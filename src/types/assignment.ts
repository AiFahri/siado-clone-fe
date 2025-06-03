export interface Assignment {
  id?: number;
  course_id: number;
  title: string;
  description: string;
  due_date: string;
  created_at?: string;
  updated_at?: string;
  course?: {
    id: number;
    name: string;
    code: string;
  };
  submissions?: AssignmentSubmission[];
  submissions_count?: number;
  graded_submissions_count?: number;
}

export interface AssignmentSubmission {
  id?: number;
  assignment_id: number;
  student_id: number;
  content?: string;
  file_path?: string;
  file_name?: string;
  grade?: number;
  feedback?: string;
  submitted_at?: string;
  graded_at?: string;
  student?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AssignmentFormData {
  title: string;
  description: string;
  due_date: string;
}
