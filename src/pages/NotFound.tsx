
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Button from "@/components/common/Button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img 
              src="https://archives.bulbagarden.net/media/upload/thumb/2/24/054Psyduck.png/250px-054Psyduck.png" 
              alt="Psyduck confused" 
              className="w-40 h-40 object-contain animate-pulse-soft"
            />
            <div className="absolute -top-4 -left-4 bg-pokemon-yellow text-pokemon-black text-sm px-3 py-1 rounded-full transform -rotate-12">
              404
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page introuvable</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oups ! Le Psyduck est confus... Cette page n'existe pas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg">
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/inventory">
            <Button size="lg" variant="outline">
              Explorer l'inventaire
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
