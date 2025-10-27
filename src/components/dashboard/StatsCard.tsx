import React from "react";
import { Activity, type LucideIcon } from "lucide-react";
import { formatNumberToPrice } from "@/utils/helpers/priceFormater";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardOneProps {
  title: string;
  value: number;
  icon: LucideIcon;
  price?: boolean;
}

const StatsCard: React.FC<DashboardCardOneProps> = ({
  title,
  value,
  icon: Icon,
  price,
}) => {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {Icon ? <Icon size={24} /> : <Activity size={24} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {price ? formatNumberToPrice(value as number) : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
