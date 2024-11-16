import { BarChart2, DollarSign, Menu, Settings, Hotel, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";



const SIDEBAR_ITEMS = [
	{
		name: "Tổng quan",
		icon: BarChart2,
		color: "#6366f1",
		href: "/overview",
		roles: ["Admin", "HotelManager"], // Cho phép cả Admin và HotelManager
	},
	{
		name: "Khách sạn",
		icon: Hotel,
		color: "#8B5CF6",
		href: "/hotelmanager",
		roles: ["Admin", "HotelManager"],
	},
	{
		name: "Người dùng",
		icon: Users,
		color: "#EC4899",
		href: "/users",
		roles: ["Admin"], // Chỉ cho phép Admin
	},
	{
		name: "Doanh Thu",
		icon: DollarSign,
		color: "#10B981",
		href: "/sales",
		roles: ["Admin", "HotelManager"], 
	},
	{
		name: "Đặt phòng",
		icon: ShoppingCart,
		color: "#F59E0B",
		href: "/orders",
		roles: ["HotelManager"], 
	},
	{
		name: "Analytics",
		icon: TrendingUp,
		color: "#3B82F6",
		href: "/analytics",
		roles: ["", ""], 
	},
	{
		name: "Settings",
		icon: Settings,
		color: "#6EE7B7",
		href: "/settings",
		roles: ["", ""], 
	},
];

const Sidebar = ({ userRole }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();



const handleHome = () => {
	navigate("/");
  };

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.filter(item => item.roles.includes(userRole)).map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
				{/* Logo ở cuối sidebar */}
				<div className="mt-auto p-6 flex justify-center">
					<img src="https://res.cloudinary.com/dackig67m/image/upload/v1730387091/logovip_qp8hz1.png" onClick={handleHome} alt="Logo" className="h-16 w-fit" />
				</div>
			
			</div>
		</motion.div>
	);
};
export default Sidebar;
