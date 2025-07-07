import { NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const { courseId, moduleId } = params
  const snap = await getDocs(
    collection(db, 'courses_coll', courseId, 'modules', moduleId, 'quiz')
  )
  const quizItems = snap.docs.map(d => {
    const { question, options, correctAnswer, type } = d.data()
    return { id: d.id, question, options, correctAnswer, type }
  })
  return NextResponse.json(quizItems)
}