
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
import { CreditCard } from "lucide-react";
import { SubscriptionType } from "@/types/customer";

interface SubscriptionFilterProps {
  subscriptionFilter: SubscriptionType | null;
  onSubscriptionFilterChange: (value: SubscriptionType | null) => void;
  isMobile: boolean;
}

const SubscriptionFilter = ({
  subscriptionFilter,
  onSubscriptionFilterChange,
  isMobile,
}: SubscriptionFilterProps) => {
  const subscriptions: SubscriptionType[] = ["free", "basic", "professional", "enterprise"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 gap-1 ${subscriptionFilter ? 'border-primary' : ''} w-full sm:w-auto`}
        >
          <CreditCard className="h-4 w-4" />
          {subscriptionFilter ? `Plan: ${subscriptionFilter.charAt(0).toUpperCase() + subscriptionFilter.slice(1)}` : "Plan"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "center" : "end"} 
        className="w-[200px] bg-[#2E2E2E] border-gray-800"
      >
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubscriptionFilter;
