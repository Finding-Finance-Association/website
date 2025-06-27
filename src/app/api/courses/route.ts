import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase';

export async function GET() {
  const snap = await getDocs(collection(clientDb, 'courses'));
  const courses = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      thumbnail: data.thumbnail,
      moduleCount: Array.isArray(data.modules) ? data.modules.length : 0,
    };
  });
  return NextResponse.json(courses);
}