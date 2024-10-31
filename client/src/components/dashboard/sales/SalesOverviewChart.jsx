import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const SalesOverviewChart = ({ bookings }) => {
	const [monthlySalesData, setMonthlySalesData] = useState([]);

	const monthsInVietnamese = [
		'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 
		'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 
		'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
	];

	const calculateMonthlySales = () => {
		const salesByMonth = {};
		const currentDate = new Date();
		const currentMonthIndex = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();

		bookings.forEach((booking) => {
			const bookingDate = new Date(booking.bookingDate);
			const monthIndex = bookingDate.getMonth();
			const year = bookingDate.getFullYear();

			// Kiểm tra xem tháng booking có nằm trong 4 tháng gần đây không
			const monthDifference = (currentYear - year) * 12 + (currentMonthIndex - monthIndex);
			if (monthDifference < 0 || monthDifference >= 4) return; // Chỉ giữ lại booking trong 4 tháng gần đây

			const month = monthsInVietnamese[monthIndex];
			const price = isPaymentCompleted(booking) ? booking.room.price : 0;

			if (!salesByMonth[month]) {
				salesByMonth[month] = 0;
			}
			salesByMonth[month] += price;
		});

		// Tạo mảng doanh thu từ các tháng gần đây
		const salesDataArray = monthsInVietnamese
			.filter((month, index) => index >= currentMonthIndex - 3 && index <= currentMonthIndex) // Lấy 4 tháng gần đây
			.map(month => ({
				month,
				sales: salesByMonth[month] || 0, // Đặt giá trị 0 nếu không có doanh thu cho tháng đó
			}));

		setMonthlySalesData(salesDataArray);
	};

	const isPaymentCompleted = (booking) => booking.paymentStatus !== 'Pending'; // Hàm kiểm tra trạng thái thanh toán

	useEffect(() => {
		if (bookings.length > 0) {
			calculateMonthlySales();
		}
	}, [bookings]);

	// Hàm định dạng số tiền với ký hiệu "VND"
	const formatCurrency = (value) => {
		return `${value.toLocaleString()} VND`;
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }} // Thay đổi độ trễ nếu cần
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Tổng quan về doanh thu</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<AreaChart data={monthlySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis 
							stroke='#9CA3AF' 
							tick={{ fontSize: 15 }} // Thay đổi kích thước chữ ở đây
						/>
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									return (
										<div className='bg-gray-800 p-2 rounded'>
											<p className='text-white'>{`Doanh thu: ${formatCurrency(payload[0].value)}`}</p>
										</div>
									);
								}
								return null;
							}}
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Area 
							type='monotone' 
							dataKey='sales' 
							stroke='#8B5CF6' 
							fill='#8B5CF6' 
							fillOpacity={0.3} 
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesOverviewChart;
