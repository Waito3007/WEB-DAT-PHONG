import React from 'react';
import EditButton from './EditButton';

const AccountInfo = () => (
  <div className="bg-white shadow p-6 rounded-lg mt-4">
    <h2 className="text-lg font-semibold mb-4">Tài khoản</h2>
    <div className="space-y-4">
      {[
        { label: 'Name', value: 'Nghĩa' },
        { label: 'Email', value: 'ltn666@gmail.com' },
        { label: 'Password', value: '********' },
        { label: 'Phone number', value: '0778705684' },
        { label: 'Address', value: 'Hóc Môn, Hồ Chí Minh' },
        { label: 'Date of birth', value: '01-10-2004' }
      ].map((item, index) => (
        <div key={index} className="flex justify-between items-center border-b pb-2 mb-2"style={{borderColor: "black"}} >
          <div>
            <p className="text-gray-500">{item.label}</p>
            <p className="text-black">{item.value}</p>
          </div>
          <EditButton />
        </div>
      ))}
    </div>
  </div>
);

export default AccountInfo;
