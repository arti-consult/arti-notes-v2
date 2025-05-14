
import { format } from "date-fns";
import { Customer, SubscriptionType } from "@/types/customer";
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { X, MapPin, Tag, Calendar, Share2, Star, Clock, BarChart4 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { EditCustomerModal, SendEmailModal, DeleteCustomerModal } from "./customer-modals";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CustomerSidebarProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const getSubscriptionBadgeVariant = (subscription: SubscriptionType) => {
  switch (subscription) {
    case "free": return "outline";
    case "basic": return "secondary";
    case "professional": return "default";
    case "enterprise": return "destructive";
    default: return "outline";
  }
};

const getSubscriptionColor = (subscription: SubscriptionType): string => {
  switch (subscription) {
    case "free": return "#8E9196"; // Neutral gray
    case "basic": return "#9b87f5"; // Primary purple
    case "professional": return "#0EA5E9"; // Ocean blue
    case "enterprise": return "#F97316"; // Bright orange
    default: return "#8E9196";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-status-active";
    case "inactive": return "bg-status-inactive";
    case "pending": return "bg-status-pending";
    case "new": return "bg-status-new";
    default: return "bg-gray-400";
  }
};

// Convert USD to NOK
const convertToNOK = (usdValue: number) => {
  // Using a fixed exchange rate of 1 USD = 10.5 NOK
  const nokValue = usdValue * 10.5;
  return nokValue.toLocaleString('no-NO');
};

// Priority colors
const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-amber-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-400";
  }
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const CustomerSidebar = ({ customer, open, onClose, isLoading = false }: CustomerSidebarProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("info");
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAction = (action: string) => {
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const fakeTags = ["VIP", "Returning", "Conference"];
  const customerTags = customer.tags || fakeTags; // Use customer tags if available, otherwise use fake tags

  // Mock data for timeline
  const timelineItems = [
    { date: new Date(2024, 3, 28), event: "Sent follow-up email", type: "email" },
    { date: new Date(2024, 3, 15), event: "Phone call about new features", type: "call" },
    { date: new Date(2024, 2, 22), event: "Demo presentation", type: "meeting" }
  ];

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <div className="flex items-center gap-3 pb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </div>
          
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Determine if there's a next contact date
  const hasNextContact = Boolean(customer.nextContactDate);
  const daysUntilNextContact = hasNextContact ? Math.ceil((new Date(customer.nextContactDate as Date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {customer.avatarUrl ? (
                    <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                  ) : (
                    <AvatarImage src="/lovable-uploads/be723d72-b625-4d18-9734-c98ccbe52b09.png" alt={customer.name} />
                  )}
                  <AvatarFallback 
                    className="text-primary-foreground" 
                    style={{ backgroundColor: getSubscriptionColor(customer.subscription) }}
                  >
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle>{customer.name}</SheetTitle>
                  <SheetDescription className="break-words max-w-[200px]">{customer.email}</SheetDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-4">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-6"
              >
                <motion.div variants={fadeIn} className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Status</h4>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(customer.status)}`} />
                      <span>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Role</h4>
                    <p className="break-all max-w-[120px]">{customer.role}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Subscription</h4>
                    <Badge 
                      variant={getSubscriptionBadgeVariant(customer.subscription)}
                      style={{ backgroundColor: customer.subscription !== "free" ? getSubscriptionColor(customer.subscription) : undefined }}
                    >
                      {customer.subscription}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Customer Value</h4>
                    <p className="font-medium break-all">NOK {convertToNOK(customer.value)}</p>
                  </div>
                </motion.div>

                <Separator />
                
                <motion.div variants={fadeIn} className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Created</h4>
                    <p>{format(customer.createdAt, "PPP")}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-1">Email</h4>
                    <p className="break-words text-sm">{customer.email || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Phone</h4>
                      <p className="text-sm break-all">{customer.phone || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Company</h4>
                      <p className="text-sm break-all">{customer.company || "N/A"}</p>
                    </div>
                  </div>

                  {customer.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="text-sm break-words">{customer.location}</p>
                    </div>
                  )}
                  
                  {customer.priority && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(customer.priority)}`} />
                        <p className="text-sm capitalize">{customer.priority} Priority</p>
                      </div>
                    </div>
                  )}
                  
                  {customerTags.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <h4 className="text-sm font-semibold">Tags</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {customerTags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground break-words">{customer.notes || "No additional information available."}</p>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                {hasNextContact && (
                  <motion.div variants={fadeIn} className="bg-muted rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Next Contact</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p>{format(customer.nextContactDate as Date, "PP")}</p>
                      <Badge variant={daysUntilNextContact && daysUntilNextContact <= 3 ? "destructive" : "outline"}>
                        {daysUntilNextContact} day{daysUntilNextContact !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={fadeIn} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Recent Activity</h3>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">View All</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mt-2">
                    {timelineItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3"
                      >
                        <div className="relative">
                          <div className={`h-8 w-8 rounded-full bg-${item.type === 'email' ? 'blue' : item.type === 'call' ? 'green' : 'purple'}-100 flex items-center justify-center`}>
                            <span className="text-xs font-medium">
                              {item.type === 'email' ? 'E' : item.type === 'call' ? 'C' : 'M'}
                            </span>
                          </div>
                          {index < timelineItems.length - 1 && (
                            <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -ml-px bg-border h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{item.event}</p>
                          <p className="text-xs text-muted-foreground">{format(item.date, "MMM d, yyyy")}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                <motion.div variants={fadeIn} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart4 className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Customer Statistics</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">Days as Customer</p>
                      <p className="text-lg font-semibold">
                        {Math.ceil((new Date().getTime() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">Last Contact</p>
                      <p className="text-sm font-medium">
                        {format(customer.lastContactDate, "MMM d, yyyy")}
                      </p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3 border border-border col-span-2">
                      <p className="text-xs text-muted-foreground">Customer Value (NOK)</p>
                      <p className="text-lg font-semibold">{convertToNOK(customer.value)}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex flex-col space-y-2">
                  <h4 className="text-sm font-semibold">Customer Journey</h4>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                          {customer.status === "active" ? "Active" : 
                           customer.status === "new" ? "New" : 
                           customer.status === "pending" ? "Pending" : "Inactive"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block">
                          {customer.subscription === "enterprise" ? "100%" : 
                           customer.subscription === "professional" ? "75%" : 
                           customer.subscription === "basic" ? "50%" : "25%"}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
                      <div style={{ 
                        width: customer.subscription === "enterprise" ? "100%" : 
                               customer.subscription === "professional" ? "75%" : 
                               customer.subscription === "basic" ? "50%" : "25%",
                        backgroundColor: getSubscriptionColor(customer.subscription)
                      }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-in-out">
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex justify-center">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share Customer Report</span>
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="mt-6">
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" className="w-full" onClick={() => handleAction("edit")}>Edit</Button>
              <Button variant="outline" className="w-full" onClick={() => handleAction("email")}>Email</Button>
              <Button variant="destructive" className="w-full" onClick={() => handleAction("delete")}>Delete</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Modals */}
      {activeModal === "edit" && (
        <EditCustomerModal customer={customer} onClose={closeModal} />
      )}
      {activeModal === "email" && (
        <SendEmailModal customer={customer} onClose={closeModal} />
      )}
      {activeModal === "delete" && (
        <DeleteCustomerModal customer={customer} onClose={closeModal} />
      )}
    </>
  );
};

export default CustomerSidebar;
