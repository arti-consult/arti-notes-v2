
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customers } from "@/data/customers";
import { CustomerRole } from "@/types/customer";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

type RoleCount = {
  role: CustomerRole;
  count: number;
  percentage: number;
};

export function RoleStatistics() {
  const roleStats = useMemo(() => {
    const roleCounts: Record<CustomerRole, number> = {
      user: 0,
      admin: 0,
      manager: 0,
      developer: 0,
      guest: 0,
    };

    // Count users by role
    customers.forEach((customer) => {
      roleCounts[customer.role]++;
    });

    const totalCustomers = customers.length;
    
    // Create statistics array
    const stats: RoleCount[] = Object.entries(roleCounts).map(([role, count]) => ({
      role: role as CustomerRole,
      count,
      percentage: Math.round((count / totalCustomers) * 100),
    }));
    
    // Sort by count descending
    return stats.sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {roleStats.map((stat) => (
        <motion.div
          key={stat.role}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                {stat.role}s
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{stat.percentage}%</span>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
