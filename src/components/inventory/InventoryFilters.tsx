
import React from "react";
import { FilterOptions, PokemonSeries } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, X } from "lucide-react";
import Button from "@/components/common/Button";
import Loader from "@/components/ui/Loader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const ALL_RARITIES = [
  'Common', 
  'Uncommon', 
  'Rare', 
  'Holo Rare', 
  'Rare Holo',
  'Ultra Rare', 
  'Secret Rare', 
  'Promo',
  'Amazing Rare',
  'Rare BREAK',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Holo LV.X',
  'Rare Holo Star',
  'Rare Holo V',
  'Rare Holo VMAX',
  'Rare Holo VSTAR',
  'Rare Prime',
  'Rare Prism Star',
  'Rare Shiny',
  'Rare Shiny GX',
  'Rare Ultra',
  'Legend',
  'Radiant Rare',
  'Illustration Rare',
  'Special Illustration Rare',
  'Trainer Gallery Rare',
  'ACE SPEC'
];

const ALL_CONDITIONS = ["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played"];

const ALL_LANGUAGES = ["EN", "FR", "JP", "DE", "IT", "ES"];

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

  // Organiser les séries par blocs
  const seriesBlocks = React.useMemo(() => {
    const blocks: Record<string, PokemonSeries[]> = {
      "Scarlet & Violet": [],
      "Sword & Shield": [],
      "Sun & Moon": [],
      "XY": [],
      "Black & White": [],
      "HeartGold & SoulSilver": [],
      "Platinum": [],
      "Diamond & Pearl": [],
      "EX Series": [],
      "Classic": [],
      "Autres": []
    };

    if (series && series.length > 0) {
      series.forEach(serie => {
        if (serie.name.includes("Scarlet & Violet")) {
          blocks["Scarlet & Violet"].push(serie);
        } else if (serie.name.includes("Sword & Shield") || serie.name.startsWith("SWSH")) {
          blocks["Sword & Shield"].push(serie);
        } else if (serie.name.includes("Sun & Moon") || serie.name.startsWith("SM")) {
          blocks["Sun & Moon"].push(serie);
        } else if (serie.name.includes("XY") || serie.name.startsWith("XY")) {
          blocks["XY"].push(serie);
        } else if (serie.name.includes("Black & White") || serie.name.startsWith("BW")) {
          blocks["Black & White"].push(serie);
        } else if (serie.name.includes("HeartGold") || serie.name.includes("SoulSilver") || serie.name.includes("Call of Legends")) {
          blocks["HeartGold & SoulSilver"].push(serie);
        } else if (serie.name.includes("Platinum")) {
          blocks["Platinum"].push(serie);
        } else if (serie.name.includes("Diamond & Pearl") || serie.name.includes("DP")) {
          blocks["Diamond & Pearl"].push(serie);
        } else if (serie.name.includes("EX") || serie.name.includes("Aquapolis") || serie.name.includes("Skyridge") || serie.name.includes("Expedition")) {
          blocks["EX Series"].push(serie);
        } else if (serie.name.includes("Base Set") || serie.name.includes("Team Rocket") || serie.name.includes("Jungle") || serie.name.includes("Fossil") || serie.name.includes("Gym") || serie.name.includes("Neo")) {
          blocks["Classic"].push(serie);
        } else {
          blocks["Autres"].push(serie);
        }
      });
    }

    // Filtrer les blocs vides
    return Object.entries(blocks).filter(([_, blockSeries]) => blockSeries.length > 0);
  }, [series]);

  const renderDesktopFilters = () => (
    <div className="hidden lg:block w-72 space-y-6">
      <div className="bg-card rounded-lg border p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="font-semibold text-lg mb-5 text-primary">Filtres</h3>
        
        <div className="mb-5">
          <label htmlFor="search" className="text-sm font-medium mb-2 block text-foreground">
            Recherche
          </label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Nom de carte..."
              className="pl-9"
              value={filterOptions.search}
              onChange={handleSearchInput}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
        </div>
        
        <Accordion type="multiple" defaultValue={["series"]} className="space-y-2">
          <AccordionItem value="series" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              Série {seriesLoading && "(chargement...)"}
            </AccordionTrigger>
            <AccordionContent>
              {seriesLoading ? (
                <div className="py-2 flex justify-center">
                  <Loader size="sm" />
                </div>
              ) : (
                <ScrollArea className="h-60 pr-4">
                  <div className="space-y-4">
                    {seriesBlocks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucune série trouvée</p>
                    ) : (
                      seriesBlocks.map(([blockName, blockSeries]) => (
                        <div key={blockName} className="space-y-1.5">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 px-1">{blockName}</h4>
                          {blockSeries.map((serie) => (
                            <div key={serie.id} className="flex items-center group hover:bg-accent/30 rounded-md p-1 transition-colors">
                              <Checkbox
                                id={`series-${serie.id}`}
                                className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                                className="text-sm cursor-pointer truncate text-foreground group-hover:text-foreground"
                                title={serie.name}
                              >
                                {serie.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              Plage de prix
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center space-x-2 py-2">
                <Input
                  type="number"
                  placeholder="Min"
                  step="0.01"
                  min="0"
                  className="w-full"
                  value={filterOptions.priceMin || ""}
                  onChange={(e) => setFilterOptions(prev => ({
                    ...prev,
                    priceMin: parseFloat(e.target.value) || 0
                  }))}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  step="0.01"
                  min="0"
                  className="w-full"
                  value={filterOptions.priceMax || ""}
                  onChange={(e) => setFilterOptions(prev => ({
                    ...prev,
                    priceMax: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="rarity" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              Rareté
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-60 pr-4">
                <div className="space-y-1.5 py-2">
                  {ALL_RARITIES.map((rarity) => (
                    <div key={rarity} className="flex items-center group hover:bg-accent/30 rounded-md p-1 transition-colors">
                      <Checkbox
                        id={`rarity-${rarity}`}
                        className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                      <label htmlFor={`rarity-${rarity}`} className="text-sm cursor-pointer group-hover:text-foreground">
                        {rarity}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="condition" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              État
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1.5 py-2">
                {ALL_CONDITIONS.map((condition) => (
                  <div key={condition} className="flex items-center group hover:bg-accent/30 rounded-md p-1 transition-colors">
                    <Checkbox
                      id={`condition-${condition}`}
                      className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                    <label htmlFor={`condition-${condition}`} className="text-sm cursor-pointer group-hover:text-foreground">
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="language" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              Langue
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1.5 py-2">
                {ALL_LANGUAGES.map((language) => (
                  <div key={language} className="flex items-center group hover:bg-accent/30 rounded-md p-1 transition-colors">
                    <Checkbox
                      id={`language-${language}`}
                      className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                    <label htmlFor={`language-${language}`} className="text-sm cursor-pointer group-hover:text-foreground">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        language === 'FR' ? 'bg-blue-500' :
                        language === 'JP' ? 'bg-red-500' :
                        language === 'EN' ? 'bg-green-500' :
                        language === 'DE' ? 'bg-yellow-500' :
                        language === 'IT' ? 'bg-emerald-500' : 
                        'bg-orange-500'
                      }`}></span>
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="special" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              Caractéristiques spéciales
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 py-2">
                <div className="flex items-center justify-between px-1">
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
                
                <div className="flex items-center justify-between px-1">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          fullWidth 
          className="mt-5"
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );

  const renderMobileFilters = () => (
    isFilterOpen && (
      <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in">
        <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg">Filtres</h3>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-accent/50 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="mobile-search" className="text-sm font-medium mb-2 block">
                Recherche
              </label>
              <div className="relative">
                <Input
                  id="mobile-search"
                  type="text"
                  placeholder="Nom de carte..."
                  className="pl-9"
                  value={filterOptions.search}
                  onChange={handleSearchInput}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
            </div>
            
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="mobile-price" className="border-b pb-2">
                <AccordionTrigger className="py-2 hover:no-underline">
                  Plage de prix
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center space-x-2 py-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      step="0.01"
                      min="0"
                      className="w-full"
                      value={filterOptions.priceMin || ""}
                      onChange={(e) => setFilterOptions(prev => ({
                        ...prev,
                        priceMin: parseFloat(e.target.value) || 0
                      }))}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      step="0.01"
                      min="0"
                      className="w-full"
                      value={filterOptions.priceMax || ""}
                      onChange={(e) => setFilterOptions(prev => ({
                        ...prev,
                        priceMax: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mobile-series" className="border-b pb-2">
                <AccordionTrigger className="py-2 hover:no-underline">
                  Séries
                </AccordionTrigger>
                <AccordionContent>
                  {seriesLoading ? (
                    <div className="py-4 flex justify-center">
                      <Loader size="md" />
                    </div>
                  ) : (
                    <ScrollArea className="h-52 pr-2">
                      <div className="space-y-4 py-2">
                        {seriesBlocks.map(([blockName, blockSeries]) => (
                          <div key={`mobile-${blockName}`} className="space-y-1.5">
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 px-1">{blockName}</h4>
                            {blockSeries.map((serie) => (
                              <div key={`mobile-${serie.id}`} className="flex items-center">
                                <Checkbox
                                  id={`mobile-series-${serie.id}`}
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
                                <label htmlFor={`mobile-series-${serie.id}`} className="text-sm">
                                  {serie.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mobile-rarity" className="border-b pb-2">
                <AccordionTrigger className="py-2 hover:no-underline">
                  Rareté
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-52 pr-2">
                    <div className="space-y-2 py-2">
                      {ALL_RARITIES.map((rarity) => (
                        <div key={`mobile-${rarity}`} className="flex items-center">
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
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mobile-condition" className="border-b pb-2">
                <AccordionTrigger className="py-2 hover:no-underline">
                  État
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1.5 py-2">
                    {ALL_CONDITIONS.map((condition) => (
                      <div key={condition} className="flex items-center group hover:bg-accent/30 rounded-md p-1 transition-colors">
                        <Checkbox
                          id={`mobile-condition-${condition}`}
                          className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                        <label htmlFor={`mobile-condition-${condition}`} className="text-sm cursor-pointer group-hover:text-foreground">
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mobile-language" className="border-b pb-2">
                <AccordionTrigger className="py-2 hover:no-underline">
                  Langue
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1.5 py-2">
                    {ALL_LANGUAGES.map((language) => (
                      <div key={language} className="flex items-center group hover:bg-accent/30 rounded-md p-1 transition-colors">
                        <Checkbox
                          id={`mobile-language-${language}`}
                          className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                        <label htmlFor={`mobile-language-${language}`} className="text-sm cursor-pointer group-hover:text-foreground">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            language === 'FR' ? 'bg-blue-500' :
                            language === 'JP' ? 'bg-red-500' :
                            language === 'EN' ? 'bg-green-500' :
                            language === 'DE' ? 'bg-yellow-500' :
                            language === 'IT' ? 'bg-emerald-500' : 
                            'bg-orange-500'
                          }`}></span>
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
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
