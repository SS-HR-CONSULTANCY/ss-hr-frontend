import type { ReactNode } from "react";

interface TablePageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: ReactNode;
}

const TablePageHeader = ({
  title,
  subtitle,
  actionButton,
}: TablePageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {actionButton && actionButton}
    </div>
  );
};

export default TablePageHeader;
