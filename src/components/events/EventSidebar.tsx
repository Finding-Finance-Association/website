import React from "react";
import EventItem from "./EventItem";
import { Event } from "@/app/api/events/route";

interface EventSidebarProps {
  upcomingEvents: Event[];
}

const EventSidebar: React.FC<EventSidebarProps> = ({ upcomingEvents }) => {
  return (
    <div className="mt-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
          <p className="text-blue-100 text-sm mt-1">Don&apos;t miss these exciting opportunities</p>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No upcoming events.</div>
            ) : (
              upcomingEvents.map((event) => (
                <EventItem key={event.id} event={event}/>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSidebar;
