import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/types/customer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  MoveHorizontal, 
  Edit, 
  Trash, 
  Eye, 
  Mail, 
  Building, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Circle,
  UserRound
} from "lucide-react";
import { motion } from "framer-motion";
import AnimatedDropdown, { DropdownItem } from "./ui/animated-dropdown";
import CustomerSidebar from "./customer-sidebar";
import { 
  ViewCustomerModal, 
  EditCustomerModal, 
  SendEmailModal, 
  DeleteCustomerModal 
} from "./customer-modals";
import { AnimatePresence } from "framer-motion";

interface CustomerCardProps {
  customer: Customer;
  isDragging?: boolean;
}

const getSubscriptionBadgeVariant = (subscription: string) => {
  switch (subscription) {
    case "free": return "outline";
    case "basic": return "secondary";
    case "professional": return "default";
    case "enterprise": return "destructive";
    default: return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <CheckCircle className="h-3 w-3 mr-1" />;
    case "pending": return <Clock className="h-3 w-3 mr-1" />;
    case "new": return <Circle className="h-3 w-3 mr-1" />;
    case "inactive": return <AlertCircle className="h-3 w-3 mr-1" />;
    default: return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-status-active text-white";
    case "pending": return "bg-status-pending text-white";
    case "new": return "bg-status-new text-white";
    case "inactive": return "bg-status-inactive text-white";
    default: return "";
  }
};

const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case "admin": return "bg-purple-700 text-white";
    case "manager": return "bg-blue-600 text-white";
    case "developer": return "bg-green-600 text-white"; 
    case "guest": return "bg-gray-500 text-white";
    case "user": return "bg-indigo-500 text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

// Convert USD to NOK
const convertToNOK = (usdValue: number) => {
  // Using a fixed exchange rate of 1 USD = 10.5 NOK
  const nokValue = usdValue * 10.5;
  return nokValue.toLocaleString('no-NO');
};

const CustomerCard = ({ customer, isDragging = false }: CustomerCardProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
    // Reset the customer state after animation completes
    setTimeout(() => {
      // This helps ensure we can open the sidebar again immediately
    }, 300);
  };

  const handleDoubleClick = () => {
    // Reset sidebar state first
    setSidebarOpen(false);
    
    // Then set it to true with slight delay
    setTimeout(() => {
      setSidebarOpen(true);
    }, 50);
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

  return (
    <>
      <motion.div
        whileHover={{ scale: isDragging ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className={`mb-2 ${isDragging ? "border-primary shadow-md" : ""}`}
          onDoubleClick={handleDoubleClick}
        >
          <CardContent className="p-2">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6 text-xs">
                  {customer.avatarUrl ? (
                    <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                  ) : (
                    <AvatarImage src="/lovable-uploads/be723d72-b625-4d18-9734-c98ccbe52b09.png" alt={customer.name} />
                  )}
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-xs">{customer.name}</div>
                </div>
              </div>
              <div className="flex items-center">
                {isDragging && (
                  <MoveHorizontal className="h-3 w-3 mr-1 text-muted-foreground" />
                )}
                <AnimatedDropdown 
                  trigger={
                    <Button variant="ghost" className="h-5 w-5 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  }
                >
                  <DropdownItem onClick={() => setSidebarOpen(true)}>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View details
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setActiveModal("edit")}>
                    <div className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit customer
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setActiveModal("email")}>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Send email
                    </div>
                  </DropdownItem>
                  <div className="border-t border-gray-100 my-1"></div>
                  <DropdownItem 
                    danger 
                    onClick={() => setActiveModal("delete")}
                  >
                    <div className="flex items-center">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete customer
                    </div>
                  </DropdownItem>
                </AnimatedDropdown>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-[10px] mb-1.5">
              <div>
                <div className="text-muted-foreground flex items-center">
                  <Mail className="h-2.5 w-2.5 mr-0.5" />Email:
                </div>
                <div className="truncate max-w-[80px]">{customer.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center">
                  <UserRound className="h-2.5 w-2.5 mr-0.5" />Role:
                </div>
                <div className="flex items-center">
                  <span className={`text-[9px] px-1 py-0.5 rounded-sm ${getRoleBadgeStyle(customer.role)}`}>
                    {customer.role}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center">
                  <Calendar className="h-2.5 w-2.5 mr-0.5" />Created:
                </div>
                <div>{format(customer.createdAt, "MMM d, yyyy")}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center">
                  <Building className="h-2.5 w-2.5 mr-0.5" />Value:
                </div>
                <div>NOK {convertToNOK(customer.value)}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-1 justify-between">
              <div className="flex flex-wrap gap-1">
                <div className={`px-1 py-0.5 rounded-full text-[9px] font-medium flex items-center ${getStatusColor(customer.status)}`}>
                  {getStatusIcon(customer.status)}
                  {customer.status}
                </div>
                <Badge variant={getSubscriptionBadgeVariant(customer.subscription)} className="text-[9px] px-1 py-0.5">
                  {customer.subscription}
                </Badge>
              </div>
              <div className={`text-[9px] px-1 py-0.5 rounded ${getRoleBadgeStyle(customer.role)}`}>
                {customer.role}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Sidebar with proper animation handling */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <CustomerSidebar 
            customer={customer} 
            open={sidebarOpen} 
            onClose={closeSidebar} 
          />
        )}
      </AnimatePresence>

      {/* Modals with proper animation handling */}
      <AnimatePresence mode="wait">
        {activeModal === "edit" && (
          <EditCustomerModal customer={customer} onClose={closeModal} />
        )}
        {activeModal === "email" && (
          <SendEmailModal customer={customer} onClose={closeModal} />
        )}
        {activeModal === "delete" && (
          <DeleteCustomerModal customer={customer} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerCard;
