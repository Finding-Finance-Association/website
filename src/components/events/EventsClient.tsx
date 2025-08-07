"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/app/api/events/route";
import EventCalendar from "./EventCalender";
import EventSidebar from "./EventSidebar";
import PastEvents from "./PastEvents";

interface EventsClientProps {
  initialEvents: Event[];
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>(initialEvents);

  // Memoized event filtering for performance
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);

    const past = events
      .filter((event) => new Date(event.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Calendar Section */}
      <EventCalendar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        events={events}
      />

      {/* Upcoming Events Section */}
      <EventSidebar upcomingEvents={upcomingEvents} />

      {/* Past Events Section */}
      <PastEvents pastEvents={pastEvents} />
    </div>
  );
}
