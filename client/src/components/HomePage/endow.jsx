import React from "react";
import Dambao from "../../assets/checked.png";
import BaoMat from "../../assets/insurance.png";
import Hotro from "../../assets/customer-service.png";

const Endow = () => {
  const destinations = [
    {
      image: Dambao,
      title: "Đảm bảo giá tốt nhất",
      text: "Cam kết cung cấp giá phòng cạnh tranh và ưu đãi độc quyền cho khách hàng khi đặt qua trang web.",
    },
    {
      image: BaoMat,
      title: "Bảo mật thông tin",
      text: "Bảo vệ thông tin cá nhân và tài khoản khách hàng với tiêu chuẩn bảo mật quốc tế và mã hóa dữ liệu.",
    },
    {
      image: Hotro,
      title: "Dịch vụ hỗ trợ 24/7",
      text: "Cung cấp hỗ trợ khách hàng qua hotline, email, và chat trực tuyến suốt ngày đêm.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center text-gray-900 mb-8">
          Dịch vụ của chúng tôi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workInfoData.map((data) => (
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
              key={data.title}
            >
              <div className="info-boxes-img-container p-6">
                <img
                  className="w-full h-40 object-contain rounded-lg"
                  src={data.image}
                  alt={data.title}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {data.title}
                </h3>
                <p className="text-gray-700">{data.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Endow;
