
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface DateSortFilterProps {
  dateSort: 'none' | 'recent' | 'oldest';
  onDateSortChange: (value: 'none' | 'recent' | 'oldest') => void;
}

const DateSortFilter = ({
  dateSort,
  onDateSortChange,
}: DateSortFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 gap-1 ${dateSort !== 'none' ? 'border-primary' : ''} w-full sm:w-auto`}
        >
          <Clock className="h-4 w-4" />
          {dateSort === 'recent' ? 'Recent First' : dateSort === 'oldest' ? 'Oldest First' : 'Creation Date'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#2E2E2E] border-gray-800">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateSortFilter;
