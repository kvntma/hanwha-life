'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function RouteError({
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
        tags: { source: 'error' },
        extra: { digest: error.digest },
      });
    } catch {}
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-md text-center">
        <p className="text-lg font-semibold text-primary">VialSupply</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t load this page. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
