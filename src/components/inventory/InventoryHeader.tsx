
import React from "react";
import { FilterOptions, SortOption, ViewMode } from "@/lib/types";
import { Filter, LayoutGrid, LayoutList, X } from "lucide-react";
import Button from "@/components/common/Button";

interface InventoryHeaderProps {
  totalCards: number;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchParams: (params: any) => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  totalCards,
  filterOptions,
  setFilterOptions,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  isFilterOpen,
  setIsFilterOpen,
  setSearchParams
}) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  return (
    <>
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Inventaire des cartes</h1>
          <p className="text-muted-foreground mt-1">
            {totalCards} cartes disponibles
            {filterOptions.series.length > 0 && ` dans la série ${filterOptions.series[0]}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="lg:hidden flex items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} className="mr-2" />
            Filtres
          </Button>
          
          {filterOptions.series.length > 0 && (
            <div className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm">
              <span className="mr-2">Série: {filterOptions.series[0]}</span>
              <button 
                onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    series: []
                  }));
                  setSearchParams({});
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="flex items-center border rounded-md overflow-hidden">
            <button 
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
              onClick={() => setViewMode('grid')}
              title="Vue en grille"
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
              onClick={() => setViewMode('list')}
              title="Vue en liste"
            >
              <LayoutList size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center w-full sm:w-auto">
          <label htmlFor="sort" className="mr-2 text-sm whitespace-nowrap">
            Trier par:
          </label>
          <select
            id="sort"
            className="p-2 rounded-md border border-input text-sm bg-background"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="number-asc">Numéro (croissant)</option>
            <option value="number-desc">Numéro (décroissant)</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
            <option value="price-asc">Prix (croissant)</option>
            <option value="price-desc">Prix (décroissant)</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default InventoryHeader;
