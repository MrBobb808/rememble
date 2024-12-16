import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Photo } from "@/types/photo";

interface SlideshowProps {
  photos: Photo[];
}

const Slideshow: React.FC<SlideshowProps> = ({ photos }) => {
  return (
    <div className="slideshow-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[50vh] rounded-lg overflow-hidden"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id} className="relative">
            <div className="w-full h-full flex items-center justify-center bg-black">
              <img
                src={photo.url}
                alt={photo.caption}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white">
                <p className="text-sm">{photo.caption}</p>
                {photo.contributorName && photo.relationship && (
                  <p className="text-xs mt-1">
                    Shared by {photo.contributorName} ({photo.relationship})
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slideshow;