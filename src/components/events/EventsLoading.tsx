import React from "react";

export default function EventsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Calendar Loading Skeleton */}
      <div className="flex flex-col items-center py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Calendar Grid Skeleton */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded"></div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Loading Skeleton */}
      <div className="mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="h-6 bg-blue-400 rounded w-48 mb-2"></div>
            <div className="h-4 bg-blue-300 rounded w-64"></div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <div className="h-1 bg-blue-200 rounded mb-4"></div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      </div>
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Past Events Loading Skeleton */}
      <div className="mt-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
            <div className="h-7 bg-gray-600 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-500 rounded w-64"></div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                    <div className="h-1 bg-gray-200 rounded mb-4"></div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                          <div className="h-5 bg-green-200 rounded w-20"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="h-5 bg-green-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
