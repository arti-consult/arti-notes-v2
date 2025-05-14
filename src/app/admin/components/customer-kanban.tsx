
import { useState, useEffect } from "react";
import { Customer, CustomerStatus } from "@/types/customer";
import CustomerCard from "./customer-card";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { Circle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerKanbanProps {
  customers: Customer[];
}

type ColumnType = "active" | "inactive" | "pending" | "new";

interface Column {
  id: ColumnType;
  title: string;
  icon: React.ReactNode;
  customers: Customer[];
}

const CustomerKanban = ({ customers: initialCustomers }: CustomerKanbanProps) => {
  // Setup state for draggable customers
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const isMobile = useIsMobile();
  
  // Update customers when filtered results change
  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  // Group customers by status
  const columns: Column[] = [
    {
      id: "active",
      title: "Active",
      icon: <CheckCircle className="h-4 w-4" />,
      customers: customers.filter(customer => customer.status === "active")
    },
    {
      id: "pending",
      title: "Pending",
      icon: <Clock className="h-4 w-4" />,
      customers: customers.filter(customer => customer.status === "pending")
    },
    {
      id: "new",
      title: "New",
      icon: <Circle className="h-4 w-4" />,
      customers: customers.filter(customer => customer.status === "new")
    },
    {
      id: "inactive",
      title: "Inactive",
      icon: <AlertCircle className="h-4 w-4" />,
      customers: customers.filter(customer => customer.status === "inactive")
    }
  ];

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Find source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Find the moved customer
    const movedCustomer = sourceColumn.customers[source.index];
    
    // If moving between columns, update customer status
    if (source.droppableId !== destination.droppableId) {
      // Create a copy of customers
      const newCustomers = [...customers];
      
      // Find the customer in the original array and update its status
      const customerIndex = newCustomers.findIndex(c => c.id === movedCustomer.id);
      if (customerIndex !== -1) {
        // Create a new updated customer object
        const updatedCustomer = {
          ...newCustomers[customerIndex],
          status: destination.droppableId as CustomerStatus
        };
        
        // Replace the old customer with the updated one
        newCustomers[customerIndex] = updatedCustomer;
        
        // Show toast notification
        toast.success(`${movedCustomer.name} moved to ${destColumn.title}`);
      }
      
      // Update state
      setCustomers(newCustomers);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Responsive grid based on screen size
  const gridClasses = isMobile
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2";

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <motion.div 
        className={gridClasses}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {columns.map((column) => (
            <motion.div 
              key={column.id}
              className="rounded-md p-2 border border-border"
              variants={columnVariants}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex items-center mb-2">
                <div className={`text-status-${column.id} mr-2`}>
                  {column.icon}
                </div>
                <h3 className="font-medium text-sm">{column.title}</h3>
                <span className="ml-auto bg-muted px-2 py-0.5 rounded text-xs font-medium">
                  {column.customers.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    className={`min-h-[150px] ${snapshot.isDraggingOver ? "bg-muted/50 rounded-md transition-colors duration-200" : ""}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <AnimatePresence>
                      {column.customers.map((customer, index) => (
                        <Draggable 
                          key={customer.id} 
                          draggableId={customer.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CustomerCard customer={customer} isDragging={snapshot.isDragging} />
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </DragDropContext>
  );
};

export default CustomerKanban;
