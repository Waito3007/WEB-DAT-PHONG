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
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
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
        setError('Kết nối timeout - Backend mất quá lâu để phản hồi');
      } else {
        setError('Không thể kết nối đến backend');
      }
      return false;
    }
  };

  useEffect(() => {
    const maxRetries = 10;
    const retryDelay = 2000; // 2 seconds

    const retryHealthCheck = async () => {
      const isReady = await checkBackendHealth();
      
      if (!isReady && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          retryHealthCheck();
        }, retryDelay);
      } else if (retryCount >= maxRetries) {
        setError('Không thể kết nối đến backend sau nhiều lần thử');
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
          
          <p className="text-gray-600 mb-2">
            Vui lòng đợi trong giây lát
          </p>
          
          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Đang thử lại lần {retryCount}/10
            </p>
          )}
          
          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-red-600 font-medium mb-2">
                Có lỗi xảy ra
              </p>
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
              <button
                onClick={() => {
                  setRetryCount(0);
                  setError(null);
                  setIsBackendReady(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return children;
};

export default BackendLoader;
