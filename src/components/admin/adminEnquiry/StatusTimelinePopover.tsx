import React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ENQUIRY_STATUS_CONFIG } from "@/utils/enquiryStatusConfig";
import { cn } from "@/lib/utils";

interface StatusTimelinePopoverProps {
  statusHistory?: Array<{ status: string; date: string }>;
}

export const StatusTimelinePopover: React.FC<StatusTimelinePopoverProps> = ({ statusHistory }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Clock className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="center">
        <h4 className="font-semibold text-sm mb-4">Status Timeline</h4>
        {!statusHistory || statusHistory.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No timeline data available.</p>
        ) : (
          <div className="relative border-l border-muted ml-3 space-y-6">
            {statusHistory.map((item, index) => {
              const cfg = ENQUIRY_STATUS_CONFIG[item.status as keyof typeof ENQUIRY_STATUS_CONFIG] || {
                label: item.status,
                dotClass: "bg-gray-400",
              };
              
              return (
                <div key={index} className="relative pl-6">
                  <span 
                    className={cn(
                      "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background",
                      cfg.dotClass
                    )} 
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium leading-none">{cfg.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.date ? format(new Date(item.date), "dd MMM yyyy, hh:mm a") : "Unknown Date"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
