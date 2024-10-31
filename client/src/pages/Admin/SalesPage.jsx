import { motion } from "framer-motion";
import { useEffect, useState } from "react"; 
import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../../components/dashboard/sales/SalesOverviewChart";
import SalesByCategoryChart from "../../components/dashboard/sales/SalesByCategoryChart";
import DailySalesTrend from "../../components/dashboard/sales/DailySalesTrend";
import axios from 'axios'; 

const SalesPage = () => {
	const [user, setUser] = useState(null); // State để lưu trữ thông tin người dùng
	const [bookings, setBookings] = useState([]); // State để lưu trữ dữ liệu bookings
	const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
	const [totalRevenue, setTotalRevenue] = useState("$0"); // State mới cho tổng doanh thu
	const [totalToday, setTotalToday] = useState("$0"); // State cho tổng doanh thu hôm nay
	const [totalThisMonth, setTotalThisMonth] = useState("$0"); // State cho tổng doanh thu tháng này
	const [totalLastMonth, setTotalLastMonth] = useState(0); // State cho tổng doanh thu tháng trước
	const [growthRate, setGrowthRate] = useState("0%"); // State cho tỷ lệ tăng trưởng

	const fetchUser = async () => {
		try {
			const response = await fetch('/api/profile/me', {
				method: 'GET',
				credentials: 'include'
			});
			if (response.ok) {
				const userData = await response.json();
				setUser(userData); // Lưu thông tin người dùng vào state
			} else {
				console.error("Lỗi lấy thông tin người dùng:", response.status);
			}
		} catch (error) {
			console.error("Lỗi mạng:", error);
		}
	};

	const fetchBookings = async () => {
		try {
			let response;
			if (user.role === 'Admin') {
				response = await axios.get('/api/booking/booking/admin'); // Gọi API cho admin
			} else if (user.role === 'HotelManager') {
				response = await axios.get('/api/booking/booking/manager'); // Gọi API cho manager
			} else {
				console.error('Vai trò người dùng không được công nhận');
				return;
			}
			setBookings(response.data); // Lưu dữ liệu vào state

			// Tính tổng doanh thu
			const revenue = response.data.reduce((acc, booking) => {
				if (booking.paymentStatus !== 'Pending') { // Kiểm tra trạng thái thanh toán
					return acc + booking.room.price; // Cộng giá phòng vào tổng doanh thu
				}
				return acc; // Trả về giá trị hiện tại nếu thanh toán đang chờ
			}, 0);
			setTotalRevenue(revenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })); // Cập nhật tổng doanh thu

			// Tính tổng doanh thu hôm nay
			const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay dưới định dạng YYYY-MM-DD
			const todayRevenue = response.data.reduce((acc, booking) => {
				const bookingDate = new Date(booking.bookingDate).toISOString().split('T')[0]; // Lấy ngày booking
				if (bookingDate === today && booking.paymentStatus !== 'Pending') { // Kiểm tra ngày và trạng thái thanh toán
					return acc + booking.room.price; // Cộng giá phòng vào tổng doanh thu hôm nay
				}
				return acc; // Trả về giá trị hiện tại nếu không phải hôm nay hoặc thanh toán đang chờ
			}, 0);
			setTotalToday(todayRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })); // Cập nhật tổng doanh thu hôm nay

			// Tính tổng doanh thu tháng này
			const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (0-11)
			const thisMonthRevenue = response.data.reduce((acc, booking) => {
				const bookingDate = new Date(booking.bookingDate); // Lấy đối tượng Date từ bookingDate
				if (bookingDate.getMonth() === currentMonth && booking.paymentStatus !== 'Pending') { // Kiểm tra tháng và trạng thái thanh toán
					return acc + booking.room.price; // Cộng giá phòng vào tổng doanh thu tháng này
				}
				return acc; // Trả về giá trị hiện tại nếu không phải tháng này hoặc thanh toán đang chờ
			}, 0);
			setTotalThisMonth(thisMonthRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })); // Cập nhật tổng doanh thu tháng này

			// Tính tổng doanh thu tháng trước
			const lastMonthRevenue = response.data.reduce((acc, booking) => {
				const bookingDate = new Date(booking.bookingDate); // Lấy đối tượng Date từ bookingDate
				if (bookingDate.getMonth() === currentMonth - 1 && booking.paymentStatus !== 'Pending') { // Kiểm tra tháng trước
					return acc + booking.room.price; // Cộng giá phòng vào tổng doanh thu tháng trước
				}
				return acc; // Trả về giá trị hiện tại nếu không phải tháng trước hoặc thanh toán đang chờ
			}, 0);
			setTotalLastMonth(lastMonthRevenue); // Lưu doanh thu tháng trước vào state

			// Tính tỷ lệ tăng trưởng doanh số
			if (lastMonthRevenue > 0) {
				const growth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100; // Tính tỷ lệ tăng trưởng
				setGrowthRate(growth.toFixed(2) + "%"); // Cập nhật tỷ lệ tăng trưởng
			} else {
				setGrowthRate(thisMonthRevenue > 0 ? "100%" : "0%"); // Nếu tháng trước không có doanh thu
			}

		} catch (error) {
			console.error('Lỗi khi lấy bookings:', error);
		} finally {
			setLoading(false); // Đặt trạng thái loading thành false
		}
	};

	useEffect(() => {
		fetchUser(); // Gọi hàm fetchUser khi component mount
	}, []);

	useEffect(() => {
		if (user) {
			fetchBookings(); // Gọi hàm fetchBookings khi user thay đổi
		}
	}, [user]);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Doanh Thu' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* SALES STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Tổng Doanh Thu' icon={DollarSign} value={totalRevenue} color='#6366F1' />
					<StatCard name='Doanh Thu Hôm Nay' icon={ShoppingCart} value={totalToday} color='#10B981' />
					<StatCard name='Doanh Thu Tháng Này' icon={TrendingUp} value={totalThisMonth} color='#F59E0B' />
					<StatCard name='Tăng trưởng doanh số' icon={CreditCard} value={growthRate} color='#EF4444' />
				</motion.div>

				<SalesOverviewChart bookings={bookings} /> {/* Truyền bookings vào component */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesByCategoryChart bookings={bookings} /> {/* Truyền bookings vào component */}
					<DailySalesTrend bookings={bookings} /> {/* Truyền bookings vào component */}
				</div>
			</main>
		</div>
	);
};

export default SalesPage;
