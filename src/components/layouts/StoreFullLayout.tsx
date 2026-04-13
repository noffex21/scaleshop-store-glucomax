import React, { useState, useMemo } from "react";
import { StoreHeader } from "../store/StoreHeader";
import { StoreTabs } from "../store/StoreTabs";
import { HomeTab } from "../store/HomeTab";
import { ProductsTab } from "../store/ProductsTab";
import { CategoriesTab } from "../store/CategoriesTab";
import { TopProductsScreen } from "../store/TopProductsScreen";
import { useCart } from "@/contexts/CartContext";

interface StoreFullLayoutProps {
  data: any;
  onProductClick: (product: any) => void;
  onBuyNow: (product: any) => void;
  onCartClick?: () => void;
  searchQuery?: string;
}

type StoreTab = "home" | "products" | "categories";

export function StoreFullLayout({ data, onProductClick, onBuyNow, onCartClick, searchQuery }: StoreFullLayoutProps) {
  const [activeTab, setActiveTab] = useState<StoreTab>(searchQuery ? "products" : "home");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [showTopProducts, setShowTopProducts] = useState(false);
  const { cartCount } = useCart();

  // Normalize text to remove accents and special chars
  const normalizeText = (text: string) => {
    return (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    const allProducts = data.storeProducts || [];
    if (!localSearch || !localSearch.trim()) return allProducts;
    
    const q = normalizeText(localSearch);
    return allProducts.filter((p: any) => {
      const name = normalizeText(p.name);
      const productName = normalizeText(p.productName);
      const shortDesc = normalizeText(p.description?.short);
      
      return name.includes(q) || productName.includes(q) || shortDesc.includes(q);
    });
  }, [data.storeProducts, localSearch]);

  const handleSearch = (query: string) => {
    setLocalSearch(query);
    if (query.trim() && activeTab !== "products") {
      setActiveTab("products");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab products={filteredProducts} onProductClick={onProductClick} onBuyNow={onBuyNow} onViewTopProducts={() => setShowTopProducts(true)} />;
      case "products":
        return <ProductsTab products={filteredProducts} onProductClick={onProductClick} onBuyNow={onBuyNow} />;
      case "categories":
        return <CategoriesTab categories={data.categories || []} />;
      default:
        return <HomeTab products={filteredProducts} onProductClick={onProductClick} onBuyNow={onBuyNow} />;
    }
  };

  return (
    <>
      <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen shadow-xl flex flex-col relative overflow-x-hidden">
        <StoreHeader 
          storeName={data.storeName} 
          storeLogo={data.storeLogo} 
          soldCount={data.soldCount} 
          cartCount={cartCount}
          onCartClick={onCartClick}
          onSearch={handleSearch}
          initialSearchQuery={searchQuery}
          storeBackground={data.storeBackground}
          isVerified={data.isVerified}
        />
        
        <StoreTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          showCategories={(data.categories || []).length > 0}
        />
        
        <main className="flex-1 pb-10">
          {renderTabContent()}
        </main>
      </div>

      {showTopProducts && (
        <TopProductsScreen
          products={data.storeProducts || []}
          onBack={() => setShowTopProducts(false)}
          onProductClick={(p) => {
             setShowTopProducts(false);
             onProductClick(p);
          }}
          onBuyNow={(p) => {
             setShowTopProducts(false);
             onBuyNow(p);
          }}
          cartCount={cartCount}
        />
      )}
    </>
  );
}
