
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface DateFilterProps {
  dateFilter: Date | null;
  onDateFilterChange: (value: Date | null) => void;
}

const DateFilter = ({
  dateFilter,
  onDateFilterChange,
}: DateFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 gap-1 ${dateFilter ? 'border-primary' : ''} w-full sm:w-auto`}
        >
          <CalendarDays className="h-4 w-4" />
          {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Created At"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#2E2E2E] border-gray-800" align="end">
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
  );
};

export default DateFilter;
