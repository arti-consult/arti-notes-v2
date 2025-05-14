
import React from "react";
import { Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CustomerStatus } from "@/types/customer";

interface StatusFilterProps {
  statusFilter: CustomerStatus | null;
  onStatusFilterChange: (value: CustomerStatus | null) => void;
  isMobile: boolean;
  activeFilterCount: number;
}

const StatusFilter = ({
  statusFilter,
  onStatusFilterChange,
  isMobile,
  activeFilterCount,
}: StatusFilterProps) => {
  const statuses: CustomerStatus[] = ["active", "inactive", "pending", "new"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto">
          <Filter className="h-4 w-4" />
          <span className="whitespace-nowrap">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "center" : "end"} 
        className="w-[280px] max-h-[60vh] overflow-y-auto bg-[#2E2E2E] border-gray-800"
      >
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem 
          checked={statusFilter === null}
          onCheckedChange={() => onStatusFilterChange(null)}
        >
          All Statuses
        </DropdownMenuCheckboxItem>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statusFilter === status}
            onCheckedChange={() => onStatusFilterChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusFilter;
