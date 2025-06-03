export const formatDate = (
  date: string | Date,
  format: "short" | "long" | "time" = "short"
): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
  };

  switch (format) {
    case "short":
      options.day = "2-digit";
      options.month = "2-digit";
      options.year = "numeric";
      return dateObj.toLocaleDateString("id-ID", options);

    case "long":
      options.weekday = "long";
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
      return dateObj.toLocaleDateString("id-ID", options);

    case "time":
      options.hour = "2-digit";
      options.minute = "2-digit";
      return dateObj.toLocaleTimeString("id-ID", options);

    default:
      return dateObj.toLocaleDateString("id-ID");
  }
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;

  return formatDate(dateObj);
};

export const formatNumber = (num: number | string, decimals = 0): string => {
  if (num === null || num === undefined || num === "") return "0";

  const number = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(number)) return "0";

  return number.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (
  amount: number | string,
  currency = "IDR"
): string => {
  if (amount === null || amount === undefined || amount === "") return "Rp 0";

  const number = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(number)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatPercentage = (
  value: number | string,
  decimals = 1
): string => {
  if (value === null || value === undefined || value === "") return "0%";

  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "0%";

  return `${formatNumber(number, decimals)}%`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const truncateText = (text: string, maxLength = 100): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const formatGrade = (grade: number | null | undefined): string => {
  if (grade === null || grade === undefined) return "Belum dinilai";
  return formatNumber(grade, 1);
};

export const getGradeColor = (grade: number | null | undefined): string => {
  if (grade === null || grade === undefined) return "text-gray-500";
  if (grade >= 80) return "text-green-600";
  if (grade >= 70) return "text-blue-600";
  if (grade >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const getGradeLetter = (grade: number | null | undefined): string => {
  if (grade === null || grade === undefined) return "-";
  if (grade >= 85) return "A";
  if (grade >= 80) return "A-";
  if (grade >= 75) return "B+";
  if (grade >= 70) return "B";
  if (grade >= 65) return "B-";
  if (grade >= 60) return "C+";
  if (grade >= 55) return "C";
  if (grade >= 50) return "C-";
  if (grade >= 45) return "D+";
  if (grade >= 40) return "D";
  return "E";
};

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
    graded: "Sudah Dinilai",
    submitted: "Sudah Dikumpulkan",
    draft: "Draft",
    active: "Aktif",
    inactive: "Tidak Aktif",
  };

  return statusMap[status] || capitalizeFirst(status);
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-100",
    approved: "text-green-600 bg-green-100",
    rejected: "text-red-600 bg-red-100",
    graded: "text-blue-600 bg-blue-100",
    submitted: "text-indigo-600 bg-indigo-100",
    draft: "text-gray-600 bg-gray-100",
    active: "text-green-600 bg-green-100",
    inactive: "text-red-600 bg-red-100",
  };

  return colorMap[status] || "text-gray-600 bg-gray-100";
};

export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: "Administrator",
    lecturer: "Dosen",
    student: "Mahasiswa",
  };

  return roleMap[role] || capitalizeFirst(role);
};

export const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    admin: "text-purple-600 bg-purple-100",
    lecturer: "text-blue-600 bg-blue-100",
    student: "text-green-600 bg-green-100",
  };

  return colorMap[role] || "text-gray-600 bg-gray-100";
};
