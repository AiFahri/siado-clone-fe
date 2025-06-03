import { useState, useEffect } from "react";
import type { AdminStats, LecturerStats } from "@/types";
import { adminApi, handleApiError } from "@/Utils/api";
import { getGlobalStats } from "@/Utils/globalStore";

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalLecturers: 0,
    totalStudents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [users, courses] = await Promise.all([
        adminApi.users.getAll(),
        adminApi.courses.getAll(),
      ]);

      const usersArray = Array.isArray(users) ? users : [];
      const coursesArray = Array.isArray(courses) ? courses : [];

      const totalUsers = usersArray.length;
      const totalCourses = coursesArray.length;
      const totalLecturers = usersArray.filter(
        (user) => user.role === "lecturer"
      ).length;
      const totalStudents = usersArray.filter(
        (user) => user.role === "student"
      ).length;

      setStats({
        totalUsers,
        totalCourses,
        totalLecturers,
        totalStudents,
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, error, refetch: fetchAdminStats };
};

export const useLecturerStats = () => {
  const [stats, setStats] = useState<LecturerStats>({
    total_courses: 0,
    total_assignments: 0,
    submissions_need_grading: 0,
    submissions_graded: 0,
    total_students: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchLecturerStats();
  }, []);

  const fetchLecturerStats = async () => {
    try {
      setIsLoading(true);
      setError("");

      const statsData = await getGlobalStats();

      setStats({
        total_courses: statsData.total_courses || 0,
        total_assignments: statsData.total_assignments || 0,
        submissions_need_grading: statsData.submissions_need_grading || 0,
        submissions_graded: statsData.submissions_graded || 0,
        total_students: statsData.total_students || 0,
      });
    } catch (err) {
      setError(handleApiError(err));
      setStats({
        total_courses: 0,
        total_assignments: 0,
        submissions_need_grading: 0,
        submissions_graded: 0,
        total_students: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, error, refetch: fetchLecturerStats };
};
