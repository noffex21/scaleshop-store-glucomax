import { Star, ShoppingCart, Package, Ticket, Trophy } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatSoldCount } from "@/lib/utils";
import { CartPlusIcon } from "@/components/icons/CartPlusIcon";

interface ProductCardProps {
  product: any;
  variant?: "grid" | "list";
  onClick?: (product: any) => void;
  onBuyNow?: (product: any) => void;
}

export function ProductCard({ product, variant = "grid", onClick, onBuyNow }: ProductCardProps) {
  const { addToCart } = useCart();
  if (!product) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Fly to cart animation
    const cartIcon = document.getElementById('cart-icon');
    const target = e.currentTarget as HTMLElement;
    
    if (cartIcon && target) {
      const rect = target.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      
      const flyItem = document.createElement('div');
      flyItem.style.position = 'fixed';
      flyItem.style.top = `${rect.top}px`;
      flyItem.style.left = `${rect.left}px`;
      flyItem.style.width = '40px';
      flyItem.style.height = '40px';
      flyItem.style.borderRadius = '20px';
      flyItem.style.backgroundColor = '#FE2C55';
      flyItem.style.zIndex = '9999';
      flyItem.style.pointerEvents = 'none';
      flyItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      const img = document.createElement('img');
      img.src = product.image || product.carouselImages?.[0] || "";
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '50%';
      flyItem.appendChild(img);
      
      document.body.appendChild(flyItem);
      
      // Force repaint
      flyItem.getBoundingClientRect();
      
      flyItem.style.top = `${cartRect.top}px`;
      flyItem.style.left = `${cartRect.left}px`;
      flyItem.style.width = '10px';
      flyItem.style.height = '10px';
      flyItem.style.opacity = '0';
      flyItem.style.transform = 'scale(0.5)';
      
      setTimeout(() => {
        document.body.removeChild(flyItem);
        // Subtle cart bounce
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => cartIcon.style.transform = 'scale(1)', 100);
      }, 600);
    }

    addToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow?.(product);
  };

  const getRankingStyles = (ranking: number) => {
    switch (ranking) {
      case 1:
        return { bg: "bg-[#E9B65F]", text: "text-white", label: "1" }; // Gold
      case 2:
        return { bg: "bg-[#95B2C1]", text: "text-white", label: "2" }; // Silver/Blue
      case 3:
        return { bg: "bg-[#E9A083]", text: "text-white", label: "3" }; // Bronze/Orange
      default:
        return { bg: "bg-[#F1F1F2]", text: "text-[#8A8B91]", label: `${ranking}` };
    }
  };

  const styles = product.ranking ? getRankingStyles(product.ranking) : null;

  if (variant === "list") {
    return (
      <div 
        className="flex gap-3 py-4 border-b border-[#F1F1F2] cursor-pointer active:opacity-70 transition-opacity"
        onClick={() => onClick?.(product)}
      >
        <div className="w-[120px] h-[120px] relative bg-[#F8F8F8] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
          {(product.carouselImages?.length > 0 || product.image) ? (
            <img 
              src={product.carouselImages?.[0] || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/logo.png";
              }}
            />
          ) : (
            <Package className="w-10 h-10 text-[#CED0D4]" />
          )}
          {product.ranking && styles && (
            <div className={`absolute top-0 left-0 ${styles.bg} ${styles.text} text-[12px] font-bold px-2 py-[2px] rounded-br-lg flex items-center justify-center z-10`}>
              {styles.label}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 py-1">
          <div>
            <h3 className="text-[#161823] text-[14px] leading-tight line-clamp-2 mb-1 font-bold">
              {product.name || "Produto sem nome"}
            </h3>
            <div className="flex items-center gap-1.5 mb-2 overflow-hidden">
              <div className="flex items-center gap-1 bg-[#FE2C55]/10 px-1.5 py-0.5 rounded text-[#FE2C55] min-w-fit">
                <Ticket className="w-3.5 h-3.5 fill-[#FE2C55]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold">{product.discount || "15% OFF"}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#00B2B2]/10 px-1.5 py-0.5 rounded text-[#00B2B2] min-w-fit">
                <span className="text-[10px] font-bold">Frete grátis</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
               {product.rating && (
                 <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-[#FFBF00] fill-[#FFBF00]" />
                    <span className="text-[#161823] text-[12px] font-bold">{product.rating}</span>
                 </div>
               )}
               <span className="text-[#A7A8AD] text-[12px] h-full flex items-center">
                 {product.rating && <span className="mx-1 opacity-30">|</span>}
                 {formatSoldCount(product.soldCount)} vendido(s)
               </span>
            </div>
            <div className="flex items-end justify-between mt-auto w-full pt-1">
              <div className="flex flex-col gap-0.5">
                 <div className="flex items-baseline gap-0.5 text-[#FE2C55] font-bold">
                    <span className="text-[14px] self-start mt-1">R$</span>
                    <span className="text-[24px] leading-none tracking-tighter">
                      {Math.floor(product.kits?.[1]?.price || product.price || 0)}
                    </span>
                    <span className="text-[14px] self-start mt-1">
                      ,{( ((product.kits?.[1]?.price || product.price || 0) % 1).toFixed(2).split('.')[1] || '00' )}
                    </span>
                 </div>
                 <span className="text-[#A7A8AD] text-[12px] line-through font-normal">
                   R$ {(product.kits?.[1]?.originalPrice || product.originalPrice || (product.price || 0) * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </span>
              </div>
              <div className="flex justify-end pr-1 shrink-0 mb-0.5">
                <div className="flex h-[28px] rounded overflow-hidden shadow-[0_1px_2px_rgba(254,44,85,0.1)]">
                  <button 
                    className="bg-[#FE2C55]/10 w-[38px] flex items-center justify-center active:bg-[#FE2C55]/20 transition-colors"
                    onClick={handleAddToCart}
                    title="Adicionar ao carrinho"
                  >
                    <CartPlusIcon className="w-[24px] h-[24px] text-[#FE2C55]" strokeWidth={1.5} />
                  </button>
                  <button 
                    className="bg-[#FE2C55] text-white px-3 font-bold text-[13px] active:bg-[#E6284D] transition-colors"
                    onClick={handleBuyNow}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col cursor-pointer active:opacity-85 transition-opacity"
      onClick={() => onClick?.(product)}
    >
      <div className="aspect-square relative flex items-center justify-center bg-[#F8F8F8] rounded-lg overflow-hidden mb-2">
        {(product.carouselImages?.length > 0 || product.image) ? (
          <img 
            src={product.carouselImages?.[0] || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/logo.png";
            }}
          />
        ) : (
          <Package className="w-12 h-12 text-[#CED0D4]" />
        )}
        {product.ranking && styles && (
          <div className={`absolute top-0 left-0 ${styles.bg} ${styles.text} text-[12px] font-bold w-6 h-7 rounded-br-lg flex items-center justify-center`}>
            {styles.label}
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 px-0.5">
        <h3 className="text-[#161823] text-[13px] leading-snug line-clamp-2 min-h-[36px] mb-1 font-medium select-none">
          {product.name || "Produto sem nome"}
        </h3>
        
        <div className="flex items-center gap-1 mb-1.5 whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-0.5 bg-[#FE2C55]/10 px-1 py-0.5 text-[#FE2C55] rounded-[2px] shrink-0">
            <Ticket className="w-3 h-3 fill-[#FE2C55]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold leading-none mt-[1px]">{product.discount || "15% OFF"}</span>
          </div>
          <div className="flex items-center gap-0.5 bg-[#00B2B2]/10 px-1 py-0.5 text-[#00B2B2] rounded-[2px] shrink-0">
            <span className="text-[10px] font-bold leading-none mt-[1px]">Frete grátis</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-0.5">
          <div className="text-[#FE2C55] font-bold text-[15px] leading-tight flex items-center">
            <span>R$ {(product.kits?.[1]?.price || product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <span className="text-[#A7A8AD] text-[11px] line-through font-normal leading-tight">
            R$ {(product.kits?.[1]?.originalPrice || product.originalPrice || (product.price || 0) * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          
          <span className="text-[#A7A8AD] text-[11px] font-normal leading-tight mt-0.5">
            {formatSoldCount(product.soldCount)} vendido(s)
          </span>
        </div>
      </div>
    </div>
  );
}


