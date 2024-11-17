import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const bookingStatusData = [
	{ name: "Đã thanh toán", value: 40 },
	{ name: "Chưa thanh toán", value: 30 },
	{ name: "Đã nhận phòng", value: 20 },
	{ name: "Đã hoàn thành", value: 50 },
];
const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

const BookingStatusChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Tỷ lệ trạng thái đặt phòng</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={bookingStatusData}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
						>
							{bookingStatusData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							formatter={(value) => `${value} lượt`}
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend
							formatter={(value) => (
								<span style={{ color: "#E5E7EB", fontSize: "14px" }}>{value}</span>
							)}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default BookingStatusChart;
