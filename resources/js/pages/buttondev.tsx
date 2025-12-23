import * as React from "react"
import { Button } from "@/components/ui/button";
import { 
    Moon, Sun, Plus, Trash2, Send, 
    ArrowRight, Loader2, Settings, Download, 
    ChevronRight, Mail, Copy, Check,
    ChevronDown
} from 'lucide-react';

export default function ButtonDev() {
    const [theme, setTheme] = React.useState("light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <div className="min-h-screen p-8 lg:p-20 bg-background text-foreground transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-16">
                
                {/* Header */}
                <header className="flex justify-between items-end border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Button Components</h1>
                        <p className="text-muted-foreground mt-2">Variants, sizes, and layouts of buttons with light and dark mode.</p>
                    </div>
                    <Button variant="tertiary" size="icon" onClick={toggleTheme} className="rounded-full shadow-inner border-2">
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </Button>
                </header>

                {/* 1. Primary Variant Matrix */}
                <VariantRow 
                    title="Primary" 
                    description="Main call-to-action buttons for important actions."
                    variant="primary"
                />

                {/* 2. Secondary Variant Matrix */}
                <VariantRow 
                    title="Secondary" 
                    description="Alternative actions with less visual weight."
                    variant="secondary"
                />

                {/* 3. Tertiary Variant Matrix */}
                <VariantRow 
                    title="Tertiary" 
                    description="Outlined style for low-priority or supporting actions."
                    variant="tertiary"
                />

                {/* 4. Negative Variant Matrix */}
                <VariantRow 
                    title="Negative" 
                    description="Danger actions like deletion or cancellation."
                    variant="negative"
                    icon={<Trash2 className="size-4" />}
                />

                {/* 5. Negative-Light Variant Matrix */}
                <VariantRow 
                    title="Negative-Light" 
                    description="Danger actions like deletion or cancellation."
                    variant="negativelight"
                    icon={<Trash2 className="size-4" />}
                />

                {/* 6. Ghost Variant Matrix */}
                <VariantRow 
                    title="Ghost" 
                    description="Clean style for toolbars or secondary navigation."
                    variant="ghost"
                    icon={<Settings className="size-4" />}
                />

                {/* 7. Link Variant Matrix */}
                <VariantRow 
                    title="Link" 
                    description="Textual links styled as buttons for navigation."
                    variant="link"
                    icon={<Settings className="size-4" />}
                />

                {/* Theme Debug Footer */}
                <footer className="sticky bottom-8 p-4 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-xl max-w-fit mx-auto flex items-center gap-6 px-8">
                    <div className="flex items-center gap-2 text-sm font-bold">
                        <div className={`size-3 rounded-full ${theme === 'light' ? 'bg-[#730000]' : 'bg-[#FFBD00]'}`} />
                        {theme.toUpperCase()} MODE
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex gap-4">
                        <Button variant="link" size="sm" className="h-auto p-0">Documentation</Button>
                        <Button variant="link" size="sm" className="h-auto p-0">Github</Button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

/**
 * A reusable row that shows a single variant in all sizes and layout types
 */
function VariantRow({ 
    title, 
    description, 
    variant, 
    icon = <Plus className="size-4" /> 
}: { 
    title: string, 
    description: string, 
    variant: any,
    icon?: React.ReactNode
}) {
    return (
        <section className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
                <h2 className="text-xl font-bold tracking-tight">{title} Variant</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-card/50 p-8 rounded-2xl border border-border/50">
                
                {/* Column 1: Sizes */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Sizes (Text Only)</p>
                    <div className="flex flex-col gap-3 items-start">
                        <Button variant={variant} size="sm">Small</Button>
                        <Button variant={variant} size="default">Default</Button>
                        <Button variant={variant} size="lg">Large</Button>
                    </div>
                </div>

                {/* Column 2: Icon Layouts */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Layouts (Default Size)</p>
                    <div className="flex flex-col gap-3 items-start">
                        <Button variant={variant}>{icon} Icon Left</Button>
                        <Button variant={variant}>Icon Right <ArrowRight className="size-4" /></Button>
                        <Button variant={variant} disabled><Loader2 className="size-4 animate-spin" /> Loading</Button>
                    </div>
                </div>

                {/* Column 3: Icon Only */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Square Icons</p>
                    <div className="flex items-center gap-3">
                        <Button variant={variant} size="icon" className="size-8">{icon}</Button>
                        <Button variant={variant} size="icon" className="size-10">{icon}</Button>
                        <Button variant={variant} size="icon" className="size-12">{icon}</Button>
                    </div>
                </div>

                {/* Column 4: Contextual Examples */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Context Use</p>
                    <div className="flex flex-col gap-3 items-start">
                        <Button variant={variant} className="w-full justify-between">
                            Menu Option <ChevronDown className="size-4 opacity-50" />
                        </Button>
                        <Button variant={variant} size="sm" className="rounded-full px-4">
                            Pill Style
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    );
}