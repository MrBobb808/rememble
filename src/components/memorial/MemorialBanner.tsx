import { Heart } from "lucide-react";

interface MemorialBannerProps {
  name: string;
  dates: string;
  photoUrl?: string;
}

const MemorialBanner = ({ name, dates, photoUrl = "/placeholder.svg" }: MemorialBannerProps) => {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px] mb-8">
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url(${photoUrl}?quality=80&width=1920)`,
          backgroundPosition: 'center 30%'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-playfair mb-4 animate-fade-in">
          {name}
        </h1>
        <p className="text-xl md:text-2xl font-inter mb-6 animate-fade-in opacity-90">
          {dates}
        </p>
        <Heart className="mx-auto w-10 h-10 text-white/90 animate-pulse" />
      </div>
    </div>
  );
};

export default MemorialBanner;