
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface MobileFiltersProps {
  dateSort: 'none' | 'recent' | 'oldest';
  dateFilter: Date | null;
  onDateSortChange: (value: 'none' | 'recent' | 'oldest') => void;
  onDateFilterChange: (value: Date | null) => void;
}

const MobileFilters = ({
  dateSort,
  dateFilter,
  onDateSortChange,
  onDateFilterChange,
}: MobileFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 gap-1 w-full sm:w-auto ${(dateSort !== 'none' || dateFilter !== null) ? 'border-primary' : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced Filters</span>
          {(dateSort !== 'none' || dateFilter !== null) && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
              {[dateSort !== 'none', dateFilter !== null].filter(Boolean).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="bg-[#2E2E2E] border-gray-800">
        <DropdownMenuLabel>Date Sorting</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem 
          checked={dateSort === 'none'}
          onCheckedChange={() => onDateSortChange('none')}
        >
          Default Order
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem 
          checked={dateSort === 'recent'}
          onCheckedChange={() => onDateSortChange('recent')}
        >
          Recent Accounts
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem 
          checked={dateSort === 'oldest'}
          onCheckedChange={() => onDateSortChange('oldest')}
        >
          Oldest Accounts
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Date Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-1"
              >
                <CalendarDays className="h-4 w-4" />
                {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#2E2E2E] border-gray-800">
              <Calendar
                mode="single"
                selected={dateFilter ?? undefined}
                onSelect={(date) => onDateFilterChange(date)}
                initialFocus
                className="pointer-events-auto"
              />
              {dateFilter && (
                <div className="p-2 border-t border-gray-800">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center"
                    onClick={() => onDateFilterChange(null)}
                  >
                    Clear Date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileFilters;
