import { Book, Shirt } from "lucide-react";

interface ProductHeaderProps {
  productType: string;
}

export const ProductHeader = ({ productType }: ProductHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      {productType === 'photo-book' ? (
        <Book className="w-8 h-8 text-memorial-blue" />
      ) : (
        <Shirt className="w-8 h-8 text-memorial-blue" />
      )}
      <h1 className="text-3xl font-playfair">
        {productType === 'photo-book' ? 'Create Memorial Photo Book' : 'Create Memory Quilt'}
      </h1>
    </div>
  );
};