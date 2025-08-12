import React, { useState, useCallback, memo } from "react";
import { Button, Radio, Drawer, Badge, Card, Typography, Space, Divider } from "antd";
import { FilterOutlined, ReloadOutlined, DollarOutlined, StarOutlined, HomeOutlined } from '@ant-design/icons';
import './Searchpage.css'; 

const { Title, Text } = Typography;

const Filter = memo(({ setFilteredHotels, hotels }) => {
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStars, setSelectedStars] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handlePriceChange = useCallback((e) => {
    setSelectedPrice(e.target.value);
  }, []);

  const handleRatingChange = useCallback((e) => {
    setSelectedRating(e.target.value);
  }, []);

  const handleStarsChange = useCallback((e) => {
    setSelectedStars(e.target.value);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedPrice("all");
    setSelectedRating("all");
    setSelectedStars("all");
    setFilteredHotels(hotels);
  }, [hotels, setFilteredHotels]);

  const handleApplyFilter = useCallback(async () => {
    setIsApplying(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filtered = [...hotels];

    // Lọc theo giá (Thấp đến cao, Cao đến thấp)
    if (selectedPrice === "lowToHigh") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.lowestRoomPrice || a.rooms?.[0]?.price || 0;
        const bPrice = b.lowestRoomPrice || b.rooms?.[0]?.price || 0;
        return aPrice - bPrice;
      });
    } else if (selectedPrice === "highToLow") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.highestRoomPrice || a.lowestRoomPrice || a.rooms?.[0]?.price || 0;
        const bPrice = b.highestRoomPrice || b.lowestRoomPrice || b.rooms?.[0]?.price || 0;
        return bPrice - aPrice;
      });
    }

    // Lọc theo đánh giá
    if (selectedRating === "excellent") {
      filtered = filtered.filter(hotel => hotel.averageRating >= 9);
    } else if (selectedRating === "good") {
      filtered = filtered.filter(hotel => hotel.averageRating >= 8);
    } else if (selectedRating === "average") {
      filtered = filtered.filter(hotel => hotel.averageRating >= 6);
    }

    // Lọc theo sao
    if (selectedStars !== "all") {
      filtered = filtered.filter(hotel => hotel.stars >= parseInt(selectedStars, 10));
    }

    setFilteredHotels(filtered);
    setIsApplying(false);
    
    // Close mobile filter after applying
    if (window.innerWidth < 1024) {
      setIsFilterOpen(false);
    }
  }, [hotels, selectedPrice, selectedRating, selectedStars, setFilteredHotels]);

  const activeFiltersCount = [selectedPrice, selectedRating, selectedStars].filter(filter => filter !== "all").length;

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          type="primary"
          shape="round"
          size="large"
          icon={<FilterOutlined />}
          onClick={() => setIsFilterOpen(true)}
          className="shadow-lg"
        >
          {activeFiltersCount > 0 && (
            <Badge count={activeFiltersCount} offset={[10, 0]} />
          )}
          Lọc
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <Drawer
          title="Bộ lọc tìm kiếm"
          placement="bottom"
          height="80%"
          onClose={() => setIsFilterOpen(false)}
          open={isFilterOpen}
          extra={
            <Button 
              type="text" 
              icon={<ReloadOutlined />}
              onClick={handleResetFilter}
              disabled={activeFiltersCount === 0}
            >
              Xóa tất cả
            </Button>
          }
        >
          <FilterContent 
            selectedPrice={selectedPrice}
            selectedRating={selectedRating}
            selectedStars={selectedStars}
            handlePriceChange={handlePriceChange}
            handleRatingChange={handleRatingChange}
            handleStarsChange={handleStarsChange}
            handleApplyFilter={handleApplyFilter}
            handleResetFilter={handleResetFilter}
            isApplying={isApplying}
            activeFiltersCount={activeFiltersCount}
          />
        </Drawer>
      )}

      {/* Desktop Filter */}
      <div className="hidden lg:block">
        <Card 
          title={
            <Space>
              <FilterOutlined />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <Badge count={activeFiltersCount} />
              )}
            </Space>
          }
          className="sticky top-24 shadow-sm"
          extra={
            activeFiltersCount > 0 && (
              <Button 
                type="text" 
                icon={<ReloadOutlined />}
                onClick={handleResetFilter}
                size="small"
              >
                Xóa tất cả
              </Button>
            )
          }
        >
          <FilterContent 
            selectedPrice={selectedPrice}
            selectedRating={selectedRating}
            selectedStars={selectedStars}
            handlePriceChange={handlePriceChange}
            handleRatingChange={handleRatingChange}
            handleStarsChange={handleStarsChange}
            handleApplyFilter={handleApplyFilter}
            handleResetFilter={handleResetFilter}
            isApplying={isApplying}
            activeFiltersCount={activeFiltersCount}
          />
        </Card>
      </div>
    </>
  );
});

// Filter Content Component để tái sử dụng
const FilterContent = memo(({ 
  selectedPrice, selectedRating, selectedStars,
  handlePriceChange, handleRatingChange, handleStarsChange,
  handleApplyFilter, handleResetFilter, isApplying, activeFiltersCount
}) => (
  <div className="space-y-6">
    {/* Lọc theo giá */}
    <div>
      <Title level={5} className="flex items-center mb-4">
        <DollarOutlined className="mr-2 text-green-600" />
        Sắp xếp theo giá
      </Title>
      <Radio.Group 
        onChange={handlePriceChange} 
        value={selectedPrice}
        className="w-full"
      >
        <Space direction="vertical" className="w-full">
          <Radio value="all">Tất cả</Radio>
          <Radio value="lowToHigh">Giá từ thấp đến cao</Radio>
          <Radio value="highToLow">Giá từ cao đến thấp</Radio>
        </Space>
      </Radio.Group>
    </div>

    <Divider />

    {/* Lọc theo Đánh giá */}
    <div>
      <Title level={5} className="flex items-center mb-4">
        <StarOutlined className="mr-2 text-yellow-500" />
        Đánh giá
      </Title>
      <Radio.Group 
        onChange={handleRatingChange} 
        value={selectedRating}
        className="w-full"
      >
        <Space direction="vertical" className="w-full">
          <Radio value="all">Tất cả đánh giá</Radio>
          <Radio value="excellent">
            <Space>
              Xuất sắc (9.0+)
              <Text type="secondary">⭐⭐⭐⭐⭐</Text>
            </Space>
          </Radio>
          <Radio value="good">
            <Space>
              Tốt (8.0+)
              <Text type="secondary">⭐⭐⭐⭐</Text>
            </Space>
          </Radio>
          <Radio value="average">
            <Space>
              Khá (6.0+)
              <Text type="secondary">⭐⭐⭐</Text>
            </Space>
          </Radio>
        </Space>
      </Radio.Group>
    </div>

    <Divider />

    

    {/* Action Buttons */}
    <div className="pt-4">
      <Space direction="vertical" className="w-full">
        <Button
          type="primary"
          size="large"
          loading={isApplying}
          onClick={handleApplyFilter}
          className="w-full"
          icon={<FilterOutlined />}
        >
          {isApplying ? 'Đang áp dụng...' : `Áp dụng bộ lọc${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}`}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            type="default"
            size="large"
            onClick={handleResetFilter}
            className="w-full"
            icon={<ReloadOutlined />}
          >
            Xóa tất cả bộ lọc
          </Button>
        )}
      </Space>
    </div>
  </div>
));

Filter.displayName = 'Filter';
FilterContent.displayName = 'FilterContent';

export default Filter;
