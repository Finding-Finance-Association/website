import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";

// Define the Event type to match the Firestore document structure
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  type: 'workshop' | 'seminar' | 'conference' | 'networking' | 'training';
  color: string;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  registrationLink?: string;
}

// GET - Fetch all events with caching
export async function GET() {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("date", "asc"));
    const snapshot = await getDocs(q);

    const events: Event[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];

    // Add cache headers for better performance
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create new event (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const { getUserFromRequest } = await import('@/lib/auth');
    const user = await getUserFromRequest(request);

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const eventData = await request.json();

    // Add timestamps
    const newEvent = {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentAttendees: 0,
      status: 'upcoming',
    };

    const eventsRef = collection(db, "events");
    const docRef = await addDoc(eventsRef, newEvent);

    return NextResponse.json(
      { id: docRef.id, ...newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
