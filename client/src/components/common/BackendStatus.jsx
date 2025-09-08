import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Wifi, WifiOff } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const BackendStatus = () => {
  const [showBanner, setShowBanner] = useState(false);

  const checkBackendStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/api/health`, {
        signal: controller.signal,
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK') {
          setShowBanner(false);
          return;
        }
      }
      throw new Error('Backend not responding');
    } catch (err) {
      setShowBanner(true);
    }
  };

  useEffect(() => {
    // Check immediately
    checkBackendStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <WifiOff className="w-5 h-5" />
              </motion.div>
              <div>
                <p className="text-sm font-medium">
                  Backend đang offline hoặc khởi động
                </p>
                <p className="text-xs opacity-90">
                  Một số tính năng có thể không hoạt động
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <a
                href="https://web-dat-phong.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Đánh thức server</span>
              </a>
              
              <button
                onClick={() => {
                  checkBackendStatus();
                }}
                className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
              >
                <Wifi className="w-3 h-3" />
                <span>Kiểm tra lại</span>
              </button>
              
              <button
                onClick={() => setShowBanner(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackendStatus;
