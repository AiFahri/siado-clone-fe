import Head from "@/Components/Common/Head";
import MainLayout from "@/Components/Layout/MainLayout";
import Card from "@/Components/Common/Card";
import type { Assignment } from "@/types/assignment";
import route from "@/Utils/route";

const mockAuth = {
  user: {
    id: 1,
    name: "Dosen Demo",
    email: "dosen@example.com",
    role: "teacher" as const,
  },
};

const mockStats = {
  totalAssignments: 0,
  pendingSubmissions: 0,
  gradedSubmissions: 0,
};

const mockRecentAssignments: Assignment[] = [];

export default function Dashboard() {
  return (
    <MainLayout user={mockAuth.user} title="Dashboard Dosen">
      <Head title="Dashboard" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Tugas</h3>
                <p className="text-3xl font-bold">
                  {mockStats.totalAssignments}
                </p>
              </div>
            </div>
          </Card>

          {/* <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-400 bg-opacity-30">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">
                                    Pending Submissions
                                </h3>
                                <p className="text-3xl font-bold">
                                    {stats.pendingSubmissions}
                                </p>
                            </div>
                        </div>
                    </Card> */}

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Tugas Dinilai</h3>
                <p className="text-3xl font-bold">
                  {mockStats.gradedSubmissions}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {mockAuth?.user?.name
                  ? mockAuth.user.name.charAt(0).toUpperCase()
                  : "T"}
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Selamat datang, {mockAuth?.user?.name || "Dosen"}!
              </h2>
              <p className="text-gray-600">
                Berikut adalah aktivitas tugas Anda hari ini.
              </p>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tugas Terbaru
          </h3>
          {mockRecentAssignments.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {mockRecentAssignments.map((assignment: Assignment) => (
                  <li key={assignment.id}>
                    <a
                      href={route("teacher.assignments.show", {
                        id: assignment.id || 0,
                      })}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {assignment.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {assignment.submissions?.length || 0} submissions
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {assignment.description.substring(0, 100)}
                              ...
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p>
                              Created on{" "}
                              <time dateTime={assignment.created_at}>
                                {new Date(
                                  assignment.created_at || ""
                                ).toLocaleDateString()}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Card>
              <div className="text-center py-6">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No assignments yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new assignment.
                </p>
                <div className="mt-6">
                  <a
                    href={route("teacher.assignments.create")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    New Assignment
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
