
import React, { memo } from "react";
import { PokemonCard, ViewMode } from "@/lib/types";
import Loader from "@/components/ui/Loader";
import InventoryGrid from "@/components/inventory/InventoryGrid";
import InventoryList from "@/components/inventory/InventoryList";
import InventoryPagination from "@/components/inventory/InventoryPagination";
import InventoryEmpty from "@/components/inventory/InventoryEmpty";

interface InventoryContentProps {
  loading: boolean;
  cards: PokemonCard[];
  viewMode: ViewMode;
  addToCart: (card: PokemonCard, quantity: number) => void;
  clearFilters: () => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalCards: number;
  pageSize: number;
}

const InventoryContent: React.FC<InventoryContentProps> = ({
  loading,
  cards,
  viewMode,
  addToCart,
  clearFilters,
  page,
  setPage,
  totalCards,
  pageSize
}) => {
  if (loading) {
    return (
      <div className="flex-1 w-full">
        <div className="min-h-[500px] flex items-center justify-center">
          <Loader size="lg" text="Chargement des cartes..." />
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 w-full">
        <InventoryEmpty clearFilters={clearFilters} />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <div className="pb-2">
        {viewMode === "grid" ? (
          <InventoryGrid cards={cards} addToCart={addToCart} />
        ) : (
          <InventoryList cards={cards} />
        )}
      </div>

      <div className="mt-8">
        <InventoryPagination 
          page={page}
          setPage={setPage}
          totalCards={totalCards}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default memo(InventoryContent);
