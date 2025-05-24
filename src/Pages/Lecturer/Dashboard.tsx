import { useState, useEffect } from 'react';
import DashboardLayout from '@/Components/Layout/DashboardLayout';
import Head from '@/Components/Common/Head';
import Card from '@/Components/Common/Card';
import { Link } from 'react-router-dom';
import type { Course, Assignment } from '@/types';

interface LecturerStats {
  totalCourses: number;
  totalAssignments: number;
  pendingSubmissions: number;
  gradedSubmissions: number;
}

export default function LecturerDashboard() {
  const [stats, setStats] = useState<LecturerStats>({
    totalCourses: 0,
    totalAssignments: 0,
    pendingSubmissions: 0,
    gradedSubmissions: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalCourses: 4,
        totalAssignments: 12,
        pendingSubmissions: 8,
        gradedSubmissions: 24,
      });

      setRecentCourses([
        {
          id: 1,
          name: 'Pemrograman Web',
          code: 'IF301',
          description: 'Mata kuliah pemrograman web menggunakan React dan Laravel',
          semester: 'Ganjil',
          year: 2024,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          students_count: 35,
        },
        {
          id: 2,
          name: 'Basis Data',
          code: 'IF201',
          description: 'Mata kuliah basis data dan sistem manajemen basis data',
          semester: 'Ganjil',
          year: 2024,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          students_count: 42,
        },
      ]);

      setRecentAssignments([
        {
          id: 1,
          course_id: 1,
          title: 'Tugas React Components',
          description: 'Membuat komponen React untuk sistem e-commerce',
          due_date: '2024-02-15T23:59:59Z',
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z',
          course: {
            id: 1,
            name: 'Pemrograman Web',
            code: 'IF301',
          },
          submissions_count: 28,
          graded_submissions_count: 15,
        },
        {
          id: 2,
          course_id: 2,
          title: 'Desain Database E-Commerce',
          description: 'Merancang skema database untuk aplikasi e-commerce',
          due_date: '2024-02-20T23:59:59Z',
          created_at: '2024-01-22T00:00:00Z',
          updated_at: '2024-01-22T00:00:00Z',
          course: {
            id: 2,
            name: 'Basis Data',
            code: 'IF201',
          },
          submissions_count: 35,
          graded_submissions_count: 20,
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Course Saya',
      value: stats.totalCourses,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      link: '/lecturer/courses',
    },
    {
      title: 'Total Tugas',
      value: stats.totalAssignments,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      link: '/lecturer/assignments',
    },
    {
      title: 'Perlu Dinilai',
      value: stats.pendingSubmissions,
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      link: '/lecturer/submissions?status=pending',
    },
    {
      title: 'Sudah Dinilai',
      value: stats.gradedSubmissions,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      link: '/lecturer/submissions?status=graded',
    },
  ];

  return (
    <DashboardLayout title="Dashboard Dosen">
      <Head title="Dashboard Dosen - Siado" />
      <Card className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
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
          <Link key={index} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Course Terbaru</h3>
            <Link to="/lecturer/courses" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
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
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{course.students_count} mahasiswa</p>
                    </div>
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
            <h3 className="text-lg font-medium text-gray-900">Tugas Terbaru</h3>
            <Link to="/lecturer/assignments" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
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
            ) : recentAssignments.length > 0 ? (
              recentAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/lecturer/assignments/${assignment.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.course?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {assignment.graded_submissions_count}/{assignment.submissions_count} dinilai
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada tugas</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
