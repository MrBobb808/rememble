import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Photo } from "@/types/photo";
import { X } from "lucide-react";

interface SlideshowProps {
  photos: Photo[];
  memorial?: {
    name: string;
  };
  onClose?: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ photos, memorial, onClose }) => {
  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Title & Subtitle */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <h2 className="text-xl font-playfair text-white font-semibold text-center">
          Memorial Slideshow
        </h2>
        <p className="text-sm text-gray-200 text-center mt-1">
          In Loving Memory of {memorial?.name || "Our Loved One"}
        </p>
      </div>

      {/* Slideshow */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[40vh] rounded-lg"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id} className="relative">
            <div className="w-full h-full flex items-center justify-center bg-black">
              <img
                src={photo.url}
                alt={photo.caption}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm text-white">{photo.caption}</p>
                {photo.contributorName && photo.relationship && (
                  <p className="text-xs text-gray-300 mt-1">
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