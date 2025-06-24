
import {db} from "@/lib/firebase"
import {collection, getDocs} from "firebase/firestore"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const coureseRef = collection(db, "courses");
    const snapshot = await getDocs(coureseRef)
    const courses = snapshot.docs.map((doc) => (
      {
        id: doc.id,
        ...doc.data(),
      }
    ))
    return NextResponse.json({courses})
    
    
  } catch (error: any) {
    console.error("Error fetching Courses:", error.message);
    return NextResponse.json({error: "Failed to fetch courses"}, {status: 500})
  }
} 
