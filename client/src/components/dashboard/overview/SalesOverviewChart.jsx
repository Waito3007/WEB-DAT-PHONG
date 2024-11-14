import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Dữ liệu về số lượng phòng đã đặt mỗi tháng
const bookingsData = [
  { name: "Jan", bookings: 300 },
  { name: "Feb", bookings: 350 },
  { name: "Mar", bookings: 450 },
  { name: "Apr", bookings: 500 },
  { name: "May", bookings: 600 },
  { name: "Jun", bookings: 700 },
  { name: "Jul", bookings: 750 },
  { name: "Aug", bookings: 650 },
  { name: "Sep", bookings: 800 },
  { name: "Oct", bookings: 900 },
  { name: "Nov", bookings: 1000 },
  { name: "Dec", bookings: 1100 },
];

const BookingsOverviewChart = () => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Tình Trạng Đặt Phòng Theo Tháng
      </h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={bookingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey={"name"} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#10B981" // Màu xanh lá cây, màu sắc dễ chịu và liên quan đến sự tăng trưởng
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BookingsOverviewChart;
