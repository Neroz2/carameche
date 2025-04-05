
import React from "react";
import Button from "@/components/common/Button";
import { FileSearch, RefreshCw } from "lucide-react";

interface InventoryEmptyProps {
  clearFilters: () => void;
}

const InventoryEmpty: React.FC<InventoryEmptyProps> = ({ clearFilters }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-8 text-center flex flex-col items-center justify-center min-h-[400px] animate-in fade-in">
      <div className="mb-6 bg-accent/50 p-6 rounded-full">
        <FileSearch size={42} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-3">Aucune carte trouvée</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Essayez de modifier vos filtres ou d'effectuer une recherche différente.
      </p>
      <Button 
        onClick={clearFilters} 
        variant="default" 
        className="flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Réinitialiser les filtres
      </Button>
    </div>
  );
};

export default InventoryEmpty;
