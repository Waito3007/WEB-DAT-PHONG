const express = require('express');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const axios = require('axios');
const router = express.Router();
router.get('/top-provinces', async (req, res) => {
    try {
        // Bước 1: Lấy danh sách tỉnh thành từ API
        const provinceResponse = await axios.get('http://localhost:5000/api/tinhthanh');
        const provinces = provinceResponse.data.data;

        // Bước 2: Lấy danh sách khách sạn và tính toán số lượng theo tỉnh thành
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

        // Bước 3: Đếm số lượng khách sạn theo từng tỉnh thành
        const locationCount = {};

        hotelWithLowestPrice.forEach(hotel => {
            const location = hotel.location; // Lấy chuỗi location

            // Kiểm tra xem location có chứa tỉnh thành nào không
            provinces.forEach(province => {
                if (location.includes(province.name)) { // So sánh tên tỉnh thành
                    // Nếu có, tăng số lượng
                    if (locationCount[province.id]) {
                        locationCount[province.id].count++;
                    } else {
                        locationCount[province.id] = { 
                            ...province, 
                            count: 1, 
                            locations: [] // Thêm mảng locations để chứa thông tin các khách sạn
                        };
                    }
                    // Thêm thông tin khách sạn vào locations
                    locationCount[province.id].locations.push({
                        id: hotel._id,
                        name: hotel.name,
                        location: hotel.location,
                        lowestRoomPrice: hotel.lowestRoomPrice,
                    });
                }
            });
        });

        // Bước 4: Chuyển đổi kết quả sang mảng và sắp xếp
        const allLocations = Object.values(locationCount).sort((a, b) => b.count - a.count);

        // Bước 5: Định dạng kết quả trả về
        const result = {
            error: 0,
            error_text: "Lấy dữ liệu tỉnh thành thành công..! ",
            data_name: "Tỉnh thành Việt Nam",
            data: allLocations.map(location => ({
                id: location.id,
                name: location.name,
                name_en: location.name_en || location.name,
                full_name: location.full_name || `Tỉnh ${location.name}`,
                full_name_en: location.full_name_en || `${location.name} Province`,
                latitude: location.latitude || "",
                longitude: location.longitude || "",
                image: location.image || "",
                count: location.count, // Số lượng khách sạn theo tỉnh
                locations: location.locations // Thông tin khách sạn
            }))
        };

        res.json(result);
    } catch (error) {
        console.error("Error fetching hotels or provinces:", error);
        res.status(500).json({ error: 1, error_text: "Internal server error" });
    }
});


