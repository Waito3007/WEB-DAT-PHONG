import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import { HomeIcon, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../components/dashboard/overview/CategoryDistributionChart";
import SalesTrendChart from "../../components/dashboard/products/SalesTrendChart";
import HotelTable from "../../components/dashboard/products/HotelTable";
import MyHotelTable from "../../components/dashboard/products/MyHotelTable";

const HotelManagerPage = () => {
  const [role, setRole] = useState("");
  const [hotelCount, setHotelCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/api/profile/me", { withCredentials: true });
        setRole(userResponse.data.role);
  
        // Tải danh sách khách sạn theo vai trò
        const hotelsResponse = await axios.get(
          userResponse.data.role === "Admin" ? "/api/hotel" : "/api/hotel/myhotels",
          { withCredentials: true }
        );
  
        setHotelCount(hotelsResponse.data.length);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Khách Sạn" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard 
            name={role === "Admin" ? "Tổng số khách sạn" : "Khách sạn của bạn"} 
            icon={HomeIcon} 
            value={hotelCount} 
            color="#6366F1" 
          />
          <StatCard name="Top Selling" icon={TrendingUp} value={89} color="#10B981" />
          <StatCard name="Low Stock" icon={AlertTriangle} value={23} color="#F59E0B" />
          <StatCard name="Total Revenue" icon={DollarSign} value={"$543,210"} color="#EF4444" />
        </motion.div>

        {role === "Admin" ? <HotelTable /> : role === "HotelManager" ? <MyHotelTable /> : <div>Bạn không có quyền truy cập</div>}

        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default HotelManagerPage;
