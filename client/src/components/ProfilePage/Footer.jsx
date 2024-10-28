import React from 'react';

const Footer = () => (
  <footer className="profile-footer">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div>
            <h3 className="font-bold text-lg">Stay Night</h3>
            <div className="flex space-x-2 mt-2">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white">
                <img src="facebook.svg" alt="Facebook" className="w-6 h-6" />
                
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white">
                <img src="x.png" alt="Twitter" className="w-6 h-6 mr-1" />
                
            </a>
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white">
                <img src="google.png" alt="Google" className="w-6 h-6 mr-1" />
                
            </a>      
       </div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Điểm đến</h3>
            <p>Hà Nội</p>
            <p>HCM</p>
            <p>Cần Thơ</p>
            <p>SaPa</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Hoạt động</h3>
            <p>Dinh Độc lập</p>
            <p>Ẩm Thực Đường Phố</p>
            <p>Chợ nổi cái răng</p>
            <p>Nhà thờ đức bà</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Blog du lịch</h3>
            <p>Hướng dẫn du lịch Huy</p>
            <p>Hướng dẫn du lịch seng</p>
            <p>Hướng dẫn du lịch nghĩa</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Về chúng tôi</h3>
            <p>Du lịch bền vững</p>
            <p>Truyền thông</p>
          </div>
        </div>
      </footer>
);

export default Footer;
