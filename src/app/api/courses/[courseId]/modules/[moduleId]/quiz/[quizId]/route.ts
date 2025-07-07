import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string; quizId: string } }
) {
  const { courseId, moduleId, quizId } = params
  const ref = doc(db, 'courses', courseId, 'modules', moduleId, 'quiz', quizId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    return NextResponse.json(null, { status: 404 })
  }
  const { category, created_at, created_by, ...rest } = snap.data()
  return NextResponse.json({ id: snap.id, ...rest })
}