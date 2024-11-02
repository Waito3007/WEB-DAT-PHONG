const express = require('express');
const router = express.Router();

// Dữ liệu tỉnh thành đầy đủ
const provincesData = {
    error: 0,
    error_text: "Lấy dữ liệu tỉnh thành thành công..!",
    data_name: "Tỉnh thành Việt Nam",
    data: [
        { id: "01", name: "Bà Rịa - Vũng Tàu", name_en: "Ba Ria - Vung Tau", full_name: "Tỉnh Bà Rịa - Vũng Tàu", full_name_en: "Ba Ria - Vung Tau Province", latitude: "10.5738801", longitude: "107.3284362" },
        { id: "06", name: "Bình Dương", name_en: "Binh Duong", full_name: "Tỉnh Bình Dương", full_name_en: "Binh Duong Province", latitude: "11.1836551", longitude: "106.7031737" },
        { id: "02", name: "Bình Thuận", name_en: "Binh Thuan", full_name: "Tỉnh Bình Thuận", full_name_en: "Binh Thuan Province", latitude: "11.1041572", longitude: "108.1832931" },
        { id: "03", name: "Cần Thơ", name_en: "Can Tho", full_name: "Thành phố Cần Thơ", full_name_en: "Can Tho City", latitude: "10.0364634", longitude: "105.7875821" },
        { id: "05", name: "Hà Nội", name_en: "Ha Noi", full_name: "Thành phố Hà Nội", full_name_en: "Ha Noi City", latitude: "21.0283334", longitude: "105.854041" },
        { id: "04", name: "Hồ Chí Minh", name_en: "Ho Chi Minh", full_name: "Thành phố Hồ Chí Minh", full_name_en: "Ho Chi Minh City", latitude: "10.7763897", longitude: "106.7011391" }
    ]
};

// Endpoint API
router.get('/', (req, res) => {
    res.json(provincesData);
});
module.exports = router;
