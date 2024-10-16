import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Header from "../components/dashboard/common/Header";
import StatCard from "../components/dashboard/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/dashboard/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/dashboard/products/SalesTrendChart";
import ProductsTable from "../components/dashboard/products/HotelTable";
import MyProductsTable from "../components/dashboard/products/MyHotelTable";

const HotelManagerPage = () => {
  const [role, setRole] = useState(""); // Biến để lưu role người dùng
  const [isLoading, setIsLoading] = useState(true); // Biến kiểm soát trạng thái loading

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/profile/me", {
          withCredentials: true, // Gửi cookie để xác thực
        });
        const userRole = response.data.role;
        setRole(userRole);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi chờ dữ liệu
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Products" icon={Package} value={1234} color="#6366F1" />
          <StatCard name="Top Selling" icon={TrendingUp} value={89} color="#10B981" />
          <StatCard name="Low Stock" icon={AlertTriangle} value={23} color="#F59E0B" />
          <StatCard name="Total Revenue" icon={DollarSign} value={"$543,210"} color="#EF4444" />
        </motion.div>

        {/* Hiển thị bảng sản phẩm hoặc khách sạn */}
        {role === "Admin" ? <ProductsTable /> : role === "HotelManager" ? <MyProductsTable /> : <div>Bạn không có quyền truy cập</div>}

        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default HotelManagerPage;
