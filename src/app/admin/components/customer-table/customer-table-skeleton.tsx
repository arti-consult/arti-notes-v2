
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerTableHead from "./customer-table-head";

interface CustomerTableSkeletonProps {
  isMobile: boolean;
}

const CustomerTableSkeleton = ({ isMobile }: CustomerTableSkeletonProps) => {
  return (
    <div className="rounded-md border w-full overflow-hidden">
      <div className={isMobile ? "w-full" : "min-w-[1160px]"}>
        <Table className="w-full table-fixed">
          <CustomerTableHead 
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          />
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b animate-pulse">
                <td className="p-4"><Skeleton className="h-8 w-full" /></td>
                <td className="p-4"><Skeleton className="h-8 w-full" /></td>
                <td className="p-4"><Skeleton className="h-8 w-3/4" /></td>
                <td className="p-4"><Skeleton className="h-8 w-1/2" /></td>
                <td className="p-4"><Skeleton className="h-8 w-3/4" /></td>
                <td className="p-4"><Skeleton className="h-8 w-3/4" /></td>
                <td className="p-4"><Skeleton className="h-8 w-1/2" /></td>
                <td className="p-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerTableSkeleton;
