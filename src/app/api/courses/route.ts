import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const snap = await getDocs(collection(db, 'courses_coll'));
    const courses = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json(courses)
  } catch {
    return NextResponse.json({err: 'Failed to fetch courses'}, {status: 500})
  }
  
}