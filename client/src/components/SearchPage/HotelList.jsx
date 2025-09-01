import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Spin, Empty, Button, Alert } from "antd";
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import HotelItem from "./HotelItem";

const HotelList = memo(({ hotels = [] }) => {
  const [visibleHotels, setVisibleHotels] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Throttle scroll handler để tránh gọi quá nhiều
  const handleScroll = useCallback(() => {
    if (isLoading) return;
    
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    
    // Load more khi còn 200px nữa đến cuối
    if (scrollTop + clientHeight >= scrollHeight - 200 && visibleHotels < hotels.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleHotels((prev) => Math.min(prev + 6, hotels.length));
        setIsLoading(false);
      }, 300);
    }
  }, [visibleHotels, hotels.length, isLoading]);

  // Throttled scroll listener
  useEffect(() => {
    let timeoutId = null;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Reset visible hotels when hotels list changes
  useEffect(() => {
    setVisibleHotels(6);
  }, [hotels]);

  // Memoize current hotels để tránh re-render không cần thiết
  const currentHotels = useMemo(() => {
    return hotels.slice(0, visibleHotels);
  }, [hotels, visibleHotels]);

  // Memoize hotel items để tránh re-render
  const hotelItems = useMemo(() => {
    return currentHotels.map((hotel, index) => (
      <HotelItem
        key={hotel._id || `hotel-${index}`}
        hotel={hotel}
      />
    ));
  }, [currentHotels]);

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Results Header */}
        {hotels.length > 0 && (
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Kết quả tìm kiếm
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tìm thấy {hotels.length} khách sạn
            </p>
          </div>
        )}

        {/* Loading State */}
        {hotels.length === 0 && isLoading ? (
          <div className="space-y-6">
            {/* Loading skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="animate-pulse">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-80 h-48 lg:h-56 bg-gray-200"></div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center py-8">
              <Spin size="large" tip="Đang tải khách sạn...">
                <div className="w-full h-20" />
              </Spin>
            </div>
          </div>
        ) : hotels.length === 0 ? (
          <div className="space-y-6">
            {/* Loading skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="animate-pulse">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-80 h-48 lg:h-56 bg-gray-200"></div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center py-8">
              <Spin size="large" tip="Đang tải khách sạn...">
                <div className="w-full h-20" />
              </Spin>
            </div>
          </div>
        ) : (
          /* Hotel List */
          <>
            <div className="grid grid-cols-1 gap-6">
              {hotelItems}
            </div>

            {/* Loading more indicator */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Spin size="large" tip="Đang tải thêm khách sạn...">
                  <div className="w-full h-20" />
                </Spin>
              </div>
            )}

            {/* End message */}
            {!isLoading && visibleHotels >= hotels.length && hotels.length > 6 && (
              <Alert
                message="Đã hiển thị tất cả khách sạn"
                description={`Bạn đã xem hết ${hotels.length} khách sạn. Sử dụng bộ lọc để tìm kiếm chính xác hơn.`}
                type="info"
                showIcon
                className="text-center"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

HotelList.displayName = 'HotelList';

export default HotelList;
