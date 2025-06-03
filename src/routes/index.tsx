import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/Components/Auth/ProtectedRoute";
import Home from "@/Pages/Home";
import Login from "@/Pages/Auth/Login";
import AdminDashboard from "@/Pages/Admin/Dashboard";
import UserList from "@/Pages/Admin/Users/UserList";
import CreateUser from "@/Pages/Admin/Users/CreateUser";
import EditUser from "@/Pages/Admin/Users/EditUser";
import AdminCourseList from "@/Pages/Admin/Courses/CourseList";
import CreateCourse from "@/Pages/Admin/Courses/CreateCourse";
import EditCourse from "@/Pages/Admin/Courses/EditCourse";
import ManageLecturers from "@/Pages/Admin/Courses/ManageLecturers";
import ManageStudents from "@/Pages/Admin/Courses/ManageStudents";
import LecturerDashboard from "@/Pages/Lecturer/Dashboard";
import LecturerCourseList from "@/Pages/Lecturer/Courses/CourseList";
import CourseAssignments from "@/Pages/Lecturer/Courses/CourseAssignments";
import CourseDetail from "@/Pages/Lecturer/Courses/CourseDetail";
import LecturerAssignmentList from "@/Pages/Lecturer/Assignments/AssignmentList";
import LecturerCreateAssignment from "@/Pages/Lecturer/Assignments/CreateAssignment";
import LecturerEditAssignment from "@/Pages/Lecturer/Assignments/EditAssignment";
import LecturerSubmissionList from "@/Pages/Lecturer/Submissions/SubmissionList";
import LecturerGradeSubmission from "@/Pages/Lecturer/Submissions/GradeSubmission";
import AllSubmissions from "@/Pages/Lecturer/Submissions/AllSubmissions";
import MaterialList from "@/Pages/Lecturer/Materials/MaterialList";
import CreateMaterial from "@/Pages/Lecturer/Materials/CreateMaterial";

function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === "lecturer") {
    return <Navigate to="/lecturer/dashboard" replace />;
  } else {
    return <Navigate to="/student/dashboard" replace />;
  }
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId/edit"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminCourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/edit"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/lecturers"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageLecturers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/students"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lecturer/dashboard"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerCourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses/:courseId"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses/:courseId/assignments"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <CourseAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/assignments"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerAssignmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/assignments/create"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerCreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/assignments/:assignmentId/edit"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerEditAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/submissions"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <AllSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/assignments/:assignmentId/submissions"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerSubmissionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/submissions/:submissionId/grade"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <LecturerGradeSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses/:courseId/materials"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <MaterialList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses/:courseId/materials/create"
            element={
              <ProtectedRoute requiredRole="lecturer">
                <CreateMaterial />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
