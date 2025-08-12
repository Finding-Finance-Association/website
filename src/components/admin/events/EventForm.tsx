"use client";

import React, { useState, useEffect } from "react";
import { Event } from "@/app/api/events/route";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

interface EventFormProps {
  event?: Event | null;
  onSave: (eventData: Partial<Event>) => void;
  onCancel: () => void;
}

const eventTypes = [
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" },
  { value: "networking", label: "Networking" },
  { value: "training", label: "Training" },
];

const colorOptions = [
  { value: "bg-blue-500", label: "Blue", preview: "bg-blue-500" },
  { value: "bg-green-500", label: "Green", preview: "bg-green-500" },
  { value: "bg-purple-500", label: "Purple", preview: "bg-purple-500" },
  { value: "bg-red-500", label: "Red", preview: "bg-red-500" },
  { value: "bg-yellow-500", label: "Yellow", preview: "bg-yellow-500" },
  { value: "bg-indigo-500", label: "Indigo", preview: "bg-indigo-500" },
  { value: "bg-pink-500", label: "Pink", preview: "bg-pink-500" },
  { value: "bg-teal-500", label: "Teal", preview: "bg-teal-500" },
];

export default function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    category: "",
    type: "workshop" as Event["type"],
    price: 0,
    color: "bg-blue-500",
    registrationLink: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        date: event.date || "",
        time: event.time || "",
        endTime: event.endTime || "",
        location: event.location || "",
        category: event.category || "",
        type: event.type || "workshop",
        price: event.price || 0,
        color: event.color || "bg-blue-500",
        registrationLink: event.registrationLink || "",
      });
    }
  }, [event]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (!formData.registrationLink.trim())
      newErrors.registrationLink = "Registration link is required";

    // Validate time logic
    if (
      formData.time &&
      formData.endTime &&
      formData.time >= formData.endTime
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    // Validate date is not in the past (for new events)
    if (!event && formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.date = "Event date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);

      toast.success("Event saved successfully!");
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.date ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.time ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.endTime ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Registration Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Link *
                </label>
                <input
                  type="text"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.registrationLink
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Event registration link"
                />
                {errors.registrationLink && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.registrationLink}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.location ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Event location or online link"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Technology, Business, Health"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0.00 for free events"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: color.value }))
                      }
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.color === color.value
                          ? "border-gray-900"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-full h-4 rounded ${color.preview}`}
                      ></div>
                      <span className="text-xs text-gray-600 mt-1 block">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {event ? "Updating..." : "Creating..."}
                </div>
              ) : event ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
