"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import React, { useState, useEffect } from "react";

// Mock Firebase data - In real implementation, this would come from Firebase
const mockEvents = [
  {
    id: 1,
    title: "Annual Finance Summit 2025",
    date: "2025-07-15",
    time: "09:00",
    endTime: "17:00",
    description:
      "Join industry leaders for insights into emerging financial trends, regulatory changes, and innovative investment strategies.",
    location: "Grand Convention Center, Dallas",
    maxAttendees: 500,
    currentAttendees: 342,
    type: "conference",
    featured: true,
    category: "Summit",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "Investment Portfolio Workshop",
    date: "2025-07-22",
    time: "14:00",
    endTime: "16:00",
    description:
      "Hands-on workshop covering portfolio diversification, risk assessment, and modern portfolio theory applications.",
    location: "Finance Center Building A",
    maxAttendees: 50,
    currentAttendees: 28,
    type: "workshop",
    category: "Workshop",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Cryptocurrency & DeFi Seminar",
    date: "2025-07-08",
    time: "18:00",
    endTime: "20:00",
    description:
      "Explore the latest developments in cryptocurrency markets and decentralized finance protocols.",
    location: "Virtual Event",
    maxAttendees: 200,
    currentAttendees: 156,
    type: "seminar",
    category: "Seminar",
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    title: "Risk Management Masterclass",
    date: "2025-08-05",
    time: "10:00",
    endTime: "15:00",
    description:
      "Comprehensive training on financial risk assessment, mitigation strategies, and regulatory compliance.",
    location: "Training Center",
    maxAttendees: 75,
    currentAttendees: 43,
    type: "masterclass",
    category: "Masterclass",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    id: 5,
    title: "FinTech Innovation Conference",
    date: "2025-06-15",
    time: "09:00",
    endTime: "17:00",
    description:
      "Showcasing the latest fintech innovations and their impact on traditional banking and finance.",
    location: "Tech Hub Convention Center",
    maxAttendees: 300,
    currentAttendees: 287,
    type: "conference",
    category: "Conference",
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    title: "ESG Investing Workshop",
    date: "2025-06-08",
    time: "13:00",
    endTime: "16:00",
    description:
      "Deep dive into Environmental, Social, and Governance investing strategies and their market impact.",
    location: "Green Finance Institute",
    maxAttendees: 80,
    currentAttendees: 72,
    type: "workshop",
    category: "Workshop",
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  {
    id: 7,
    title: "Quantitative Trading Seminar",
    date: "2025-05-20",
    time: "14:00",
    endTime: "18:00",
    description:
      "Advanced techniques in algorithmic trading, backtesting strategies, and risk management systems.",
    location: "Trading Floor Academy",
    maxAttendees: 60,
    currentAttendees: 58,
    type: "seminar",
    category: "Seminar",
    color: "bg-gradient-to-r from-slate-600 to-slate-800",
  },
];

type EventType = (typeof mockEvents)[number] | null;

const EventsPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [events, setEvents] = useState(mockEvents);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Calendar navigation
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateStr);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateForComparison = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEvents = getEventsForDate(date);
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

  // Handle event registration
  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Registration submitted:", registrationData);

      // Show success message and reset form
      alert(
        "Registration successful! You will receive a confirmation email shortly."
      );
      setRegistrationData({ name: "", email: "", phone: "", company: "" });
      setShowRegistrationModal(false);
      setSelectedEvent(null);
      setIsLoading(false);
    }, 1500);
  };

  // Generate ICS file content
  const generateICSFile = (event: any) => {
    const startDate = new Date(`${event.date}T${event.time}:00`);
    const endDate = new Date(`${event.date}T${event.endTime}:00`);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Finance Association//Events//EN
BEGIN:VEVENT
UID:${event.id}@financeassociation.com
DTSTART:${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calendarDays = generateCalendarDays();
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

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .slice(0, 3);
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* <div className="max-w-4xl mx-auto px-4 py-8"> */}
            {/* Calendar Section */}
            <div className="flex flex-col items-center py-10">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Calendar
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-semibold min-w-[200px] text-center">
                      {monthNames[currentDate.getMonth()]}{" "}
                      {currentDate.getFullYear()}
                    </span>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {calendarDays.map((dayObj, index) => {
                    const dayEvents = dayObj.events;
                    const eventColor =
                      dayEvents.length > 0 ? dayEvents[0].color : "";
                    return (
                      <div
                        key={index}
                        className={`
                relative p-2 text-center cursor-pointer transition-all duration-300 rounded-xl
                ${dayObj.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${dayObj.isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                ${
                  dayObj.hasEvents
                    ? `text-white font-bold ${eventColor}`
                    : "hover:bg-gray-100"
                }
                ${
                  !dayObj.hasEvents && dayObj.isCurrentMonth
                    ? "hover:bg-gray-50"
                    : ""
                }
              `}
                        onClick={() =>
                          dayObj.hasEvents && setSelectedEvent(dayObj.events[0])
                        }
                      >
                        <span className="relative z-10">{dayObj.day}</span>
                        {dayObj.hasEvents && (
                          <div className="absolute inset-0 rounded-xl opacity-90"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm text-gray-500 text-center mt-4">
                  <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm mr-2"></div>
                    Colored blocks indicate event dates
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Sidebar */}
            <div className="mt-10">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h3 className="text-xl font-bold text-white">
                    Upcoming Events
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Don't miss these exciting opportunities
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.length === 0 && (
                      <div className="text-gray-500 text-center py-8">
                        No upcoming events.
                      </div>
                    )}
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${event.color}`}
                        ></div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${event.color}`}
                                >
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
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              {event.time} - {event.endTime}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-gray-400" />
                              {event.currentAttendees}/{event.maxAttendees}{" "}
                              registered
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                                  <div
                                    className={`h-2 rounded-full ${event.color}`}
                                    style={{
                                      width: `${
                                        (event.currentAttendees /
                                          event.maxAttendees) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {Math.round(
                                    (event.currentAttendees /
                                      event.maxAttendees) *
                                      100
                                  )}
                                  % full
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          {/* </div> */}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <div className="mt-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Past Events
                  </h3>
                  <p className="text-gray-300">
                    Explore our previous successful events and their highlights
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event, index) => (
                      <div
                        key={event.id}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${event.color} opacity-60`}
                        ></div>
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
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-gray-400" />
                              {event.currentAttendees} attendees
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                                {event.currentAttendees >= event.maxAttendees
                                  ? "Sold Out"
                                  : "Successfully Completed"}
                              </span>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {event.time} - {event.endTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedEvent.title}
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>
                      {selectedEvent.time} - {selectedEvent.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <span>
                      {selectedEvent.currentAttendees} /{" "}
                      {selectedEvent.maxAttendees} registered
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowRegistrationModal(true)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    disabled={
                      selectedEvent.currentAttendees >=
                      selectedEvent.maxAttendees
                    }
                  >
                    {selectedEvent.currentAttendees >=
                    selectedEvent.maxAttendees
                      ? "Event Full"
                      : "Register Now"}
                  </button>
                  <button
                    onClick={() => generateICSFile(selectedEvent)}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download ICS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistrationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-100">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Event Registration
                  </h2>
                  <button
                    onClick={() => setShowRegistrationModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={registrationData.name}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            name: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={registrationData.email}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={registrationData.phone}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      value={registrationData.company}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          company: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowRegistrationModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer/>
    </>
  );
};

export default EventsPage;
	