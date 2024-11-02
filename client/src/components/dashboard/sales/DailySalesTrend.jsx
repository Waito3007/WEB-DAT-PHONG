import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

// Hàm để lấy thứ trong tuần từ ngày
const getDayOfWeek = (date) => {
  const dayNames = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const dayIndex = new Date(date).getDay();
  return dayNames[dayIndex];
};

const DailySalesTrend = ({ bookings }) => {
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const salesData = {};

    // Xử lý từng booking
    bookings.forEach((booking) => {
      const day = getDayOfWeek(booking.bookingDate); // Giả sử bookingDate có định dạng ISO
      const price = booking.room.price; // Giả sử room.price chứa giá trị doanh số

      if (!salesData[day]) {
        salesData[day] = { name: day, sales: 0 };
      }
      salesData[day].sales += price; // Cộng dồn doanh số cho ngày
    });

    // Chuyển đổi salesData thành mảng để hiển thị
    const salesArray = Object.values(salesData);
    setDailySalesData(salesArray);
  }, [bookings]);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Xu hướng doanh số hàng ngày</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={dailySalesData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='name' stroke='#9CA3AF' />
            <YAxis 
              stroke='#9CA3AF' 
              tick={{ fontSize: 15 }} // Thay đổi kích thước chữ ở đây
            />
            <Tooltip
              content={({ payload, active }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className='bg-gray-800 p-2 rounded'>
                      <p className='text-white'>{`Doanh Thu: ${payload[0].value.toLocaleString()} VND`}</p>
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
            <Bar dataKey='sales' fill='#10B981' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailySalesTrend;
