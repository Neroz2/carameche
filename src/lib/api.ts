import { PokemonSeries, PokemonCard, FilterOptions } from './types';

const CARDTRADER_API_TOKEN = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTM5MzgiLCJhdWQiOiJhcHA6MTM5MzgiLCJleHAiOjQ4OTU2MzQ3MTcsImp0aSI6IjQxMjA3NmNjLTcyZTEtNDljOC1iODA2LTE3OTJiNmU3N2JhMyIsImlhdCI6MTczOTk2MTExNywibmFtZSI6Ik5lcm96YnJpY2tzIEFwcCAyMDI1MDIwODE3NDkxOSJ9.PkkEXit3MvxmVij_e5Eyz55k_3EYgQF-2ln9goSfMbQD3mIpDVrSkQa010BfnF9IR1L8fvswAyxk56qiUr2LKm2KXX0iKAvVRR373A3XEDwgNtGGBBAR-rxh8raL1hW8e4AH_bps1tVFTrdZ_W-Odg5egSxLFIxnLgi0a9It5KVeVkjdgLmxYuaCXspgml9TXfgJcJ2GH62izvB5eUsAj4NhobpH5q_Pyfbyw2cJu4HmilQjBSOm4NsmRW7Nd692tNT2semj1Oh1UqV1xel2WewtLaWlUAVHYt2LSMWrEw_kx9Yjk9Kz-rM67tk0nXosKklnIigJpcrmRUXf-O7qJA";
const IMAGE_BASE_URL = "https://www.cardtrader.com/images/blueprint/";

const conditionMapping = {
  'Near Mint': 'Near Mint',
  'Excellent': 'Excellent',
  'Good': 'Slightly Played',
  'Peu joué': 'Moderately Played',
  'Joué': 'Played',
  'très joué': 'Heavily Played',
  'Mauvais': 'Poor',
};

const rarityMapping = {
  'Common': 'Common',
  'Uncommon': 'Uncommon',
  'Rare': 'Rare',
  'Holo Rare': 'Holo Rare',
  'Ultra Rare': 'Ultra Rare',
  'Secret Rare': 'Secret Rare',
  'Promo': 'Promo',
  'Amazing Rare': 'Amazing Rare',
  'Rare BREAK': 'Rare BREAK',
  'Rare Holo': 'Rare Holo',
  'Rare Holo EX': 'Rare Holo EX',
  'Rare Holo GX': 'Rare Holo GX',
  'Rare Holo LV.X': 'Rare Holo LV.X',
  'Rare Holo Star': 'Rare Holo Star',
  'Rare Holo V': 'Rare Holo V',
  'Rare Holo VMAX': 'Rare Holo VMAX',
  'Rare Holo VSTAR': 'Rare Holo VSTAR',
  'Rare Prime': 'Rare Prime',
  'Rare Prism Star': 'Rare Prism Star',
  'Rare Shiny': 'Rare Shiny',
  'Rare Shiny GX': 'Rare Shiny GX',
  'Rare Ultra': 'Rare Ultra',
  'Legend': 'Legend',
  'Radiant Rare': 'Radiant Rare',
  'Illustration Rare': 'Illustration Rare',
  'Special Illustration Rare': 'Special Illustration Rare',
  'Trainer Gallery Rare': 'Trainer Gallery Rare',
  'ACE SPEC': 'ACE SPEC',
};

const expansionMapping: Record<number, string> = {
  2152: 'Silver Lance',
  2153: 'Jet Black Spirit',
  2154: 'Eevee Heroes',
  2155: 'Fusion Strike',
  2156: 'Evolving Skies',
  2157: 'Chilling Reign',
  2158: 'Battle Styles',
  2159: 'Shining Fates',
  2160: 'Vivid Voltage',
  2161: 'Champions Path',
  2162: 'Darkness Ablaze',
  2163: 'Rebel Clash',
  2164: 'Sword & Shield',
  2165: 'Cosmic Eclipse',
  2166: 'Hidden Fates',
  2167: 'Unified Minds',
  2168: 'Unbroken Bonds',
  2169: 'Detective Pikachu',
  2170: 'Team Up',
  2171: 'Scarlet & Violet',
  2172: 'Paldea Evolved',
  2173: 'Obsidian Flames',
  2174: 'Paradox Rift',
  2175: 'Temporal Forces',
  2176: 'Astral Radiance',
  2177: 'Lost Origin',
  2178: 'Silver Tempest',
  2179: 'Crown Zenith',
  2180: 'Brilliant Stars',
  2181: 'Pokémon GO',
};

let expansionsData: Record<number, string> = {};

