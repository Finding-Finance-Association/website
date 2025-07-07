import { NextResponse } from 'next/server'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params

  const modulesQ = query(
    collection(db, 'courses_coll', courseId, 'modules'),
    orderBy('order')
  )
  const snap = await getDocs(modulesQ)

  const modules = snap.docs.map(d => {
    const { title, outcome, order, hasQuiz } = d.data() as {
      title: string
      outcome: object[]
      order: number
      hasQuiz: boolean
    }
    return { id: d.id, title, outcome, order, hasQuiz }
  })

  return NextResponse.json(modules)
}