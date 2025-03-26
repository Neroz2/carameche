
import { PokemonSeries, PokemonCard } from './types';

const CARDTRADER_API_TOKEN = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTM5MzgiLCJhdWQiOiJhcHA6MTM5MzgiLCJleHAiOjQ4OTU2MzQ3MTcsImp0aSI6IjQxMjA3NmNjLTcyZTEtNDljOC1iODA2LTE3OTJiNmU3N2JhMyIsImlhdCI6MTczOTk2MTExNywibmFtZSI6Ik5lcm96YnJpY2tzIEFwcCAyMDI1MDIwODE3NDkxOSJ9.PkkEXit3MvxmVij_e5Eyz55k_3EYgQF-2ln9goSfMbQD3mIpDVrSkQa010BfnF9IR1L8fvswAyxk56qiUr2LKm2KXX0iKAvVRR373A3XEDwgNtGGBBAR-rxh8raL1hW8e4AH_bps1tVFTrdZ_W-Odg5egSxLFIxnLgi0a9It5KVeVkjdgLmxYuaCXspgml9TXfgJcJ2GH62izvB5eUsAj4NhobpH5q_Pyfbyw2cJu4HmilQjBSOm4NsmRW7Nd692tNT2semj1Oh1UqV1xel2WewtLaWlUAVHYt2LSMWrEw_kx9Yjk9Kz-rM67tk0nXosKklnIigJpcrmRUXf-O7qJA";
const IMAGE_BASE_URL = "https://www.cardtrader.com/images/blueprint/";

// Mapping pour les conditions de carte
const conditionMapping = {
  'Near Mint': 'Near Mint',
  'Excellent': 'Excellent',
  'Good': 'Good',
  'Light Played': 'Light Played',
  'Played': 'Played',
  'Poor': 'Played',
};

// Mapping pour les raretés de carte
const rarityMapping = {
  'Common': 'Common',
  'Uncommon': 'Uncommon',
  'Rare': 'Rare',
  'Holo Rare': 'Ultra Rare',
  'Ultra Rare': 'Ultra Rare',
  'Secret Rare': 'Secret Rare',
  'Promo': 'Promo',
};

// Mapping des séries basé sur l'ID d'expansion
const expansionMapping: Record<number, string> = {
  2152: 'Silver Lance',
  2153: 'Jet Black Spirit',
  2154: 'Eevee Heroes',
  // Ajoutez d'autres expansions selon les besoins
};

// Cache pour les traductions de noms
const translationCache: Record<string, string> = {};

