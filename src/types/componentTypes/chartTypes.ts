export const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

export type ChartDataItem = Record<string, string | number>;
export interface RadialChartInterface<T extends ChartDataItem> {
  title: string;
  description: string;
  chartData: T[];
  dataKeyOne: keyof T;
  dataKeyTwo: keyof T;
  chartConfig: ChartConfig;
  isLocked?: boolean;
}


export type TimeRange = "7d"
  | "14d"
  | "30d"
  | "45d"
  | "60d"
  | "90d"
  | "180d"
  | "365d"
  
export interface ChartHeaderInterface {
    title: string;
    description?: string;
    onValueChange?: (value: TimeRange) => void;
    value?: string;
}

export interface dataSelectListItemInterface {
  value: string;
  content: string;
}

export interface DateSelectInterface {
    onValueChange: (value: TimeRange) => void;
    value: string;
}

export interface ChatComponentProps<T extends { date: string }> {
  title: string;
  description: string;
  chartData: T[];
  dataKeyOne: string;
  dataKeyTwo: string;
  dataKeyThree?: string;
  dataKeyFour?: string;
  dataKeyFive?: string;
  nameKey: string;
  chartConfig: ChartConfig;
  isLocked?: boolean;
}

export type BaseChartData = {
  date: string;
  [key: string]: number | string | undefined;
};

export type AreaGroupChartProps = Pick<ChatComponentProps<BaseChartData>, "title" | "description" | "chartData" | "dataKeyOne" | "dataKeyTwo" | "dataKeyThree" | "chartConfig" | "isLocked">;

export type BarChartVerticalProps = Pick<ChatComponentProps<BaseChartData>, "title" | "description" | "chartData" | "dataKeyOne" | "dataKeyTwo" | "chartConfig" | "isLocked"> ;

export type ChartLineMultipleProps = Pick<ChatComponentProps<BaseChartData>, "title" | "description" | "chartData" | "dataKeyOne" | "dataKeyTwo" | "dataKeyThree" | "dataKeyFour" | "dataKeyFive" | "chartConfig" | "isLocked"> ;
