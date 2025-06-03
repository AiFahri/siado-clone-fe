import { useState, useEffect, useCallback } from "react";
import { adminApi, handleApiError } from "@/Utils/api";
import { getGlobalAdminCourses, getGlobalCourses } from "@/Utils/globalStore";
import type { Course, User } from "@/types";

interface UseCoursesOptions {
  immediate?: boolean;
  role?: "admin" | "lecturer";
}

interface UseCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<Course | null>;
  updateCourse: (
    id: number,
    courseData: Partial<Course>
  ) => Promise<Course | null>;
  deleteCourse: (id: number) => Promise<boolean>;
}

interface UseCourseDetailReturn {
  course: Course | null;
  lecturers: User[];
  students: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  assignLecturer: (lecturerId: number) => Promise<boolean>;
  removeLecturer: (lecturerId: number) => Promise<boolean>;
  enrollStudent: (studentId: number) => Promise<boolean>;
  unenrollStudent: (studentId: number) => Promise<boolean>;
}

export const useCourses = (
  options: UseCoursesOptions = {}
): UseCoursesReturn => {
  const { immediate = true, role = "admin" } = options;

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let coursesData: Course[];

      if (role === "admin") {
        coursesData = await getGlobalAdminCourses();
      } else {
        coursesData = await getGlobalCourses();
      }

      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  const createCourse = useCallback(
    async (courseData: Partial<Course>): Promise<Course | null> => {
      try {
        setError(null);
        const newCourse = await adminApi.courses.create(courseData as { 
          name: string; 
          code: string; 
          credits?: number 
        });

        await fetchCourses();

        return newCourse;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return null;
      }
    },
    [fetchCourses]
  );

  const updateCourse = useCallback(
    async (id: number, courseData: Partial<Course>): Promise<Course | null> => {
      try {
        setError(null);
        const updatedCourse = await adminApi.courses.update(id, courseData);

        setCourses((prev) =>
          prev.map((course) =>
            course.id === id ? { ...course, ...updatedCourse } : course
          )
        );

        return updatedCourse;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  const deleteCourse = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await adminApi.courses.delete(id);

      setCourses((prev) => prev.filter((course) => course.id !== id));

      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return false;
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchCourses();
    }
  }, [immediate, fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};

export const useCourseDetail = (courseId: number): UseCourseDetailReturn => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseDetail = useCallback(async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError(null);

      const [courseData, lecturersData, studentsData] = await Promise.all([
        adminApi.courses.getById(courseId),
        adminApi.courses.getLecturers(courseId),
        adminApi.courses.getEnrolledStudents(courseId),
      ]);

      setCourse(courseData);
      setLecturers(Array.isArray(lecturersData) ? lecturersData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const assignLecturer = useCallback(
    async (lecturerId: number): Promise<boolean> => {
      try {
        setError(null);
        await adminApi.courses.assignLecturer(courseId, lecturerId);

        await fetchCourseDetail();

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return false;
      }
    },
    [courseId, fetchCourseDetail]
  );

  const removeLecturer = useCallback(
    async (lecturerId: number): Promise<boolean> => {
      try {
        setError(null);
        await adminApi.courses.removeLecturer(courseId, lecturerId);

        setLecturers((prev) =>
          prev.filter((lecturer) => lecturer.id !== lecturerId)
        );

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return false;
      }
    },
    [courseId]
  );

  const enrollStudent = useCallback(
    async (studentId: number): Promise<boolean> => {
      try {
        setError(null);
        await adminApi.courses.enrollStudent(courseId, studentId);

        await fetchCourseDetail();

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return false;
      }
    },
    [courseId, fetchCourseDetail]
  );

  const unenrollStudent = useCallback(
    async (studentId: number): Promise<boolean> => {
      try {
        setError(null);
        await adminApi.courses.unenrollStudent(courseId, studentId);

        setStudents((prev) =>
          prev.filter((student) => student.id !== studentId)
        );

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return false;
      }
    },
    [courseId]
  );

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  return {
    course,
    lecturers,
    students,
    isLoading,
    error,
    refetch: fetchCourseDetail,
    assignLecturer,
    removeLecturer,
    enrollStudent,
    unenrollStudent,
  };
};

export const useLecturerCourses = () => {
  return useCourses({ role: "lecturer" });
};




