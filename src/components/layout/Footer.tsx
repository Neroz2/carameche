
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card shadow-inner border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pokemon-red text-white">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                  <line x1="12" y1="2" x2="12" y2="7"></line>
                  <line x1="12" y1="17" x2="12" y2="22"></line>
                </svg>
              </span>
              <span className="font-bold text-xl">Poké-Cartopia</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre destination pour les cartes Pokémon à l'unité. Nous proposons un large choix de cartes à des prix compétitifs.
            </p>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="text-muted-foreground hover:text-foreground transition-colors">
                  Inventaire
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Informations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Social and newsletter */}
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Suivez-nous</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
            <h3 className="font-medium mb-2">Newsletter</h3>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Votre email"
                className="rounded-l-md border border-input py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-3 rounded-r-md font-medium">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-sm text-muted-foreground text-center">
          <p>&copy; {currentYear} Poké-Cartopia. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
