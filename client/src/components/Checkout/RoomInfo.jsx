import React from 'react';

const RoomInfo = ({ roomDetails }) => {
  if (!roomDetails) return null;

  return (
    <div className="room-info bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Loại phòng: {roomDetails.type}</h2>
      <img src={roomDetails.imageroom[0]} alt={roomDetails.type} className="mb-4 rounded-lg" />
      <p>{roomDetails.description}</p>
    </div>
  );
};

export default RoomInfo;
