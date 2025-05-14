
import { useState, useMemo } from "react";
import { customers as customerData } from "@/data/customers";
import { CustomerRole, Customer } from "@/types/customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { toast } from "sonner";

interface RoleUsersTableProps {
  selectedRole: CustomerRole | "all";
  onRoleChange: (role: CustomerRole | "all") => void;
}

export function RoleUsersTable({ selectedRole, onRoleChange }: RoleUsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isManagingRole, setIsManagingRole] = useState(false);
  const [newRole, setNewRole] = useState<CustomerRole | "">("");
  const [customerList, setCustomerList] = useState(customerData);
  const itemsPerPage = 10;
  
  // Filter customers by selected role
  const filteredCustomers = useMemo(() => {
    if (selectedRole === "all") {
      return customerList;
    }
    return customerList.filter(customer => customer.role === selectedRole);
  }, [selectedRole, customerList]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Role badge variant mapping
  const getRoleBadgeVariant = (role: CustomerRole) => {
    switch (role) {
      case "admin": return "destructive";
      case "manager": return "default"; 
      case "developer": return "secondary";
      case "guest": return "outline";
      default: return "default";
    }
  };
  
  const handleRowClick = (customer: Customer) => {
    setSelectedUser(customer);
    setNewRole(customer.role as CustomerRole);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setIsManagingRole(false);
    setTimeout(() => {
      setSelectedUser(null);
      setNewRole("");
    }, 300); // Wait for animation to complete
  };

  const handleManageRole = () => {
    setIsManagingRole(true);
  };

  const handleUpdateRole = () => {
    if (selectedUser && newRole) {
      // Update the user's role
      setCustomerList(prev => 
        prev.map(customer => 
          customer.id === selectedUser.id 
            ? { ...customer, role: newRole as CustomerRole } 
            : customer
        )
      );
      
      // Update selected user
      setSelectedUser({ ...selectedUser, role: newRole as CustomerRole });
      
      toast(`Updated ${selectedUser.name}'s role to ${newRole}`);
      setIsManagingRole(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-400";
      case "pending": return "bg-amber-500";
      case "new": return "bg-blue-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <>
      <motion.div 
        className="bg-card rounded-lg shadow overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Users by Role</h3>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button
              variant={selectedRole === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => onRoleChange("all")}
            >
              All
            </Button>
            {(["admin", "manager", "user", "developer", "guest"] as CustomerRole[]).map(role => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                size="sm" 
                onClick={() => onRoleChange(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow 
                key={customer.id}
                onClick={() => handleRowClick(customer)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {customer.avatarUrl ? (
                        <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                      ) : null}
                      <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(customer.role as CustomerRole)}>
                    {customer.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.status === "active" ? "outline" : "secondary"}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(customer.createdAt, "PP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="py-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      {/* User Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md" onPointerDownOutside={handleCloseSheet}>
          {selectedUser && (
            <>
              <SheetHeader className="pr-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {selectedUser.avatarUrl ? (
                        <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                      ) : null}
                      <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle>{selectedUser.name}</SheetTitle>
                      <SheetDescription className="truncate">{selectedUser.email}</SheetDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCloseSheet}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Status</h4>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedUser.status)}`} />
                      <span>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Role</h4>
                    {!isManagingRole ? (
                      <Badge variant={getRoleBadgeVariant(selectedUser.role as CustomerRole)}>
                        {selectedUser.role}
                      </Badge>
                    ) : (
                      <Select 
                        value={newRole} 
                        onValueChange={(value: CustomerRole) => setNewRole(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="guest">Guest</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">User Since</h4>
                    <p>{format(selectedUser.createdAt, "PPP")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Value</h4>
                    <p className="font-medium">${selectedUser.value.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-1">Contact Information</h4>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Email:</span> {selectedUser.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedUser.phone || "N/A"}</p>
                    <p><span className="text-muted-foreground">Company:</span> {selectedUser.company || "N/A"}</p>
                    <p><span className="text-muted-foreground">Location:</span> {selectedUser.location || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-1">Subscription</h4>
                  <Badge variant={selectedUser.subscription === "free" ? "outline" : "default"}>
                    {selectedUser.subscription.charAt(0).toUpperCase() + selectedUser.subscription.slice(1)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedUser.subscription === "enterprise" 
                      ? "Full access to all features with premium support" 
                      : selectedUser.subscription === "professional" 
                        ? "Advanced features with priority support" 
                        : selectedUser.subscription === "basic" 
                          ? "Basic features with standard support" 
                          : "Limited access to basic features"}
                  </p>
                </div>

                {selectedUser.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Notes</h4>
                      <p className="text-sm text-muted-foreground break-words">{selectedUser.notes}</p>
                    </div>
                  </>
                )}
              </div>
              
              <SheetFooter className="mt-6">
                {!isManagingRole ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="w-full">Edit User</Button>
                    <Button variant="default" className="w-full" onClick={handleManageRole}>Manage Role</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="w-full" onClick={() => setIsManagingRole(false)}>Cancel</Button>
                    <Button variant="default" className="w-full" onClick={handleUpdateRole}>Update Role</Button>
                  </div>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
