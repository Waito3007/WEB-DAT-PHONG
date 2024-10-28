import Header from "../../components/dashboard/common/Header";
import ConnectedAccounts from "../../components/dashboard/settings/ConnectedAccounts";
import DangerZone from "../../components/dashboard/settings/DangerZone";
import Notifications from "../../components/dashboard/settings/Notifications";
import Profile from "../../components/dashboard/settings/Profile";
import Security from "../../components/dashboard/settings/Security";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Notifications />
				<Security />
				<ConnectedAccounts />
				<DangerZone />
			</main>
		</div>
	);
};
export default SettingsPage;
