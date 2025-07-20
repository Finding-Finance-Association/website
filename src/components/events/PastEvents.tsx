import React from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Event } from "@/app/api/events/route";

interface PastEventItemProps {
  event: Event;
}

interface PastEventsProps {
  pastEvents: Event[];
}

const PastEventItem: React.FC<PastEventItemProps> = ({ event }) => (
  <div
    key={event.id}
    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300"
  >
    <div className={`absolute top-0 left-0 right-0 h-1 ${event.color} opacity-60`}></div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${event.color} opacity-80`}
            >
              {event.category}
            </span>
            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {event.title}
          </h4>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          {new Date(event.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {event.time} - {event.endTime}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PastEvents: React.FC<PastEventsProps> = ({ pastEvents }) => {
  return (
    <>
      {pastEvents.length > 0 && (
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Past Events</h3>
              <p className="text-gray-300">
                Explore our previous successful events and their highlights
              </p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <PastEventItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PastEvents;
