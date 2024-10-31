import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = ({ bookings }) => {
  // Group bookings by category and calculate total sales
  const salesByCategory = bookings.reduce((acc, booking) => {
    const type = booking.room.type; // Assuming 'type' is the field you need
    const price = booking.room.price;

    if (booking.paymentStatus !== 'Pending') {
      if (!acc[type]) {
        acc[type] = { name: type, value: 0 };
      }
      acc[type].value += price; // Sum up prices for each type
    }
    return acc;
  }, {});

  // Convert to array format for PieChart
  const salesData = Object.values(salesByCategory);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Thống kê phòng</h2>

      <div style={{ width: "100%", height: 300 }}>
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
      </div>
    </motion.div>
  );
};

export default SalesByCategoryChart;
