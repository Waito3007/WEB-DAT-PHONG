import React from "react";
import { motion } from "framer-motion"; // Import framer-motion for animation
import { Facebook, Twitter, Instagram } from "lucide-react"; // Import biểu tượng từ lucide-react


const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-800 text-white py-10"
      initial={{ opacity: 0, y: 20 }} // Hiệu ứng ban đầu
      animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
      transition={{ duration: 0.5 }} // Thời gian chuyển động
    >
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-6">Stay Night</h3>
        
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://www.facebook.com/consauchetduoi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-center">
          <div>
            <h4 className="font-semibold mb-2">Điểm đến</h4>
            <p>Hà Nội<br />HCM<br />Cần Thơ<br />Sapa</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Hoạt động</h4>
            <p>Dinh Độc Lập<br />Ẩm thực đường phố<br />Chợ nổi Cái Răng<br />Nhà thờ Đức Bà</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Blog du lịch</h4>
            <p>Hướng dẫn du lịch Huy<br />Hướng dẫn du lịch Seng<br />Hướng dẫn du lịch Nghĩa</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Về chúng tôi</h4>
            <p>Du lịch bền vững<br />Truyền thông</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Liên hệ với chúng tôi</h4>
            <p>Du lịch bền vững<br />Truyền thông</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Stay Night. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
