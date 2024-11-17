/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  notification,
  InputNumber,
  Switch,
  Upload,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select; // Khai báo biến Option để sử dụng trong Select

const AddRoom = ({ hotelId, onClose }) => {
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]); // Đổi thành images cho nhất quán
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleAddRoom = async () => {
    setLoading(true); // Bắt đầu loading
    const formData = new FormData();
    formData.append("type", type);
    formData.append("price", price);
    formData.append("availability", availability);

    // Thêm từng ảnh vào formData với tên trường 'imageroom'
    images.forEach((file) => {
      formData.append("imageroom", file);
    });

    try {
      const response = await axios.post(
        `/api/room/${hotelId}/add-room`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      notification.success({
        message: "Thêm Phòng Thành Công.",
      });
      onClose(); // Đóng modal sau khi thêm thành công
    } catch (error) {
      notification.error({
        message: "Thêm Phòng Thất Bại.",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleFileChange = ({ fileList }) => {
    setImages(fileList.map((file) => file.originFileObj)); // Lưu ảnh dưới dạng file gốc
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-xl font-semibold mb-5">Thêm Phòng</h2>
      <Form layout="vertical" onFinish={handleAddRoom}>
        <Form.Item label="Loại Phòng" required>
          <Select
            value={type}
            onChange={(value) => setType(value)}
            placeholder="Chọn loại phòng"
            required
          >
            <Option value="Phòng thường 1 giường lớn">
              Phòng thường 1 giường lớn
            </Option>
            <Option value="Phòng thường 2 giường nhỏ">
              Phòng thường 2 giường nhỏ
            </Option>
            <Option value="Phòng vip 1 giường lớn">
              Phòng vip 1 giường lớn
            </Option>
            <Option value="Phòng vip 2 giường nhỏ">
              Phòng vip 2 giường nhỏ
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="Giá Phòng" required>
          <InputNumber
            min={0}
            value={price}
            onChange={(value) => setPrice(value)}
            className="w-full"
            placeholder="Nhập giá phòng"
            required
          />
        </Form.Item>
        <Form.Item label="Tình Trạng">
          <Switch
            checked={availability}
            onChange={(checked) => setAvailability(checked)}
            checkedChildren="Có sẵn"
            unCheckedChildren="Hết phòng"
          />
        </Form.Item>
        <Form.Item label="Ảnh Phòng">
          <Upload
            listType="picture"
            beforeUpload={() => false} // Ngăn chặn upload tự động
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {loading ? "Đang thêm phòng..." : "Thêm Phòng"}
        </Button>
      </Form>
    </div>
  );
};

export default AddRoom;