export const fetchExpansions = async (): Promise<Record<number, string>> => {
  if (Object.keys(expansionsData).length > 0) {
    return expansionsData;
  }

  try {
    console.log("Chargement des expansions depuis l'API...");
    const response = await fetch('https://api.cardtrader.com/api/v2/expansions', {
      headers: {
        'Authorization': `Bearer ${CARDTRADER_API_TOKEN}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Récupération de ${data.length} expansions depuis l'API`);
      
      expansionsData = data.reduce((acc: Record<number, string>, expansion: any) => {
        acc[expansion.id] = expansion.name;
        return acc;
      }, {});
      
      expansionsData = { ...expansionMapping, ...expansionsData };
      
      return expansionsData;
    } else {
      console.error('Échec de la récupération des expansions CardTrader', await response.text());
      return expansionMapping;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des expansions:', error);
    return expansionMapping;
  }
};

export const getExpansionName = async (expansionId: number): Promise<string> => {
  const expansions = await fetchExpansions();
  return expansions[expansionId] || 'Unknown Series';
};

const translationCache: Record<string, string> = {};

const transformCardTraderData = async (data: any[]): Promise<PokemonCard[]> => {
  const expansions = await fetchExpansions();
  
  return Promise.all(data.map(async (item) => {
    const id = `card-${item.id}`;
    const name = item.name_en;
    const number = item.properties_hash.collector_number || 'N/A';
    const expansionId = item.expansion?.id;
    const series = expansions[expansionId] || 'Unknown Series';
    const rarity = rarityMapping[item.properties_hash.pokemon_rarity] || 'Common';
    const condition = conditionMapping[item.properties_hash.condition] || 'Near Mint';
    const price = item.price_cents / 100;
    const stock = item.quantity;
    const language = item.properties_hash.pokemon_language?.toUpperCase() || 'EN';
    const isHolo = !!item.properties_hash.pokemon_holo;
    const isReverse = !!item.properties_hash.pokemon_reverse;
    const isPromo = rarity === 'Promo';
    
    const image = `${IMAGE_BASE_URL}${item.blueprint_id}.jpg`;

    let nameFr;
    try {
      nameFr = await translateCardName(name);
    } catch (error) {
      console.error(`Erreur lors de la traduction de "${name}":`, error);
      nameFr = name;
    }
    
    return {
      id,
      name,
      nameEn: name,
      nameFr,
      number,
      series,
      rarity,
      image,
      price,
      stock,
      condition,
      language,
      isHolo,
      isReverse,
      isPromo,
      expansionId
    };
  }));
};

const extractUniqueSeries = (cards: PokemonCard[]): PokemonSeries[] => {
  const seriesMap = new Map<string, PokemonSeries>();
  
  cards.forEach(card => {
    if (!seriesMap.has(card.series)) {
      seriesMap.set(card.series, {
        id: card.expansionId?.toString() || card.series.toLowerCase().replace(/\s+/g, '-'),
        name: card.series,
        logo: `https://tcg.pokemon.com/assets/img/expansions/${card.series.toLowerCase().replace(/\s+/g, '-')}/logos/fr-fr/logo.png`,
        symbol: `https://tcg.pokemon.com/assets/img/expansions/${card.series.toLowerCase().replace(/\s+/g, '-')}/symbols/symbol.png`,
        releaseDate: new Date().toISOString().split('T')[0],
        totalCards: 0
      });
    }
  });
  
  cards.forEach(card => {
    const series = seriesMap.get(card.series);
    if (series) {
      series.totalCards += 1;
    }
  });
  
  return Array.from(seriesMap.values());
};

let cachedCards: PokemonCard[] = [];
let cachedSeries: PokemonSeries[] = [];

export const fetchPokemonSeries = async (): Promise<PokemonSeries[]> => {
  if (cachedSeries.length > 0) {
    console.log(`Retourne ${cachedSeries.length} séries en cache`);
    return cachedSeries;
  }
  
  console.log("Pas de séries en cache, chargement des cartes pour extraire les séries...");
  
  try {
    if (cachedCards.length === 0) {
      await fetchAllCards();
    }
    
    const series = extractUniqueSeries(cachedCards);
    console.log(`${series.length} séries extraites de toutes les cartes`);
    cachedSeries = series;
    return series;
  } catch (error) {
    console.error("Erreur lors de l'extraction des séries:", error);
    return [];
  }
};

const fetchAllCards = async (): Promise<void> => {
  if (cachedCards.length > 0) {
    return;
  }
  
  try {
    console.log("Chargement de toutes les cartes depuis l'API...");
    const response = await fetch('https://api.cardtrader.com/api/v2/products/export', {
      headers: {
        'Authorization': `Bearer ${CARDTRADER_API_TOKEN}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`${data.length} cartes récupérées depuis l'API CardTrader`);
      cachedCards = await transformCardTraderData(data);
      console.log(`${cachedCards.length} cartes transformées et mises en cache`);
    } else {
      console.warn('Échec de la requête CardTrader, utilisation des données mockées');
    }
  } catch (error) {
    console.error("Erreur lors du chargement des cartes:", error);
  }
};

export const fetchPokemonCards = async (
  seriesFilter?: string,
  page: number = 1,
  pageSize: number = 100,
  filterOptions?: Partial<FilterOptions>
): Promise<{ cards: PokemonCard[], total: number }> => {
  if (cachedCards.length === 0) {
    await fetchAllCards();
  }
  
  let filteredCards = cachedCards;
  
  if (filterOptions || seriesFilter) {
    filteredCards = cachedCards.filter(card => {
      if (seriesFilter && card.series.toLowerCase() !== seriesFilter.toLowerCase()) {
        return false;
      }
      
      if (filterOptions) {
        if (filterOptions.search && filterOptions.search.trim() !== '') {
          const searchLower = filterOptions.search.toLowerCase();
          const nameMatch = card.name.toLowerCase().includes(searchLower);
          const nameFrMatch = card.nameFr.toLowerCase().includes(searchLower);
          
          if (!nameMatch && !nameFrMatch) {
            return false;
          }
        }
        
        if (filterOptions.series && filterOptions.series.length > 0 && 
            !filterOptions.series.some(s => card.series.toLowerCase() === s.toLowerCase())) {
          return false;
        }
        
        if (filterOptions.rarity && filterOptions.rarity.length > 0 && 
            !filterOptions.rarity.includes(card.rarity)) {
          return false;
        }
        
        if (filterOptions.condition && filterOptions.condition.length > 0 && 
            !filterOptions.condition.includes(card.condition)) {
          return false;
        }
        
        if (filterOptions.language && filterOptions.language.length > 0 && 
            !filterOptions.language.includes(card.language)) {
          return false;
        }
        
        if (filterOptions.priceMin !== undefined && filterOptions.priceMin > 0 && card.price < filterOptions.priceMin) {
          return false;
        }
        if (filterOptions.priceMax !== undefined && filterOptions.priceMax > 0 && card.price > filterOptions.priceMax) {
          return false;
        }
        
        if (filterOptions.isReverse !== undefined && filterOptions.isReverse !== null && card.isReverse !== filterOptions.isReverse) {
          return false;
        }
        if (filterOptions.isPromo !== undefined && filterOptions.isPromo !== null && card.isPromo !== filterOptions.isPromo) {
          return false;
        }
        
        if (filterOptions.expansionId && card.expansionId !== filterOptions.expansionId) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  const total = filteredCards.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedCards = filteredCards.slice(start, end);
  
  return { cards: paginatedCards, total };
};

export const fetchCardDetails = async (cardId: string): Promise<PokemonCard | null> => {
  if (cachedCards.length > 0) {
    const card = cachedCards.find(card => card.id === cardId);
    if (card) return card;
  }
  
  try {
    const { cards } = await fetchPokemonCards();
    return cards.find(card => card.id === cardId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la carte:', error);
    return null;
  }
};

export const translateCardName = async (englishName: string): Promise<string> => {
  if (translationCache[englishName]) {
    return translationCache[englishName];
  }
  
  try {
    const normalizedName = englishName.toLowerCase()
      .replace(/\s+v$/i, '')
      .replace(/\s+vmax$/i, '')
      .replace(/\s+gx$/i, '')
      .replace(/\s+ex$/i, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${normalizedName}`);
    
    if (response.ok) {
      const data = await response.json();
      const frenchName = data.names.find((nameObj: any) => nameObj.language.name === 'fr')?.name;
      
      if (frenchName) {
        let suffixedName = frenchName;
        if (/\s+v$/i.test(englishName)) suffixedName += ' V';
        if (/\s+vmax$/i.test(englishName)) suffixedName += ' VMAX';
        if (/\s+gx$/i.test(englishName)) suffixedName += ' GX';
        if (/\s+ex$/i.test(englishName)) suffixedName += ' EX';
        
        translationCache[englishName] = suffixedName;
        return suffixedName;
      }
    }
    
    translationCache[englishName] = englishName;
    return englishName;
  } catch (error) {
    console.error(`Erreur lors de la traduction de "${englishName}":`, error);
    translationCache[englishName] = englishName;
    return englishName;
  }
};
