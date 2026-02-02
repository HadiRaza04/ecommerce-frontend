import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCarousel = ({ product }) => {
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
        {product.image.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center bg-gray-100 h-[400px]">
              <img
                src={`http://localhost:3000${img}`}
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