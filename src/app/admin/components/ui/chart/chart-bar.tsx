
import * as React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useChart } from "./chart-context";
import { ChartTooltipContent } from "./chart-tooltip";
import { ChartLegendContent } from "./chart-legend";

interface ChartBarProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  categories?: string[];
  height?: number;
  colors?: string[];
  stackedBars?: boolean;
  showGrid?: boolean;
  title?: string;
  description?: string;
  className?: string;
  animated?: boolean;
}

export const ChartBar = ({
  data,
  nameKey = "name",
  categories = [],
  height = 300,
  colors = ["#6564DB", "#8B80F9", "#A59BFF", "#4A49B0"],
  stackedBars = false,
  showGrid = true,
  className,
  animated = true,
}: ChartBarProps) => {
  const { config } = useChart();
  
  // If no categories are provided, extract them from the data
  const chartCategories = 
    categories.length > 0 
      ? categories 
      : Object.keys(data[0] || {}).filter(key => key !== nameKey);

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5 }}
      className={className}
      style={{ width: "100%", height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border"
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={nameKey} />
          <YAxis />
          <Tooltip content={<ChartTooltipContent showValueTags={true} />} />
          <Legend content={<ChartLegendContent />} />
          
          {chartCategories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              stackId={stackedBars ? "stack" : undefined}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
