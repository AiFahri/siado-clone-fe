import type { ReactNode } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  message?: string;
  className?: string;
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const LoadingSpinner = ({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-indigo-600",
    secondary: "text-gray-600",
    white: "text-white",
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const LoadingOverlay = ({
  isLoading,
  children,
  message = "Memuat...",
  className = "",
}: LoadingOverlayProps) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const LoadingButton = ({
  isLoading,
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: LoadingButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center
        ${isLoading ? "cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {isLoading && (
        <LoadingSpinner
          size="sm"
          color="white"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
};

export const LoadingCard = ({
  message = "Memuat data...",
}: {
  message?: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-center space-x-3">
        <LoadingSpinner size="md" />
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
};

export const LoadingTable = ({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
            ))}
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-gray-200 rounded flex-1"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LoadingList = ({ items = 3 }: { items?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-4 animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const FullPageLoader = ({
  message = "Memuat konten...",
}: {
  message?: string;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-gray-700 text-lg font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;


