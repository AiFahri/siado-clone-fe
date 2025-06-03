type RouteParams = Record<string, string | number>;

const routes = {
  home: "/",

  login: "/login",
  logout: "/logout",
  dashboard: "/dashboard",

  "admin.dashboard": "/admin/dashboard",
  "admin.users": "/admin/users",
  "admin.users.create": "/admin/users/create",
  "admin.users.show": "/admin/users/:id",
  "admin.users.edit": "/admin/users/:id/edit",
  "admin.courses": "/admin/courses",
  "admin.courses.create": "/admin/courses/create",
  "admin.courses.show": "/admin/courses/:id",
  "admin.courses.edit": "/admin/courses/:id/edit",
  "lecturer.dashboard": "/lecturer/dashboard",
  "lecturer.courses": "/lecturer/courses",
  "lecturer.courses.show": "/lecturer/courses/:id",
  "lecturer.assignments": "/lecturer/assignments",
  "lecturer.assignments.create": "/lecturer/assignments/create",
  "lecturer.assignments.show": "/lecturer/assignments/:id",
  "lecturer.assignments.edit": "/lecturer/assignments/:id/edit",
  "lecturer.submissions": "/lecturer/submissions",
  "lecturer.submissions.grade": "/lecturer/submissions/:id/grade",
  "teacher.dashboard": "/lecturer/dashboard",
  "teacher.assignments.index": "/teacher/assignments",
  "teacher.assignments.create": "/teacher/assignments/create",
  "teacher.assignments.show": "/teacher/assignments/:id",
  "teacher.assignments.edit": "/teacher/assignments/:id/edit",
  "teacher.assignments.store": "/teacher/assignments",
  "teacher.assignments.update": "/teacher/assignments/:id",
  "teacher.assignments.destroy": "/teacher/assignments/:id",
  "teacher.submissions.grade": "/teacher/submissions/:id/grade",
  "teacher.submissions.update_grade": "/teacher/submissions/:id/grade",
} as const;

export function route(name: keyof typeof routes, params?: RouteParams): string {
  let path: string = routes[name];

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }

  return path;
}

export default route;
