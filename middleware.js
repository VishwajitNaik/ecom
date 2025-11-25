import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('Middleware running for:', pathname);

  // Allow access to home, signin, and signup for everyone
  if (pathname === '/' || pathname === '/user/SignIn' || pathname === '/user/SignUp') {
    return NextResponse.next();
  }

  // For all other paths, check if token cookie exists
  const token = request.cookies.get('token')?.value;
  console.log('Token:', token ? 'exists' : 'not exists');

  if (!token) {
    // Redirect to signin
    return NextResponse.redirect(new URL('/user/SignIn', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};