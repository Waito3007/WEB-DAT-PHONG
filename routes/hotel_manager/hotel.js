// routes/hotel_manager/hotel.js
const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Room = require('../../models/Room');
const User = require('../../models/User'); // Import model User
const auth = require('../../middleware/auth'); // Middleware xác thực
const upload = require('../../middleware/upload'); // Middleware upload ảnh
const cloudinary = require('cloudinary').v2;

// Hàm để lấy publicId từ URL của Cloudinary
const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
  return matches ? matches[1] : null;
};

// Route thêm khách sạn
router.post('/addhotel', auth, upload.array('imagehotel', 5), async (req, res) => {
  const { name, location, description, rooms } = req.body;

  try {
    const managerId = req.user.userId;

    // Lấy link ảnh từ Cloudinary sau khi upload
    const imageUrls = req.files.map(file => file.path);

    const newHotel = new Hotel({
      name,
      location,
      description,
      manager: managerId,
      rooms,
      imagehotel: imageUrls, // Lưu link ảnh Cloudinary
    });

    await newHotel.save();
    res.status(201).json({ msg: 'Khách sạn đã được thêm thành công', hotel: newHotel });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Route lấy danh sách khách sạn của người dùng hiện tại
router.get('/myhotels', auth, async (req, res) => {
  try {
    const managerId = req.user.userId; // Lấy ID người dùng từ middleware auth

    // Tìm các khách sạn mà người dùng là quản lý và lấy thêm thông tin từ 'User'
    const hotels = await Hotel.find({ manager: managerId })
      .populate('manager', 'name email'); // Tham chiếu thông tin từ model 'User'

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
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
router.delete('/:id', auth, async (req, res) => {
  const hotelId = req.params.id; // Lấy ID khách sạn từ tham số URL
  const { password } = req.body; // Lấy mật khẩu từ body yêu cầu

  try {
    // Tìm user theo ID đã xác thực
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'Người dùng không tìm thấy' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mật khẩu không chính xác' });
    }

    // Xóa khách sạn
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tìm thấy' });
    }

    // Xóa tất cả các phòng thuộc khách sạn
    await Room.deleteMany({ hotel: hotelId });

    // Xóa hình ảnh từ Cloudinary
    const publicIds = hotel.imagehotel.map(url => getPublicIdFromUrl(url)).filter(id => id);
    
    for (const publicId of publicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', error);
      }
    }

    // Xóa khách sạn
    await Hotel.findByIdAndDelete(hotelId);
    res.json({ message: 'Khách sạn và các phòng đã được xóa' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi khi xóa khách sạn', error: error.message });
  }
});


// Route cập nhật khách sạn
router.put('/:hotelId', auth, upload.array('imagehotel', 5), async (req, res) => {
  const { hotelId } = req.params;
  const { name, location, description, removedImages = [] } = req.body; // Đảm bảo removedImages là một mảng

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tồn tại' });
    }

    // Lấy URL ảnh mới từ file tải lên
    const imageHotelUrls = req.files ? req.files.map(file => file.path) : [];

    // Cập nhật thông tin khách sạn
    hotel.name = name || hotel.name;
    hotel.location = location || hotel.location;
    hotel.description = description !== undefined ? description : hotel.description;

    // Gộp ảnh cũ và ảnh mới
    hotel.imagehotel = [...hotel.imagehotel, ...imageHotelUrls];

    // Xóa ảnh đã được đánh dấu
    if (Array.isArray(removedImages) && removedImages.length > 0) {
      const publicIdsToRemove = removedImages.map(url => getPublicIdFromUrl(url)).filter(id => id);

      // Xử lý xóa ảnh khỏi Cloudinary
      for (const publicId of publicIdsToRemove) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', error);
        }
      }

      // Xóa ảnh đã đánh dấu khỏi mảng imagehotel
      hotel.imagehotel = hotel.imagehotel.filter(image => !removedImages.includes(image));
    }

    await hotel.save();
    res.status(200).json({ msg: 'Khách sạn đã được cập nhật thành công', hotel });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Route để lấy tất cả khách sạn với tên quản lý
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('manager', 'name'); // Chỉ lấy trường tên của người quản lý
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

    // Xóa ảnh khỏi Cloudinary
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
