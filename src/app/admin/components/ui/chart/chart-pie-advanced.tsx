
import * as React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useChart } from "./chart-context";
import { ChartTooltipContent } from "./chart-tooltip";
import { ChartLegendContent } from "./chart-legend";

interface ChartPieAdvancedProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  colors?: string[];
  isDonut?: boolean;
  title?: string;
  description?: string;
  className?: string;
  animated?: boolean;
}

export const ChartPieAdvanced = ({
  data,
  dataKey,
  nameKey = "name",
  innerRadius = 0,
  outerRadius = 80,
  height = 300,
  colors = ["#6564DB", "#8B80F9", "#A59BFF", "#4A49B0", "#312E81", "#4338CA", "#4F46E5"],
  isDonut = false,
  className,
  animated = true,
}: ChartPieAdvancedProps) => {
  const { config } = useChart();
  
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5 }}
      className={className}
      style={{ width: "100%", height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={isDonut ? innerRadius || 60 : 0}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            animationDuration={1500}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
