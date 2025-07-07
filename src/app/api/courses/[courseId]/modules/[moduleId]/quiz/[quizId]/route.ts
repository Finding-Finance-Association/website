import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string; quizId: string } }
) {
  const { courseId, moduleId, quizId } = params
  const ref = doc(
    db,
    'courses_coll',
    courseId,
    'modules',
    moduleId,
    'quiz',
    quizId
  )
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    return NextResponse.json(null, { status: 404 })
  }
  const { question, options, correctAnswer, type } = snap.data()!
  return NextResponse.json({ id: snap.id, question, options, correctAnswer, type })
}