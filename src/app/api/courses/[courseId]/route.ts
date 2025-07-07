import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const ref = doc(db, 'courses_coll', courseId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    return NextResponse.json(null, { status: 404 })
  }
  const { title, description, hours, thumbnail, category } = snap.data() as {
    title: string
    description: string
    hours: number
    thumbnail: string
    category: string
  }
  return NextResponse.json({ id: snap.id, title, description, hours, thumbnail, category })
}