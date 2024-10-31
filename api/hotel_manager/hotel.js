// routes/hotel_manager/hotel.js
const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const User = require('../../models/User');
const auth = require('../../middleware/auth'); 
const upload = require('../../middleware/upload');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt'); // Để kiểm tra mật khẩu nếu cần

// Hàm lấy publicId từ URL của Cloudinary
const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
  return matches ? matches[1] : null;
};

// Route thêm khách sạn
// Thêm khách sạn
router.post('/addhotel', auth, upload.array('imagehotel', 5), async (req, res) => {
  const { name, location, description, rooms, stars } = req.body;

  try {
    const managerId = req.userId; // Lấy userId từ middleware auth

    // Kiểm tra xem có tệp nào không
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'Không có tệp nào được tải lên' });
    }

    // Lấy đường dẫn ảnh sau khi upload
    const imageUrls = req.files.map(file => file.path);
    
    // Tạo khách sạn mới theo mô hình
    const newHotel = new Hotel({
      name,
      location,
      description,
      manager: managerId,
      rooms: rooms ? rooms.split(',') : [],  // Chuyển đổi từ chuỗi thành mảng nếu cần
      imagehotel: imageUrls,
      stars: stars || 3  // Mặc định số sao là 3 nếu không có giá trị
    });

    await newHotel.save();
    res.status(201).json({ msg: 'Khách sạn đã được thêm thành công', hotel: newHotel });
  } catch (err) {
    console.error(err); // In ra toàn bộ lỗi
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
});




// Route lấy danh sách khách sạn của người dùng hiện tại
router.get('/myhotels', auth, async (req, res) => {
  try {
    const managerId = req.userId; // Lấy userId từ middleware

    const hotels = await Hotel.find({ manager: managerId })
      .populate('manager', 'name email'); 

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});
router.get('/api/hotel', async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('manager');

    const hotelWithLowestPrice = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id });
        const lowestRoomPrice = rooms.length > 0 ? Math.min(...rooms.map(room => room.price)) : null;
        
        return {
          ...hotel.toObject(),
          lowestRoomPrice,
        };
      })
    );

    res.json(hotelWithLowestPrice);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route lấy thông tin khách sạn cụ thể
router.get('/:hotelId', auth, async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ msg: 'Không tìm thấy khách sạn' });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi server', error });
  }
});

// Route xóa khách sạn
router.delete('/:hotelId', auth, async (req, res) => {
  const { hotelId } = req.params;
  const userId = req.user.userId; // Lấy userId từ middleware auth
  const { password } = req.body; // Lấy mật khẩu từ body

  try {
    // Lấy thông tin người dùng từ model User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu nếu cần
    const isMatch = await bcrypt.compare(password, user.password); // Kiểm tra mật khẩu
    if (!isMatch) {
      return res.status(403).json({ msg: 'Mật khẩu không đúng' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tồn tại' });
    }

    // Kiểm tra quyền
    const isAdmin = user.role === 'Admin';
    const isManager = user.role === 'HotelManager';
    
    if (isManager && !hotel.manager.equals(user._id)) {
      return res.status(403).json({ msg: 'Bạn không có quyền xóa khách sạn này' });
    }

    if (!isAdmin && !isManager) {
      return res.status(403).json({ msg: 'Bạn không có quyền xóa khách sạn' });
    }

    await Hotel.findByIdAndDelete(hotelId);
    return res.json({ msg: 'Khách sạn đã được xóa thành công' });

  } catch (error) {
    console.error('Lỗi khi xóa khách sạn:', error);
    return res.status(500).json({ msg: 'Đã xảy ra lỗi trong quá trình xóa khách sạn' });
  }
});

// Route cập nhật khách sạn
router.put('/:hotelId', auth, upload.array('imagehotel', 5), async (req, res) => {
  const { hotelId } = req.params;
  const { name, location, description, stars, removedImages = [] } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tồn tại' });
    }

    const imageHotelUrls = req.files ? req.files.map(file => file.path) : [];

    hotel.name = name || hotel.name;
    hotel.location = location || hotel.location;
    hotel.description = description !== undefined ? description : hotel.description;
    hotel.stars = stars || hotel.stars;


    hotel.imagehotel = [...hotel.imagehotel, ...imageHotelUrls];

    // Xóa ảnh đã được đánh dấu
    if (Array.isArray(removedImages) && removedImages.length > 0) {
      const publicIdsToRemove = removedImages.map(url => getPublicIdFromUrl(url)).filter(id => id);
    
      for (const publicId of publicIdsToRemove) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', error);
        }
      }
    
      hotel.imagehotel = hotel.imagehotel.filter(image => !removedImages.includes(image));
    }
    
    await hotel.save();
    res.status(200).json({ msg: 'Khách sạn đã được cập nhật thành công', hotel });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Route lấy tất cả khách sạn với tên quản lý
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('manager', 'name');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách sạn', error });
  }
});

// Route xóa hình ảnh
router.put('/:hotelId/remove-image', auth, async (req, res) => {
  const { hotelId } = req.params;
  const { imageUrl } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
    }

    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { imagehotel: imageUrl } },
      { new: true }
    );

    res.json(updatedHotel);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});



module.exports = router;
