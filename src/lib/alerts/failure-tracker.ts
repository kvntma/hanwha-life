import * as Sentry from '@sentry/nextjs';

const DEFAULT_FAILURE_THRESHOLD = 3;
const DEFAULT_FAILURE_COOLDOWN_MS = 600_000;

type FailureState = {
  consecutiveFailures: number;
  lastAlertAt: number;
};

// In-memory and per process/instance, so counts are approximate across serverless instances.
const failureStates = new Map<string, FailureState>();

function getPositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error) ?? String(error);
  } catch {
    return String(error);
  }
}

export function recordFailure(key: string, error: unknown): void {
  try {
    Sentry.captureException(error, { tags: { operation: key } });
  } catch (captureError) {
    console.error('Failed to capture operation failure in Sentry:', captureError);
  }

  try {
    const threshold = getPositiveInteger(
      process.env.ALERT_FAILURE_THRESHOLD,
      DEFAULT_FAILURE_THRESHOLD
    );
    const cooldownMs = getPositiveInteger(
      process.env.ALERT_FAILURE_COOLDOWN_MS,
      DEFAULT_FAILURE_COOLDOWN_MS
    );
    const state = failureStates.get(key) ?? {
      consecutiveFailures: 0,
      lastAlertAt: 0,
    };
    const now = Date.now();

    state.consecutiveFailures += 1;
    failureStates.set(key, state);

    if (state.consecutiveFailures >= threshold && now - state.lastAlertAt >= cooldownMs) {
      state.lastAlertAt = now;
      // Target this event with a Sentry alert rule (e.g. tag alert = repeated-failure) to ping developers.
      Sentry.captureMessage(
        `Repeated failure for ${key} (${state.consecutiveFailures} consecutive): ${getErrorMessage(error)}`,
        {
          level: 'error',
          tags: { operation: key, alert: 'repeated-failure' },
          extra: { consecutiveFailures: state.consecutiveFailures },
        }
      );
    }
  } catch (trackingError) {
    console.error('Failed to track operation failure:', trackingError);
  }
}

export function recordSuccess(key: string): void {
  try {
    const state = failureStates.get(key);
    failureStates.set(key, {
      consecutiveFailures: 0,
      lastAlertAt: state?.lastAlertAt ?? 0,
    });
  } catch (trackingError) {
    console.error('Failed to reset operation failure tracking:', trackingError);
  }
}
