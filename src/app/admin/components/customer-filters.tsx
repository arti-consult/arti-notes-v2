
import React from "react";
import { CustomerStatus, SubscriptionType, CustomerRole } from "@/types/customer";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import AllFilters from "./filters/all-filters";
import StatusFilter from "./filters/status-filter";
import RoleFilter from "./filters/role-filter";
import SubscriptionFilter from "./filters/subscription-filter";
import DateFilter from "./filters/date-filter";
import DateSortFilter from "./filters/date-sort-filter";
import MobileFilters from "./filters/mobile-filters";

interface CustomerFiltersProps {
  statusFilter: CustomerStatus | null;
  roleFilter: CustomerRole | null;
  subscriptionFilter: SubscriptionType | null;
  dateFilter: Date | null;
  dateSort: 'none' | 'recent' | 'oldest';
  onStatusFilterChange: (value: CustomerStatus | null) => void;
  onRoleFilterChange: (value: CustomerRole | null) => void;
  onSubscriptionFilterChange: (value: SubscriptionType | null) => void;
  onDateFilterChange: (value: Date | null) => void;
  onDateSortChange: (value: 'none' | 'recent' | 'oldest') => void;
}

const CustomerFilters = ({
  statusFilter,
  roleFilter,
  subscriptionFilter,
  dateFilter,
  dateSort,
  onStatusFilterChange,
  onRoleFilterChange,
  onSubscriptionFilterChange,
  onDateFilterChange,
  onDateSortChange,
}: CustomerFiltersProps) => {
  const isMobile = useIsMobile();
  
  // Count active filters
  const activeFilterCount = [
    statusFilter !== null,
    roleFilter !== null,
    subscriptionFilter !== null,
    dateFilter !== null,
    dateSort !== 'none'
  ].filter(Boolean).length;

  return (
    <motion.div 
      className={`flex flex-wrap ${isMobile ? 'flex-col' : 'items-center'} gap-3`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Filters */}
      <StatusFilter 
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        isMobile={isMobile}
        activeFilterCount={activeFilterCount}
      />

      {!isMobile && (
        <>
          <RoleFilter 
            roleFilter={roleFilter}
            onRoleFilterChange={onRoleFilterChange}
            isMobile={isMobile}
          />

          <SubscriptionFilter 
            subscriptionFilter={subscriptionFilter}
            onSubscriptionFilterChange={onSubscriptionFilterChange}
            isMobile={isMobile}
          />

          <DateSortFilter 
            dateSort={dateSort}
            onDateSortChange={onDateSortChange}
          />

          <DateFilter 
            dateFilter={dateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </>
      )}
      
      {/* Compact filters for mobile view */}
      {isMobile && (
        <>
          <RoleFilter 
            roleFilter={roleFilter}
            onRoleFilterChange={onRoleFilterChange}
            isMobile={isMobile}
          />

          <SubscriptionFilter 
            subscriptionFilter={subscriptionFilter}
            onSubscriptionFilterChange={onSubscriptionFilterChange}
            isMobile={isMobile}
          />
          
          <MobileFilters 
            dateSort={dateSort}
            dateFilter={dateFilter}
            onDateSortChange={onDateSortChange}
            onDateFilterChange={onDateFilterChange}
          />
        </>
      )}
    </motion.div>
  );
};

export default CustomerFilters;
