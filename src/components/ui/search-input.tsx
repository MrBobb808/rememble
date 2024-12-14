import { Input } from "./input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const SearchInput = ({ className, icon, ...props }: SearchInputProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
      )}
      <Input
        className={cn("pl-10", className)}
        {...props}
      />
    </div>
  );
};

export { SearchInput };