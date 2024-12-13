import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";

interface MemorialHeroProps {
  name: string;
  dates: string;
  photoUrl: string;
}

const MemorialHero = ({ name, dates, photoUrl }: MemorialHeroProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] mt-14">
      <div className="absolute inset-0 bg-black/20" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
        </div>
      )}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url(${photoUrl}?quality=80&width=1920)`,
          backgroundPosition: 'center 30%',
          display: isLoading ? 'none' : 'block'
        }}
        onLoad={() => setIsLoading(false)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-12 text-white text-center">
        <h1 className="text-6xl md:text-7xl font-playfair mb-6 animate-fade-in">
          {name}
        </h1>
        <p className="text-2xl md:text-3xl font-inter mb-8 animate-fade-in opacity-90">
          {dates}
        </p>
        <Heart className="mx-auto w-12 h-12 text-white/90 animate-pulse" />
      </div>
    </div>
  );
};

export default MemorialHero;