import Header from "../../components/dashboard/common/Header";

import OverviewCards from "../../components/dashboard/analytics/OverviewCards";
import RevenueChart from "../../components/dashboard/analytics/RevenueChart";
import ChannelPerformance from "../../components/dashboard/analytics/ChannelPerformance";
import ProductPerformance from "../../components/dashboard/analytics/ProductPerformance";
import UserRetention from "../../components/dashboard/analytics/UserRetention";
import CustomerSegmentation from "../../components/dashboard/analytics/CustomerSegmentation";
import AIPoweredInsights from "../../components/dashboard/analytics/AIPoweredInsights";

const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance />
					<ProductPerformance />
					<UserRetention />
					<CustomerSegmentation />
				</div>

				<AIPoweredInsights />
			</main>
		</div>
	);
};
export default AnalyticsPage;
