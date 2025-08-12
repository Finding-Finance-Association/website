import React, { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsClient from "@/components/events/EventsClient";
import EventsLoading from "@/components/events/EventsLoading";
import { Event } from "@/app/api/events/route";
import TitleCard from "@/components/TitleCard";

// Server-side data fetching
async function getEvents(): Promise<Event[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Metadata for SEO
export const metadata: Metadata = {
  description:
    "Discover upcoming workshops, seminars, and training events. Join our community of learners and professionals.",
  keywords:
    "events, workshops, seminars, training, learning, professional development",
  openGraph: {
    title: "Events | FFA Learning Platform",
    description: "Discover upcoming workshops, seminars, and training events.",
    type: "website",
  },
};

// Server Component - SSR with data fetching
export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <TitleCard
          title1="Upcoming"
          title2="Events"
          subtext="Join our community of learners and professionals for upcoming workshops, seminars, and training events."
        />

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Suspense fallback={<EventsLoading />}>
            <EventsClient initialEvents={events} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
