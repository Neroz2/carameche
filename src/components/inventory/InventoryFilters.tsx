import React, { useState } from "react";
import { X, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { FilterOptions, PokemonSeries } from "@/lib/types";
import seriesTranslations from "@/data/series-translations.json";
import Loader from "@/components/ui/Loader";

interface InventoryFiltersProps {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  clearFilters: () => void;
  series: PokemonSeries[];
  seriesLoading: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  filterOptions,
  setFilterOptions,
  clearFilters,
  series,
  seriesLoading,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const [priceRange, setPriceRange] = useState({
    min: filterOptions.priceMin,
    max: filterOptions.priceMax,
  });

  const updatePriceRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) numericValue = 0;
    
    setPriceRange((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const applyPriceRange = () => {
    setFilterOptions((prev) => ({
      ...prev,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    }));
  };

  const toggleFilter = (filterType: string, value: string) => {
    setFilterOptions((prev) => {
      const currentFilters = prev[filterType as keyof typeof prev] as string[];
      
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [filterType]: currentFilters.filter((filter) => filter !== value),
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentFilters, value],
        };
      }
    });
  };

  const toggleBooleanFilter = (filterType: keyof FilterOptions) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === null ? true : prev[filterType] === true ? false : null,
    }));
  };

  const getSeriesTranslation = (seriesName: string) => {
    const translations = seriesTranslations.translations as Record<string, { fr: string, logo: string, block?: string }>;
    return {
      fr: translations[seriesName]?.fr || seriesName,
      block: translations[seriesName]?.block || 'Autre'
    };
  };

  const getSeriesByBlock = () => {
    const blockMap: Record<string, { name: string, series: PokemonSeries[] }> = {};
    
    series.forEach(serie => {
      const { block } = getSeriesTranslation(serie.name);
      
      if (!blockMap[block]) {
        blockMap[block] = {
          name: block,
          series: []
        };
      }
      
      blockMap[block].series.push(serie);
    });
    
    Object.keys(blockMap).forEach(block => {
      blockMap[block].series.sort((a, b) => {
        const aName = getSeriesTranslation(a.name).fr;
        const bName = getSeriesTranslation(b.name).fr;
        return aName.localeCompare(bName);
      });
    });
    
    const blockOrder = [
      'Scarlet & Violet',
      'Sword & Shield', 
      'Sun & Moon', 
      'XY', 
      'Black & White', 
      'Diamond & Pearl',
      'EX Series',
      'Autre'
    ];
    
    return Object.keys(blockMap)
      .sort((a, b) => {
        const indexA = blockOrder.indexOf(a);
        const indexB = blockOrder.indexOf(b);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      })
      .map(key => blockMap[key]);
  };
  
  const seriesByBlock = getSeriesByBlock();

  const rarityOptions = [
    "Common",
    "Uncommon",
    "Rare",
    "Holo Rare",
    "Ultra Rare",
    "Secret Rare",
    "Promo",
    "Amazing Rare",
    "Rare BREAK",
    "Rare Holo",
    "Rare Holo EX",
    "Rare Holo GX",
    "Rare Holo LV.X",
    "Rare Holo Star",
    "Rare Holo V",
    "Rare Holo VMAX",
    "Rare Holo VSTAR",
    "Rare Prime",
    "Rare Prism Star",
    "Rare Shiny",
    "Rare Shiny GX",
    "Rare Ultra",
    "Legend",
    "Radiant Rare",
    "Illustration Rare",
    "Special Illustration Rare",
    "Trainer Gallery Rare",
    "ACE SPEC",
  ];

  const conditionOptions = [
    "Near Mint",
    "Excellent",
    "Slightly Played",
    "Moderately Played",
    "Played",
    "Heavily Played",
    "Poor",
  ];

  const languageOptions = [
    "EN",
    "FR",
    "JP",
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg flex items-center"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={20} />
          <span className="ml-2 mr-1 font-medium">Filtres</span>
          {isFilterOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      <div
        className={`w-full lg:w-64 xl:w-72 bg-card border rounded-lg overflow-hidden transition-all duration-300 ease-in-out shadow-md z-50 ${
          isFilterOpen
            ? "fixed inset-0 lg:relative h-full lg:h-auto transform-none lg:transform-none"
            : "fixed bottom-full lg:relative lg:h-auto lg:transform-none"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-card z-10">
          <h3 className="font-medium flex items-center text-foreground">
            <Filter size={18} className="mr-2" /> Filtres
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 border rounded-md"
            >
              Réinitialiser
            </button>
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsFilterOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6">
          <div>
            <h4 className="font-medium text-sm mb-2 text-foreground">Recherche</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-8 pr-4 py-2 border rounded-md focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                value={filterOptions.search}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
              />
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Prix (€)</h4>
            <div className="flex gap-2 items-center">
              <div>
                <label htmlFor="min-price" className="sr-only">
                  Prix minimum
                </label>
                <input
                  id="min-price"
                  type="number"
                  step="0.01"
                  name="min"
                  min="0"
                  placeholder="Min"
                  className="w-full p-2 border rounded-md focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                  value={priceRange.min === 0 ? '' : priceRange.min}
                  onChange={updatePriceRange}
                  onBlur={applyPriceRange}
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div>
                <label htmlFor="max-price" className="sr-only">
                  Prix maximum
                </label>
                <input
                  id="max-price"
                  type="number"
                  step="0.01"
                  name="max"
                  min="0"
                  placeholder="Max"
                  className="w-full p-2 border rounded-md focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
                  value={priceRange.max === 0 ? '' : priceRange.max}
                  onChange={updatePriceRange}
                  onBlur={applyPriceRange}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Séries</h4>
            {seriesLoading ? (
              <div className="flex justify-center py-4">
                <Loader size="sm" />
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {seriesByBlock.map((block) => (
                  <div key={block.name} className="space-y-1">
                    <h5 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">
                      {block.name}
                    </h5>
                    <div className="space-y-1 pl-1">
                      {block.series.map((item) => {
                        const isSelected = filterOptions.series.includes(item.name);
                        const seriesFr = getSeriesTranslation(item.name).fr;
                        
                        return (
                          <div key={item.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`series-${item.id}`}
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={isSelected}
                              onChange={() => toggleFilter("series", item.name)}
                            />
                            <label
                              htmlFor={`series-${item.id}`}
                              className={`text-sm truncate ${
                                isSelected ? "font-medium" : ""
                              }`}
                              title={item.name}
                            >
                              {seriesFr}
                              {seriesFr !== item.name && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({item.name})
                                </span>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Rareté</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {rarityOptions.map((rarity) => (
                <div key={rarity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`rarity-${rarity}`}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={filterOptions.rarity.includes(rarity)}
                    onChange={() => toggleFilter("rarity", rarity)}
                  />
                  <label
                    htmlFor={`rarity-${rarity}`}
                    className={`text-sm ${
                      filterOptions.rarity.includes(rarity) ? "font-medium" : ""
                    }`}
                  >
                    {rarity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Types spéciaux</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filter-reverse"
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={filterOptions.isReverse === true}
                  onChange={() => toggleBooleanFilter("isReverse")}
                />
                <label
                  htmlFor="filter-reverse"
                  className={`text-sm ${
                    filterOptions.isReverse === true ? "font-medium" : ""
                  }`}
                >
                  Reverse
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filter-promo"
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={filterOptions.isPromo === true}
                  onChange={() => toggleBooleanFilter("isPromo")}
                />
                <label
                  htmlFor="filter-promo"
                  className={`text-sm ${
                    filterOptions.isPromo === true ? "font-medium" : ""
                  }`}
                >
                  Promo
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">État</h4>
            <div className="space-y-1">
              {conditionOptions.map((condition) => (
                <div key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`condition-${condition}`}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={filterOptions.condition.includes(condition)}
                    onChange={() => toggleFilter("condition", condition)}
                  />
                  <label
                    htmlFor={`condition-${condition}`}
                    className={`text-sm ${
                      filterOptions.condition.includes(condition)
                        ? "font-medium"
                        : ""
                    }`}
                  >
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Langue</h4>
            <div className="space-y-1">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`language-${language}`}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={filterOptions.language.includes(language)}
                    onChange={() => toggleFilter("language", language)}
                  />
                  <label
                    htmlFor={`language-${language}`}
                    className={`text-sm ${
                      filterOptions.language.includes(language)
                        ? "font-medium"
                        : ""
                    }`}
                  >
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryFilters;
