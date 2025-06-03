export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  TIMEOUT: 10000,
  CACHE_DURATION: 300000,
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  LECTURER: "lecturer",
  STUDENT: "student",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USERS_CREATE: "/admin/users/create",
    USERS_EDIT: (id: number) => `/admin/users/${id}/edit`,
    COURSES: "/admin/courses",
    COURSES_CREATE: "/admin/courses/create",
    COURSES_EDIT: (id: number) => `/admin/courses/${id}/edit`,
    COURSES_LECTURERS: (id: number) => `/admin/courses/${id}/lecturers`,
    COURSES_STUDENTS: (id: number) => `/admin/courses/${id}/students`,
  },

  LECTURER: {
    DASHBOARD: "/lecturer/dashboard",
    COURSES: "/lecturer/courses",
    COURSE_DETAIL: (id: number) => `/lecturer/courses/${id}`,
    COURSE_ASSIGNMENTS: (id: number) => `/lecturer/courses/${id}/assignments`,
    COURSE_MATERIALS: (id: number) => `/lecturer/courses/${id}/materials`,
    MATERIALS_CREATE: (courseId: number) =>
      `/lecturer/courses/${courseId}/materials/create`,
    ASSIGNMENTS: "/lecturer/assignments",
    ASSIGNMENTS_CREATE: "/lecturer/assignments/create",
    ASSIGNMENTS_EDIT: (id: number) => `/lecturer/assignments/${id}/edit`,
    SUBMISSIONS: "/lecturer/submissions",
    SUBMISSIONS_BY_ASSIGNMENT: (id: number) =>
      `/lecturer/assignments/${id}/submissions`,
    SUBMISSIONS_GRADE: (id: number) => `/lecturer/submissions/${id}/grade`,
  },
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "Field ini wajib diisi",
  EMAIL_INVALID: "Format email tidak valid",
  PASSWORD_MIN_LENGTH: "Password minimal 8 karakter",
  PASSWORD_CONFIRMATION: "Konfirmasi password tidak cocok",
  NAME_MIN_LENGTH: "Nama minimal 2 karakter",
  CODE_REQUIRED: "Kode mata kuliah wajib diisi",
  CREDITS_MIN: "SKS minimal 1",
  CREDITS_MAX: "SKS maksimal 6",
  TITLE_REQUIRED: "Judul wajib diisi",
  DESCRIPTION_REQUIRED: "Deskripsi wajib diisi",
  DUE_DATE_REQUIRED: "Tanggal deadline wajib diisi",
  DUE_DATE_FUTURE: "Tanggal deadline harus di masa depan",
  GRADE_MIN: "Nilai minimal 0",
  GRADE_MAX: "Nilai maksimal 100",
} as const;

export const UI_CONFIG = {
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  LOADING_DELAY: 200,
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024,
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
    SPREADSHEETS: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    PRESENTATIONS: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    ARCHIVES: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
    ],
  },
} as const;

export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  GRADED: "graded",
  SUBMITTED: "submitted",
  DRAFT: "draft",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const COLORS = {
  PRIMARY: "indigo",
  SUCCESS: "green",
  WARNING: "yellow",
  DANGER: "red",
  INFO: "blue",
  SECONDARY: "gray",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Terjadi kesalahan jaringan. Periksa koneksi internet Anda.",
  SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi.",
  UNAUTHORIZED: "Sesi Anda telah berakhir. Silakan login kembali.",
  FORBIDDEN: "Anda tidak memiliki akses untuk melakukan aksi ini.",
  NOT_FOUND: "Data yang dicari tidak ditemukan.",
  VALIDATION_ERROR: "Data yang dikirim tidak valid.",
  UNKNOWN_ERROR: "Terjadi kesalahan yang tidak diketahui.",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login berhasil!",
  LOGOUT_SUCCESS: "Logout berhasil!",
  CREATE_SUCCESS: "Data berhasil dibuat!",
  UPDATE_SUCCESS: "Data berhasil diperbarui!",
  DELETE_SUCCESS: "Data berhasil dihapus!",
  SAVE_SUCCESS: "Data berhasil disimpan!",
  SUBMIT_SUCCESS: "Data berhasil dikirim!",
} as const;
