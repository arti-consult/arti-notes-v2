
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CustomerSearch = ({ searchTerm, onSearchChange }: CustomerSearchProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      className={`relative ${isMobile ? 'w-full' : 'min-w-[220px]'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search customers..."
        className="h-9 pl-9 w-full transition-all duration-200 focus:ring-1 focus:ring-primary"
      />
    </motion.div>
  );
};

export default CustomerSearch;
