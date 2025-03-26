
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Search, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // Detect scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for escape key to close mobile menu
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Add overflow: hidden to body when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/inventory" className="font-medium hover:text-primary transition-colors">
              Inventaire
            </Link>
            <Link to="/cart" className="font-medium hover:text-primary transition-colors">
              Panier
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Cart button */}
            <Link to="/cart" className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pokemon-red text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden rounded-full hover:bg-muted transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar - conditionally rendered */}
        {isSearchOpen && (
          <div className="mt-4 animate-slide-down">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une carte..."
                className="w-full p-2 pl-10 rounded-md border border-input"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu - conditionally rendered */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 md:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 items-center text-2xl">
              <Link 
                to="/" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/inventory" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inventaire
              </Link>
              <Link 
                to="/cart" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Panier
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
