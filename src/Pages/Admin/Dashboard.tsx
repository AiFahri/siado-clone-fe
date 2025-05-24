import { useState, useEffect } from 'react';
import DashboardLayout from '@/Components/Layout/DashboardLayout';
import Head from '@/Components/Common/Head';
import Card from '@/Components/Common/Card';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLecturers: number;
  totalStudents: number;
  totalAssignments: number;
  totalSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalLecturers: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would come from API
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalCourses: 24,
        totalLecturers: 18,
        totalStudents: 138,
        totalAssignments: 89,
        totalSubmissions: 234,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total User',
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      link: '/admin/users',
    },
    {
      title: 'Total Course',
      value: stats.totalCourses,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      link: '/admin/courses',
    },
    {
      title: 'Total Dosen',
      value: stats.totalLecturers,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      link: '/admin/users?role=lecturer',
    },
    {
      title: 'Total Mahasiswa',
      value: stats.totalStudents,
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      link: '/admin/users?role=student',
    },
    {
      title: 'Total Tugas',
      value: stats.totalAssignments,
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      link: '/admin/assignments',
    },
    {
      title: 'Total Pengumpulan',
      value: stats.totalSubmissions,
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: 'bg-indigo-50',
      link: '/admin/submissions',
    },
  ];

  return (
    <DashboardLayout title="Dashboard Admin">
      <Head title="Dashboard Admin - Siado" />

      {/* Welcome Section */}
      <Card className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Selamat datang, Admin!
            </h2>
            <p className="text-gray-600">
              Kelola sistem akademik dengan mudah dan efisien.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <Link
              to="/admin/users/create"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-blue-700 font-medium">Tambah User Baru</span>
            </Link>
            <Link
              to="/admin/courses/create"
              className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-green-700 font-medium">Tambah Course Baru</span>
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span>5 user baru terdaftar hari ini</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span>12 tugas baru dibuat minggu ini</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span>3 course baru ditambahkan</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
