import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = ({ bookings }) => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('month'); // Filter default là 'month'
  const [salesData, setSalesData] = useState([]);

  // Lọc dữ liệu bookings theo phạm vi thời gian
  const filterBookings = (filter) => {
    const now = new Date();
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      if (filter === 'day') {
        return bookingDate.toDateString() === now.toDateString();
      } else if (filter === 'month') {
        return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
      } else if (filter === 'year') {
        return bookingDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
    return filteredBookings;
  };

  // Tính toán doanh thu theo loại phòng
  const calculateSalesByCategory = (filteredBookings) => {
    const salesByCategory = filteredBookings.reduce((acc, booking) => {
      const type = booking.room.type; 
      const price = booking.priceBooking;

      if (booking.paymentStatus !== 'Pending') {
        if (!acc[type]) {
          acc[type] = { name: type, value: 0 };
        }
        acc[type].value += price;
      }
      return acc;
    }, {});

    return Object.values(salesByCategory);
  };

  useEffect(() => {
    const filteredBookings = filterBookings(filter);
    const salesData = calculateSalesByCategory(filteredBookings);
    setSalesData(salesData);
    setLoading(false); // Hoàn thành việc tải dữ liệu
  }, [bookings, filter]);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
    <div className="mb-4 flex justify-between items-center">
      <div className="text-gray-100">
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Thống kê phòng</h2>
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
            <PieChart>
              <Pie
                data={salesData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ payload, active }) => {
                  if (active && payload && payload.length) {
                    const { name, value } = payload[0];
                    return (
                      <div className='bg-gray-800 p-2 rounded'>
                        <p className='text-white'>{`Doanh Thu: ${value.toLocaleString()} VND`}</p>
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default SalesByCategoryChart;
