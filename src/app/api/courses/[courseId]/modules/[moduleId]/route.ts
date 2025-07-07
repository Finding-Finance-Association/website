import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const { courseId, moduleId } = params
  const ref = doc(db, 'courses_coll', courseId, 'modules', moduleId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    return NextResponse.json(null, { status: 404 })
  }
  const { title, outcome, order, hasQuiz } = snap.data() as {
    title: string
    outcome: object[]
    order: number
    hasQuiz: boolean
  }
  return NextResponse.json({ id: snap.id, title, outcome, order, hasQuiz })
}