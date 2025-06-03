import axios, { AxiosError } from "axios";
import type { User, Course } from "@/types";
import type { Assignment, AssignmentSubmission } from "@/types/assignment";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 401:
        return "Sesi Anda telah berakhir. Silakan login kembali.";
      case 403:
        return "Anda tidak memiliki akses untuk melakukan aksi ini.";
      case 422:
        return data?.message || "Data yang dikirim tidak valid.";
      case 500:
        return "Terjadi kesalahan pada server. Silakan coba lagi.";
      default:
        return data?.message || "Terjadi kesalahan yang tidak diketahui.";
    }
  }
  return "Terjadi kesalahan jaringan.";
};

export const authApi = {
  signin: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/signin", { email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get("/api/users/_self");
    return response.data;
  },
};

export const adminApi = {
  users: {
    getAll: async (): Promise<User[]> => {
      return getUltimateCachedData("admin-users", async () => {
        const response = await axios.get("/api/admin/users");

        // Handle pagination response
        // if (
        //   response.data &&
        //   response.data.data &&
        //   Array.isArray(response.data.data)
        // ) {
        //   return response.data.data;
        // }

        // // Handle direct array response
        // if (Array.isArray(response.data)) {
        return response.data;
        // }

        // return [];
      });
    },

    create: async (userData: {
      name: string;
      email: string;
      password: string;
      role: "lecturer" | "student" | "admin";
    }): Promise<User> => {
      const response = await axios.post("/api/admin/users", userData);
      return response.data;
    },

    getById: async (id: number): Promise<User> => {
      const response = await axios.get(`/api/admin/users/${id}`);
      return response.data;
    },

    update: async (id: number, userData: Partial<User>): Promise<User> => {
      const response = await axios.patch(`/api/admin/users/${id}`, userData);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await axios.delete(`/api/admin/users/${id}`);
    },
  },

  courses: {
    getAll: async (): Promise<Course[]> => {
      return getUltimateCachedData("admin-courses", async () => {
        const response = await axios.get("/api/courses");

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data;
        }

        if (Array.isArray(response.data)) {
          return response.data;
        }

        return [];
      });
    },

    create: async (courseData: {
      name: string;
      code: string;
      credits?: number;
    }): Promise<Course> => {
      const payload = {
        name: courseData.name,
        code: courseData.code,
        credits: courseData.credits || 3,
      };
      try {
        const response = await axios.post("/api/admin/courses", payload);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },

    getById: async (id: number): Promise<Course> => {
      const response = await axios.get(`/api/courses/${id}`);
      return response.data;
    },

    update: async (
      id: number,
      courseData: Partial<Course>
    ): Promise<Course> => {
      const response = await axios.patch(`/api/admin/courses/${id}`, {
        name: courseData.name,
        code: courseData.code,
        credits: courseData.credits,
      });
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await axios.delete(`/api/admin/courses/${id}`);
    },

    assignLecturer: async (
      courseId: number,
      lecturerId: number
    ): Promise<void> => {
      await axios.post(
        `/api/admin/courses/${courseId}/lecturers/${lecturerId}`
      );
    },

    removeLecturer: async (
      courseId: number,
      lecturerId: number
    ): Promise<void> => {
      await axios.delete(
        `/api/admin/courses/${courseId}/lecturers/${lecturerId}`
      );
    },

    getLecturers: async (courseId: number): Promise<User[]> => {
      const response = await axios.get(
        `/api/admin/courses/${courseId}/lecturers`
      );

      // Handle pagination response
      // if (
      //   response.data &&
      //   response.data.data &&
      //   Array.isArray(response.data.data)
      // ) {
      //   return response.data.data;
      // }

      // // Handle direct array response
      // if (Array.isArray(response.data)) {
      return response.data;
      // }

      // return [];
    },

    enrollStudent: async (
      courseId: number,
      studentId: number
    ): Promise<void> => {
      await axios.post(`/api/admin/courses/${courseId}/students/${studentId}`);
    },

    unenrollStudent: async (
      courseId: number,
      studentId: number
    ): Promise<void> => {
      await axios.delete(
        `/api/admin/courses/${courseId}/students/${studentId}`
      );
    },

    getEnrolledStudents: async (courseId: number): Promise<User[]> => {
      try {
        const response = await axios.get(
          `/api/admin/courses/${courseId}/students`
        );

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data;
        }

        if (Array.isArray(response.data)) {
          return response.data;
        }

        return [];
      } catch {
        return [];
      }
    },
  },
};

const globalCache = new Map<
  string,
  { data: unknown; timestamp: number; promise?: Promise<unknown> }
>();
const CACHE_DURATION = 300000; // 5 minutes - longer cache
const pendingRequests = new Map<string, Promise<unknown>>();

