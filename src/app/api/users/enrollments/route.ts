import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId){
            return NextResponse.json({error: "Missiing userID"}, {status: 400})
        }

        const progressRef = collection(db, "users", userId, "courseProgress")
        const progressSnap = await getDocs(progressRef);

        const enrolledCourseIds = progressSnap.docs.map((doc) => doc.id)
        return NextResponse.json({enrolledCourseIds})

    } catch (error) {
        return NextResponse.json({err: "User not Found"}, {status: 500})
    }
}