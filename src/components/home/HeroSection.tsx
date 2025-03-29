
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-pokemon-blue/10 to-transparent z-0"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h4 className="text-sm md:text-base inline-block bg-pokemon-red/10 text-pokemon-red px-3 py-1 rounded-full font-medium">
                Boutique de cartes Pokémon
              </h4>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Capturez les cartes Pokémon les plus rares
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mt-4">
                Explorez notre collection exclusive de cartes Pokémon à l'unité. 
                Des cartes communes aux plus rares, complétez votre collection !
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/inventory">
                <Button size="lg" className="group">
                  Explorer l'inventaire
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button size="lg" variant="outline">
                  Voir mon panier
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div>
                <p className="text-3xl font-bold">1000+</p>
                <p className="text-sm text-muted-foreground">Cartes uniques</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24h</p>
                <p className="text-sm text-muted-foreground">Expédition rapide</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Authentique</p>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
            {/* Main card with 3D effect */}
            <div className="pokemon-card absolute w-[220px] h-[300px] transform rotate-6 translate-x-4 z-20 animate-float animate-fade-in">
              <img 
                src="https://tcg.pokemon.com/assets/img/expansions/silver-tempest/cards/en-us/SWSH12_EN_179-2x.jpg" 
                alt="Charizard Card" 
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 rounded-lg shadow-lg bg-gradient-to-tr from-pokemon-fire/30 to-transparent"></div>
            </div>
            
            {/* Background cards */}
            <div className="absolute w-[220px] h-[300px] transform -rotate-6 -translate-x-8 z-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <img 
                src="https://tcg.pokemon.com/assets/img/expansions/crown-zenith/cards/en-us/SWSH12PT5_EN_001-2x.jpg" 
                alt="Pikachu Card" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 rounded-lg shadow-lg bg-gradient-to-tr from-pokemon-electric/30 to-transparent"></div>
            </div>
            
            <div className="absolute w-[220px] h-[300px] transform -rotate-12 -translate-x-20 translate-y-5 z-0 opacity-80 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <img 
                src="https://tcg.pokemon.com/assets/img/expansions/crown-zenith/cards/en-us/SWSH12PT5_EN_070-2x.jpg" 
                alt="Snorlax Card" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 rounded-lg shadow-lg bg-gradient-to-tr from-pokemon-water/30 to-transparent"></div>
            </div>
            
            {/* Visual effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pokemon-red/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pokemon-blue/10 rounded-full filter blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