// Fonction pour transformer les données de l'API CardTrader en notre format
const transformCardTraderData = (data: any[]): PokemonCard[] => {
  return data.map((item) => {
    const id = `card-${item.id}`;
    const name = item.name_en;
    const number = item.properties_hash.collector_number || 'N/A';
    const expansionId = item.expansion?.id;
    const series = expansionMapping[expansionId] || 'Unknown Series';
    const rarity = rarityMapping[item.properties_hash.pokemon_rarity] || 'Common';
    const condition = conditionMapping[item.properties_hash.condition] || 'Near Mint';
    const price = item.price_cents / 100; // Convertir les centimes en euros
    const stock = item.quantity;
    const language = item.properties_hash.pokemon_language?.toUpperCase() || 'EN';
    const isHolo = !!item.properties_hash.pokemon_holo;
    const isReverse = !!item.properties_hash.pokemon_reverse;
    const isPromo = rarity === 'Promo';
    
    // Utiliser l'ID du blueprint pour l'image
    const image = `${IMAGE_BASE_URL}${item.blueprint_id}.jpg`;
    
    return {
      id,
      name,
      nameEn: name,
      nameFr: name, // La traduction sera ajoutée ultérieurement
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
  });
};

// Obtenir les séries uniques à partir des cartes
const extractUniqueSeries = (cards: PokemonCard[]): PokemonSeries[] => {
  const seriesMap = new Map<string, PokemonSeries>();
  
  cards.forEach(card => {
    if (!seriesMap.has(card.series)) {
      seriesMap.set(card.series, {
        id: card.expansionId?.toString() || card.series.toLowerCase().replace(/\s+/g, '-'),
        name: card.series,
        logo: `https://tcg.pokemon.com/assets/img/expansions/${card.series.toLowerCase().replace(/\s+/g, '-')}/logos/fr-fr/logo.png`,
        symbol: `https://tcg.pokemon.com/assets/img/expansions/${card.series.toLowerCase().replace(/\s+/g, '-')}/symbols/symbol.png`,
        releaseDate: new Date().toISOString().split('T')[0], // Placeholder
        totalCards: 0 // Sera mis à jour plus tard
      });
    }
  });
  
  // Compter le nombre de cartes par série
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
  try {
    // Si nous avons déjà récupéré les cartes et extrait les séries
    if (cachedSeries.length > 0) {
      return cachedSeries;
    }
    
    // Sinon, récupérons toutes les cartes pour extraire les séries
    const { cards } = await fetchPokemonCards();
    const series = extractUniqueSeries(cards);
    cachedSeries = series;
    return series;
  } catch (error) {
    console.error('Erreur lors de la récupération des séries:', error);
    return [];
  }
};

export const fetchPokemonCards = async (
  seriesFilter?: string,
  page: number = 1,
  pageSize: number = 24,
  filterOptions?: Partial<FilterOptions>
): Promise<{ cards: PokemonCard[], total: number }> => {
  try {
    // Utiliser le cache si disponible et qu'aucun filtre n'est appliqué
    if (cachedCards.length > 0 && !seriesFilter && !filterOptions) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return { 
        cards: cachedCards.slice(start, end), 
        total: cachedCards.length 
      };
    }
    
    // Tentative de récupération des données depuis l'API CardTrader
    const response = await fetch('https://api.cardtrader.com/api/v2/products/export', {
      headers: {
        'Authorization': `Bearer ${CARDTRADER_API_TOKEN}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Transformer les données de l'API
      let allCards = transformCardTraderData(data);
      
      // Mettre à jour le cache global
      cachedCards = allCards;
      
      // Si nous n'avons pas encore extrait les séries, faisons-le maintenant
      if (cachedSeries.length === 0) {
        cachedSeries = extractUniqueSeries(allCards);
      }
      
      // Appliquer les filtres
      let filteredCards = allCards;
      
      if (filterOptions || seriesFilter) {
        filteredCards = allCards.filter(card => {
          // Filtre par série
          if (seriesFilter && card.series.toLowerCase() !== seriesFilter.toLowerCase()) {
            return false;
          }
          
          // Filtres supplémentaires si fournis
          if (filterOptions) {
            // Recherche textuelle
            if (filterOptions.search && 
                !card.name.toLowerCase().includes(filterOptions.search.toLowerCase()) &&
                !card.nameFr.toLowerCase().includes(filterOptions.search.toLowerCase())) {
              return false;
            }
            
            // Filtre par série (array)
            if (filterOptions.series && filterOptions.series.length > 0 && 
                !filterOptions.series.some(s => card.series.toLowerCase() === s.toLowerCase())) {
              return false;
            }
            
            // Filtre par rareté
            if (filterOptions.rarity && filterOptions.rarity.length > 0 && 
                !filterOptions.rarity.includes(card.rarity)) {
              return false;
            }
            
            // Filtre par condition
            if (filterOptions.condition && filterOptions.condition.length > 0 && 
                !filterOptions.condition.includes(card.condition)) {
              return false;
            }
            
            // Filtre par langue
            if (filterOptions.language && filterOptions.language.length > 0 && 
                !filterOptions.language.includes(card.language)) {
              return false;
            }
            
            // Filtre par prix
            if (filterOptions.priceMin && card.price < filterOptions.priceMin) {
              return false;
            }
            if (filterOptions.priceMax && card.price > filterOptions.priceMax) {
              return false;
            }
            
            // Filtre par caractéristiques spéciales
            if (filterOptions.isHolo !== null && card.isHolo !== filterOptions.isHolo) {
              return false;
            }
            if (filterOptions.isReverse !== null && card.isReverse !== filterOptions.isReverse) {
              return false;
            }
            if (filterOptions.isPromo !== null && card.isPromo !== filterOptions.isPromo) {
              return false;
            }
            
            // Filtre par ID d'expansion
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
      
      // Essayer de traduire les noms des cartes (si pas déjà traduits)
      for (const card of paginatedCards) {
        if (card.nameFr === card.nameEn) {
          try {
            card.nameFr = await translateCardName(card.nameEn);
          } catch (error) {
            console.error(`Erreur lors de la traduction de "${card.nameEn}":`, error);
          }
        }
      }
      
      return { cards: paginatedCards, total };
    } else {
      console.warn('Échec de la requête CardTrader, utilisation des données mockées');
      return { cards: [], total: 0 };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    return { cards: [], total: 0 };
  }
};

export const fetchCardDetails = async (cardId: string): Promise<PokemonCard | null> => {
  // Rechercher d'abord dans le cache
  if (cachedCards.length > 0) {
    const card = cachedCards.find(card => card.id === cardId);
    if (card) return card;
  }
  
  // Sinon, essayer de récupérer toutes les cartes
  try {
    const { cards } = await fetchPokemonCards();
    return cards.find(card => card.id === cardId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la carte:', error);
    return null;
  }
};

// Traduire les noms de cartes à l'aide de l'API PokeAPI
export const translateCardName = async (englishName: string): Promise<string> => {
  // Vérifier d'abord le cache
  if (translationCache[englishName]) {
    return translationCache[englishName];
  }
  
  try {
    // Normaliser le nom pour l'URL
    const normalizedName = englishName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Essayer de récupérer les données Pokémon de l'API
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${normalizedName}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Chercher le nom français dans les noms
      const frenchName = data.names.find((nameObj: any) => nameObj.language.name === 'fr')?.name;
      
      if (frenchName) {
        // Mettre en cache la traduction
        translationCache[englishName] = frenchName;
        return frenchName;
      }
    }
    
    // Si pas de traduction trouvée, ajouter "(FR)" pour le mock
    const mockTranslation = `${englishName} (FR)`;
    translationCache[englishName] = mockTranslation;
    return mockTranslation;
  } catch (error) {
    console.error(`Erreur lors de la traduction de "${englishName}":`, error);
    // En cas d'erreur, retourner le nom original
    return englishName;
  }
};
