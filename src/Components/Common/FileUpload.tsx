import { useState, useRef } from "react";
import { fileValidation } from "@/Utils/supabase";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  currentFile?: {
    name: string;
    url?: string;
    size?: number;
  };
  error?: string;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = [],
  maxSizeMB = 10,
  multiple = false,
  disabled = false,
  label = "Upload File",
  description,
  currentFile,
  error,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setValidationError("");

    if (!fileValidation.validateFileSize(file, maxSizeMB)) {
      setValidationError(`File terlalu besar. Maksimal ${maxSizeMB}MB`);
      return false;
    }

    if (
      acceptedTypes.length > 0 &&
      !fileValidation.validateFileType(file, acceptedTypes)
    ) {
      setValidationError("Tipe file tidak didukung");
      return false;
    }

    return true;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const openFileDialog = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return (
          <svg
            className="w-8 h-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 18h12V6l-4-4H4v16zm8-14l2 2h-2V4z" />
          </svg>
        );
      case "doc":
      case "docx":
        return (
          <svg
            className="w-8 h-8 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 18h12V6l-4-4H4v16zm8-14l2 2h-2V4z" />
          </svg>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 18h12V6l-4-4H4v16zm8-14l2 2h-2V4z" />
          </svg>
        );
    }
  };

  const displayError = error || validationError;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {currentFile && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(currentFile.name)}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentFile.name}
                </p>
                {currentFile.size && (
                  <p className="text-xs text-gray-500">
                    {fileValidation.formatFileSize(currentFile.size)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentFile.url && (
                <a
                  href={currentFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                  Lihat
                </a>
              )}
              {onFileRemove && (
                <button
                  onClick={onFileRemove}
                  className="text-red-600 hover:text-red-500 text-sm"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : displayError
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="text-center">
          <svg
            className={`mx-auto h-12 w-12 ${
              displayError ? "text-red-400" : "text-gray-400"
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p
              className={`text-sm ${
                displayError ? "text-red-600" : "text-gray-600"
              }`}
            >
              <span className="font-medium">Klik untuk upload</span> atau drag
              and drop
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {acceptedTypes.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Tipe file:{" "}
                {acceptedTypes.map((type) => type.split("/")[1]).join(", ")}
              </p>
            )}
            <p className="text-xs text-gray-500">Maksimal {maxSizeMB}MB</p>
          </div>
        </div>
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}
