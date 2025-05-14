import { Customer } from "@/types/customer";
import { AnimatePresence } from "framer-motion";
import {
  ViewCustomerModal,
  EditCustomerModal,
  SendEmailModal,
  DeleteCustomerModal,
} from "../customer-modals";
import CustomerSidebar from "../customer-sidebar";

interface CustomerModalsManagerProps {
  activeCustomer: Customer | null;
  activeModal: string | null;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  onCloseModal: () => void;
}

const CustomerModalsManager = ({
  activeCustomer,
  activeModal,
  sidebarOpen,
  onCloseSidebar,
  onCloseModal,
}: CustomerModalsManagerProps) => {
  return (
    <>
      {/* Customer Sidebar with improved animation handling */}
      <AnimatePresence>
        {activeCustomer && sidebarOpen && (
          <CustomerSidebar
            customer={activeCustomer}
            open={sidebarOpen}
            onClose={onCloseSidebar}
          />
        )}
      </AnimatePresence>

      {/* Other Modals */}
      <AnimatePresence>
        {activeCustomer && activeModal === "view" && (
          <ViewCustomerModal customer={activeCustomer} onClose={onCloseModal} />
        )}
        {activeCustomer && activeModal === "edit" && (
          <EditCustomerModal customer={activeCustomer} onClose={onCloseModal} />
        )}
        {activeCustomer && activeModal === "email" && (
          <SendEmailModal customer={activeCustomer} onClose={onCloseModal} />
        )}
        {activeCustomer && activeModal === "delete" && (
          <DeleteCustomerModal
            customer={activeCustomer}
            onClose={onCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerModalsManager;
