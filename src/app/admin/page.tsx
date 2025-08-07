"use client";

import Link from "next/link";
import { FiBook, FiUsers, FiBarChart, FiSettings, FiArrowRight, FiCalendar } from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  const adminCards = [
    {
      title: "Course Management",
      description: "Create, edit, and organize your courses and modules",
      icon: FiBook,
      href: "/admin/courses",
      color: "blue",
      stats: "Manage all courses"
    },
    {
      title: "Event Management",
      description: "Create and manage workshops, seminars, and training events",
      icon: FiCalendar,
      href: "/admin/events",
      color: "purple",
      stats: "Manage all events"
    },
    {
      title: "Student Management",
      description: "Manage student enrollments and access",
      icon: FiUsers,
      href: "#",
      color: "orange",
      stats: "Coming soon"
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "bg-blue-100 text-blue-600",
          hover: "hover:border-blue-300"
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "bg-purple-100 text-purple-600",
          hover: "hover:border-purple-300"
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "bg-green-100 text-green-600",
          hover: "hover:border-green-300"
        };
      case "orange":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: "bg-orange-100 text-orange-600",
          hover: "hover:border-orange-300"
        };
      case "gray":
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "bg-gray-100 text-gray-600",
          hover: "hover:border-gray-300"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "bg-gray-100 text-gray-600",
          hover: "hover:border-gray-300"
        };
    }
  };

  return (
    <AdminLayout
      pageTitle="Admin Dashboard"
      pageDescription="Welcome to the administration panel. Manage your courses, events, students, and platform settings."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => {
          const colors = getColorClasses(card.color);
          const IconComponent = card.icon;
          
          return (
            <Link
              key={index}
              href={card.href}
              className={`block p-6 rounded-xl border-2 ${colors.bg} ${colors.border} ${colors.hover} transition-all duration-200 hover:shadow-md group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {card.stats}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {card.description}
                  </p>
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}
