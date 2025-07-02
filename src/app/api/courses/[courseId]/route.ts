import { NextResponse } from 'next/server';
import {collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
 request: Request, {params: { courseId }}:{params: {courseId: string}}
) {

  try {
    const modulesRef = collection(db, 'courses_coll', courseId, 'modules');
    const modulesSnapshot = await getDocs(modulesRef);
    const modules = await Promise.all(
      modulesSnapshot.docs.map(async moduleDoc => {
        const moduleData = {
          id: moduleDoc.id,
          ...moduleDoc.data(),
        };
        const contentBlockRef = collection(db, 'courses_coll', courseId, 'modules', moduleDoc.id, 'contentBlocks');

        const contentBlocksSnapshot = await getDocs(contentBlockRef)
        const contentBlocks = contentBlocksSnapshot.docs.map(cdDoc => ({
          id: cdDoc.id,
          ...cdDoc.data(),
        }));
        return {
          ...moduleData,
          contentBlocks,
        }
      })
    )
    return NextResponse.json(modules);
    } catch (error) {
    console.error('Error fetchinf Modules:', error)
    return NextResponse.json({error: 'Failed to fetch modules'}, {status: 500})
  }
}