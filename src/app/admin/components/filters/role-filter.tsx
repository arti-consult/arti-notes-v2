
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
import { UserCircle } from "lucide-react";
import { CustomerRole } from "@/types/customer";

interface RoleFilterProps {
  roleFilter: CustomerRole | null;
  onRoleFilterChange: (value: CustomerRole | null) => void;
  isMobile: boolean;
}

const RoleFilter = ({
  roleFilter,
  onRoleFilterChange,
  isMobile,
}: RoleFilterProps) => {
  const roles: CustomerRole[] = ["user", "admin", "manager", "developer", "guest"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 gap-1 ${roleFilter ? 'border-primary' : ''} w-full sm:w-auto`}
        >
          <UserCircle className="h-4 w-4" />
          {roleFilter ? `Role: ${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}` : "Role"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "center" : "end"} 
        className="w-[200px] bg-[#2E2E2E] border-gray-800"
      >
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleFilter;
