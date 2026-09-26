'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Developer alerting is configured as a Sentry alert rule (webhook), not in code.
    try {
      Sentry.captureException(error, {
        tags: { source: 'global-error' },
        extra: { digest: error.digest },
      });
    } catch {}
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <p className="text-lg font-semibold text-primary">VialSupply</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="mt-3 text-muted-foreground">
              We couldn&apos;t load this page. Please try again.
            </p>
            <button
              className="mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"
              onClick={reset}
              type="button"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
