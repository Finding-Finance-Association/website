import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as any), 
};

// Initialize app if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

// Get Firestore instance
export const adminDb = getFirestore(app);

export default app;
