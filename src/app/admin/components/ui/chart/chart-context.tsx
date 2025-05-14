
import * as React from "react";
import { ChartContextProps } from "./types";

// Initialize with default values to avoid type errors
const defaultContextValue: ChartContextProps = {
  config: {},
  animated: false,
  showValueTags: false,
  isPercentage: false,
};

export const ChartContext = React.createContext<ChartContextProps>(defaultContextValue);

export function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}
