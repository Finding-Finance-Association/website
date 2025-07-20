import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/app/api/events/route";
import toast from "react-hot-toast";

interface EventCalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  events: Event[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  currentDate,
  setCurrentDate,
  events,
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateForComparison = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayEvents = events.filter(
        (event) => event.date === date.toISOString().split("T")[0]
      );
      const isCurrentMonth = date.getMonth() === month;
      const isToday =
        date.toDateString() === currentDateForComparison.toDateString();
      const hasEvents = dayEvents.length > 0;

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        hasEvents,
        events: dayEvents,
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex flex-col items-center py-10">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Event Calendar</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {calendarDays.map((dayObj, index) => (
            <div
              key={index}
              className={`relative p-2 text-center cursor-pointer transition-all duration-300 rounded-xl ${
                dayObj.isCurrentMonth ? "text-gray-900" : "text-gray-400"
              } ${dayObj.isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""} ${
                dayObj.hasEvents
                  ? `text-white font-bold ${dayObj.events[0].color}`
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                if (dayObj.hasEvents) {
                  const link = dayObj.events[0].registrationLink;
                  if (link) {
                    toast.success("Redirecting to event registration...");
                    window.open(link, "_blank");
                  } else {
                    toast.error("No registration link available.");
                  }
                }
              }}
            >
              <span className="relative z-10">{dayObj.day}</span>
              {dayObj.hasEvents && (
                <div className="absolute inset-0 rounded-xl opacity-90"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
