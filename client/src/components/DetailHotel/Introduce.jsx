import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Introduce.css'; // Đảm bảo đã nhập tệp CSS của bạn

const Introduce = () => {
  const { hotelId } = useParams(); // Nhận hotelId từ URL
  const [hotelDescription, setHotelDescription] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Mở mặc định

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`/api/detail/${hotelId}`); // Sửa đổi URL cho phù hợp
        setHotelDescription(response.data.hotel.description); // Lấy mô tả khách sạn từ dữ liệu
      } catch (error) {
        console.error('Error fetching hotel data:', error);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen); // Chuyển trạng thái khi nhấn vào tiêu đề
  };

  const accordionData = [
    {
      question: "Giới thiệu",
      answer: (
        <p className="mb-2 text-black dark:text-gray-800">
          {hotelDescription || 'Đang tải mô tả...'}
        </p>
      ),
    },
  ];

  return (
    <div className="accordion-container">
      {accordionData.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            onClick={toggleAccordion}
            className={`accordion-button ${isOpen ? 'active' : ''}`}
          >
            <span>{item.question}</span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="accordion-content">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Introduce;
