import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase';
import { getUserFromRequest, requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  requireAuth(user);

  const { courseId, moduleId } = await req.json();
  if (!courseId || !moduleId) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  await addDoc(
    collection(clientDb, 'users', user!.uid, 'progress'),
    {
      courseId,
      moduleId,
      completedAt: new Date().toISOString(),
    }
  );
  return NextResponse.json({ success: true });
}