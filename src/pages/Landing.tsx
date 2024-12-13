import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1920)`,
          backgroundPosition: 'center 30%'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-7xl md:text-8xl font-playfair mb-8 animate-fade-in">
          In Loving Memory
        </h1>
        <p className="text-2xl md:text-3xl font-inter mb-12 animate-fade-in opacity-90">
          Create a beautiful memorial to honor your loved one
        </p>
        <Button 
          onClick={() => navigate("/memorial")}
          size="lg"
          className="text-xl px-8 py-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm animate-fade-in"
        >
          Enter Memorial
        </Button>
      </div>
    </div>
  );
};

export default Landing;