// Dữ liệu tỉnh thành đầy đủ
const provincesData = {
    error: 0,
    error_text: "Lấy dữ liệu tỉnh thành thành công..!",
    data_name: "Tỉnh thành Việt Nam",
    data: [
        {
          "id": "89",
          "name": "An Giang",
          "name_en": "An Giang",
          "full_name": "Tỉnh An Giang",
          "full_name_en": "An Giang Province",
          "latitude": "10.5392057",
          "longitude": "105.2312822",
          "image":""
        },
        {
          "id": "77",
          "name": "Bà Rịa - Vũng Tàu",
          "name_en": "Ba Ria - Vung Tau",
          "full_name": "Tỉnh Bà Rịa - Vũng Tàu",
          "full_name_en": "Ba Ria - Vung Tau Province",
          "latitude": "10.5738801",
          "longitude": "107.3284362"
        },
        {
          "id": "24",
          "name": "Bắc Giang",
          "name_en": "Bac Giang",
          "full_name": "Tỉnh Bắc Giang",
          "full_name_en": "Bac Giang Province",
          "latitude": "21.3169625",
          "longitude": "106.437985"
        },
        {
          "id": "06",
          "name": "Bắc Kạn",
          "name_en": "Bac Kan",
          "full_name": "Tỉnh Bắc Kạn",
          "full_name_en": "Bac Kan Province",
          "latitude": "22.2571701",
          "longitude": "105.8204437"
        },
        {
          "id": "95",
          "name": "Bạc Liêu",
          "name_en": "Bac Lieu",
          "full_name": "Tỉnh Bạc Liêu",
          "full_name_en": "Bac Lieu Province",
          "latitude": "9.3298341",
          "longitude": "105.509946"
        },
        {
          "id": "27",
          "name": "Bắc Ninh",
          "name_en": "Bac Ninh",
          "full_name": "Tỉnh Bắc Ninh",
          "full_name_en": "Bac Ninh Province",
          "latitude": "21.0955822",
          "longitude": "106.1264766"
        },
        {
          "id": "83",
          "name": "Bến Tre",
          "name_en": "Ben Tre",
          "full_name": "Tỉnh Bến Tre",
          "full_name_en": "Ben Tre Province",
          "latitude": "10.1093637",
          "longitude": "106.4811559"
        },
        {
          "id": "74",
          "name": "Bình Dương",
          "name_en": "Binh Duong",
          "full_name": "Tỉnh Bình Dương",
          "full_name_en": "Binh Duong Province",
          "latitude": "11.1836551",
          "longitude": "106.7031737"
        },
        {
          "id": "70",
          "name": "Bình Phước",
          "name_en": "Binh Phuoc",
          "full_name": "Tỉnh Bình Phước",
          "full_name_en": "Binh Phuoc Province",
          "latitude": "11.7543232",
          "longitude": "106.9266473"
        },
        {
          "id": "60",
          "name": "Bình Thuận",
          "name_en": "Binh Thuan",
          "full_name": "Tỉnh Bình Thuận",
          "full_name_en": "Binh Thuan Province",
          "latitude": "11.1041572",
          "longitude": "108.1832931"
        },
        {
          "id": "52",
          "name": "Bình Định",
          "name_en": "Binh Dinh",
          "full_name": "Tỉnh Bình Định",
          "full_name_en": "Binh Dinh Province",
          "latitude": "14.0779378",
          "longitude": "108.9898798"
        },
        {
          "id": "96",
          "name": "Cà Mau",
          "name_en": "Ca Mau",
          "full_name": "Tỉnh Cà Mau",
          "full_name_en": "Ca Mau Province",
          "latitude": "9.0180177",
          "longitude": "105.0869724"
        },
        {
          "id": "92",
          "name": "Cần Thơ",
          "name_en": "Can Tho",
          "full_name": "Thành phố Cần Thơ",
          "full_name_en": "Can Tho City",
          "latitude": "10.0364634",
          "longitude": "105.7875821"
        },
        {
          "id": "04",
          "name": "Cao Bằng",
          "name_en": "Cao Bang",
          "full_name": "Tỉnh Cao Bằng",
          "full_name_en": "Cao Bang Province",
          "latitude": "22.7426936",
          "longitude": "106.1060926"
        },
        {
          "id": "64",
          "name": "Gia Lai",
          "name_en": "Gia Lai",
          "full_name": "Tỉnh Gia Lai",
          "full_name_en": "Gia Lai Province",
          "latitude": "13.8177445",
          "longitude": "108.2004015"
        },
        {
          "id": "02",
          "name": "Hà Giang",
          "name_en": "Ha Giang",
          "full_name": "Tỉnh Hà Giang",
          "full_name_en": "Ha Giang Province",
          "latitude": "22.7336097",
          "longitude": "105.0027271"
        },
        {
          "id": "35",
          "name": "Hà Nam",
          "name_en": "Ha Nam",
          "full_name": "Tỉnh Hà Nam",
          "full_name_en": "Ha Nam Province",
          "latitude": "20.5340294",
          "longitude": "105.98102482169935"
        },
        {
          "id": "01",
          "name": "Hà Nội",
          "name_en": "Ha Noi",
          "full_name": "Thành phố Hà Nội",
          "full_name_en": "Ha Noi City",
          "latitude": "21.0283334",
          "longitude": "105.854041",
          "image":"https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/04/anh-ha-noi.jpg.webp"
        },
        {
          "id": "42",
          "name": "Hà Tĩnh",
          "name_en": "Ha Tinh",
          "full_name": "Tỉnh Hà Tĩnh",
          "full_name_en": "Ha Tinh Province",
          "latitude": "18.3504832",
          "longitude": "105.7623047"
        },
        {
          "id": "30",
          "name": "Hải Dương",
          "name_en": "Hai Duong",
          "full_name": "Tỉnh Hải Dương",
          "full_name_en": "Hai Duong Province",
          "latitude": "20.8930571",
          "longitude": "106.3725441"
        },
        {
          "id": "31",
          "name": "Hải Phòng",
          "name_en": "Hai Phong",
          "full_name": "Thành phố Hải Phòng",
          "full_name_en": "Hai Phong City",
          "latitude": "20.858864",
          "longitude": "106.6749591"
        },
        {
          "id": "93",
          "name": "Hậu Giang",
          "name_en": "Hau Giang",
          "full_name": "Tỉnh Hậu Giang",
          "full_name_en": "Hau Giang Province",
          "latitude": "9.7985063",
          "longitude": "105.6379524"
        },
        {
          "id": "79",
          "name": "Hồ Chí Minh",
          "name_en": "Ho Chi Minh",
          "full_name": "Thành phố Hồ Chí Minh",
          "full_name_en": "Ho Chi Minh City",
          "latitude": "10.7763897",
          "longitude": "106.7011391",
          "image": "https://images.pexels.com/photos/941195/pexels-photo-941195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          "id": "17",
          "name": "Hoà Bình",
          "name_en": "Hoa Binh",
          "full_name": "Tỉnh Hoà Bình",
          "full_name_en": "Hoa Binh Province",
          "latitude": "20.6763365",
          "longitude": "105.3759952"
        },
        {
          "id": "33",
          "name": "Hưng Yên",
          "name_en": "Hung Yen",
          "full_name": "Tỉnh Hưng Yên",
          "full_name_en": "Hung Yen Province",
          "latitude": "20.7833912",
          "longitude": "106.0699025"
        },
        {
          "id": "56",
          "name": "Khánh Hòa",
          "name_en": "Khanh Hoa",
          "full_name": "Tỉnh Khánh Hòa",
          "full_name_en": "Khanh Hoa Province",
          "latitude": "12.2980751",
          "longitude": "108.9950386"
        },
        {
          "id": "91",
          "name": "Kiên Giang",
          "name_en": "Kien Giang",
          "full_name": "Tỉnh Kiên Giang",
          "full_name_en": "Kien Giang Province",
          "latitude": "9.9904962",
          "longitude": "105.2435248"
        },
        {
          "id": "62",
          "name": "Kon Tum",
          "name_en": "Kon Tum",
          "full_name": "Tỉnh Kon Tum",
          "full_name_en": "Kon Tum Province",
          "latitude": "14.6995372",
          "longitude": "107.9323831"
        },
        {
          "id": "12",
          "name": "Lai Châu",
          "name_en": "Lai Chau",
          "full_name": "Tỉnh Lai Châu",
          "full_name_en": "Lai Chau Province",
          "latitude": "22.2921668",
          "longitude": "103.1798662"
        },
        {
          "id": "68",
          "name": "Lâm Đồng",
          "name_en": "Lam Dong",
          "full_name": "Tỉnh Lâm Đồng",
          "full_name_en": "Lam Dong Province",
          "latitude": "11.6614957",
          "longitude": "108.1335279"
        },
        {
          "id": "20",
          "name": "Lạng Sơn",
          "name_en": "Lang Son",
          "full_name": "Tỉnh Lạng Sơn",
          "full_name_en": "Lang Son Province",
          "latitude": "21.8487579",
          "longitude": "106.6140692"
        },
        {
          "id": "10",
          "name": "Lào Cai",
          "name_en": "Lao Cai",
          "full_name": "Tỉnh Lào Cai",
          "full_name_en": "Lao Cai Province",
          "latitude": "22.3069302",
          "longitude": "104.1829592"
        },
        {
          "id": "80",
          "name": "Long An",
          "name_en": "Long An",
          "full_name": "Tỉnh Long An",
          "full_name_en": "Long An Province",
          "latitude": "10.6983968",
          "longitude": "106.1883517"
        },
        {
          "id": "36",
          "name": "Nam Định",
          "name_en": "Nam Dinh",
          "full_name": "Tỉnh Nam Định",
          "full_name_en": "Nam Dinh Province",
          "latitude": "20.2686476",
          "longitude": "106.2289075"
        },
        {
          "id": "40",
          "name": "Nghệ An",
          "name_en": "Nghe An",
          "full_name": "Tỉnh Nghệ An",
          "full_name_en": "Nghe An Province",
          "latitude": "19.1976001",
          "longitude": "105.060676"
        },
        {
          "id": "37",
          "name": "Ninh Bình",
          "name_en": "Ninh Binh",
          "full_name": "Tỉnh Ninh Bình",
          "full_name_en": "Ninh Binh Province",
          "latitude": "20.2051051",
          "longitude": "105.9280678"
        },
        {
          "id": "58",
          "name": "Ninh Thuận",
          "name_en": "Ninh Thuan",
          "full_name": "Tỉnh Ninh Thuận",
          "full_name_en": "Ninh Thuan Province",
          "latitude": "11.6965639",
          "longitude": "108.8928476"
        },
        {
          "id": "25",
          "name": "Phú Thọ",
          "name_en": "Phu Tho",
          "full_name": "Tỉnh Phú Thọ",
          "full_name_en": "Phu Tho Province",
          "latitude": "21.3007538",
          "longitude": "105.1349604"
        },
        {
          "id": "54",
          "name": "Phú Yên",
          "name_en": "Phu Yen",
          "full_name": "Tỉnh Phú Yên",
          "full_name_en": "Phu Yen Province",
          "latitude": "13.1912633",
          "longitude": "109.1273678"
        },
        {
          "id": "44",
          "name": "Quảng Bình",
          "name_en": "Quang Binh",
          "full_name": "Tỉnh Quảng Bình",
          "full_name_en": "Quang Binh Province",
          "latitude": "17.509599",
          "longitude": "106.4004452"
        },
        {
          "id": "49",
          "name": "Quảng Nam",
          "name_en": "Quang Nam",
          "full_name": "Tỉnh Quảng Nam",
          "full_name_en": "Quang Nam Province",
          "latitude": "15.5761698",
          "longitude": "108.0527132"
        },
        {
          "id": "51",
          "name": "Quảng Ngãi",
          "name_en": "Quang Ngai",
          "full_name": "Tỉnh Quảng Ngãi",
          "full_name_en": "Quang Ngai Province",
          "latitude": "14.9953739",
          "longitude": "108.691729"
        },
        {
          "id": "22",
          "name": "Quảng Ninh",
          "name_en": "Quang Ninh",
          "full_name": "Tỉnh Quảng Ninh",
          "full_name_en": "Quang Ninh Province",
          "latitude": "21.1718046",
          "longitude": "107.2012742"
        },
        {
          "id": "45",
          "name": "Quảng Trị",
          "name_en": "Quang Tri",
          "full_name": "Tỉnh Quảng Trị",
          "full_name_en": "Quang Tri Province",
          "latitude": "16.7897806",
          "longitude": "106.9797431"
        },
        {
          "id": "94",
          "name": "Sóc Trăng",
          "name_en": "Soc Trang",
          "full_name": "Tỉnh Sóc Trăng",
          "full_name_en": "Soc Trang Province",
          "latitude": "9.5628369",
          "longitude": "105.9493991"
        },
        {
          "id": "14",
          "name": "Sơn La",
          "name_en": "Son La",
          "full_name": "Tỉnh Sơn La",
          "full_name_en": "Son La Province",
          "latitude": "21.2276769",
          "longitude": "104.1575944"
        },
        {
          "id": "72",
          "name": "Tây Ninh",
          "name_en": "Tay Ninh",
          "full_name": "Tỉnh Tây Ninh",
          "full_name_en": "Tay Ninh Province",
          "latitude": "11.4019366",
          "longitude": "106.1626927"
        },
        {
          "id": "34",
          "name": "Thái Bình",
          "name_en": "Thai Binh",
          "full_name": "Tỉnh Thái Bình",
          "full_name_en": "Thai Binh Province",
          "latitude": "20.5296832",
          "longitude": "106.3876068"
        },
        {
          "id": "19",
          "name": "Thái Nguyên",
          "name_en": "Thai Nguyen",
          "full_name": "Tỉnh Thái Nguyên",
          "full_name_en": "Thai Nguyen Province",
          "latitude": "21.6498502",
          "longitude": "105.8351394"
        },
        {
          "id": "38",
          "name": "Thanh Hóa",
          "name_en": "Thanh Hoa",
          "full_name": "Tỉnh Thanh Hóa",
          "full_name_en": "Thanh Hoa Province",
          "latitude": "19.9781573",
          "longitude": "105.4816107"
        },
        {
          "id": "46",
          "name": "Thừa Thiên Huế",
          "name_en": "Thua Thien Hue",
          "full_name": "Tỉnh Thừa Thiên Huế",
          "full_name_en": "Thua Thien Hue Province",
          "latitude": "16.3480798",
          "longitude": "107.5398913"
        },
        {
          "id": "82",
          "name": "Tiền Giang",
          "name_en": "Tien Giang",
          "full_name": "Tỉnh Tiền Giang",
          "full_name_en": "Tien Giang Province",
          "latitude": "10.4030368",
          "longitude": "106.361633"
        },
        {
          "id": "84",
          "name": "Trà Vinh",
          "name_en": "Tra Vinh",
          "full_name": "Tỉnh Trà Vinh",
          "full_name_en": "Tra Vinh Province",
          "latitude": "9.8037998",
          "longitude": "106.3256808"
        },
        {
          "id": "08",
          "name": "Tuyên Quang",
          "name_en": "Tuyen Quang",
          "full_name": "Tỉnh Tuyên Quang",
          "full_name_en": "Tuyen Quang Province",
          "latitude": "22.0747798",
          "longitude": "105.258411"
        },
        {
          "id": "86",
          "name": "Vĩnh Long",
          "name_en": "Vinh Long",
          "full_name": "Tỉnh Vĩnh Long",
          "full_name_en": "Vinh Long Province",
          "latitude": "10.1203043",
          "longitude": "106.0125705"
        },
        {
          "id": "26",
          "name": "Vĩnh Phúc",
          "name_en": "Vinh Phuc",
          "full_name": "Tỉnh Vĩnh Phúc",
          "full_name_en": "Vinh Phuc Province",
          "latitude": "21.3778689",
          "longitude": "105.5758286"
        },
        {
          "id": "15",
          "name": "Yên Bái",
          "name_en": "Yen Bai",
          "full_name": "Tỉnh Yên Bái",
          "full_name_en": "Yen Bai Province",
          "latitude": "21.8268679",
          "longitude": "104.663122"
        },
        {
          "id": "48",
          "name": "Đà Nẵng",
          "name_en": "Da Nang",
          "full_name": "Thành phố Đà Nẵng",
          "full_name_en": "Da Nang City",
          "latitude": "16.068",
          "longitude": "108.212"
        },
        {
          "id": "66",
          "name": "Đắk Lắk",
          "name_en": "Dak Lak",
          "full_name": "Tỉnh Đắk Lắk",
          "full_name_en": "Dak Lak Province",
          "latitude": "12.8292274",
          "longitude": "108.2999058"
        },
        {
          "id": "67",
          "name": "Đắk Nông",
          "name_en": "Dak Nong",
          "full_name": "Tỉnh Đắk Nông",
          "full_name_en": "Dak Nong Province",
          "latitude": "12.2818851",
          "longitude": "107.7302484"
        },
        {
          "id": "11",
          "name": "Điện Biên",
          "name_en": "Dien Bien",
          "full_name": "Tỉnh Điện Biên",
          "full_name_en": "Dien Bien Province",
          "latitude": "21.6546566",
          "longitude": "103.2168632"
        },
        {
          "id": "75",
          "name": "Đồng Nai",
          "name_en": "Dong Nai",
          "full_name": "Tỉnh Đồng Nai",
          "full_name_en": "Dong Nai Province",
          "latitude": "11.0355624",
          "longitude": "107.1881076"
        },
        {
          "id": "87",
          "name": "Đồng Tháp",
          "name_en": "Dong Thap",
          "full_name": "Tỉnh Đồng Tháp",
          "full_name_en": "Dong Thap Province",
          "latitude": "10.590424",
          "longitude": "105.6802341"
        }
      ]
};
// Endpoint API
router.get('/', (req, res) => {
    res.json(provincesData);
});
module.exports = router;
