import { NextResponse } from "next/server";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Force Node.js runtime
export const runtime = "nodejs";

export async function GET(request: Request, context: { params: { courseId: string } }) {
  const { courseId } = await context.params;

  try {
    const courseRef = doc(db, "courses_coll", courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = {
      id: courseSnap.id,
      ...courseSnap.data(),
    };

    const modulesRef = collection(db, "courses_coll", courseId, "modules");
    const modulesSnapshot = await getDocs(modulesRef);

    const modules = await Promise.all(
      modulesSnapshot.docs.map(async (moduleDoc) => {
        const moduleData = {
          id: moduleDoc.id,
          ...moduleDoc.data(),
        };

        const contentBlockRef = collection(
          db,
          "courses_coll",
          courseId,
          "modules",
          moduleDoc.id,
          "contentBlocks"
        );
        const contentBlocksSnapshot = await getDocs(contentBlockRef);

        const contentBlocks = contentBlocksSnapshot.docs.map((cdDoc) => ({
          id: cdDoc.id,
          ...cdDoc.data(),
        }));

        return {
          ...moduleData,
          contentBlocks,
        };
      })
    );

    return NextResponse.json({
      ...courseData,
      modules,
    });
  } catch (error: any) {
    console.error("❌ Error fetching Modules:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch course and modules" },
      { status: 500 }
    );
  }
}
