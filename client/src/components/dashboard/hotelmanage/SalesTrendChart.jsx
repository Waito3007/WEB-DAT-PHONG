import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const bookingRevenueData = [
	{ month: "Tháng 1", revenue: 12000000 },
	{ month: "Tháng 2", revenue: 9000000 },
	{ month: "Tháng 3", revenue: 15000000 },
	{ month: "Tháng 4", revenue: 13500000 },
	{ month: "Tháng 5", revenue: 18000000 },
	{ month: "Tháng 6", revenue: 16500000 },
];

const BookingRevenueChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Doanh thu đặt phòng</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={bookingRevenueData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis
							stroke='#9CA3AF'
							tickFormatter={(value) => `${value / 1000000}M`}
						/>
						<Tooltip
							formatter={(value) => `${value.toLocaleString()} VNĐ`}
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='revenue' stroke='#8B5CF6' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default BookingRevenueChart;
