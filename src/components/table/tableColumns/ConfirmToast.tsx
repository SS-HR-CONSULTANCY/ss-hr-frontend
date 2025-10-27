import React from "react";

interface ConfirmToastProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmToast: React.FC<ConfirmToastProps> = ({
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <div>
      <p className="mb-3">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          {confirmText}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};
