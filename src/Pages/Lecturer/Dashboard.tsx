import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import {
  StatCard,
  BookIcon,
  ClipboardIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
} from "@/Components/UI";
import type { Course } from "@/types";
import { useLecturerStats } from "@/Hooks";
import { getGlobalCourses } from "@/Utils";
import FullPageLoader from "@/Components/UI/LoadingSpinner";

const LecturerDashboard = memo(function LecturerDashboard() {
  const { stats, isLoading } = useLecturerStats();
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);

  const fetchRecentCourses = async () => {
    try {
      const courses = await getGlobalCourses();
      const coursesArray = Array.isArray(courses) ? courses : [];
      setRecentCourses(coursesArray.slice(0, 5));
    } catch {
      setRecentCourses([]);
    }
  };

  useEffect(() => {
    fetchRecentCourses();
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  const statCards = [
    {
      title: "Course Saya",
      value: stats.total_courses,
      icon: <BookIcon className="w-8 h-8 text-blue-600" />,
      bgColor: "bg-blue-50",
      link: "/lecturer/courses",
    },
    {
      title: "Total Tugas",
      value: stats.total_assignments,
      icon: <ClipboardIcon className="w-8 h-8 text-green-600" />,
      bgColor: "bg-green-50",
      link: "/lecturer/assignments",
    },
    {
      title: "Perlu Dinilai",
      value: stats.submissions_need_grading,
      icon: <ClockIcon className="w-8 h-8 text-yellow-600" />,
      bgColor: "bg-yellow-50",
      link: "/lecturer/submissions?status=pending",
    },
    {
      title: "Sudah Dinilai",
      value: stats.submissions_graded,
      icon: <CheckCircleIcon className="w-8 h-8 text-purple-600" />,
      bgColor: "bg-purple-50",
      link: "/lecturer/submissions?status=graded",
    },
  ];

  return (
    <DashboardLayout title="Dashboard Dosen">
      <Head title="Dashboard Dosen - Siado" />
      <Card className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Selamat datang, Dosen!
            </h2>
            <p className="text-gray-600">
              Kelola course dan tugas Anda dengan mudah.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            link={stat.link}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Course Terbaru
            </h3>
            <Link
              to="/lecturer/courses"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-200 h-16 rounded"></div>
                ))}
              </div>
            ) : recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/lecturer/courses/${course.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {course.name}
                      </h4>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                    {/* <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {course.students_count} mahasiswa
                      </p>
                    </div> */}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada course</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Yang Perlu dinilai
            </h3>
            <Link
              to="/lecturer/assignments"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-200 h-16 rounded"></div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Lihat statistik di atas untuk informasi tugas yang perlu dinilai
              </p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
});

export default LecturerDashboard;
