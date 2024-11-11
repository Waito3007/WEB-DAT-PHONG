// BookingHistory.js
import React from 'react';
import { Table } from 'antd';
import { Eye, EyeOff } from 'lucide-react';

const BookingHistory = ({
    bookingHistory,
    currentPage,
    itemsPerPage,
    onPageChange,
    formatDate,
    isOrderIdVisible,
    toggleOrderIdVisibility,
}) => {

    
    // Cấu hình các cột của bảng, bao gồm bộ lọc
    const columns = [
        {
            title: (
                <div className="flex items-center space-x-2">
                    <span>Mã Đặt Phòng</span>
                    <button onClick={toggleOrderIdVisibility} style={{ border: 'none', background: 'transparent' }}>
                        {isOrderIdVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            ),
            dataIndex: 'orderId',
            key: 'orderId',
            filterMultiple: false,
            onFilter: (value, record) => record.orderId.includes(value),
            filters: bookingHistory.map((booking) => ({ text: booking.orderId, value: booking.orderId })),
            render: (text) => (isOrderIdVisible ? text : '*********'),
        },
        {
            title: 'Tên Khách Sạn',
            dataIndex: ['room', 'hotel', 'name'],
            key: 'hotelName',
            filterMultiple: true,
            onFilter: (value, record) => record.room.hotel.name.includes(value),
            filters: Array.from(new Set(bookingHistory.map((booking) => booking.room.hotel.name)))
                .sort()
                .map((name) => ({ text: name, value: name })),
        },
        {
            title: 'Loại Phòng',
            dataIndex: ['room', 'type'],
            key: 'roomType',
            onFilter: (value, record) => record.room.type.includes(value),
            filters: Array.from(new Set(bookingHistory.map((booking) => booking.room.type)))
                .sort()
                .map((type) => ({ text: type, value: type })),
        },
        {
            title: 'Ngày Check In',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (date) => formatDate(date),
            sorter: (a, b) => new Date(a.checkInDate) - new Date(b.checkInDate),
        },
        {
            title: 'Ngày Check Out',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (date) => formatDate(date),
            sorter: (a, b) => new Date(a.checkOutDate) - new Date(b.checkOutDate),
        },
        {
            title: 'Tình Trạng Thanh Toán',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            onFilter: (value, record) => record.paymentStatus === value,
            filters: [
                { text: 'Đã thanh toán', value: 'Complete' },
                { text: 'Chưa thanh toán', value: 'Pending' },
            ],
        },
    ].filter(Boolean);

    
    return (
         <div className="relative mx-auto px-4">
                <h2 className="text-2xl font-ROBOTO text-black mb-4">LỊCH SỬ ĐẶT PHÒNG</h2>
                <Table
                    columns={columns}
                    dataSource={bookingHistory}
                    pagination={{
                        current: currentPage,
                        pageSize: itemsPerPage,
                        total: bookingHistory.length,
                        onChange: onPageChange,
                    }}
                    rowKey="id"
                />
            </div>
    );
};

export default BookingHistory;
