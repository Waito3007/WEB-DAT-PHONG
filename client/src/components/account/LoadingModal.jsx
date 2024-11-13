// LoadingModal.jsx
import React from 'react';
import { Modal, Spin } from 'antd';

const LoadingModal = ({ loading }) => {
    return (
        <Modal
            visible={loading}
            footer={null}
            closable={false}
            bodyStyle={{ textAlign: 'center' }}
            style={{ borderRadius: '10px', padding: '20px' }}
        >
            <Spin size="large" tip="Đang tải..." />
            <h3 style={{ marginTop: '20px' }}>Đang tải...</h3>
        </Modal>
    );
};

export default LoadingModal;
