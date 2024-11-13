import React from 'react';
import { Table } from 'antd';
import { Eye, EyeOff, Calendar, DollarSign } from 'lucide-react';

const BookingHistory = ({
    bookingHistory,
    currentPage,
    itemsPerPage,
    onPageChange,
    formatDate,
    isOrderIdVisible,
    toggleOrderIdVisibility,
}) => {

    // Cấu hình các cột của bảng
    const columns = [
        {
            title: (
                <div className="flex items-center justify-center space-x-2">
                    <span className="font-semibold text-gray-700">Mã Đặt Phòng</span>
                    <button onClick={toggleOrderIdVisibility} className="hover:opacity-75">
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
            render: (name) => name,
        },
        {
            title: 'Loại Phòng',
            dataIndex: ['room', 'type'],
            key: 'roomType',
            onFilter: (value, record) => record.room.type.includes(value),
            filters: Array.from(new Set(bookingHistory.map((booking) => booking.room.type)))
                .sort()
                .map((type) => ({ text: type, value: type })),
            render: (type) => type,
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
            render: (status) => (
                <span
                    style={{
                        color: status === 'Complete' ? '#38a169' : '#e53e3e',
                        fontWeight: 'bold',
                    }}
                >
                    {status === 'Complete' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
            ),
        },
    ];

    return (
        <div className="booking-history relative mx-auto px-4">
            <h2 className=" text-2xl font-ROBOTO text-black mb-4">
                <span>LỊCH SỬ ĐẶT PHÒNG</span>
            </h2>
            <div className="overflow-x-auto">
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
                    rowClassName="ant-table-row-hover"
                    className="ant-table-bordered"
                    scroll={{ x: 'max-content' }} // Enable horizontal scroll on smaller screens
                />
            </div>
        </div>
    );
};

export default BookingHistory;
