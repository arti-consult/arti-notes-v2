import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/customer";
import { motion } from 'framer-motion';
import { 
  ChartContainer, 
  ChartPieAdvanced, 
  ChartBar, 
  ChartLine
} from "@/components/ui/chart";

interface CustomerPieChartProps {
  customers: Customer[];
}

// Enhanced colors for better visualization
const COLORS = {
  subscription: {
    free: '#8E9196',       // Neutral gray
    basic: '#9b87f5',      // Primary purple
    professional: '#0EA5E9', // Ocean blue
    enterprise: '#F97316', // Bright orange
  },
  status: {
    active: '#22c55e',      // Green
    inactive: '#ef4444',    // Red
    pending: '#f59e0b',     // Yellow/Amber
    new: '#3b82f6'          // Blue
  },
  growth: ['#22c55e', '#9b87f5', '#0EA5E9', '#F97316'],
  value: ['#6564DB', '#8B80F9', '#A59BFF', '#4A49B0', '#353486'],
  age: ['#D3E4FD', '#0EA5E9', '#1EAEDB', '#33C3F0', '#0FA0CE']
};

// Convert USD to NOK
const convertToNOK = (usdValue: number) => {
  // Using a fixed exchange rate of 1 USD = 10.5 NOK
  const nokValue = usdValue * 10.5;
  return nokValue.toLocaleString('no-NO');
};

// Implement getSubscriptionColor function for consistent colors
const getSubscriptionColor = (subscription: string): string => {
  return (COLORS.subscription as Record<string, string>)[subscription] || '#8E9196';
};

const getStatusColor = (status: string): string => {
  return (COLORS.status as Record<string, string>)[status] || '#8E9196';
};

