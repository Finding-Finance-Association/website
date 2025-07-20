"use client";

import { useState, useEffect } from "react";
import { Event } from "@/app/api/events/route";
import AdminLayout from "@/components/admin/AdminLayout";
import EventsAdminTable from "@/components/admin/events/EventsAdminTable";
import EventForm from "@/components/admin/events/EventForm";
import { EventsClient } from "@/lib/events-client";
import { Plus, Calendar, TrendingUp } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await EventsClient.fetchEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle create/update event
  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      if (editingEvent) {
        await EventsClient.updateEvent(editingEvent.id, eventData);
      } else {
        await EventsClient.createEvent(eventData);
      }

      await fetchEvents(); // Refresh events list
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await EventsClient.deleteEvent(eventId);
      await fetchEvents(); // Refresh events list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  // Calculate stats
  const stats = {
    total: events.length,
    upcoming: events.filter((e) => new Date(e.date) >= new Date()).length,
  };

  return (
    <AdminLayout
      pageTitle="Event Management"
      pageDescription="Create, edit, and manage all your events from this central dashboard."
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Events</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Upcoming</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.upcoming}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          All Events ({events.length})
        </h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Event
        </button>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading events...</span>
        </div>
      ) : (
        <EventsAdminTable
          events={events}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
