
import { format } from "date-fns";
import { MoreHorizontal, User, Calendar, Building, Mail } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Customer, SubscriptionType } from "@/types/customer";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

interface CustomerTableRowProps {
  customer: Customer;
  onRowDoubleClick: (customer: Customer) => void;
  onActionClick: (customer: Customer, action: string) => void;
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

const getSubscriptionColor = (subscription: SubscriptionType): string | undefined => {
  switch (subscription) {
    case "free": return undefined; // Use default outline style
    case "basic": return "#9b87f5"; // Primary purple
    case "professional": return "#0EA5E9"; // Ocean blue
    case "enterprise": return "#F97316"; // Bright orange
    default: return undefined;
  }
};

// Get initials for avatar fallback
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Convert USD to NOK
const convertToNOK = (usdValue: number) => {
  // Using a fixed exchange rate of 1 USD = 10.5 NOK
  const nokValue = usdValue * 10.5;
  return nokValue.toLocaleString('no-NO');
};

const CustomerTableRow = ({ customer, onRowDoubleClick, onActionClick }: CustomerTableRowProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const handleViewDetails = () => {
    setIsSheetOpen(true);
  };

  // Clean up effect to ensure proper state management when the component unmounts
  useEffect(() => {
    return () => {
      // Ensure sheet is closed when component unmounts
      setIsSheetOpen(false);
    };
  }, []);
  
  return (
    <>
      <TableRow 
        key={customer.id} 
        className="cursor-pointer transition-colors hover:bg-muted/30" 
        onDoubleClick={() => onRowDoubleClick(customer)}
      >
        <TableCell className="font-medium w-[200px]">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {customer.avatarUrl ? (
                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
              ) : (
                <AvatarImage src="/lovable-uploads/be723d72-b625-4d18-9734-c98ccbe52b09.png" alt={customer.name} />
              )}
              <AvatarFallback 
                className="text-primary-foreground"
                style={{ backgroundColor: getSubscriptionColor(customer.subscription) || undefined }}
              >
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="truncate max-w-[130px]">{customer.name}</div>
          </div>
        </TableCell>
        <TableCell className="w-[220px] truncate">{customer.email}</TableCell>
        <TableCell className="w-[120px]">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(customer.status)}`} />
            <span>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </span>
          </div>
        </TableCell>
        <TableCell className="w-[120px]">{customer.role}</TableCell>
        <TableCell className="w-[150px]">
          <Badge 
            variant={getSubscriptionBadgeVariant(customer.subscription)}
            style={{ backgroundColor: customer.subscription !== "free" ? getSubscriptionColor(customer.subscription) : undefined }}
          >
            {customer.subscription}
          </Badge>
        </TableCell>
        <TableCell className="w-[150px]">{format(customer.createdAt, "MMM d, yyyy")}</TableCell>
        <TableCell className="w-[120px]">NOK {convertToNOK(customer.value)}</TableCell>
        <TableCell className="text-right w-[80px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewDetails}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionClick(customer, "edit")}>
                Edit customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionClick(customer, "email")}>
                Send email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onActionClick(customer, "delete")}
              >
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Customer Details Sheet with improved handling */}
      <Sheet 
        open={isSheetOpen} 
        onOpenChange={(open) => {
          setIsSheetOpen(open);
        }}
      >
        <SheetContent size="lg">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {customer.avatarUrl ? (
                  <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                ) : (
                  <AvatarImage src="/lovable-uploads/be723d72-b625-4d18-9734-c98ccbe52b09.png" alt={customer.name} />
                )}
                <AvatarFallback 
                  style={{ backgroundColor: getSubscriptionColor(customer.subscription) || undefined }}
                  className="text-primary-foreground"
                >
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>{customer.name}</SheetTitle>
                <SheetDescription className="truncate max-w-[300px]">{customer.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <User className="h-3.5 w-3.5" />
                  Role
                </div>
                <Badge variant={customer.role === "admin" ? "destructive" : "default"}>
                  {customer.role}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Created
                </div>
                <p>{format(customer.createdAt, "PPP")}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Building className="h-3.5 w-3.5" />
                  Company
                </div>
                <p>{customer.company || "Not specified"}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Mail className="h-3.5 w-3.5" />
                  Last Contact
                </div>
                <p>{format(customer.lastContactDate, "PPP")}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(customer.status)}`} />
                <p className="capitalize">{customer.status}</p>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Subscription</div>
              <Badge 
                variant={getSubscriptionBadgeVariant(customer.subscription)}
                style={{ backgroundColor: customer.subscription !== "free" ? getSubscriptionColor(customer.subscription) : undefined }}
                className="text-sm"
              >
                {customer.subscription.charAt(0).toUpperCase() + customer.subscription.slice(1)}
              </Badge>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Value</div>
              <p className="text-lg font-medium">NOK {convertToNOK(customer.value)}</p>
            </div>
            
            {customer.notes && (
              <>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                  <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
                </div>
              </>
            )}
            
            {customer.location && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
                <p>{customer.location}</p>
              </div>
            )}
          </div>
          
          <SheetFooter className="mt-6">
            <Button onClick={() => onActionClick(customer, "edit")}>Edit Customer</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CustomerTableRow;
