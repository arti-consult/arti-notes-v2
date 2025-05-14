
import { ForwardRefExoticComponent, RefAttributes, ReactNode } from "react";

// Define the themes
export const THEMES = {
  light: "",
  dark: ".dark",
};

// Define the chart configuration interface
export interface ChartConfig {
  [key: string]: {
    color?: string;
    label?: string;
    icon?: ForwardRefExoticComponent<RefAttributes<SVGSVGElement>>;
    theme?: {
      light?: string;
      dark?: string;
    };
  };
}

export interface ChartContextProps {
  config: ChartConfig;
  showValueTags?: boolean;
  isPercentage?: boolean;
  animated?: boolean;
}

// Updated function to work with payload objects from recharts
export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any, // Using any since recharts types are not properly exported
  key?: string
) {
  const payloadKey = typeof payload.name === "string" ? payload.name : key;
  return payloadKey ? config[payloadKey] : undefined;
}
