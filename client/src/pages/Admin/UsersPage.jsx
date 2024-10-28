import { useEffect, useState } from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import UsersTable from "../../components/dashboard/users/UsersTable";
import UserGrowthChart from "../../components/dashboard/users/UserGrowthChart";
import UserActivityHeatmap from "../../components/dashboard/users/UserActivityHeatmap";
import UserDemographicsChart from "../../components/dashboard/users/UserDemographicsChart";

const UsersPage = () => {
	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
		activeUsers: 0,
		churnRate: "2.4%",
	});

	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				const response = await fetch('/api/usertable');
				if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu người dùng');
				const users = await response.json();

				// Tính toán các giá trị thống kê
				const totalUsers = users.length;
				const newUsersToday = users.filter(user => {
					const registrationDate = new Date(user.registrationDate);
					const today = new Date();
					return (
						registrationDate.getDate() === today.getDate() &&
						registrationDate.getMonth() === today.getMonth() &&
						registrationDate.getFullYear() === today.getFullYear()
					);
				}).length;

				const activeUsers = users.filter(user => user.isVerified).length;

				setUserStats({
					totalUsers,
					newUsersToday,
					activeUsers,
					churnRate: "2.4%", // Tạm thời giữ nguyên
				});
			} catch (error) {
				console.error('Lỗi:', error);
			}
		};

		fetchUserStats();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' />
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div>
			</main>
		</div>
	);
};

export default UsersPage;
