import type { ReactNode } from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
  variant?: "inline" | "card" | "banner";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

interface FieldErrorProps {
  error?: string;
  className?: string;
}

const ErrorIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RefreshIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const ErrorMessage = ({
  message = "Terjadi kesalahan",
  className = "",
  variant = "inline",
  size = "md",
  showIcon = true,
  onRetry,
  retryText = "Coba Lagi",
}: ErrorMessageProps) => {
  const sizeClasses = {
    sm: "text-sm p-2",
    md: "text-base p-3",
    lg: "text-lg p-4",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center text-red-600 ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <ErrorIcon className={`mr-2 ${iconSizes[size]}`} />}
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-3 text-sm text-red-700 hover:text-red-800 underline"
          >
            {retryText}
          </button>
        )}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-md ${sizeClasses[size]} ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {showIcon && (
              <ErrorIcon className={`text-red-400 mr-3 ${iconSizes[size]}`} />
            )}
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{message}</p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <RefreshIcon className="mr-1" />
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Card variant
  return (
    <div
      className={`bg-white rounded-lg shadow border border-red-200 ${sizeClasses[size]} ${className}`}
    >
      <div className="text-center">
        {showIcon && (
          <ErrorIcon
            className={`mx-auto text-red-400 mb-3 ${
              iconSizes[size] === "w-4 h-4"
                ? "w-8 h-8"
                : iconSizes[size] === "w-5 h-5"
                ? "w-10 h-10"
                : "w-12 h-12"
            }`}
          />
        )}
        <h3 className="text-red-800 font-medium mb-2">Terjadi Kesalahan</h3>
        <p className="text-red-700 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <RefreshIcon className="mr-2" />
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export const FieldError = ({ error, className = "" }: FieldErrorProps) => {
  if (!error) return null;

  return <p className={`text-red-600 text-sm mt-1 ${className}`}>{error}</p>;
};

export const ErrorBoundaryFallback = ({
  error,
  resetError,
}: ErrorBoundaryFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <ErrorMessage
          variant="card"
          size="lg"
          message={`Aplikasi mengalami kesalahan: ${error.message}`}
          onRetry={resetError}
          retryText="Muat Ulang"
        />
      </div>
    </div>
  );
};

export const NotFound = ({
  title = "Halaman Tidak Ditemukan",
  message = "Halaman yang Anda cari tidak dapat ditemukan.",
  onGoHome,
}: {
  title?: string;
  message?: string;
  onGoHome?: () => void;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({
  title = "Tidak Ada Data",
  message = "Belum ada data untuk ditampilkan.",
  icon,
  action,
}: {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default ErrorMessage;
