import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, message, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const MyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('/api/hotel/myhotels', { withCredentials: true });
        setHotels(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách sạn:', error.response?.data);
        message.error('Đã xảy ra lỗi khi lấy danh sách khách sạn');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" tip="Đang tải danh sách khách sạn..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Title level={2}>Danh Sách Khách Sạn Của Bạn</Title>
      <List
        itemLayout="vertical"
        dataSource={hotels}
        renderItem={(hotel) => (
          <List.Item key={hotel._id} className="border-b py-4">
            <List.Item.Meta
              title={
                <Link to={`/hotels/${hotel._id}`} className="text-xl font-semibold">
                  {hotel.name}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyHotels;
