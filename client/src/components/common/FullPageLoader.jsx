import React from "react";

const FullPageLoader = ({ title = "Dữ liệu từ máy chủ đang được tải, vui lòng đợi...", subtitle = "Máy chủ miễn phí có thể 'ngủ' khi rảnh, khởi động sẽ mất vài chục giây." }) => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Đang kết nối tới máy chủ...</span>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
