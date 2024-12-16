import Navigation from "@/components/Navigation";
import MemorialContainer from "@/components/memorial/MemorialContainer";

const Memorial = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      {/* Added mt-16 to account for fixed header height */}
      <div className="mt-16">
        <MemorialContainer />
      </div>
    </div>
  );
};

export default Memorial;