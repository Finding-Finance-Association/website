import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');

// Initialize Firebase Admin SDK
let adminApp: any;
let adminAuth: any;
let adminDb: any;

try {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }
  
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

async function verifyAdminAccess(request: NextRequest): Promise<boolean> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    // Try to get token from cookies if not in header
    const cookieToken = request.cookies.get('firebase-token')?.value;
    const idToken = token || cookieToken;
    
    if (!idToken) {
      return false;
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;
    
    if (!userEmail) {
      return false;
    }

    // Check if user email is in admin list
    if (ADMIN_EMAILS.includes(userEmail)) {
      return true;
    }

    // Alternative: Check admin status from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    
    return userData?.isAdmin === true || userData?.role === 'admin';
    
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // Skip middleware for static files and API routes that don't need protection
    if (
      pathname.startsWith('/admin/_next') ||
      pathname.startsWith('/admin/favicon.ico')
    ) {
      return NextResponse.next();
    }

    const isAdmin = await verifyAdminAccess(request);
    
    if (!isAdmin) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      loginUrl.searchParams.set('error', 'admin_access_required');
      
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin') || 
      (pathname.startsWith('/api/') && 
       (pathname.includes('/events') || pathname.includes('/courses')) &&
       request.method !== 'GET')) {
    
    const isAdmin = await verifyAdminAccess(request);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/events/:path*',
    '/api/courses/:path*'
  ]
};
