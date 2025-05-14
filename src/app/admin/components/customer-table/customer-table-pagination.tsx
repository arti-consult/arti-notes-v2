
import { Button } from "@/components/ui/button";
import { ChevronsDown } from "lucide-react";
import { motion } from "framer-motion";

interface CustomerTablePaginationProps {
  onScrollToTop: () => void;
}

const CustomerTablePagination = ({
  onScrollToTop
}: CustomerTablePaginationProps) => {
  return (
    <motion.div 
      className="mt-6 flex justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Button 
        variant="outline" 
        className="gap-1 border-dashed" 
        onClick={onScrollToTop}
      >
        <ChevronsDown className="h-4 w-4" />
        <span>Show All Customers</span>
      </Button>
    </motion.div>
  );
};

export default CustomerTablePagination;
