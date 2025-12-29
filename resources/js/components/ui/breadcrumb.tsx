import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  items: string[];
  className?: string;
}

const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ items, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-2.5", className)}
        role="navigation"
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Button
              variant="secondary"
              size="default"
              className={cn(
                "text-[13.33px] font-medium rounded-lg",
                "!bg-transparent !text-primary !border-none !shadow-none",
                "hover:!bg-white/70",
                "active:!bg-primary-foreground-2",
                "disabled:!bg-transparent disabled:!opacity-100 disabled:cursor-default",
                "focus:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
              )}
              disabled={index === items.length - 1}
            >
              {item}
            </Button>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </div>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbSeparator = () => (
  <div className="flex items-center justify-center w-3.5 h-3.5">
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
    >
      <path
        d="M5.25 10.5L8.75 7L5.25 3.5"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  </div>
);

export { Breadcrumb };