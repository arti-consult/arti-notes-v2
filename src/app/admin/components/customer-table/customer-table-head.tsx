
import { ChevronDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer } from "@/types/customer";

interface CustomerTableHeadProps {
  sortColumn: keyof Customer;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof Customer) => void;
}

const CustomerTableHead = ({ sortColumn, sortDirection, onSort }: CustomerTableHeadProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="w-[200px] cursor-pointer" 
          onClick={() => onSort("name")}
        >
          Customer
          {sortColumn === "name" && (
            <ChevronDown 
              className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
            />
          )}
        </TableHead>
        <TableHead className="w-[220px]">Email</TableHead>
        <TableHead 
          className="cursor-pointer w-[120px]"
          onClick={() => onSort("status")}
        >
          Status
          {sortColumn === "status" && (
            <ChevronDown 
              className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
            />
          )}
        </TableHead>
        <TableHead className="w-[120px]">Role</TableHead>
        <TableHead 
          className="cursor-pointer w-[150px]"
          onClick={() => onSort("subscription")}
        >
          Subscription
          {sortColumn === "subscription" && (
            <ChevronDown 
              className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
            />
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer w-[150px]"
          onClick={() => onSort("createdAt")}
        >
          Created At
          {sortColumn === "createdAt" && (
            <ChevronDown 
              className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
            />
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer w-[120px]"
          onClick={() => onSort("value")}
        >
          Value
          {sortColumn === "value" && (
            <ChevronDown 
              className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
            />
          )}
        </TableHead>
        <TableHead className="text-right w-[80px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CustomerTableHead;
