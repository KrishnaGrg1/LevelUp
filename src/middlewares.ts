import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session');
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/communities'];
  const authRoutes = ['/login', '/signup', '/forget-password', '/reset-password', '/verify'];

  // If user is on auth routes but has session, redirect to dashboard
  if (authRoutes.some(route => pathname.includes(route)) && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is on protected routes but has no session, redirect to login
  if (protectedRoutes.some(route => pathname.includes(route)) && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
