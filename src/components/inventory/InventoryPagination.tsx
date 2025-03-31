
import React from "react";
import Button from "@/components/common/Button";

interface InventoryPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalCards: number;
  pageSize: number;
}

const InventoryPagination: React.FC<InventoryPaginationProps> = ({
  page,
  setPage,
  totalCards,
  pageSize
}) => {
  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <Button
        variant="outline"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        Précédent
      </Button>
      <span className="text-sm">
        Page {page} sur {Math.ceil(totalCards / pageSize)}
      </span>
      <Button
        variant="outline"
        onClick={() => setPage((p) => p + 1)}
        disabled={page * pageSize >= totalCards}
      >
        Suivant
      </Button>
    </div>
  );
};

export default InventoryPagination;
