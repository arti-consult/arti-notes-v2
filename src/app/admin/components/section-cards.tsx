import { TrendingUpIcon, Users, DollarSign, Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({
  preRevenueCustomersCount = 0,
  revenueCustomersCount = 0,
}: {
  preRevenueCustomersCount?: number;
  revenueCustomersCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-4 lg:px-6">
      <Card className="relative">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <CardDescription>Total Revenue</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            $45,231.89
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +20.1%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <span>+$2,350 from last month</span>
        </CardFooter>
      </Card>

      <Card className="relative">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardDescription>Pre Revenue Customers</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {preRevenueCustomersCount}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +180.1%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <span>+180.1% from last month</span>
        </CardFooter>
      </Card>

      <Card className="relative">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardDescription>Revenue Customers</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {revenueCustomersCount}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <span>+12.5% from last month</span>
        </CardFooter>
      </Card>

      <Card className="relative">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardDescription>Growth Rate</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <span>+4.5% from last month</span>
        </CardFooter>
      </Card>
    </div>
  );
}
