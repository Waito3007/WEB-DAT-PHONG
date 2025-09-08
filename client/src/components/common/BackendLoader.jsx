import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL;

const BackendLoader = ({ children }) => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 seconds for Render
      
      const response = await fetch(`${API_URL}/api/health`, {
        signal: controller.signal,
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK') {
          setIsBackendReady(true);
          setError(null);
          return true;
        }
      }
      throw new Error('Backend not ready');
    } catch (err) {
      console.error('Backend health check failed:', err);
      if (err.name === 'AbortError') {
        setError('Kết nối timeout - Backend đang khởi động (cold start có thể mất 30-60 giây)');
      } else {
        setError('Không thể kết nối đến backend - Có thể server đang trong trạng thái ngủ');
      }
      return false;
    }
  };

  useEffect(() => {
    const maxRetries = 6; // Reduced retries but with longer intervals
    const retryDelay = 5000; // Increased to 5 seconds between retries

    const retryHealthCheck = async () => {
      const isReady = await checkBackendHealth();
      
      if (!isReady && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          retryHealthCheck();
        }, retryDelay);
      } else if (retryCount >= maxRetries) {
        setError('Backend không phản hồi sau nhiều lần thử - Vui lòng kiểm tra server status');
      }
    };

    retryHealthCheck();
  }, [retryCount]);

  if (!isBackendReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <motion.div
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Đang khởi động hệ thống...
          </h2>
          
          <p className="text-gray-600 mb-4">
            Backend đang được khởi động, vui lòng đợi trong giây lát
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Thông tin Backend:</strong>
            </p>
            <a 
              href="https://web-dat-phong.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
            >
              https://web-dat-phong.onrender.com
            </a>
            <p className="text-xs text-blue-600 mt-2">
              💡 Nếu backend chưa sẵn sàng, hãy truy cập link trên để đánh thức server
            </p>
          </div>
          
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mb-2">
              Đang thử lại lần {retryCount}/6 (mỗi lần cách nhau 5 giây)
            </p>
          )}
          
          {retryCount >= 2 && (
            <motion.div
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-amber-800 text-sm">
                <strong>⏰ Backend đang mất thời gian khởi động</strong>
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Server trên Render.com có thể mất 30-60 giây để khởi động từ trạng thái "cold start".
              </p>
              <p className="text-amber-700 text-xs mt-1">
                💡 Bạn có thể truy cập link backend phía trên để giúp đánh thức server nhanh hơn.
              </p>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-red-600 font-medium mb-2">
                ❌ Không thể kết nối đến Backend
              </p>
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
              
              <div className="bg-white border border-red-300 rounded p-3 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Hướng dẫn khắc phục:</strong>
                </p>
                <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                  <li>Truy cập <a href="https://web-dat-phong.onrender.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">backend link</a> để đánh thức server</li>
                  <li>Đợi 1-2 phút để server khởi động hoàn toàn</li>
                  <li>Nhấn "Thử lại" bên dưới</li>
                </ol>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                    setIsBackendReady(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Thử lại
                </button>
                <a
                  href="https://web-dat-phong.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Mở Backend
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return children;
};

export default BackendLoader;
