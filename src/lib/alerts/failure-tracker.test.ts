import * as Sentry from '@sentry/nextjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { recordFailure, recordSuccess } from './failure-tracker';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

const captureException = vi.mocked(Sentry.captureException);
const captureMessage = vi.mocked(Sentry.captureMessage);

function useDefaultAlertSettings() {
  vi.stubEnv('ALERT_FAILURE_THRESHOLD', '');
  vi.stubEnv('ALERT_FAILURE_COOLDOWN_MS', '');
}

function setTime(milliseconds: number) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(milliseconds));
}

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('failure tracker', () => {
  it('captures every failure with the operation tag', () => {
    useDefaultAlertSettings();
    setTime(1_000_000);
    const key = 'capture-every-failure';
    const firstError = new Error('first failure');
    const secondError = new Error('second failure');

    recordFailure(key, firstError);
    recordFailure(key, secondError);

    expect(captureException).toHaveBeenCalledTimes(2);
    expect(captureException).toHaveBeenNthCalledWith(1, firstError, {
      tags: { operation: key },
    });
    expect(captureException).toHaveBeenNthCalledWith(2, secondError, {
      tags: { operation: key },
    });
  });

  it('does not alert below the default failure threshold', () => {
    useDefaultAlertSettings();
    setTime(1_000_000);
    const key = 'below-default-threshold';

    recordFailure(key, new Error('first failure'));
    recordFailure(key, new Error('second failure'));

    expect(captureMessage).not.toHaveBeenCalled();
  });

  it('alerts at the default threshold with the failure count', () => {
    useDefaultAlertSettings();
    setTime(1_000_000);
    const key = 'at-default-threshold';

    recordFailure(key, new Error('first failure'));
    recordFailure(key, new Error('second failure'));
    recordFailure(key, new Error('third failure'));

    expect(captureMessage).toHaveBeenCalledWith(
      `Repeated failure for ${key} (3 consecutive): third failure`,
      {
        level: 'error',
        tags: { operation: key, alert: 'repeated-failure' },
        extra: { consecutiveFailures: 3 },
      }
    );
  });

  it('suppresses alerts during the cooldown and sends one after it elapses', () => {
    useDefaultAlertSettings();
    const startTime = 1_000_000;
    setTime(startTime);
    const key = 'cooldown';

    recordFailure(key, new Error('failure one'));
    recordFailure(key, new Error('failure two'));
    recordFailure(key, new Error('failure three'));
    recordFailure(key, new Error('failure four'));

    expect(captureMessage).toHaveBeenCalledTimes(1);

    vi.setSystemTime(new Date(startTime + 600_000));
    recordFailure(key, new Error('failure five'));

    expect(captureMessage).toHaveBeenCalledTimes(2);
    expect(captureMessage).toHaveBeenLastCalledWith(
      `Repeated failure for ${key} (5 consecutive): failure five`,
      {
        level: 'error',
        tags: { operation: key, alert: 'repeated-failure' },
        extra: { consecutiveFailures: 5 },
      }
    );
  });

  it('requires failures to re-accumulate after a success', () => {
    vi.stubEnv('ALERT_FAILURE_THRESHOLD', '3');
    vi.stubEnv('ALERT_FAILURE_COOLDOWN_MS', '1');
    setTime(1_000_000);
    const key = 'success-reset';

    recordFailure(key, new Error('failure one'));
    recordFailure(key, new Error('failure two'));
    recordFailure(key, new Error('failure three'));
    recordSuccess(key);
    vi.setSystemTime(new Date(1_000_001));
    recordFailure(key, new Error('failure four'));
    recordFailure(key, new Error('failure five'));

    expect(captureMessage).toHaveBeenCalledTimes(1);

    recordFailure(key, new Error('failure six'));

    expect(captureMessage).toHaveBeenCalledTimes(2);
    expect(captureMessage).toHaveBeenLastCalledWith(
      `Repeated failure for ${key} (3 consecutive): failure six`,
      {
        level: 'error',
        tags: { operation: key, alert: 'repeated-failure' },
        extra: { consecutiveFailures: 3 },
      }
    );
  });

  it('uses positive threshold and cooldown environment overrides', () => {
    vi.stubEnv('ALERT_FAILURE_THRESHOLD', '1');
    vi.stubEnv('ALERT_FAILURE_COOLDOWN_MS', '1');
    setTime(1_000_000);
    const key = 'environment-overrides';

    recordFailure(key, new Error('first failure'));
    recordFailure(key, new Error('second failure'));

    expect(captureMessage).toHaveBeenCalledTimes(1);
    expect(captureMessage).toHaveBeenLastCalledWith(
      `Repeated failure for ${key} (1 consecutive): first failure`,
      {
        level: 'error',
        tags: { operation: key, alert: 'repeated-failure' },
        extra: { consecutiveFailures: 1 },
      }
    );

    vi.setSystemTime(new Date(1_000_001));
    recordFailure(key, new Error('third failure'));

    expect(captureMessage).toHaveBeenCalledTimes(2);
    expect(captureMessage).toHaveBeenLastCalledWith(
      `Repeated failure for ${key} (3 consecutive): third failure`,
      {
        level: 'error',
        tags: { operation: key, alert: 'repeated-failure' },
        extra: { consecutiveFailures: 3 },
      }
    );
  });
});
