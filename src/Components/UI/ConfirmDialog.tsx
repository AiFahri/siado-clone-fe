import { useState } from "react";
import type { ReactNode } from "react";
import { LoadingButton } from "./LoadingSpinner";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
  icon?: ReactNode;
}

interface UseConfirmDialogReturn {
  isOpen: boolean;
  open: (options?: Partial<ConfirmDialogOptions>) => void;
  close: () => void;
  confirm: () => void;
  props: ConfirmDialogProps;
}

interface ConfirmDialogOptions {
  title: string;
  message: string | ReactNode;
  confirmText: string;
  cancelText: string;
  variant: "danger" | "warning" | "info" | "success";
  onConfirm: () => void | Promise<void>;
}

const WarningIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const InfoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const TrashIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya",
  cancelText = "Batal",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      defaultIcon: <TrashIcon />,
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      confirmBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      defaultIcon: <WarningIcon />,
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      defaultIcon: <InfoIcon />,
    },
    success: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      confirmBtn: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      defaultIcon: <CheckIcon />,
    },
  };

  const styles = variantStyles[variant];

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div
              className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
            >
              <div className={styles.iconColor}>
                {icon || styles.defaultIcon}
              </div>
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                {typeof message === "string" ? (
                  <p className="text-sm text-gray-500">{message}</p>
                ) : (
                  <div className="text-sm text-gray-500">{message}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <LoadingButton
              isLoading={isLoading}
              onClick={handleConfirm}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${styles.confirmBtn}`}
            >
              {confirmText}
            </LoadingButton>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useConfirmDialog = (
  defaultOptions: Partial<ConfirmDialogOptions> = {}
): UseConfirmDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: "Konfirmasi",
    message: "Apakah Anda yakin?",
    confirmText: "Ya",
    cancelText: "Batal",
    variant: "danger",
    onConfirm: () => {},
    ...defaultOptions,
  });
  const [isLoading, setIsLoading] = useState(false);

  const open = (newOptions: Partial<ConfirmDialogOptions> = {}) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const confirm = async () => {
    try {
      setIsLoading(true);
      await options.onConfirm();
      close();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return {
    isOpen,
    open,
    close,
    confirm,
    props: {
      isOpen,
      onClose: close,
      onConfirm: confirm,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant,
      isLoading,
    },
  };
};

export default ConfirmDialog;
