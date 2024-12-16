import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen">
      {/* Added mt-16 to account for fixed header height */}
      <div className="absolute inset-0 mt-16 bg-black/20" />
      <div 
        className="absolute inset-0 mt-16 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(/placeholder.svg)`,
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 mt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 mt-16 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair mb-8">
          In Loving Memory
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-inter mb-12 max-w-2xl">
          Create a beautiful memorial to honor your loved one
        </p>
        <Button 
          onClick={() => navigate("/memorial")}
          size="lg"
          className="text-lg md:text-xl px-6 py-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
        >
          Enter Memorial
        </Button>
      </div>
    </div>
  );
};

export default Landing;