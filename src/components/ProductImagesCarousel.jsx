import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { IoChevronBackCircle } from "react-icons/io5";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import baseURL from '../constraints';

const ProductCarousel = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-2xl mx-auto z-0">
      
    
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="rounded-lg overflow-hidden shadow-lg z-0"
      >
        <div className="text-2xl flex top-3 block cursor-pointer absolute left-4 z-10" onClick={() => navigate('/products')}>

          <IoChevronBackCircle className='text-4xl'   />
          <p>Back</p>
        </div>
        {product.image.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center bg-gray-100 h-[400px]">
              <img
                src={`${baseURL}${img}`}
                alt={`${product.name} ${index}`}
                className="max-h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default ProductCarousel;