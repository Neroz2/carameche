
import { useInventory } from "@/hooks/useInventory";
import { useCart } from "@/context/CartContext";
import Loader from "@/components/ui/Loader";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryGrid from "@/components/inventory/InventoryGrid";
import InventoryList from "@/components/inventory/InventoryList";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryPagination from "@/components/inventory/InventoryPagination";
import InventoryEmpty from "@/components/inventory/InventoryEmpty";
import InventoryContent from "@/components/inventory/InventoryContent";
import { memo } from "react";

const Inventory = () => {
  const {
    cards,
    series,
    loading,
    seriesLoading,
    totalCards,
    page,
    setPage,
    pageSize,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    filterOptions,
    setFilterOptions,
    isFilterOpen,
    setIsFilterOpen,
    clearFilters,
    setSearchParams
  } = useInventory();
  
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-background/50">
      <InventoryHeader 
        totalCards={totalCards}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        sortOption={sortOption}
        setSortOption={setSortOption}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        setSearchParams={setSearchParams}
      />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 mt-2 relative">
        <InventoryFilters 
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          clearFilters={clearFilters}
          series={series}
          seriesLoading={seriesLoading}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />

        <InventoryContent
          loading={loading}
          cards={cards}
          viewMode={viewMode}
          addToCart={addToCart}
          clearFilters={clearFilters}
          page={page}
          setPage={setPage}
          totalCards={totalCards}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default memo(Inventory);
