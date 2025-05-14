
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ChartContext } from "./chart-context";
import { ChartConfig } from "./types";

interface ChartContainerProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  title?: string;
  description?: string;
  config?: ChartConfig;
  animated?: boolean; // Add the animated prop to the interface
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, title, description, children, config = {}, animated = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("space-y-4", className)}
        initial={animated ? { opacity: 0, y: 20 } : false}
        animate={animated ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-1">
            {title && <h3 className="text-lg font-medium">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="pt-4">
          <ChartContext.Provider value={{ 
            config, 
            animated, 
            showValueTags: false, 
            isPercentage: false 
          }}>
            {children as React.ReactNode}
          </ChartContext.Provider>
        </div>
      </motion.div>
    );
  }
);

ChartContainer.displayName = "ChartContainer";

export { ChartContainer };
