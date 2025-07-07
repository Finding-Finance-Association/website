import { NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const { courseId, moduleId } = params
  const col = collection(
    db,
    'courses_coll',
    courseId,
    'modules',
    moduleId,
    'contentBlocks'
  )
  const snap = await getDocs(col)

  const blocks = snap.docs.map(d => {
    // cast data() so TypeScript knows content is an array
    const { content, order, type } = d.data() as {
      content: string[]
      order: number
      type: string
    }
    return { id: d.id, content, order, type }
  })

  return NextResponse.json(blocks)
}