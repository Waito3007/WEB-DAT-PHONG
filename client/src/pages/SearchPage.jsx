import React, { useState, memo, Suspense } from "react";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import Footer from "../components/HomePage/Footer";

// Lazy load các components để giảm bundle size
const SearchHotel = React.lazy(() => import("../components/SearchPage/SearchHotel"));
const HotelList = React.lazy(() => import("../components/SearchPage/HotelList"));
const Filter = React.lazy(() => import("../components/SearchPage/Filter"));

// Enhanced Loading component
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center py-12">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
    </div>
  </div>
));

const SearchPageSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    {/* Search Header Skeleton */}
    <div className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-64 rounded"></div>
          <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-14 rounded-xl"></div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Skeleton */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-white rounded-xl p-6 space-y-6">
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotels List Skeleton */}
        <div className="flex-1 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="bg-gray-200 w-full lg:w-80 h-48 rounded-lg"></div>
                <div className="flex-1 space-y-4">
                  <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  <div className="bg-gray-200 h-8 w-32 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const SearchPage = memo(() => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        {/* Search Section */}
        <Suspense fallback={<SearchPageSkeleton />}>
          <SearchHotel 
            setFilteredHotels={setFilteredHotels} 
            setHotels={setHotels} 
            hotels={hotels}
          />
        </Suspense>
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <Suspense fallback={<LoadingSpinner />}>
                <Filter 
                  setFilteredHotels={setFilteredHotels} 
                  hotels={hotels} 
                />
              </Suspense>
            </div>
            
            {/* Mobile Filter */}
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <Filter 
                  setFilteredHotels={setFilteredHotels} 
                  hotels={hotels} 
                />
              </Suspense>
            </div>
            
            {/* Hotels List */}
            <div className="flex-1 min-w-0">
              <Suspense fallback={<LoadingSpinner />}>
                <HotelList hotels={filteredHotels} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
SearchPageSkeleton.displayName = 'SearchPageSkeleton';
SearchPage.displayName = 'SearchPage';

export default SearchPage;
