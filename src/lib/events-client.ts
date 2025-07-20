"use client";

import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { Event } from "@/app/api/events/route";

// Client-side event operations (requires authentication)
export class EventsClient {
  
  // Create new event
  static async createEvent(eventData: Partial<Event>): Promise<Event> {
    try {
      const newEvent = {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentAttendees: 0,
        status: 'upcoming' as const,
      };

      const eventsRef = collection(db, "events");
      const docRef = await addDoc(eventsRef, newEvent);

      return { id: docRef.id, ...newEvent } as Event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Update existing event
  static async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const updatedEvent = {
        ...eventData,
        updatedAt: new Date().toISOString(),
      };

      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, updatedEvent);

      return { id: eventId, ...updatedEvent } as Event;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Delete event
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      const eventRef = doc(db, "events", eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Fetch all events
  static async fetchEvents(): Promise<Event[]> {
    try {
      const eventsRef = collection(db, "events");
      const eventsQuery = query(eventsRef, orderBy("date", "asc"));
      const snapshot = await getDocs(eventsQuery);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }
}
