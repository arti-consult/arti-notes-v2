import { useState } from "react";
import { Customer } from "@/types/customer";
import { useTableSort } from "@/hooks/use-table-sort";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import CustomerTableSkeleton from "./customer-table-skeleton";
import CustomerTableContent from "./customer-table-content";
import CustomerTablePagination from "./customer-table-pagination";
import CustomerModalsManager from "./customer-modals-manager";

interface CustomerTableProps {
  customers: Customer[];
  isLoading?: boolean;
}

const CustomerTable = ({
  customers,
  isLoading = false,
}: CustomerTableProps) => {
  const { sortColumn, sortDirection, handleSort, sortItems } =
    useTableSort<Customer>("name");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const closeModal = () => {
    setActiveModal(null);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    // We reset the activeCustomer state only after the sidebar has fully closed
    setTimeout(() => {
      setActiveCustomer(null);
    }, 300); // Match this to the sidebar animation duration
  };

  const openModal = (customer: Customer, modalType: string) => {
    // Reset any previous state first
    setActiveModal(null);
    setSidebarOpen(false);

    // Set new state with slight delay to ensure previous states are cleared
    setTimeout(() => {
      setActiveCustomer(customer);

      // If action is "view", open the sidebar instead
      if (modalType === "view") {
        setSidebarOpen(true);
      } else {
        setActiveModal(modalType);
      }
    }, 50);
  };

  const handleRowDoubleClick = (customer: Customer) => {
    // Reset state first
    setSidebarOpen(false);
    setActiveModal(null);

    // Then set new state with slight delay
    setTimeout(() => {
      setActiveCustomer(customer);
      setActiveModal("view"); // Открываем модальное окно вместо боковой панели
    }, 50);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render loading skeleton
  if (isLoading) {
    return <CustomerTableSkeleton isMobile={isMobile} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <CustomerTableContent
        customers={sortItems(customers)}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowDoubleClick={handleRowDoubleClick}
        onActionClick={openModal}
        isMobile={isMobile}
      />

      {/* Show All Pages Button */}
      <CustomerTablePagination onScrollToTop={handleScrollToTop} />

      {/* Customer Sidebar and Modals */}
      <CustomerModalsManager
        activeCustomer={activeCustomer}
        activeModal={activeModal}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        onCloseModal={closeModal}
      />
    </motion.div>
  );
};

export default CustomerTable;
