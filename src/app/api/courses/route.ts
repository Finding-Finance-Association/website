import { NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const runtime = 'nodejs'

export async function GET() {
  const snap = await getDocs(collection(db, 'courses_coll'))
  const courses = snap.docs.map(d => {
    const { title, description, hours, thumbnail, category } = d.data() as {
      title: string
      description: string
      hours: number
      thumbnail: string
      category: string
    }
    return { id: d.id, title, description, hours, thumbnail, category }
  })
  return NextResponse.json(courses)
}