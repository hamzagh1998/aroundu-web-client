import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function CustomTooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-secondary text-sm font-bold">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
