import { useState, useEffect } from "react";
import { isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, Table, ChartPie, Loader2 } from "lucide-react";
import CustomerTable from "./customer-table";
import CustomerKanban from "./customer-kanban";
import CustomerPieChart from "./customer-pie-chart";
import CustomerSearch from "./customer-search";
import CustomerFilters from "./customer-filters";
import CustomerPagination from "./customer-pagination";
import { Customer, CustomerStatus, CustomerRole, SubscriptionType } from "@/types/customer";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerTabsProps {
  customers: Customer[];
}

const ITEMS_PER_PAGE = 10;

const CustomerTabs = ({ customers }: CustomerTabsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | null>(null);
  const [roleFilter, setRoleFilter] = useState<CustomerRole | null>(null);
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionType | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [dateSort, setDateSort] = useState<'none' | 'recent' | 'oldest'>('none');
  const [activeTab, setActiveTab] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply filters and search to customers
  const filteredCustomers = customers.filter(customer => {
    // Apply search filter - search across multiple fields
    const searchableFields = [
      customer.name,
      customer.email,
      customer.company,
      customer.phone,
      customer.notes || ""
    ].map(field => field.toLowerCase());
    
    const matchesSearch = searchTerm === "" || 
      searchableFields.some(field => field.includes(searchTerm.toLowerCase()));
    
    // Apply status filter
    const matchesStatus = statusFilter === null || customer.status === statusFilter;
    
    // Apply role filter
    const matchesRole = roleFilter === null || customer.role === roleFilter;
    
    // Apply subscription filter
    const matchesSubscription = subscriptionFilter === null || 
      customer.subscription === subscriptionFilter;
    
    // Apply date filter
    const matchesDate = dateFilter === null || 
      isSameDay(customer.createdAt, dateFilter);
    
    return matchesSearch && matchesStatus && matchesRole && matchesSubscription && matchesDate;
  });

  // Apply sorting based on creation date
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (dateSort === 'recent') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else if (dateSort === 'oldest') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
    return 0;
  });

  // Reset to first page when filters change or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, subscriptionFilter, dateFilter, dateSort, activeTab]);
  
  // Calculate pagination details
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    // Add small delay to simulate tab content loading
    setTimeout(() => setIsLoading(false), 300);
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    // Add small delay to simulate page content loading
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleDateSortChange = (value: 'none' | 'recent' | 'oldest') => {
    setDateSort(value);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <Tabs defaultValue="table" className="w-full" onValueChange={handleTabChange}>
      <motion.div 
        className="flex flex-col gap-4 justify-between mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Modified header to put search and tabs on the same line */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold self-start sm:self-center">
            Customers <span className="text-sm font-normal text-muted-foreground">({filteredCustomers.length})</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
            <motion.div
              className="w-full sm:w-[250px] mt-2 sm:mt-0"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <CustomerSearch 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchChange} 
              />
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <TabsList>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  <span>Table</span>
                </TabsTrigger>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Kanban className="h-4 w-4" />
                  <span>Kanban</span>
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <ChartPie className="h-4 w-4" />
                  <span>Charts</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <CustomerFilters 
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            subscriptionFilter={subscriptionFilter}
            dateFilter={dateFilter}
            dateSort={dateSort}
            onStatusFilterChange={setStatusFilter}
            onRoleFilterChange={setRoleFilter}
            onSubscriptionFilterChange={setSubscriptionFilter}
            onDateFilterChange={setDateFilter}
            onDateSortChange={handleDateSortChange}
          />
        </motion.div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="overflow-hidden"
        >
          <TabsContent value="table" className="mt-0">
            <CustomerTable customers={paginatedCustomers} isLoading={isLoading} />
            <CustomerPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TabsContent>
          
          <TabsContent value="kanban" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="rounded-md p-2 border border-border min-h-[200px]">
                    <div className="flex items-center mb-2">
                      <Skeleton className="h-5 w-5 mr-2" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="ml-auto h-4 w-6" />
                    </div>
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, j) => (
                        <Skeleton key={j} className="h-20 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CustomerKanban customers={paginatedCustomers} />
            )}
            <CustomerPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </motion.div>
              </div>
            ) : (
              <CustomerPieChart customers={sortedCustomers} />
            )}
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
};

export default CustomerTabs;
