import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function Collapsible({
    className,
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
    return (
        <CollapsiblePrimitive.Root 
            data-slot="collapsible" 
            className={cn("group w-full space-y-0", className)} 
            {...props} 
        />
    )
}

/* TRIGGER (HEADER) */
function CollapsibleTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
    return (
        <CollapsiblePrimitive.CollapsibleTrigger
            data-slot="collapsible-trigger"
            className={cn(
                "flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-200",
                
                // CLOSED STATE STYLES
                "bg-background border-muted-foreground text-foreground hover:bg-border",
                
                // OPENED STATE STYLES
                // 1. Switches background to Maroon
                "data-[state=open]:bg-primary data-[state=open]:text-background data-[state=open]:border-primary",
                
                // 2. Removes the bottom border so it doesn't separate from the content
                "data-[state=open]:border-b-0",
                
                // 3. Squares the bottom corners so the header flows into the content box
                "data-[state=open]:rounded-b-none",
                
                className
            )}
            {...props}
        >
            {children}
            {/* The Chevron rotates 180 degrees based on the data-state of the parent */}
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsiblePrimitive.CollapsibleTrigger>
    )
}

/* CONTENT AREA */
function CollapsibleContent({
    className,
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
    return (
        <CollapsiblePrimitive.CollapsibleContent
            data-slot="collapsible-content"
            className={cn(
                // Rounded-b-xl keeps the bottom corners consistent with the card shape
                "overflow-hidden rounded-b-xl border border-t-0 p-6 text-sm transition-all",
                
                // Background and text colors responsive to dark mode
                "bg-background dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400",
                
                className
            )}
            {...props}
        />
    )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }