import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface SessionMetadata {
  isAdmin?: boolean;
}

interface SessionClaims {
  metadata?: SessionMetadata;
}

const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();

  console.log('Full auth data:', JSON.stringify(authData, null, 2));

  if (isProtectedRoute(req)) {
    // Check if user has isAdmin flag in metadata
    const isAdmin = (authData.sessionClaims as SessionClaims)?.metadata?.isAdmin;

    if (!isAdmin) {
      // Use NextResponse for redirects in middleware
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
