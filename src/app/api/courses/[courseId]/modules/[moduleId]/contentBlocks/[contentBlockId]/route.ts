import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: {
    params: {
      courseId: string
      moduleId: string
      contentBlockId: string
    }
  }
) {
  const { courseId, moduleId, contentBlockId } = params
  const ref = doc(
    db,
    'courses_coll',
    courseId,
    'modules',
    moduleId,
    'contentBlocks',
    contentBlockId
  )
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    return NextResponse.json(null, { status: 404 })
  }
  const { content, order, type } = snap.data() as {
    content: string[]
    order: number
    type: string
  }
  return NextResponse.json({ id: snap.id, content, order, type })
}