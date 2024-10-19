import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { Modal, Input, Button, message, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const HotelTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [password, setPassword] = useState("");
  const [removedImages, setRemovedImages] = useState([]);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/profile/me", {
          withCredentials: true,
        });
        if (response.data && response.data.role) {
          setIsAdmin(response.data.role === "Admin");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchHotel = useCallback(async () => {
    try {
      const response = await axios.get("/api/hotel");
      setHotels(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách sạn:", error);
    }
  }, []);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  const showModal = (hotel) => {
    setCurrentHotel(hotel);
    setFileList(hotel.imagehotel.map((url) => ({ uid: url, url })));
    form.setFieldsValue({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    });
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("location", values.location);
      formData.append("description", values.description);
      fileList.forEach((file) => {
        formData.append("imagehotel", file);
      });
      formData.append("removedImages", JSON.stringify(removedImages));

      await axios.put(`/api/hotel/${currentHotel._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      message.success("Khách sạn đã được cập nhật thành công");
      setIsModalVisible(false);
      fetchHotel();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật khách sạn");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map((file) => file.originFileObj || file));
  };

  const showDeleteModal = (hotel) => {
    setCurrentHotel(hotel);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/hotel/${currentHotel._id}`, {
        withCredentials: true,
        data: { password },
      });
      message.success("Xóa khách sạn thành công");
      setHotels(hotels.filter((hotel) => hotel._id !== currentHotel._id));
    } catch (error) {
      console.error("Lỗi khi xóa khách sạn:", error.response?.data);
      message.error(
        error.response?.data.message ||
          "Không thể xóa khách sạn vì lí do xác thực"
      );
    } finally {
      setIsDeleteModalVisible(false);
      setPassword("");
    }
  };

  const handleRemoveImage = async (file) => {
    if (file.uid) {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      setRemovedImages((prev) => [...prev, file.url]);

      try {
        await axios.put(
          `/api/hotel/${currentHotel._id}/remove-image`,
          { imageUrl: file.url },
          { withCredentials: true }
        );
      } catch (error) {
        message.error("Đã xảy ra lỗi khi xóa hình ảnh");
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm) ||
      hotel.location.toLowerCase().includes(searchTerm)
  );

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredHotels.length / hotelsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Danh Sách Khách Sạn
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm khách sạn..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vị trí
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quản lý
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentHotels.map((hotel) => (
              <tr key={hotel._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {hotel.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {hotel.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {hotel.manager.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => showModal(hotel)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => showDeleteModal(hotel)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="inline-block mx-1">
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        title="Xóa Khách Sạn"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa khách sạn này không?</p>
        <Input.Password
          placeholder="Nhập mật khẩu để xác nhận"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </motion.div>
  );
};

export default HotelTable;