const getUltimateCachedData = async <T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cached = globalCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const pendingRequest = pendingRequests.get(key);
  if (pendingRequest) {
    return pendingRequest as Promise<T>; // Return the same promise to avoid duplicate calls
  }

  const requestPromise = fetchFn()
    .then((data) => {
      globalCache.set(key, { data, timestamp: Date.now() });
      pendingRequests.delete(key); // Clean up pending request
      return data;
    })
    .catch((error) => {
      pendingRequests.delete(key); // Clean up on error
      throw error;
    });

  pendingRequests.set(key, requestPromise);
  return requestPromise;
};

export const clearApiCache = (pattern?: string) => {
  if (pattern) {
    for (const key of globalCache.keys()) {
      if (key.includes(pattern)) {
        globalCache.delete(key);
        pendingRequests.delete(key);
      }
    }
  } else {
    globalCache.clear();
    pendingRequests.clear();
  }
};

export const lecturerApi = {
  getStats: async () => {
    return getUltimateCachedData("lecturer-stats", async () => {
      try {
        const response = await axios.get("/api/lecturer/stats");
        return response.data;
      } catch {
        return {
          total_courses: 0,
          total_assignments: 0,
          submissions_need_grading: 0,
          submissions_graded: 0,
          total_students: 0,
        };
      }
    });
  },

  getCourses: async (): Promise<Course[]> => {
    return getUltimateCachedData("lecturer-courses", async () => {
      try {
        const response = await axios.get("/api/users/_self/courses");

        if (Array.isArray(response.data)) {
          return response.data;
        }
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response.data?.courses && Array.isArray(response.data.courses)) {
          return response.data.courses;
        }

        return [];
      } catch {
        try {
          const response = await axios.get("/api/courses");
          if (Array.isArray(response.data)) {
            return response.data;
          }
          if (response.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }
          return [];
        } catch {
          return [];
        }
      }
    });
  },

  assignments: {
    getByCourse: async (courseId: number): Promise<Assignment[]> => {
      return getUltimateCachedData(
        `assignments-course-${courseId}`,
        async () => {
          const response = await axios.get(
            `/api/lecturer/courses/${courseId}/assignments`
          );

          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            return response.data.data;
          }

          if (Array.isArray(response.data)) {
            return response.data;
          }

          return [];
        }
      );
    },

    getAll: async (): Promise<Assignment[]> => {
      const courses = await lecturerApi.getCourses();
      const coursesArray = Array.isArray(courses) ? courses : [];

      if (coursesArray.length === 0) return [];

      const assignmentPromises = coursesArray.map(async (course: Course) => {
        try {
          const assignments = await lecturerApi.assignments.getByCourse(
            course.id
          );
          return Array.isArray(assignments) ? assignments : [];
        } catch {
          return [];
        }
      });

      const results = await Promise.allSettled(assignmentPromises);
      const allAssignments: Assignment[] = [];

      results.forEach((result) => {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          allAssignments.push(...result.value);
        }
      });

      return allAssignments;
    },

    create: async (
      courseId: number,
      assignmentData: {
        title: string;
        description: string;
        due_date: string;
      }
    ): Promise<Assignment> => {
      const response = await axios.post(
        `/api/lecturer/courses/${courseId}/assignments`,
        assignmentData
      );
      clearApiCache("assignments");
      clearApiCache("lecturer-stats");
      return response.data;
    },

    getById: async (id: number): Promise<Assignment> => {
      const allAssignments = await lecturerApi.assignments.getAll();
      const assignment = allAssignments.find((a) => a.id === id);

      if (!assignment) {
        throw new Error(`Assignment ${id} not found`);
      }

      return assignment;
    },

    update: async (
      assignmentId: number,
      assignmentData: Partial<Assignment>
    ): Promise<Assignment> => {
      const assignments = await lecturerApi.assignments.getAll();
      const assignment = Array.isArray(assignments)
        ? assignments.find((a) => a.id === assignmentId)
        : null;

      if (!assignment || !assignment.course_id) {
        throw new Error("Assignment or course not found for update");
      }

      const response = await axios.patch(
        `/api/lecturer/courses/${assignment.course_id}/assignments/${assignmentId}`,
        assignmentData
      );
      clearApiCache("assignments");
      clearApiCache("lecturer-stats");
      return response.data;
    },

    delete: async (courseId: number, assignmentId: number): Promise<void> => {
      await axios.delete(
        `/api/lecturer/courses/${courseId}/assignments/${assignmentId}`
      );
      clearApiCache("assignments");
      clearApiCache("lecturer-stats");
    },

    getSubmissions: async (
      assignmentId: number
    ): Promise<AssignmentSubmission[]> => {
      return getUltimateCachedData(
        `submissions-assignment-${assignmentId}`,
        async () => {
          const response = await axios.get(
            `/api/lecturer/assignments/${assignmentId}/submissions`
          );

          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            return response.data.data;
          }

          if (Array.isArray(response.data)) {
            return response.data;
          }

          return [];
        }
      );
    },

    getAllSubmissions: async (): Promise<AssignmentSubmission[]> => {
      return getUltimateCachedData("all-submissions", async () => {
        try {
          const response = await axios.get("/api/lecturer/submissions");

          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            return response.data.data;
          }

          if (Array.isArray(response.data)) {
            return response.data;
          }

          throw new Error("No bulk endpoint available");
        } catch {
          const assignments = await lecturerApi.assignments.getAll();

          if (assignments.length === 0) return [];

          const batchSize = 5; // Process 5 assignments at a time
          const allSubmissions: AssignmentSubmission[] = [];

          for (let i = 0; i < assignments.length; i += batchSize) {
            const batch = assignments.slice(i, i + batchSize);
            const batchPromises = batch.map(async (assignment) => {
              try {
                const submissions =
                  await lecturerApi.assignments.getSubmissions(assignment.id!);
                return submissions.map((submission) => ({
                  ...submission,
                  assignment: {
                    id: assignment.id,
                    title: assignment.title,
                    course_id: assignment.course_id,
                  },
                }));
              } catch {
                return [];
              }
            });

            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach((result) => {
              if (result.status === "fulfilled") {
                allSubmissions.push(...result.value);
              }
            });
          }

          return allSubmissions;
        }
      });
    },

    gradeSubmission: async (
      submissionId: number,
      gradeData: {
        grade: number;
        feedback?: string;
      }
    ): Promise<AssignmentSubmission> => {
      const response = await axios.post(
        `/api/lecturer/submissions/${submissionId}/grade`,
        gradeData
      );
      clearApiCache("submissions");
      clearApiCache("lecturer-stats");
      return response.data;
    },
  },

  materials: {
    getByCourse: async (courseId: number) => {
      const response = await axios.get(
        `/api/lecturer/courses/${courseId}/materials`
      );
      return response.data;
    },

    create: async (
      courseId: number,
      materialData: {
        title: string;
        content: string;
      }
    ) => {
      const response = await axios.post(
        `/api/lecturer/courses/${courseId}/materials`,
        {
          title: materialData.title,
          content: materialData.content,
        }
      );
      return response.data;
    },

    update: async (
      courseId: number,
      materialId: number,
      materialData: { title?: string; content?: string }
    ) => {
      const response = await axios.patch(
        `/api/lecturer/courses/${courseId}/materials/${materialId}`,
        materialData
      );
      return response.data;
    },

    delete: async (courseId: number, materialId: number): Promise<void> => {
      await axios.delete(
        `/api/lecturer/courses/${courseId}/materials/${materialId}`
      );
    },
  },

  courses: {
    getStudents: async (
      courseId: number
    ): Promise<{ students: User[]; count: number }> => {
      return getUltimateCachedData(`students-course-${courseId}`, async () => {
        const response = await axios.get(
          `/api/lecturer/courses/${courseId}/students`
        );
        return response.data;
      });
    },
  },
};

