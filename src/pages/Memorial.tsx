import Navigation from "@/components/Navigation";
import MemorialContainer from "@/components/memorial/MemorialContainer";

const Memorial = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      <MemorialContainer />
    </div>
  );
};

export default Memorial;