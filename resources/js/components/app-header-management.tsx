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

interface Props {
    label?: string;
    items: NavItem[];
    variant?: 'faculty' | 'admin' | 'coordinator' | 'student';
}

export function GlobalNavDropdown({ 
    label = "Management", 
    items = [],
    variant = 'faculty'
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const isAdmin = variant === 'admin';
    const isCoordinator = variant === 'coordinator';
    const isStudent = variant === 'student';

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => {
                setIsMenuOpen(false);
                setActiveTab(null);
            }}
        >
            {/* --- TRIGGER BUTTON --- */}
            <Button
                variant="primary"
                className={cn(
                    "mx-1 border-none shadow-none",
                    /* Added underline and ensured text remains yellow on hover */
                    "hover:text-primary-foreground-2 hover:underline"
                )}
            >
                <span>{label}</span>
                <ChevronDown className={cn(
                    "size-4 transition-transform duration-300", 
                    isMenuOpen && "rotate-180"
                )} />
            </Button>

            {/* --- MAIN DROPDOWN CONTAINER --- */}
            {isMenuOpen && (
                <div className={cn(
                    "absolute left-0 top-full mt-1 flex flex-col animate-in fade-in zoom-in-95 duration-200 z-[100]",
                    "w-full"
                )}>
                    
                    {isAdmin || isCoordinator || isStudent ? (
                        /* --- ADMIN/COORDINATOR/STUDENT VARIANT --- */
                        <div className="w-full rounded-b-xl bg-primary borderbackdrop-blur-sm">
                            {items[0]?.children?.map((sub, idx) => {
                                const isCategory = sub.isHeader ||
                                    ["User Management", "System Configuration", "Defense Management", "Panel Endorsement", "Grading Management", "Thesis Management", "Progress Tracking"].includes(sub.title);

                                return (
                                    <div key={idx} className={cn(
                                        "px-4 transition-all duration-200",
                                        sub.isHeader 
                                            ? "text-primary-foreground-2 pt-2 pb-2 text-[10px] uppercase font-bold tracking-[0.15em] pointer-events-none" 
                                            : "text-background/90 py-1.5 hover:bg-background/10 hover:text-background cursor-pointer group",
                                        isCategory ? "pl-4" : "pl-10"
                                    )}>
                                        {sub.isHeader ? (
                                            sub.title
                                        ) : (
                                            <Link href={sub.href} className="text-[13px] text-background no-underline block w-full">
                                                {sub.title}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* --- FACULTY VARIANT --- */
                        <div className="w-full rounded-b-xl bg-primary border border-background/10 overflow-visible shadow-xl">
                            {items.map((item) => (
                                <div 
                                    key={item.id} 
                                    onMouseEnter={() => setActiveTab(item.id)} 
                                    className="relative"
                                >
                                    <div 
                                        className={cn(
                                            "flex items-center justify-between px-4 py-2.5 cursor-default transition-all duration-200",
                                            activeTab === item.id 
                                                ? "bg-background/10 text-primary-foreground-2" 
                                                : "text-background/80 hover:text-background hover:bg-background/5"
                                        )}
                                    >
                                        <span className="text-[11px] font-bold uppercase tracking-wider">{item.title}</span>
                                        {item.children && <ChevronRight className="size-3 opacity-50" />}
                                    </div>

                                    {/* --- Sub-Menu Fly-out --- */}
                                    {activeTab === item.id && item.children && (
                                        <div className="absolute left-full top-0 ml-1 h-full w-full z-[110]">
                                            <div className="rounded-r-xl bg-primary border border-background/10 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                                                {item.children.map((sub, idx) => {
                                                    /* INDENTATION LOGIC:
                                                       These titles are aligned to the left (pl-4). 
                                                       Everything else is indented (pl-10).
                                                    */
                                                    const isSubCategory = sub.isHeader || 
                                                        [
                                                            "Advisee Management", 
                                                            "Evaluation and Grading", 
                                                            "Defense Management", 
                                                            "Panel Endorsement",
                                                            "Proposal Review",
                                                            "Panel Thesis Review"
                                                        ].includes(sub.title);

                                                    return (
                                                        <div key={idx} className={cn(
                                                            "px-4 transition-colors",
                                                            sub.isHeader 
                                                                ? "text-primary-foreground-2 pt-2 pb-2 text-[10px] uppercase font-bold tracking-[0.15em] pointer-events-none" 
                                                                : "text-background/90 py-2.5 hover:bg-background/10 hover:text-background",
                                                            isSubCategory ? "pl-4" : "pl-10"
                                                        )}>
                                                            {sub.isHeader ? (
                                                                sub.title
                                                            ) : (
                                                                <Link href={sub.href} className="text-background text-xs block w-full no-underline">
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
                    )}
                </div>
            )}
        </div>
    );
}