
import React from "react";
import { FilterOptions, PokemonSeries } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, X } from "lucide-react";
import Button from "@/components/common/Button";
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
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(prev => ({
      ...prev,
      search: event.target.value
    }));
  };

  // Desktop sidebar filters
  const renderDesktopFilters = () => (
    <div className="hidden lg:block w-64 space-y-6">
      <div className="bg-card rounded-lg border p-4">
        <h3 className="font-medium mb-4">Filtres</h3>
        
        <div className="mb-4">
          <label htmlFor="search" className="text-sm font-medium mb-1 block">
            Recherche
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Nom de carte..."
              className="w-full p-2 pl-8 rounded-md border border-input text-sm"
              value={filterOptions.search}
              onChange={handleSearchInput}
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Série {seriesLoading && "(chargement...)"}
          </label>
          {seriesLoading ? (
            <div className="py-2 flex justify-center">
              <Loader size="sm" />
            </div>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {series.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune série trouvée</p>
              ) : (
                series.map((serie) => (
                  <div key={serie.id} className="flex items-center">
                    <Checkbox
                      id={`series-${serie.id}`}
                      className="mr-2"
                      checked={filterOptions.series.includes(serie.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilterOptions(prev => ({
                            ...prev,
                            series: [...prev.series, serie.name]
                          }));
                        } else {
                          setFilterOptions(prev => ({
                            ...prev,
                            series: prev.series.filter(s => s !== serie.name)
                          }));
                        }
                      }}
                    />
                    <label 
                      htmlFor={`series-${serie.id}`} 
                      className="text-sm cursor-pointer truncate"
                      title={serie.name}
                    >
                      {serie.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Plage de prix
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 rounded-md border border-input text-sm"
              value={filterOptions.priceMin || ""}
              onChange={(e) => setFilterOptions(prev => ({
                ...prev,
                priceMin: Number(e.target.value)
              }))}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 rounded-md border border-input text-sm"
              value={filterOptions.priceMax || ""}
              onChange={(e) => setFilterOptions(prev => ({
                ...prev,
                priceMax: Number(e.target.value)
              }))}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Rareté
          </label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Promo"].map((rarity) => (
              <div key={rarity} className="flex items-center">
                <Checkbox
                  id={`rarity-${rarity}`}
                  className="mr-2"
                  checked={filterOptions.rarity.includes(rarity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilterOptions(prev => ({
                        ...prev,
                        rarity: [...prev.rarity, rarity]
                      }));
                    } else {
                      setFilterOptions(prev => ({
                        ...prev,
                        rarity: prev.rarity.filter(r => r !== rarity)
                      }));
                    }
                  }}
                />
                <label htmlFor={`rarity-${rarity}`} className="text-sm cursor-pointer">
                  {rarity}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            État
          </label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played"].map((condition) => (
              <div key={condition} className="flex items-center">
                <Checkbox
                  id={`condition-${condition}`}
                  className="mr-2"
                  checked={filterOptions.condition.includes(condition)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilterOptions(prev => ({
                        ...prev,
                        condition: [...prev.condition, condition]
                      }));
                    } else {
                      setFilterOptions(prev => ({
                        ...prev,
                        condition: prev.condition.filter(c => c !== condition)
                      }));
                    }
                  }}
                />
                <label htmlFor={`condition-${condition}`} className="text-sm cursor-pointer">
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Langue
          </label>
          <div className="space-y-1">
            {["EN", "FR", "JP", "DE", "IT", "ES"].map((language) => (
              <div key={language} className="flex items-center">
                <Checkbox
                  id={`language-${language}`}
                  className="mr-2"
                  checked={filterOptions.language.includes(language)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilterOptions(prev => ({
                        ...prev,
                        language: [...prev.language, language]
                      }));
                    } else {
                      setFilterOptions(prev => ({
                        ...prev,
                        language: prev.language.filter(l => l !== language)
                      }));
                    }
                  }}
                />
                <label htmlFor={`language-${language}`} className="text-sm cursor-pointer">
                  {language}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4 space-y-3">
          <label className="text-sm font-medium mb-1 block">
            Caractéristiques spéciales
          </label>
          
          <div className="flex items-center justify-between">
            <label htmlFor="is-reverse" className="text-sm cursor-pointer">
              Reverse
            </label>
            <div className="relative inline-flex items-center cursor-pointer" onClick={() => {
              setFilterOptions(prev => ({
                ...prev,
                isReverse: prev.isReverse === true ? null : true
              }));
            }}>
              <input 
                type="checkbox" 
                id="is-reverse" 
                className="sr-only" 
                checked={filterOptions.isReverse === true}
                onChange={() => {}}
              />
              <div className={`w-10 h-5 rounded-full transition ${
                filterOptions.isReverse ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
              <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-transform ${
                filterOptions.isReverse ? 'transform translate-x-5' : 'translate-x-1'
              }`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="is-promo" className="text-sm cursor-pointer">
              Promo
            </label>
            <div className="relative inline-flex items-center cursor-pointer" onClick={() => {
              setFilterOptions(prev => ({
                ...prev,
                isPromo: prev.isPromo === true ? null : true
              }));
            }}>
              <input 
                type="checkbox" 
                id="is-promo" 
                className="sr-only" 
                checked={filterOptions.isPromo === true}
                onChange={() => {}}
              />
              <div className={`w-10 h-5 rounded-full transition ${
                filterOptions.isPromo ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
              <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-transform ${
                filterOptions.isPromo ? 'transform translate-x-5' : 'translate-x-1'
              }`}></div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          fullWidth 
          className="mt-2"
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );

  // Mobile filters modal
  const renderMobileFilters = () => (
    isFilterOpen && (
      <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
        <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg">Filtres</h3>
            <button onClick={() => setIsFilterOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="mobile-search" className="text-sm font-medium mb-1 block">
                Recherche
              </label>
              <div className="relative">
                <input
                  id="mobile-search"
                  type="text"
                  placeholder="Nom de carte..."
                  className="w-full p-2 pl-8 rounded-md border border-input"
                  value={filterOptions.search}
                  onChange={handleSearchInput}
                />
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Plage de prix
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 rounded-md border border-input"
                  value={filterOptions.priceMin || ""}
                  onChange={(e) => setFilterOptions(prev => ({
                    ...prev,
                    priceMin: Number(e.target.value)
                  }))}
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 rounded-md border border-input"
                  value={filterOptions.priceMax || ""}
                  onChange={(e) => setFilterOptions(prev => ({
                    ...prev,
                    priceMax: Number(e.target.value)
                  }))}
                />
              </div>
            </div>
            
            <div className="flex space-y-1">
              <div className="flex items-center">
                <label className="text-sm font-medium mb-1 block">
                  Rareté
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Promo"].map((rarity) => (
                    <div key={rarity} className="flex items-center">
                      <Checkbox
                        id={`mobile-rarity-${rarity}`}
                        className="mr-2"
                        checked={filterOptions.rarity.includes(rarity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterOptions(prev => ({
                              ...prev,
                              rarity: [...prev.rarity, rarity]
                            }));
                          } else {
                            setFilterOptions(prev => ({
                              ...prev,
                              rarity: prev.rarity.filter(r => r !== rarity)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={`mobile-rarity-${rarity}`} className="text-sm">
                        {rarity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="text-sm font-medium mb-1 block">
                  État
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played"].map((condition) => (
                    <div key={condition} className="flex items-center">
                      <Checkbox
                        id={`mobile-condition-${condition}`}
                        className="mr-2"
                        checked={filterOptions.condition.includes(condition)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterOptions(prev => ({
                              ...prev,
                              condition: [...prev.condition, condition]
                            }));
                          } else {
                            setFilterOptions(prev => ({
                              ...prev,
                              condition: prev.condition.filter(c => c !== condition)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={`mobile-condition-${condition}`} className="text-sm">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="text-sm font-medium mb-1 block">
                  Langue
                </label>
                <div className="space-y-1">
                  {["EN", "FR", "JP", "DE", "IT", "ES"].map((language) => (
                    <div key={language} className="flex items-center">
                      <Checkbox
                        id={`mobile-language-${language}`}
                        className="mr-2"
                        checked={filterOptions.language.includes(language)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterOptions(prev => ({
                              ...prev,
                              language: [...prev.language, language]
                            }));
                          } else {
                            setFilterOptions(prev => ({
                              ...prev,
                              language: prev.language.filter(l => l !== language)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={`mobile-language-${language}`} className="text-sm">
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button 
                onClick={() => {
                  clearFilters();
                  setIsFilterOpen(false);
                }} 
                variant="outline" 
                className="flex-1"
              >
                Réinitialiser
              </Button>
              <Button 
                onClick={() => setIsFilterOpen(false)} 
                className="flex-1"
              >
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {renderDesktopFilters()}
      {renderMobileFilters()}
    </>
  );
};

export default InventoryFilters;
