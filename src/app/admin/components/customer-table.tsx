
import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/types/customer";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, MoreHorizontal, Loader2 } from "lucide-react";
import { 
  EditCustomerModal, 
  SendEmailModal, 
  DeleteCustomerModal 
} from "./customer-modals";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import CustomerTableRow from "./customer-table/customer-table-row";

interface CustomerTableProps {
  customers: Customer[];
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-status-active";
    case "inactive": return "bg-status-inactive";
    case "pending": return "bg-status-pending";
    case "new": return "bg-status-new";
    default: return "bg-gray-400";
  }
};

const getSubscriptionBadgeVariant = (subscription: string) => {
  switch (subscription) {
    case "free": return "outline";
    case "basic": return "secondary";
    case "professional": return "default";
    case "enterprise": return "destructive";
    default: return "outline";
  }
};

const CustomerTable = ({ customers, isLoading = false }: CustomerTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Improved modal handling to prevent UI locking
  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => {
      setActiveCustomer(null);
    }, 300);
  };

  const openModal = (customer: Customer, modalType: string) => {
    // Skip handling "view" action as it's now handled by the row component directly
    if (modalType === "view") return;
    
    // Reset previous state
    setActiveModal(null);
    setActiveCustomer(null);
    
    // Set new state with a delay to ensure UI updates properly
    setTimeout(() => {
      setActiveCustomer(customer);
      setActiveModal(modalType);
    }, 50);
  };

  const handleSort = (column: keyof Customer) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleRowDoubleClick = (customer: Customer) => {
    // For consistency, we're no longer handling this here
    // as double click is now managed in the row component
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc" 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" 
        ? aValue - bValue 
        : bValue - aValue;
    }

    return 0;
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // If loading, render skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-8 w-1/2" /></TableCell>
                <TableCell><Skeleton className="h-8 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-8 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-8 w-1/2" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[200px] cursor-pointer" 
                onClick={() => handleSort("name")}
              >
                Customer
                {sortColumn === "name" && (
                  <ChevronDown 
                    className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
                  />
                )}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status
                {sortColumn === "status" && (
                  <ChevronDown 
                    className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
                  />
                )}
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("subscription")}
              >
                Subscription
                {sortColumn === "subscription" && (
                  <ChevronDown 
                    className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
                  />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created At
                {sortColumn === "createdAt" && (
                  <ChevronDown 
                    className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
                  />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("value")}
              >
                Value
                {sortColumn === "value" && (
                  <ChevronDown 
                    className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} 
                  />
                )}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.map((customer) => (
              <CustomerTableRow 
                key={customer.id}
                customer={customer}
                onRowDoubleClick={() => {}} // We no longer use this functionality
                onActionClick={openModal}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Handle each modal separately to avoid AnimatePresence issues */}
      {activeCustomer && activeModal === "edit" && (
        <EditCustomerModal key="edit-modal" customer={activeCustomer} onClose={closeModal} />
      )}
      
      {activeCustomer && activeModal === "email" && (
        <SendEmailModal key="email-modal" customer={activeCustomer} onClose={closeModal} />
      )}
      
      {activeCustomer && activeModal === "delete" && (
        <DeleteCustomerModal key="delete-modal" customer={activeCustomer} onClose={closeModal} />
      )}
    </>
  );
};

export default CustomerTable;
