// UpdateStatusModal.js
import React from "react";
import { CheckCircle, Clock, UserCheck, CheckSquare } from "lucide-react";

const UpdateStatusModal = ({
  isVisible,
  onClose,
  onUpdateStatus,
  getStatusText,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 p-10 rounded-3xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-3xl font-extrabold text-white mb-6 text-center drop-shadow-md"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          CẬP NHẬT TRẠNG THÁI
        </h3>

        <div className="flex flex-col gap-6">
          {["Complete", "Pending", "CheckIn", "Done"].map((status) => {
            let Icon;
            if (status === "Complete") Icon = CheckCircle;
            else if (status === "Pending") Icon = Clock;
            else if (status === "CheckIn") Icon = UserCheck;
            else if (status === "Done") Icon = CheckSquare;

            return (
              <button
                key={status}
                onClick={() => onUpdateStatus(status)}
                className="flex items-center justify-between bg-white text-gray-800 py-4 px-8 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-600 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-2xl" />
                  <span>{getStatusText(status)}</span>
                </div>
                {/* <span className="bg-gray-400 text-gray-800 py-1 px-4 rounded-full text-sm font-medium hidden sm:block">
                  {status}
                </span> */}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end mt-8 gap-6">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
