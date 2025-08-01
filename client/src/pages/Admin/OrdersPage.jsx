import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios"; // Đảm bảo cài đặt axios hoặc dùng fetch

import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
// import DailyOrders from "../../components/dashboard/orders/DailyOrders";
// import OrderDistribution from "../../components/dashboard/orders/OrderDistribution";
import OrdersTable from "../../components/dashboard/orders/OrdersTable";

const API_URL = process.env.REACT_APP_API_URL;

const OrdersPage = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: "0",
    pendingOrders: "0",
    completedOrders: "0",
    totalRevenue: "₫0",
  });

  useEffect(() => {
    // Gọi API để lấy dữ liệu tổng quan
    const fetchOrderStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/booking/booking/total`);
        const { totalBookings, pendingBookings, doneBookings, totalAmount } = response.data;

        // Chuyển totalAmount sang định dạng tiền tệ VND
        const formattedTotalAmount = totalAmount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });

        setOrderStats({
          totalOrders: totalBookings.toString(),
          pendingOrders: pendingBookings.toString(),
          completedOrders: doneBookings.toString(),
          totalRevenue: formattedTotalAmount,
        });
      } catch (error) {
        console.error("Error fetching order stats:", error);
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"Quản Lí Đặt Phòng"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Tổng đơn đặt'
            icon={ShoppingBag}
            value={orderStats.totalOrders}
            color='#6366F1'
          />
          <StatCard
            name='Chưa thanh toán'
            icon={Clock}
            value={orderStats.pendingOrders}
            color='#F59E0B'
          />
          <StatCard
            name='Đã hoàn thành'
            icon={CheckCircle}
            value={orderStats.completedOrders}
            color='#10B981'
          />
          <StatCard
            name='Tổng tiền'
            icon={DollarSign}
            value={orderStats.totalRevenue}
            color='#EF4444'
          />
        </motion.div>
        <OrdersTable />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* <DailyOrders />
          <OrderDistribution /> */}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
