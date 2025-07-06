import { NextResponse } from "next/server";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserFromRequest, requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    requireAuth(user);

    const { courseId, progressData } = await req.json();
    
    if (!courseId || !progressData) {
      return NextResponse.json({ error: "Missing courseId or progressData" }, { status: 400 });
    }

    // Save progress to Firebase
    const progressRef = doc(db, "users", user!.uid, "courseProgress", courseId);
    await setDoc(progressRef, {
      ...progressData,
      lastUpdated: Date.now(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing progress:", error);
    return NextResponse.json({ error: "Failed to sync progress" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    requireAuth(user);

    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");
    
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // Get progress from Firebase
    const progressRef = doc(db, "users", user!.uid, "courseProgress", courseId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return NextResponse.json(progressSnap.data());
    } else {
      return NextResponse.json({ completedModules: [], userInputs: {} });
    }
  } catch (error) {
    console.error("Error loading progress:", error);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}
