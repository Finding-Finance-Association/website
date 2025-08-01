"use client";

import { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminGuard from "./AdminGuard";

interface AdminLayoutProps {
  children: ReactNode;
  courseTitle?: string;
  moduleTitle?: string;
  courseId?: string;
  moduleId?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export default function AdminLayout({
  children,
  courseTitle,
  moduleTitle,
  courseId,
  moduleId,
  pageTitle,
  pageDescription,
}: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar
          courseTitle={courseTitle}
          moduleTitle={moduleTitle}
          courseId={courseId}
          moduleId={moduleId}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          {(pageTitle || pageDescription) && (
            <div className="mb-8">
              {pageTitle && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {pageTitle}
                </h1>
              )}
              {pageDescription && (
                <p className="text-lg text-gray-600">
                  {pageDescription}
                </p>
              )}
            </div>
          )}

          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
