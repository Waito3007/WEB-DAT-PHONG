// UpdateStatusModal.js
import React from 'react';

const UpdateStatusModal = ({
  isVisible,
  onClose,
  onUpdateStatus,
  getStatusText,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Cập nhật trạng thái</h3>
        <div className="flex flex-col gap-4">
          {['Complete', 'Pending', 'CheckIn', 'Done'].map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(status)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              {getStatusText(status)}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded-xl">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
