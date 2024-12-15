import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Variant {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface ProductVariantsProps {
  variants: Variant[];
  selectedVariant: number | null;
  onVariantSelect: (id: number) => void;
}

export const ProductVariants = ({ variants, selectedVariant, onVariantSelect }: ProductVariantsProps) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Select Product Option</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <Button
            key={variant.id}
            variant={selectedVariant === variant.id ? "default" : "outline"}
            className="h-auto p-4 flex flex-col gap-2"
            onClick={() => onVariantSelect(variant.id)}
          >
            <span className="font-semibold">{variant.name}</span>
            <span className="text-sm text-gray-600">{variant.description}</span>
            <span className="text-memorial-blue font-bold">{variant.price}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};