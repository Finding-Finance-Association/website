import { NextResponse } from 'next/server';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  const courseRef = doc(clientDb, 'courses', courseId);
  const courseSnap = await getDoc(courseRef);
  if (!courseSnap.exists()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const courseData = courseSnap.data()!;
  // if modules are subcollection:
  const modulesSnap = await getDocs(collection(courseRef, 'modules'));
  const modules = await Promise.all(
    modulesSnap.docs.map(async mDoc => {
      const mData = mDoc.data()!;
      const contentSnap = await getDocs(collection(mDoc.ref, 'content'));
      return {
        id: mDoc.id,
        title: mData.title,
        content: contentSnap.docs.map(c => c.data()),
      };
    })
  );

  return NextResponse.json({
    id: courseId,
    title: courseData.title,
    modules,
  });
}