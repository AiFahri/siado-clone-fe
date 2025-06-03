import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import {
  StatCard,
  UsersIcon,
  BookIcon,
  UserIcon,
  AcademicCapIcon,
  BadgeCheckIcon,
} from "@/Components/UI";
import { useAdminStats } from "@/Hooks";

const AdminDashboard = () => {
  const { stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: "Total User",
      value: stats.totalUsers,
      icon: <UsersIcon className="w-8 h-8 text-blue-600" />,
      bgColor: "bg-blue-50",
      link: "/admin/users",
    },
    {
      title: "Total Course",
      value: stats.totalCourses,
      icon: <BookIcon className="w-8 h-8 text-green-600" />,
      bgColor: "bg-green-50",
      link: "/admin/courses",
    },
    {
      title: "Total Dosen",
      value: stats.totalLecturers,
      icon: <UserIcon className="w-8 h-8 text-purple-600" />,
      bgColor: "bg-purple-50",
      link: "/admin/users?role=lecturer",
    },
    {
      title: "Total Mahasiswa",
      value: stats.totalStudents,
      icon: <AcademicCapIcon className="w-8 h-8 text-yellow-600" />,
      bgColor: "bg-yellow-50",
      link: "/admin/users?role=student",
    },
  ];

  return (
    <DashboardLayout title="Dashboard Admin">
      <Head title="Dashboard Admin - Siado" />
      <Card className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <BadgeCheckIcon className="h-6 w-6 text-indigo-600" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
