
import * as React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useChart } from "./chart-context";
import { ChartTooltipContent } from "./chart-tooltip";
import { ChartLegendContent } from "./chart-legend";

interface ChartLineProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  categories?: string[];
  height?: number;
  colors?: string[];
  strokeWidth?: number;
  showGrid?: boolean;
  showArea?: boolean;
  title?: string;
  description?: string;
  className?: string;
  animated?: boolean;
}

export const ChartLine = ({
  data,
  nameKey = "name",
  categories = [],
  height = 300,
  colors = ["#6564DB", "#8B80F9", "#A59BFF", "#4A49B0"],
  strokeWidth = 2,
  showGrid = true,
  className,
  animated = true,
}: ChartLineProps) => {
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
        <LineChart
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
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
