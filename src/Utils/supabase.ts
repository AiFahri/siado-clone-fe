import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://htnqkjejgcovkehhtqjw.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnFramVqZ2NvdmtlaGh0cWp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTU3NjcxNywiZXhwIjoyMDYxMTUyNzE3fQ.1grlfRPhyA86mXRY2YNKcHgswjLnYIbnSjN18lYI8TM";
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET || "siado-clone";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fileStorage = {
  uploadFile: async (
    file: File,
    path: string
  ): Promise<{ url: string; path: string }> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  },

  deleteFile: async (path: string): Promise<void> => {
    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  },

  getFileUrl: (pathOrUrl: string): string => {
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      return pathOrUrl;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(pathOrUrl);
    return data.publicUrl;
  },

  downloadFile: async (pathOrUrl: string): Promise<Blob> => {
    let filePath = pathOrUrl;

    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      const urlParts = pathOrUrl.split(
        `/storage/v1/object/public/${bucketName}/`
      );
      if (urlParts.length > 1) {
        filePath = urlParts[1];
      } else {
        filePath = pathOrUrl.split("/").pop() || pathOrUrl;
      }
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    return data;
  },

  listFiles: async (folder: string = "") => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);

    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }

    return data;
  },
};

export const urlUtils = {
  isFullUrl: (pathOrUrl: string): boolean => {
    return pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://");
  },

  extractPathFromUrl: (url: string): string => {
    if (!urlUtils.isFullUrl(url)) {
      return url; // Already a path
    }

    const urlParts = url.split(`/storage/v1/object/public/${bucketName}/`);
    if (urlParts.length > 1) {
      return urlParts[1];
    }

    return url.split("/").pop() || url;
  },

  getFileName: (pathOrUrl: string): string => {
    return pathOrUrl.split("/").pop() || "file";
  },

  ensureFullUrl: (pathOrUrl: string): string => {
    return fileStorage.getFileUrl(pathOrUrl);
  },
};

export const uploadHelpers = {
  uploadSubmissionFile: async (
    file: File,
    assignmentId: number,
    studentId: number
  ) => {
    const path = `submissions/assignment-${assignmentId}/student-${studentId}`;
    return fileStorage.uploadFile(file, path);
  },

  uploadMaterialFile: async (file: File, courseId: number) => {
    const path = `materials/course-${courseId}`;
    return fileStorage.uploadFile(file, path);
  },

  uploadAvatar: async (file: File, userId: number) => {
    const path = `avatars/user-${userId}`;
    return fileStorage.uploadFile(file, path);
  },

  uploadAssignmentFile: async (file: File, assignmentId: number) => {
    const path = `assignments/assignment-${assignmentId}`;
    return fileStorage.uploadFile(file, path);
  },
};

export const fileValidation = {
  validateFileSize: (file: File, maxSizeMB: number = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  fileTypes: {
    images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
    spreadsheets: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    presentations: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    archives: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
    ],
    code: ["text/plain", "application/javascript", "text/html", "text/css"],
  },

  getFileCategory: (file: File): string => {
    const { fileTypes } = fileValidation;

    if (fileTypes.images.includes(file.type)) return "image";
    if (fileTypes.documents.includes(file.type)) return "document";
    if (fileTypes.spreadsheets.includes(file.type)) return "spreadsheet";
    if (fileTypes.presentations.includes(file.type)) return "presentation";
    if (fileTypes.archives.includes(file.type)) return "archive";
    if (fileTypes.code.includes(file.type)) return "code";

    return "other";
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },
};

export default supabase;
