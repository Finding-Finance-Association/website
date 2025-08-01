import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",");

// Initialize Firebase Admin SDK
let adminAuth: any;
let adminDb: any;

try {
  if (getApps().length === 0) {
    const adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } else {
    adminAuth = getAuth(getApps()[0]);
    adminDb = getFirestore(getApps()[0]);
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export interface AuthUser {
  uid: string;
  email: string | null;
  claims?: any;
  isAdmin?: boolean;
}

export async function getUserFromRequest(req: any): Promise<AuthUser | null> {
  try {
    // Get the Authorization header
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return null;
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check admin status
    const isAdmin = ADMIN_EMAILS.includes(decodedToken.email || '') ||
                   await checkAdminInFirestore(decodedToken.uid);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      claims: decodedToken,
      isAdmin,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

async function checkAdminInFirestore(uid: string): Promise<boolean> {
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    return userData?.isAdmin === true || userData?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status in Firestore:', error);
    return false;
  }
}

export function requireAuth(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new Error("Authentication required");
  }
}

export function requireAdmin(user: AuthUser | null): asserts user is AuthUser {
  requireAuth(user);
  if (!user.isAdmin) {
    throw new Error("Admin access required");
  }
}
