import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase';
import { getUserFromRequest, requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  requireAuth(user);

  // Here you could check a custom claim or Firestore-stored role:
  const isAdmin = !!(user && user.claims && user.claims.admin === true);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const fileMeta = await req.json();
  await addDoc(collection(clientDb, 'files'), {
    ...fileMeta,
    uploadedBy: user!.uid,
    uploadedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}