
import React from "react";
import Button from "@/components/common/Button";

interface InventoryEmptyProps {
  clearFilters: () => void;
}

const InventoryEmpty: React.FC<InventoryEmptyProps> = ({ clearFilters }) => {
  return (
    <div className="bg-card rounded-lg border p-8 text-center">
      <h3 className="text-xl font-medium mb-2">Aucune carte trouvée</h3>
      <p className="text-muted-foreground">
        Essayez de modifier vos filtres ou d'effectuer une recherche différente.
      </p>
      <Button 
        onClick={clearFilters} 
        variant="outline" 
        className="mt-4"
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
};

export default InventoryEmpty;
