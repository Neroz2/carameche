
import React, { memo, useCallback, useMemo } from "react";
import Button from "@/components/common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const totalPages = Math.ceil(totalCards / pageSize);
  
  if (totalPages <= 1) return null;
  
  // Generate pagination numbers with ellipsis - memoized for performance
  const paginationItems = useMemo(() => {
    let pages = [];
    const maxDisplayedPages = 5; // Maximum number of page buttons to display
    
    if (totalPages <= maxDisplayedPages) {
      // If we have fewer pages than our maximum, show them all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first, last and page around current
      const firstPage = 1;
      const lastPage = totalPages;
      
      if (page <= 3) {
        // If close to the start, show first 3, ellipsis, and last
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(lastPage);
      } else if (page >= totalPages - 2) {
        // If close to the end, show first, ellipsis, and last 3
        pages.push(firstPage);
        pages.push("ellipsis");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle, show first, ellipsis, current and neighbors, ellipsis, last
        pages.push(firstPage);
        pages.push("ellipsis");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("ellipsis");
        pages.push(lastPage);
      }
    }
    
    return pages;
  }, [page, totalPages]);
  
  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, [setPage]);
  
  const handleNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, [setPage]);
  
  const handlePageClick = useCallback((pageNum: number) => {
    setPage(pageNum);
  }, [setPage]);
  
  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevPage}
        disabled={page === 1}
        className="h-9 w-9 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {paginationItems.map((item, index) => 
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="text-muted-foreground px-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${item}`}
            variant={page === item ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageClick(item as number)}
            className={`h-9 w-9 p-0 ${page === item ? 'pointer-events-none' : ''}`}
          >
            {item}
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextPage}
        disabled={page >= totalPages}
        className="h-9 w-9 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(InventoryPagination);
