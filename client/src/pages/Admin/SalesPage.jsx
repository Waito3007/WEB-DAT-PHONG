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
	const [user, setUser] = useState(null);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [totalToday, setTotalToday] = useState(0);
	const [totalThisMonth, setTotalThisMonth] = useState(0);
	const [totalLastMonth, setTotalLastMonth] = useState(0);
	const [growthRate, setGrowthRate] = useState("0%");

	const fetchUser = async () => {
		try {
			const response = await fetch('/api/profile/me', {
				method: 'GET',
				credentials: 'include'
			});
			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
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
				response = await axios.get('/api/booking/booking/admin');
			} else if (user.role === 'HotelManager') {
				response = await axios.get('/api/booking/booking/manager');
			} else {
				console.error('Vai trò người dùng không được công nhận');
				return;
			}
			setBookings(response.data);

			// Tính tổng doanh thu
			const revenue = response.data.reduce((acc, booking) => {
				if (booking.paymentStatus !== 'Pending') {
					return acc + booking.priceBooking;  // Sử dụng priceBooking
				}
				return acc;
			}, 0);
			setTotalRevenue(revenue);

			// Tính tổng doanh thu hôm nay
			const today = new Date().toISOString().split('T')[0];
			const todayRevenue = response.data.reduce((acc, booking) => {
				const bookingDate = new Date(booking.bookingDate).toISOString().split('T')[0];
				if (bookingDate === today && booking.paymentStatus !== 'Pending') {
					return acc + booking.priceBooking;  // Sử dụng priceBooking 
				}
				return acc;
			}, 0);
			setTotalToday(todayRevenue);

			// Tính tổng doanh thu tháng này
			const currentMonth = new Date().getMonth();
			const thisMonthRevenue = response.data.reduce((acc, booking) => {
				const bookingDate = new Date(booking.bookingDate);
				if (bookingDate.getMonth() === currentMonth && booking.paymentStatus !== 'Pending') {
					return acc + booking.priceBooking;  // Sử dụng priceBooking
				}
				return acc;
			}, 0);
			setTotalThisMonth(thisMonthRevenue);

			// Tính tổng doanh thu tháng trước
			const lastMonthRevenue = response.data.reduce((acc, booking) => {
				const bookingDate = new Date(booking.bookingDate);
				if (bookingDate.getMonth() === currentMonth - 1 && booking.paymentStatus !== 'Pending') {
					return acc + booking.priceBooking;  // Sử dụng priceBooking 
				}
				return acc;
			}, 0);
			setTotalLastMonth(lastMonthRevenue);

			// Tính tỷ lệ tăng trưởng doanh số
			if (lastMonthRevenue > 0) {
				const growth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
				setGrowthRate(growth.toFixed(2) + "%");
			} else {
				setGrowthRate(thisMonthRevenue > 0 ? "100%" : "0%");
			}

		} catch (error) {
			console.error('Lỗi khi lấy bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	useEffect(() => {
		if (user) {
			fetchBookings();
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
					<StatCard name='Tổng Doanh Thu' icon={DollarSign} value={totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} color='#6366F1' />
					<StatCard name='Doanh Thu Hôm Nay' icon={ShoppingCart} value={totalToday.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} color='#10B981' />
					<StatCard name='Doanh Thu Tháng Này' icon={TrendingUp} value={totalThisMonth.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} color='#F59E0B' />
					<StatCard name='Tăng trưởng doanh số' icon={CreditCard} value={growthRate} color='#EF4444' />
				</motion.div>

				<SalesOverviewChart bookings={bookings} />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesByCategoryChart bookings={bookings} />
					<DailySalesTrend bookings={bookings} />
				</div>
			</main>
		</div>
	);
};

export default SalesPage;
