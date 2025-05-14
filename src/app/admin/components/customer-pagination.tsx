
import { useState, useEffect } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis 
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomerPagination = ({ currentPage, totalPages, onPageChange }: CustomerPaginationProps) => {
  const isMobile = useIsMobile();
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  
  // Calculate visible page numbers based on current page
  useEffect(() => {
    let pages: number[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first and last page
      pages = [1];
      
      // Handle different cases based on current page position
      if (currentPage <= 3) {
        // Near the start
        pages = [...pages, 2, 3, 4, 5, -1, totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages = [...pages, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Somewhere in the middle
        pages = [...pages, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
      }
    }
    
    setVisiblePages(pages);
  }, [currentPage, totalPages]);
  
  // Mobile pagination is simplified
  if (isMobile && totalPages > 3) {
    return (
      <motion.div 
        className="flex justify-center items-center mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        layout
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            <PaginationItem>
              <motion.div
                key={currentPage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PaginationLink isActive={true}>
                  {currentPage}
                </PaginationLink>
              </motion.div>
            </PaginationItem>
            
            <PaginationItem>
              <p className="text-sm text-muted-foreground px-2">of {totalPages}</p>
            </PaginationItem>
            
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </motion.div>
    );
  }
  
  // Desktop pagination with all page numbers
  return (
    <motion.div 
      className="flex justify-center items-center mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      layout
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          <AnimatePresence mode="wait">
            {visiblePages.map((page, index) => (
              page === -1 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </motion.div>
                </PaginationItem>
              )
            ))}
          </AnimatePresence>
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
};

export default CustomerPagination;
