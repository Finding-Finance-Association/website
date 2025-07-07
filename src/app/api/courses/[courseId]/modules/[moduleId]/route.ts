import { NextResponse } from 'next/server'
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const { courseId, moduleId } = params
  const modRef = doc(db, 'courses', courseId, 'modules', moduleId)
  const modSnap = await getDoc(modRef)
  if (!modSnap.exists()) {
    return NextResponse.json(null, { status: 404 })
  }
  const { category, created_at, created_by, ...rest } = modSnap.data()
  const quizQ = query(
    collection(db, 'courses', courseId, 'modules', moduleId, 'quiz'),
    limit(1)
  )
  const quizSnap = await getDocs(quizQ)
  const hasQuiz = quizSnap.docs.length > 0

  return NextResponse.json({
    id: modSnap.id,
    ...rest,
    hasQuiz
  })
}