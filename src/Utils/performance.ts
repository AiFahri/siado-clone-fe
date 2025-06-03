const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 30000;

export const getCachedData = (key: string) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key: string, data: unknown) => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = () => {
  apiCache.clear();
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const batchApiCalls = async <T>(
  calls: (() => Promise<T>)[],
  batchSize: number = 5
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < calls.length; i += batchSize) {
    const batch = calls.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((call) => call()));

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
    });
  }

  return results;
};

export const normalizeApiResponse = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: unknown[] }).data;
  }
  if (
    data &&
    typeof data === "object" &&
    "courses" in data &&
    Array.isArray((data as { courses: unknown }).courses)
  ) {
    return (data as { courses: unknown[] }).courses;
  }
  return [];
};

export const fastFilter = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(lowerSearchTerm)
      );
    })
  );
};

export const mapSubmission = (
  rawSubmission: Record<string, unknown>,
  assignment: Record<string, unknown>,
  course: Record<string, unknown>
) => ({
  ...rawSubmission,
  student: rawSubmission.user || rawSubmission.student,
  file_path: rawSubmission.file_url || rawSubmission.file_path,
  file_name:
    rawSubmission.file_url && typeof rawSubmission.file_url === "string"
      ? rawSubmission.file_url.split("/").pop()
      : null,
  submitted_at: rawSubmission.created_at || rawSubmission.submitted_at,
  content: rawSubmission.answer || rawSubmission.content,
  assignment: {
    id: assignment.id,
    title: assignment.title,
    course: course || null,
  },
});

export const performanceMonitor = {
  start: (label: string) => {
    if (process.env.NODE_ENV === "development") {
      console.time(label);
    }
  },

  end: (label: string) => {
    if (process.env.NODE_ENV === "development") {
      console.timeEnd(label);
    }
  },

  mark: (message: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`⚡ ${message} - ${Date.now()}`);
    }
  },
};

export const createLazyComponent = <
  T extends React.ComponentType<Record<string, unknown>>
>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

import React from "react";
