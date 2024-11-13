import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

// Hàm để lấy thứ trong tuần từ ngày
const getDayOfWeek = (date) => {
  const dayNames = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const dayIndex = new Date(date).getDay();
  return dayNames[dayIndex];
};

// Hàm để lấy tháng từ ngày
const getMonth = (date) => {
  const monthIndex = new Date(date).getMonth(); 
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  return monthNames[monthIndex];
};

const DailySalesTrend = ({ bookings }) => {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [filter, setFilter] = useState('day'); // State cho lựa chọn lọc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const salesData = {};

    // Xử lý từng booking
    bookings.forEach((booking) => {
      let timePeriod;
      const price = booking.priceBooking;

      if (filter === "day") {
        // Lọc theo ngày trong tuần
        timePeriod = getDayOfWeek(booking.bookingDate);
      } else if (filter === "month") {
        // Lọc theo tháng
        timePeriod = getMonth(booking.bookingDate);
      } else if (filter === "year") {
        // Lọc theo năm
        timePeriod = new Date(booking.bookingDate).getFullYear().toString();
      }

      if (!salesData[timePeriod]) {
        salesData[timePeriod] = { name: timePeriod, sales: 0 };
      }
      salesData[timePeriod].sales += price; // Cộng dồn doanh số cho phạm vi thời gian
    });

    // Chuyển đổi salesData thành mảng để hiển thị
    const salesArray = Object.values(salesData);
    setDailySalesData(salesArray);
    setLoading(false); // Sau khi xử lý dữ liệu xong, tắt loading
  }, [bookings, filter]); // Thêm filter vào dependency để cập nhật khi thay đổi

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >


{/* Dropdown chọn phạm vi thời gian */}
<div className="mb-4 flex justify-between items-center">
  <div className="flex-1">
    <h2 className='text-xl font-semibold text-gray-100 mb-4'>Xu hướng doanh số</h2>
  </div>
  <select
    className="bg-gray-700 text-gray-100 px-3 py-2 rounded"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="day">Ngày</option>
    <option value="month">Tháng</option>
    <option value="year">Năm</option>
  </select>
</div>

      <div style={{ width: "100%", height: 300 }}>
        {loading ? (
          <motion.div
            className="text-gray-100 flex justify-center items-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            {/* Loading Indicator */}
          </motion.div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 15 }} />
              <Tooltip
                content={({ payload, active }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-2 rounded">
                        <p className="text-white">{`Doanh Thu: ${payload[0].value.toLocaleString()} VND`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default DailySalesTrend;
