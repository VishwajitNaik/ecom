import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to static assets, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  console.log('Middleware checking:', pathname);

  // Allow access to public routes for everyone
  const publicRoutes = [
    '/',
    '/user/SignIn',
    '/user/SignUp',
    '/Products',
    '/Products/Cart',
    '/products'
  ];

  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/products/'))) {
    console.log('Allowing access to public route:', pathname);
    return NextResponse.next();
  }

  // For all other paths, check if token cookie exists
  const token = request.cookies.get('token')?.value;
  console.log('Token cookie check:', token ? 'present' : 'missing');

  if (!token) {
    console.log('No token found, redirecting to signin from:', pathname);
    // Redirect to signin
    return NextResponse.redirect(new URL('/user/SignIn', request.url));
  }

  console.log('Token found, allowing access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};