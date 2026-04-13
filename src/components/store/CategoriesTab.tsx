import { ChevronRight, Package } from "lucide-react";

interface CategoriesTabProps {
  categories: any[];
}

export function CategoriesTab({ categories }: CategoriesTabProps) {
  return (
    <div className="flex flex-col bg-white">
      {categories.map((category, i) => (
        <div
          key={category.id || i}
          className="flex items-center justify-between px-4 py-5 border-b border-[#F1F1F2] active:bg-[#F8F8F8] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] bg-[#F8F8F8] rounded-lg overflow-hidden border border-[#F1F1F2] flex items-center justify-center shrink-0">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-8 h-8 text-[#CED0D4]" />
              )}
            </div>
            <span className="text-[#161823] font-bold text-[16px]">{category.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8A8B91] text-[15px]">{category.count}</span>
            <ChevronRight className="w-5 h-5 text-[#8A8B91]" />
          </div>
        </div>
      ))}
    </div>
  );
}
