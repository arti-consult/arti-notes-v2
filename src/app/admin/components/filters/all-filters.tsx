
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
import { Filter } from "lucide-react";
import { CustomerStatus, CustomerRole, SubscriptionType } from "@/types/customer";

interface AllFiltersProps {
  statusFilter: CustomerStatus | null;
  roleFilter: CustomerRole | null;
  subscriptionFilter: SubscriptionType | null;
  dateSort: 'none' | 'recent' | 'oldest';
  onStatusFilterChange: (value: CustomerStatus | null) => void;
  onRoleFilterChange: (value: CustomerRole | null) => void;
  onSubscriptionFilterChange: (value: SubscriptionType | null) => void;
  onDateSortChange: (value: 'none' | 'recent' | 'oldest') => void;
  isMobile: boolean;
  activeFilterCount: number;
}

const AllFilters = ({
  statusFilter,
  roleFilter,
  subscriptionFilter,
  dateSort,
  onStatusFilterChange,
  onRoleFilterChange,
  onSubscriptionFilterChange,
  onDateSortChange,
  isMobile,
  activeFilterCount,
}: AllFiltersProps) => {
  const statuses: CustomerStatus[] = ["active", "inactive", "pending", "new"];
  const roles: CustomerRole[] = ["user", "admin", "manager", "developer", "guest"];
  const subscriptions: SubscriptionType[] = ["free", "basic", "professional", "enterprise"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto">
          <Filter className="h-4 w-4" />
          <span className="whitespace-nowrap">All Filters</span>
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
        {/* Status Filter Section */}
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
        
        {/* Role Filter Section */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem 
          checked={roleFilter === null}
          onCheckedChange={() => onRoleFilterChange(null)}
        >
          All Roles
        </DropdownMenuCheckboxItem>
        {roles.map((role) => (
          <DropdownMenuCheckboxItem
            key={role}
            checked={roleFilter === role}
            onCheckedChange={() => onRoleFilterChange(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}
        
        {/* Subscription Filter Section */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Subscription</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem 
          checked={subscriptionFilter === null}
          onCheckedChange={() => onSubscriptionFilterChange(null)}
        >
          All Subscriptions
        </DropdownMenuCheckboxItem>
        {subscriptions.map((subscription) => (
          <DropdownMenuCheckboxItem
            key={subscription}
            checked={subscriptionFilter === subscription}
            onCheckedChange={() => onSubscriptionFilterChange(subscription)}
          >
            {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}

        {/* Sort by Creation Date Section */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort by Creation Date</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem 
          checked={dateSort === 'none'}
          onCheckedChange={() => onDateSortChange('none')}
        >
          Default
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

export default AllFilters;
