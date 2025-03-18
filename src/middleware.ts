import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

// Add paths that should be protected
const protectedPaths = [
    '/api/protected',
    // Add other protected paths here
];

// Add paths that should be explicitly public (no auth required)
const publicPaths = [
    '/api/user/register',
    '/api/user/check',
    '/api/auth/login',
    '/api/auth/test-siwe',
    '/api/user',
    '/api/profile',
    '/api/events',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is in the public paths list
    if (publicPaths.some(path => pathname.startsWith(path))) {
        console.log(`Middleware: Allowing public access to ${pathname}`);
        return NextResponse.next();
    }

    // Check if the path should be protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    if (!isProtectedPath) {
        return NextResponse.next();
    }

    console.log(`Middleware: Checking auth for protected path: ${pathname}`);

    // Get the token from the request headers
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Middleware: No token provided');
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = await verifyJwtToken(token);
        console.log(`Middleware: Valid token for user: ${decoded.userId}`);

        // Add user info to request headers to be accessible in route handlers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', decoded.userId);
        requestHeaders.set('x-user-address', decoded.address);

        // Return the request with modified headers
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error(`Middleware: Token verification failed:`, error);
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }
}

// Configure middleware to run only on API routes
export const config = {
    matcher: '/api/:path*',
}; 