import React from "react";
import { Calendar, Clock, MapPin, ArrowUpRight, DollarSign } from "lucide-react";
import { Event } from "@/app/api/events/route";
import toast from "react-hot-toast";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const handleRegisterRedirect = () => {
    if (event.registrationLink) {
      toast.success("Redirecting to event registration...");
      window.open(event.registrationLink, "_blank"); 
    } else {
      toast.error("No registration link available.");
    }
  };
  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => handleRegisterRedirect()}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${event.color}`}></div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${event.color}`}>
                {event.category}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h4>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {event.time} - {event.endTime}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.price > 0 && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium text-green-600">${event.price}</span>
            </div>
          )}
          {event.price === 0 && (
            <div className="flex items-center">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Free Event
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventItem;
