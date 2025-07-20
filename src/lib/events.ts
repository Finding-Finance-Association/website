import { Event } from "@/app/api/events/route";

// Cache for events data
let eventsCache: Event[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Client-side event fetching with caching
export async function fetchEvents(forceRefresh = false): Promise<Event[]> {
  const now = Date.now();
  
  // Return cached data if it's still valid and not forcing refresh
  if (!forceRefresh && eventsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return eventsCache;
  }

  try {
    const response = await fetch('/api/events', {
      next: { revalidate: 300 }, // 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const events = await response.json();
    
    // Update cache
    eventsCache = events;
    cacheTimestamp = now;
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Return cached data if available, even if stale
    if (eventsCache) {
      return eventsCache;
    }
    
    throw error;
  }
}

// Utility functions for event filtering and sorting
export function getUpcomingEvents(events: Event[], limit?: number): Event[] {
  const now = new Date();
  const upcoming = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getPastEvents(events: Event[], limit?: number): Event[] {
  const now = new Date();
  const past = events
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return limit ? past.slice(0, limit) : past;
}

export function getEventsByType(events: Event[], type: Event['type']): Event[] {
  return events.filter(event => event.type === type);
}

export function getEventsByCategory(events: Event[], category: string): Event[] {
  return events.filter(event => 
    event.category.toLowerCase().includes(category.toLowerCase())
  );
}

export function searchEvents(events: Event[], query: string): Event[] {
  const searchTerm = query.toLowerCase();
  return events.filter(event =>
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.category.toLowerCase().includes(searchTerm) ||
    event.location.toLowerCase().includes(searchTerm)
  );
}

// Event statistics
export function getEventStats(events: Event[]) {
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= now);
  const past = events.filter(e => new Date(e.date) < now);
  
  return {
    total: events.length,
    upcoming: upcoming.length,
    past: past.length,
    freeEvents: events.filter(e => e.price === 0).length,
    paidEvents: events.filter(e => e.price > 0).length,
  };
}

// Date formatting utilities
export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEventTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getEventDuration(startTime: string, endTime: string): string {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes} minutes`;
  } else if (diffMinutes === 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    return `${diffHours}h ${diffMinutes}m`;
  }
}

// Event validation
export function validateEvent(event: Partial<Event>): string[] {
  const errors: string[] = [];
  
  if (!event.title?.trim()) errors.push('Title is required');
  if (!event.description?.trim()) errors.push('Description is required');
  if (!event.date) errors.push('Date is required');
  if (!event.time) errors.push('Start time is required');
  if (!event.endTime) errors.push('End time is required');
  if (!event.location?.trim()) errors.push('Location is required');
  if (!event.category?.trim()) errors.push('Category is required');
  if (event.price !== undefined && event.price < 0) errors.push('Price cannot be negative');
  
  // Validate time logic
  if (event.time && event.endTime && event.time >= event.endTime) {
    errors.push('End time must be after start time');
  }
  
  // Validate date is not in the past (for new events)
  if (event.date) {
    const selectedDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }
  
  return errors;
}

// Clear cache (useful for admin operations)
export function clearEventsCache(): void {
  eventsCache = null;
  cacheTimestamp = 0;
}