const CustomerPieChart = ({ customers }: CustomerPieChartProps) => {
  const [activeTab, setActiveTab] = useState('subscription');
  const [activeChartTab, setActiveChartTab] = useState('pie');
  const [timeRange, setTimeRange] = useState('all');

  // Data preparation helpers
  const prepareSubscriptionData = () => {
    const subscriptionCounts: Record<string, number> = {};
    
    customers.forEach(customer => {
      if (subscriptionCounts[customer.subscription]) {
        subscriptionCounts[customer.subscription]++;
      } else {
        subscriptionCounts[customer.subscription] = 1;
      }
    });
    
    return Object.keys(subscriptionCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: subscriptionCounts[key],
      color: getSubscriptionColor(key)
    }));
  };

  const prepareStatusData = () => {
    const statusCounts: Record<string, number> = {};
    
    customers.forEach(customer => {
      if (statusCounts[customer.status]) {
        statusCounts[customer.status]++;
      } else {
        statusCounts[customer.status] = 1;
      }
    });
    
    return Object.keys(statusCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusCounts[key],
      color: getStatusColor(key)
    }));
  };

  const prepareValueData = () => {
    const valueBrackets = [
      { range: '0-1K', min: 0, max: 1000 },
      { range: '1K-5K', min: 1000, max: 5000 },
      { range: '5K-10K', min: 5000, max: 10000 },
      { range: '10K-50K', min: 10000, max: 50000 },
      { range: '50K+', min: 50000, max: Infinity }
    ];
    
    const valueCounts: Record<string, number> = {};
    valueBrackets.forEach(bracket => {
      valueCounts[bracket.range] = 0;
    });
    
    customers.forEach(customer => {
      const bracket = valueBrackets.find(
        b => customer.value >= b.min && customer.value < b.max
      );
      if (bracket) {
        valueCounts[bracket.range]++;
      }
    });
    
    return Object.keys(valueCounts)
      .filter(key => valueCounts[key] > 0)
      .map((key, index) => ({
        name: key,
        value: valueCounts[key],
        color: COLORS.value[index % COLORS.value.length]
      }));
  };

  const prepareAgeData = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    const counts = {
      'Last Month': 0,
      '1-3 Months': 0,
      '3-6 Months': 0,
      '6-12 Months': 0,
      'Over a Year': 0
    };
    
    customers.forEach(customer => {
      const createdAt = new Date(customer.createdAt);
      
      if (createdAt >= oneMonthAgo) {
        counts['Last Month']++;
      } else if (createdAt >= threeMonthsAgo) {
        counts['1-3 Months']++;
      } else if (createdAt >= sixMonthsAgo) {
        counts['3-6 Months']++;
      } else if (createdAt >= yearAgo) {
        counts['6-12 Months']++;
      } else {
        counts['Over a Year']++;
      }
    });
    
    return Object.keys(counts).map((key, index) => ({
      name: key,
      value: counts[key],
      color: COLORS.age[index % COLORS.age.length]
    }));
  };

  // NEW: Prepare time-based data for trends
  const prepareCustomerGrowthData = () => {
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, 0, 1);
    const months = [];
    
    // Create array of last 12 months
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.unshift(month); // Add to beginning so months are in chronological order
    }
    
    // Initialize data structure for counting
    const growthData = months.map(month => {
      return {
        name: month.toLocaleString('default', { month: 'short' }) + ' ' + month.getFullYear().toString().slice(2),
        Active: 0,
        Inactive: 0,
        New: 0,
        Pending: 0,
        Month: month
      };
    });
    
    // Count customers by month and status
    customers.forEach(customer => {
      const createdAt = new Date(customer.createdAt);
      if (createdAt < lastYear) return;
      
      // Find which month this customer belongs to
      const monthIndex = growthData.findIndex(data => {
        const month = data.Month;
        return createdAt.getMonth() === month.getMonth() && 
               createdAt.getFullYear() === month.getFullYear();
      });
      
      if (monthIndex !== -1) {
        // Increment the appropriate status counter
        const status = customer.status.charAt(0).toUpperCase() + customer.status.slice(1);
        if (growthData[monthIndex][status] !== undefined) {
          growthData[monthIndex][status]++;
        }
      }
    });
    
    // Remove the Month property as it's just for calculation
    return growthData.map(({ Month, ...rest }) => rest);
  };
  
  // Prepare value distribution by month
  const prepareValueTrendData = () => {
    const now = new Date();
    const months = [];
    
    // Create array of last 6 months
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.unshift(month); // Add to beginning so months are in chronological order
    }
    
    // Initialize data structure
    const valueData = months.map(month => {
      return {
        name: month.toLocaleString('default', { month: 'short' }) + ' ' + month.getFullYear().toString().slice(2),
        'Average Value': 0,
        'Max Value': 0,
        Month: month
      };
    });
    
    // Calculate average and max values by month
    months.forEach((month, i) => {
      const nextMonth = i < months.length - 1 ? months[i + 1] : new Date();
      
      // Get customers created in this month
      const monthCustomers = customers.filter(customer => {
        const createdAt = new Date(customer.createdAt);
        return createdAt >= month && createdAt < nextMonth;
      });
      
      if (monthCustomers.length > 0) {
        const totalValue = monthCustomers.reduce((sum, customer) => sum + customer.value, 0);
        const avgValue = Math.round(totalValue / monthCustomers.length);
        const maxValue = Math.max(...monthCustomers.map(c => c.value));
        
        valueData[i]['Average Value'] = avgValue;
        valueData[i]['Max Value'] = maxValue;
      }
    });
    
    // Remove the Month property as it's just for calculation
    return valueData.map(({ Month, ...rest }) => rest);
  };

  // Data state
  const [data, setData] = useState(() => prepareSubscriptionData());
  const [growthData, setGrowthData] = useState(() => prepareCustomerGrowthData());
  const [valueTrendData, setValueTrendData] = useState(() => prepareValueTrendData());
  
  // Update data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'subscription':
        setData(prepareSubscriptionData());
        break;
      case 'status':
        setData(prepareStatusData());
        break;
      case 'value':
        setData(prepareValueData());
        break;
      case 'age':
        setData(prepareAgeData());
        break;
      default:
        setData(prepareSubscriptionData());
    }
  }, [activeTab, customers]);

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalValue = customers.reduce((sum, customer) => sum + customer.value, 0);
  const averageValue = totalCustomers > 0 ? totalValue / totalCustomers : 0;
  
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const activePercentage = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
  
  const enterpriseCustomers = customers.filter(c => c.subscription === 'enterprise').length;
  const enterprisePercentage = totalCustomers > 0 ? (enterpriseCustomers / totalCustomers) * 100 : 0;
  
  const getTabTitle = () => {
    switch (activeTab) {
      case 'subscription': return 'Subscription Distribution';
      case 'status': return 'Customer Status Distribution';
      case 'value': return 'Customer Value Distribution';
      case 'age': return 'Customer Age Distribution';
      default: return 'Distribution';
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-background border rounded-md p-3 shadow-md"
        >
          <p className="font-semibold">{`${data.name}: ${data.value}`}</p>
          <p className="text-sm text-muted-foreground">{`${((data.value / customers.length) * 100).toFixed(1)}%`}</p>
        </motion.div>
      );
    }
    return null;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-2xl font-bold"
              >
                {totalCustomers}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-2xl font-bold"
                >
                  {activeCustomers}
                </motion.div>
                <Badge variant="outline" className="text-xs">{activePercentage.toFixed(1)}%</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enterprise Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-2xl font-bold"
                >
                  {enterpriseCustomers}
                </motion.div>
                <Badge variant="outline" className="text-xs">{enterprisePercentage.toFixed(1)}%</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Value</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-2xl font-bold"
              >
                NOK {convertToNOK(averageValue)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Customer Growth Trends - New Chart */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Customer Growth Trends</CardTitle>
            <CardDescription>Monthly customer acquisition by status over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ChartBar
                data={growthData}
                dataKey="value"
                height={350}
                stackedBars={true}
                colors={[COLORS.status.active, COLORS.status.inactive, COLORS.status.pending, COLORS.status.new]}
                categories={["Active", "Inactive", "Pending", "New"]}
              />
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Value Trends - New Chart */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Customer Value Trends</CardTitle>
            <CardDescription>Average and maximum customer value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ChartLine
                data={valueTrendData}
                dataKey="value"
                height={300}
                categories={["Average Value", "Max Value"]}
                colors={['#6564DB', '#F97316']}
              />
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Pie Chart with enhanced visualization */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>{getTabTitle()}</CardTitle>
            <CardDescription>
              Breakdown of customers based on {activeTab === 'value' ? 'value range' : activeTab}
            </CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="value">Value</TabsTrigger>
                  <TabsTrigger value="age">Age</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs value={activeChartTab} onValueChange={setActiveChartTab}>
                <TabsList>
                  <TabsTrigger value="pie">Pie</TabsTrigger>
                  <TabsTrigger value="donut">Donut</TabsTrigger>
                  <TabsTrigger value="bar">Bar</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              {activeChartTab === 'pie' && (
                <ChartPieAdvanced
                  data={data}
                  dataKey="value"
                  height={400}
                  isDonut={false}
                />
              )}
              
              {activeChartTab === 'donut' && (
                <ChartPieAdvanced
                  data={data}
                  dataKey="value"
                  height={400}
                  isDonut={true}
                  innerRadius={70}
                  outerRadius={130}
                />
              )}
              
              {activeChartTab === 'bar' && (
                <ChartBar
                  data={data.map(item => ({ name: item.name, Value: item.value }))}
                  dataKey="Value"
                  height={400}
                  colors={data.map(item => item.color)}
                />
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Additional metrics - Keep existing but improved visually */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Top Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const subscriptions = prepareSubscriptionData();
                subscriptions.sort((a, b) => b.value - a.value);
                const topSub = subscriptions[0];
                
                return topSub ? (
                  <div className="space-y-2">
                    <div className="text-xl font-bold">{topSub.name}</div>
                    <div className="text-muted-foreground">
                      {topSub.value} customers ({((topSub.value / totalCustomers) * 100).toFixed(1)}%)
                    </div>
                  </div>
                ) : <div>No data</div>
              })()}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Most Recent Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl font-bold">
                  {prepareAgeData()[0]?.value || 0}
                </div>
                <div className="text-muted-foreground">
                  customers joined in the last month
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">High Value Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const highValueUsd = 10000;
                const highValueNok = highValueUsd * 10.5;
                const highValueCount = customers.filter(c => c.value > highValueUsd).length;
                const percentage = ((highValueCount / totalCustomers) * 100).toFixed(1);
                
                return (
                  <div className="space-y-2">
                    <div className="text-xl font-bold">{highValueCount}</div>
                    <div className="text-muted-foreground">
                      customers with value over NOK {highValueNok.toLocaleString('no-NO')} ({percentage}%)
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CustomerPieChart;
