import React, { useState } from 'react';
import { Link } from '@inertiajs/react'; 
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
    id: string;
    title: string;
    href?: string;
    children?: {
        title: string;
        href: string;
        isHeader?: boolean;
    }[];
}

export function GlobalNavDropdown({ 
    label = "Management", 
    items = [] 
}: { 
    label: string; 
    items: NavItem[] 
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => {
                setIsMenuOpen(false);
                setActiveTab(null);
            }}
        >
            {/* TRIGGER BUTTON: Primary variant gamit ang maroon/yellow variables */}
            <Button
                variant="primary"
                className={cn(
                    "w-40 text-sm font-medium transition-all rounded-md flex items-center justify-between",
                    isMenuOpen && "text-[var(--primary-foreground-2)]"
                )}
            >
                {label}
                <ChevronDown className={cn("size-3 transition-transform duration-200", isMenuOpen && "rotate-180")} />
            </Button>

            {/* MAIN DROPDOWN */}
            {isMenuOpen && (
                <div className="absolute left-0 top-full mt-1 flex items-start animate-in fade-in zoom-in-95 duration-200 z-[100]">
                    <div className="w-40 rounded-b-xl bg-[var(--primary)] border border-white/10 overflow-visible">
                        {items.map((item) => (
                            <div key={item.id} onMouseEnter={() => setActiveTab(item.id)} className="relative">
                                <Link 
                                    href={item.href || '#'} 
                                    className={cn(
                                        "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 no-underline hover:no-underline",
                                        activeTab === item.id 
                                            ? "bg-[var(--sidebar-gradient-mid)] text-[var(--primary-foreground-2)]" 
                                            : "text-white/80 hover:text-white"
                                    )}
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{item.title}</span>
                                    {item.children && <ChevronRight className="size-3 opacity-50" />}
                                </Link>

                                {/* SUB-MENU DRILL DOWN */}
                                {activeTab === item.id && item.children && (
                                    <div className="absolute left-full top-0 ml-1 w-48 z-[110]">
                                        <div className="rounded-r-xl py-2 bg-[var(--primary)] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-left-1 duration-150">
                                            {item.children.map((sub, idx) => {
                                                {/* Logic para sa Indentation: Pantay sa header (pl-4) kung ito ay header o special clickable item */}
                                                const isHeaderLevel = sub.isHeader || 
                                                    ["Defense Management", "Panel Endorsement", "Proposal Review", "Panel Thesis Review"].includes(sub.title);

                                                return (
                                                    <div key={idx} className={cn(
                                                        "px-4 transition-colors",
                                                        sub.isHeader 
                                                            ? "text-white/40 pt-3 pb-1 text-[9px] uppercase tracking-widest font-black pointer-events-none" 
                                                            : "text-white py-1.5 text-[11px] hover:bg-[var(--sidebar-gradient-mid)] cursor-pointer",
                                                        /* Indentation logic: pl-4 para sa headers/main items, pl-10 para sa nested */
                                                        isHeaderLevel ? "pl-4" : "pl-10"
                                                    )}>
                                                        {sub.isHeader ? (
                                                            sub.title
                                                        ) : (
                                                            <Link 
                                                                href={sub.href} 
                                                                className="text-white no-underline hover:no-underline block w-full"
                                                            >
                                                                {sub.title}
                                                            </Link>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}