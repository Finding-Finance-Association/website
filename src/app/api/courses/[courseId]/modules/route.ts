import { NextResponse } from 'next/server'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params

  // 1) fetch the modules in order
  const modulesQuery = query(
    collection(db, 'courses', courseId, 'modules'),
    orderBy('order')
  )
  const modulesSnap = await getDocs(modulesQuery)

  // 2) for each module, check if it has at least one quiz doc
  const modulesWithFlag = await Promise.all(
    modulesSnap.docs.map(async (modDoc) => {
      const { category, created_at, created_by, ...rest } = modDoc.data()

      // head‐query the quiz subcollection
      const quizQ = query(
        collection(db, 'courses', courseId, 'modules', modDoc.id, 'quiz'),
        limit(1)
      )
      const quizSnap = await getDocs(quizQ)
      const hasQuiz = quizSnap.docs.length > 0

      return {
        id: modDoc.id,
        ...rest,
        hasQuiz,
      }
    })
  )
  return NextResponse.json(modulesWithFlag)
}