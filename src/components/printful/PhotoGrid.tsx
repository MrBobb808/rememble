import { Card } from "@/components/ui/card";

interface Photo {
  url: string;
  caption: string;
}

interface PhotoGridProps {
  photos: Photo[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Selected Photos</h2>
      <p className="text-gray-600 mb-4">
        These photos will be beautifully arranged in your memorial product.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md">
            <img 
              src={photo.url} 
              alt={photo.caption} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};