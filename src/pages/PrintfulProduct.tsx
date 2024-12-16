import Navigation from "@/components/Navigation";
import { PrintfulProduct as PrintfulProductComponent } from "@/components/memorial/PrintfulProduct";

const PrintfulProduct = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      {/* Added mt-16 to account for fixed header height */}
      <div className="mt-16">
        <PrintfulProductComponent />
      </div>
    </div>
  );
};

export default PrintfulProduct;