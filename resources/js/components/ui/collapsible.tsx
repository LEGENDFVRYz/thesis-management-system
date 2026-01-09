import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const collapsibleVariants = cva("group w-full space-y-0", {
    variants: {
        variant: {
            default: "",
            faq: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

interface CollapsibleProps
    extends React.ComponentProps<typeof CollapsiblePrimitive.Root>,
        VariantProps<typeof collapsibleVariants> {}

function Collapsible({
    className,
    variant,
    ...props
}: CollapsibleProps) {
    return (
        <CollapsiblePrimitive.Root
            data-slot="collapsible"
            data-variant={variant}
            className={cn(collapsibleVariants({ variant }), className)}
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
                "flex w-full items-center justify-between border p-4 transition-all duration-200",

                // DEFAULT VARIANT
                "group-data-[variant=default]:rounded-xl",
                "group-data-[variant=default]:bg-background group-data-[variant=default]:border-muted-foreground group-data-[variant=default]:text-foreground group-data-[variant=default]:hover:bg-border",
                "group-data-[variant=default]:data-[state=open]:bg-primary group-data-[variant=default]:data-[state=open]:text-background group-data-[variant=default]:data-[state=open]:border-primary",
                "group-data-[variant=default]:data-[state=open]:border-b-0",
                "group-data-[variant=default]:data-[state=open]:rounded-b-none",

                // FAQ VARIANT
                "group-data-[variant=faq]:bg-white group-data-[variant=faq]:border-[#E5E7EB]",
                "group-data-[variant=faq]:rounded-[10px]",
                "group-data-[variant=faq]:data-[state=open]:rounded-b-none",
                "group-data-[variant=faq]:data-[state=open]:border-b-0",

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
                "overflow-hidden border border-t-0 p-6 text-sm transition-all",

                // DEFAULT VARIANT
                "group-data-[variant=default]:rounded-b-xl",
                "group-data-[variant=default]:bg-background group-data-[variant=default]:dark:bg-slate-950 group-data-[variant=default]:border-slate-200 group-data-[variant=default]:dark:border-slate-800 group-data-[variant=default]:text-slate-600 group-data-[variant=default]:dark:text-slate-400",

                // FAQ VARIANT
                "group-data-[variant=faq]:rounded-b-[10px]",
                "group-data-[variant=faq]:bg-white group-data-[variant=faq]:border-[#E5E7EB]",

                className
            )}
            {...props}
        />
    )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }