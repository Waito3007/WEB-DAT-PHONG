import React from "react";
const BookingCard = ({
  dateFrom,
  dateTo,
  checkInTime,
  checkOutTime,
  roomStatus,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center">
            <img src="logo512.png" alt="Logo" className="h-6" />
          </div>
          <div className="ml-4 flex flex-col mr-8">
            <div className="text-gray-500 text-lg">
              <span className="">Ngày đến:</span>
            </div>
            <div className="font-bold text-black">{dateFrom}</div>
          </div>
          <div className="font-bold text-black text-2xl mr-8 border-b-2 border-black w-6"></div>
          <div className="ml-4 flex flex-col mr-20">
            <div className="text-gray-500 text-lg">
              <span className="">Ngày đi:</span>
            </div>
            <div className="font-bold text-black">{dateTo}</div>
          </div>
          <div className="flex justify-between items-center mt-4 mr-20">
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm ">Thời gian nhận:</div>
              <div className="font-semibold text-black">{checkInTime}</div>
              <div className="text-gray-500 text-sm">Thời gian đi:</div>
              <div className="font-semibold text-black">{checkOutTime}</div>
            </div>
            <div className="flex flex-col items-center ml-20">
              <div className="text-gray-500 text-sm">Phòng:</div>
              <div className="font-semibold text-black">{roomStatus}</div>
            </div>
          </div>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">
          Đặt phòng
        </button>
      </div>
    </div>
  );
};
const BookingList = () => {
  const bookings = [
    {
      dateFrom: "12/10/2024",
      dateTo: "14/10/2024",
      checkInTime: "12:00pm",
      checkOutTime: "11:30am",
      roomStatus: "On arrival",
    },
    {
      dateFrom: "12/10/2024",
      dateTo: "14/10/2024",
      checkInTime: "12:00pm",
      checkOutTime: "11:30am",
      roomStatus: "On arrival",
    },
    {
      dateFrom: "12/10/2024",
      dateTo: "14/10/2024",
      checkInTime: "12:00pm",
      checkOutTime: "11:30am",
      roomStatus: "On arrival",
    },
  ];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Đặt phòng</h1>
      {bookings.map((booking, index) => (
        <BookingCard key={index} {...booking} />
      ))}
    </div>
  );
};
export default BookingList;
