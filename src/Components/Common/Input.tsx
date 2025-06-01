import React from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
    px-4 py-2
    rounded-lg
    bg-white
    border
    text-sm
    text-gray-800
    shadow-sm
    placeholder-gray-400
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    transition-all
    duration-200
    ease-in-out
    ${
      error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300"
    }
    ${fullWidth ? "w-full" : ""}
    ${className}
  `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
