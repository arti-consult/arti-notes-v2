
import { Table, TableBody } from "@/components/ui/table";
import { Customer } from "@/types/customer";
import { motion, AnimatePresence } from "framer-motion";
import CustomerTableHead from "./customer-table-head";
import CustomerTableRow from "./customer-table-row";

interface CustomerTableContentProps {
  customers: Customer[];
  sortColumn: keyof Customer;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof Customer) => void;
  onRowDoubleClick: (customer: Customer) => void;
  onActionClick: (customer: Customer, action: string) => void;
  isMobile: boolean;
}

const CustomerTableContent = ({
  customers,
  sortColumn,
  sortDirection,
  onSort,
  onRowDoubleClick,
  onActionClick,
  isMobile
}: CustomerTableContentProps) => {
  return (
    <div className="rounded-md border w-full overflow-auto">
      <div className={isMobile ? "w-full" : "min-w-[1160px]"}>
        <Table className="w-full table-fixed">
          <CustomerTableHead 
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <AnimatePresence mode="popLayout">
            <TableBody>
              {customers.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CustomerTableRow 
                    customer={customer}
                    onRowDoubleClick={onRowDoubleClick}
                    onActionClick={onActionClick}
                  />
                </motion.tr>
              ))}
            </TableBody>
          </AnimatePresence>
        </Table>
      </div>
    </div>
  );
};

export default CustomerTableContent;
