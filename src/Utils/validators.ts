import { VALIDATION_MESSAGES } from "./constants";

export const required = (value: unknown): string | null => {
  if (value === null || value === undefined || value === "") {
    return VALIDATION_MESSAGES.REQUIRED;
  }
  if (typeof value === "string" && value.trim() === "") {
    return VALIDATION_MESSAGES.REQUIRED;
  }
  return null;
};

export const email = (value: string): string | null => {
  if (!value) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID;
  }
  return null;
};

export const minLength =
  (min: number) =>
  (value: string): string | null => {
    if (!value) return null;

    if (value.length < min) {
      return `Minimal ${min} karakter`;
    }
    return null;
  };

export const maxLength =
  (max: number) =>
  (value: string): string | null => {
    if (!value) return null;

    if (value.length > max) {
      return `Maksimal ${max} karakter`;
    }
    return null;
  };

export const minValue =
  (min: number) =>
  (value: number | string): string | null => {
    if (value === null || value === undefined || value === "") return null;

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue) || numValue < min) {
      return `Nilai minimal ${min}`;
    }
    return null;
  };

export const maxValue =
  (max: number) =>
  (value: number | string): string | null => {
    if (value === null || value === undefined || value === "") return null;

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue) || numValue > max) {
      return `Nilai maksimal ${max}`;
    }
    return null;
  };

export const password = (value: string): string | null => {
  if (!value) return null;

  if (value.length < 8) {
    return VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return null;
};

export const passwordConfirmation =
  (password: string) =>
  (value: string): string | null => {
    if (!value) return null;

    if (value !== password) {
      return VALIDATION_MESSAGES.PASSWORD_CONFIRMATION;
    }
    return null;
  };

export const name = (value: string): string | null => {
  if (!value) return null;

  if (value.trim().length < 2) {
    return VALIDATION_MESSAGES.NAME_MIN_LENGTH;
  }
  return null;
};

export const courseCode = (value: string): string | null => {
  if (!value) return VALIDATION_MESSAGES.CODE_REQUIRED;

  const codeRegex = /^[A-Za-z0-9_-]+$/;
  if (!codeRegex.test(value)) {
    return "Kode mata kuliah hanya boleh mengandung huruf, angka, tanda hubung, dan underscore";
  }

  if (value.length < 2 || value.length > 10) {
    return "Kode mata kuliah harus 2-10 karakter";
  }

  return null;
};

export const credits = (value: number | string): string | null => {
  if (value === null || value === undefined || value === "") {
    return "SKS wajib diisi";
  }

  const numValue = typeof value === "string" ? parseInt(value) : value;

  if (isNaN(numValue)) {
    return "SKS harus berupa angka";
  }

  if (numValue < 1) {
    return VALIDATION_MESSAGES.CREDITS_MIN;
  }

  if (numValue > 6) {
    return VALIDATION_MESSAGES.CREDITS_MAX;
  }

  return null;
};

export const grade = (value: number | string): string | null => {
  if (value === null || value === undefined || value === "") return null;

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "Nilai harus berupa angka";
  }

  if (numValue < 0) {
    return VALIDATION_MESSAGES.GRADE_MIN;
  }

  if (numValue > 100) {
    return VALIDATION_MESSAGES.GRADE_MAX;
  }

  return null;
};

export const futureDate = (value: string | Date): string | null => {
  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "Format tanggal tidak valid";
  }

  if (date <= now) {
    return VALIDATION_MESSAGES.DUE_DATE_FUTURE;
  }

  return null;
};

export const url = (value: string): string | null => {
  if (!value) return null;

  try {
    new URL(value);
    return null;
  } catch {
    return "Format URL tidak valid";
  }
};

export const phoneNumber = (value: string): string | null => {
  if (!value) return null;

  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  if (!phoneRegex.test(value.replace(/[\s-]/g, ""))) {
    return "Format nomor telepon tidak valid";
  }

  return null;
};

export const fileSize =
  (maxSizeInMB: number) =>
  (file: File): string | null => {
    if (!file) return null;

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `Ukuran file maksimal ${maxSizeInMB}MB`;
    }

    return null;
  };

export const fileType =
  (allowedTypes: string[]) =>
  (file: File): string | null => {
    if (!file) return null;

    if (!allowedTypes.includes(file.type)) {
      return `Tipe file tidak diizinkan. Tipe yang diizinkan: ${allowedTypes.join(
        ", "
      )}`;
    }

    return null;
  };

export const validateUser = {
  name: [required, name],
  email: [required, email],
  password: [required, password],
  role: [required],
};

export const validateCourse = {
  name: [required, minLength(3), maxLength(255)],
  code: [required, courseCode],
  credits: [required, credits],
};

export const validateAssignment = {
  title: [required, minLength(3), maxLength(255)],
  description: [required, minLength(10)],
  due_date: [required, futureDate],
};

export const validateMaterial = {
  title: [required, minLength(3), maxLength(255)],
  content: [required, minLength(10)],
};

export const validateSubmission = {
  content: [minLength(10)],
};

export const validateGrading = {
  grade: [required, grade],
  feedback: [minLength(5)],
};

export const validateField = (
  value: unknown,
  validators: Array<(value: unknown) => string | null>
): string | null => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = <T extends Record<string, unknown>>(
  values: T,
  validationRules: Record<keyof T, Array<(value: unknown) => string | null>>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, validators] of Object.entries(validationRules)) {
    const error = validateField(values[field as keyof T], validators);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};
