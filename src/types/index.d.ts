export interface User {
  id: number;
  name: string;
  email: string;
  role: "lecturer" | "student" | "admin";
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  user: User;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  semester?: string;
  year?: number;
  credits?: number;
  created_at: string;
  updated_at: string;
  lecturers?: User[];
  students_count?: number;
}

export interface Material {
  id: number;
  course_id: number;
  title: string;
  content?: string;
  description?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  content?: string;
  file_path?: string;
  file_name?: string;
  file_url?: string;
  grade?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
  student: User;
  user?: User; // Backend sometimes uses 'user' field
}

export interface LecturerStats {
  total_courses: number;
  total_assignments: number;
  submissions_need_grading: number;
  submissions_graded: number;
  total_students: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalLecturers: number;
  totalStudents: number;
}

export interface StudentsResponse {
  students: User[];
  count: number;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = T & {
  auth: AuthUser;
};
