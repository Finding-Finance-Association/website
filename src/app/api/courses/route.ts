import { NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  const snap = await getDocs(collection(db, 'courses'))
  const courses = snap.docs.map(d => {
    const { category, created_at, created_by, ...rest } = d.data()
    return { id: d.id, ...rest }
  })
  return NextResponse.json(courses)
}