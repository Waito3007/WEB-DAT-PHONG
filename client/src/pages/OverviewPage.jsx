import { BarChart2, Hotel, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/dashboard/common/Header";
import StatCard from "../components/dashboard/common/StatCard";
import SalesOverviewChart from "../components/dashboard/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/dashboard/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/dashboard/overview/SalesChannelChart";

const OverviewPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Tổng Quan' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Tổng đơn đặt phòng' icon={Zap} value='22' color='#6366F1' />
					<StatCard name='Đơn đang chờ' icon={Users} value='9' color='#8B5CF6' />
					<StatCard name='Số khách sạn' icon={Hotel} value='8' color='#EC4899' />
					<StatCard name='Tăng trưởng' icon={BarChart2} value='12.5%' color='#10B981' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