const api = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await axios.get<T>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axios.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axios.patch<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axios.delete<T>(url);
    return response.data;
  },

  assignments: {
    getAll: async () => lecturerApi.assignments.getAll(),
    getById: async (id: number) => lecturerApi.assignments.getById(id),
    create: async (data: {
      title: string;
      description: string;
      due_date: string;
    }) => {
      const courses = await lecturerApi.getCourses();
      if (Array.isArray(courses) && courses.length > 0) {
        return lecturerApi.assignments.create(courses[0].id, data);
      }
      throw new Error("No courses available");
    },
    update: async (id: number, data: Partial<Assignment>) =>
      lecturerApi.assignments.update(id, data),
    delete: async (id: number) => {
      const assignments = await lecturerApi.assignments.getAll();
      const assignment = Array.isArray(assignments)
        ? assignments.find((a) => a.id === id)
        : null;

      if (assignment && assignment.course_id) {
        return lecturerApi.assignments.delete(assignment.course_id, id);
      }
      throw new Error("Assignment or course not found for deletion");
    },
  },

  submissions: {
    getByAssignmentId: async (assignmentId: number) =>
      lecturerApi.assignments.getSubmissions(assignmentId),
    getById: async () => {
      throw new Error("Not implemented");
    },
    create: async () => {
      throw new Error("Students create submissions, not lecturers");
    },
    grade: async (id: number, data: { score: number; feedback?: string }) =>
      lecturerApi.assignments.gradeSubmission(id, {
        grade: data.score,
        feedback: data.feedback,
      }),
  },
};

export default api;
