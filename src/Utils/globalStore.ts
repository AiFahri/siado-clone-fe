import { lecturerApi } from "./api";
import type { User, Course, LecturerStats, StudentsResponse } from "@/types";
import type { Assignment, AssignmentSubmission } from "@/types/assignment";

interface GlobalState {
  user: User | null;
  courses: Course[] | null;
  stats: LecturerStats | null;
  assignments: Map<number, Assignment[]>;
  submissions: Map<number, AssignmentSubmission[]>;
  students: Map<number, StudentsResponse>;
}

class GlobalDataStore {
  private state: GlobalState = {
    user: null,
    courses: null,
    stats: null,
    assignments: new Map(),
    submissions: new Map(),
    students: new Map(),
  };

  public fetchPromises: Map<string, Promise<unknown>> = new Map();

  async getUser(): Promise<User | null> {
    if (this.state.user) return this.state.user;

    const key = "user";
    if (this.fetchPromises.has(key)) {
      return this.fetchPromises.get(key) as Promise<User | null>;
    }

    const promise = this.fetchUserData();
    this.fetchPromises.set(key, promise);

    try {
      const user = await promise;
      this.state.user = user;
      return user;
    } finally {
      this.fetchPromises.delete(key);
    }
  }

  async getCourses(): Promise<Course[]> {
    if (this.state.courses) return this.state.courses;

    const key = "courses";
    if (this.fetchPromises.has(key)) {
      return this.fetchPromises.get(key) as Promise<Course[]>;
    }

    const promise = lecturerApi.getCourses();
    this.fetchPromises.set(key, promise);

    try {
      const courses = await promise;
      this.state.courses = courses;
      return courses;
    } finally {
      this.fetchPromises.delete(key);
    }
  }

  async getStats(): Promise<LecturerStats> {
    if (this.state.stats) return this.state.stats;

    const key = "stats";
    if (this.fetchPromises.has(key)) {
      return this.fetchPromises.get(key) as Promise<LecturerStats>;
    }

    const promise = lecturerApi.getStats();
    this.fetchPromises.set(key, promise);

    try {
      const stats = await promise;
      this.state.stats = stats;
      return stats;
    } finally {
      this.fetchPromises.delete(key);
    }
  }

  async getAssignments(courseId: number): Promise<Assignment[]> {
    if (this.state.assignments.has(courseId)) {
      return this.state.assignments.get(courseId)!;
    }

    const key = `assignments-${courseId}`;
    if (this.fetchPromises.has(key)) {
      return this.fetchPromises.get(key) as Promise<Assignment[]>;
    }

    const promise = lecturerApi.assignments.getByCourse(courseId);
    this.fetchPromises.set(key, promise);

    try {
      const assignments = await promise;
      this.state.assignments.set(courseId, assignments);
      return assignments;
    } finally {
      this.fetchPromises.delete(key);
    }
  }

  async getSubmissions(assignmentId: number): Promise<AssignmentSubmission[]> {
    if (this.state.submissions.has(assignmentId)) {
      return this.state.submissions.get(assignmentId)!;
    }

    const key = `submissions-${assignmentId}`;
    if (this.fetchPromises.has(key)) {
      return this.fetchPromises.get(key) as Promise<AssignmentSubmission[]>;
    }

    const promise = lecturerApi.assignments.getSubmissions(assignmentId);
    this.fetchPromises.set(key, promise);

    try {
      const submissions = await promise;
      this.state.submissions.set(assignmentId, submissions);
      return submissions;
    } finally {
      this.fetchPromises.delete(key);
    }
  }

  async getStudents(courseId: number): Promise<StudentsResponse> {
    if (this.state.students.has(courseId)) {
      return this.state.students.get(courseId)!;
    }

    const key = `students-${courseId}`;
    if (this.fetchPromises.has(key)) {
      return this.fetchPromises.get(key) as Promise<StudentsResponse>;
    }

    const promise = lecturerApi.courses.getStudents(courseId);
    this.fetchPromises.set(key, promise);

    try {
      const students = await promise;
      this.state.students.set(courseId, students);
      return students;
    } finally {
      this.fetchPromises.delete(key);
    }
  }

  clear() {
    this.state = {
      user: null,
      courses: null,
      stats: null,
      assignments: new Map(),
      submissions: new Map(),
      students: new Map(),
    };
    this.fetchPromises.clear();
  }

  clearCourses() {
    this.state.courses = null;
    this.state.stats = null; // Stats depend on courses
  }

  clearAssignments(courseId?: number) {
    if (courseId) {
      this.state.assignments.delete(courseId);
    } else {
      this.state.assignments.clear();
    }
    this.state.stats = null; // Stats depend on assignments
  }

  clearSubmissions(assignmentId?: number) {
    if (assignmentId) {
      this.state.submissions.delete(assignmentId);
    } else {
      this.state.submissions.clear();
    }
    this.state.stats = null; // Stats depend on submissions
  }

  private async fetchUserData(): Promise<User | null> {
    // This would be your user API call
    return null;
  }
}

export const globalStore = new GlobalDataStore();

export const getGlobalCourses = () => globalStore.getCourses();
export const getGlobalStats = () => globalStore.getStats();
export const getGlobalAssignments = (courseId: number) =>
  globalStore.getAssignments(courseId);
export const getGlobalSubmissions = (assignmentId: number) =>
  globalStore.getSubmissions(assignmentId);
export const getGlobalStudents = (courseId: number) =>
  globalStore.getStudents(courseId);
export const clearGlobalData = () => globalStore.clear();

export const getGlobalUsers = async (): Promise<User[]> => {
  const { adminApi } = await import("./api");
  const existingPromise = globalStore.fetchPromises.get("admin-users");
  if (existingPromise) {
    return existingPromise as Promise<User[]>;
  }

  const promise = adminApi.users.getAll();
  globalStore.fetchPromises.set("admin-users", promise);
  return promise;
};

export const getGlobalAdminCourses = async (): Promise<Course[]> => {
  const { adminApi } = await import("./api");
  const existingPromise = globalStore.fetchPromises.get("admin-courses");
  if (existingPromise) {
    return existingPromise as Promise<Course[]>;
  }

  const promise = adminApi.courses.getAll();
  globalStore.fetchPromises.set("admin-courses", promise);
  return promise;
};
