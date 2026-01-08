import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { matrix, panel_assign } from '@/routes/faculty/management/coordinator/defense_management';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react'; // Added router for navigation
import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    GripVertical,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from '@/lib/utils';

// Import Dropdown Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

// ----------------------------------------------------------------------
// CUSTOM TABS COMPONENT (From your provided code)
// ----------------------------------------------------------------------

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
    ({ className, isActive = false, children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'h-12 px-[20px] flex flex-col justify-center items-center gap-2.5', // Slightly adjusted height for page tab feel
                'rounded-t-[10px] transition-colors',
                // 'shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]', // Optional: kept or removed based on preference

                // Base background
                isActive
                    ? 'bg-[#9b000a] text-white' // Active: Maroon
                    : 'bg-[#800000] text-white/70 hover:bg-[#9b000a] hover:text-white', // Inactive: Darker Maroon

                className
            )}
            {...props}
        >
            <div className="flex justify-center items-center gap-2.5">
                <span className="font-medium text-[16px] leading-normal whitespace-nowrap font-dm">
                    {children}
                </span>
            </div>
        </button>
    )
);
TabButton.displayName = 'TabButton';

// ----------------------------------------------------------------------
// APP CONTENT WRAPPER
// ----------------------------------------------------------------------

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export function AppContent({
    variant = 'header',
    title,
    subtitle,
    icon,
    children,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset>
                <div className="flex-1 p-6" style={{ backgroundColor: 'var(--primary-foreground)' }} {...props}>
                    {children}
                </div>
            </SidebarInset>
        )
    }

    return (
        <div
            className="flex h-full w-full flex-1 flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }}
            {...props}
        >
            {(title || subtitle) && (
                <div className="w-full border-b border-sidebar-border">
                    <div className="mx-auto max-w-[1440px] h-[124px] flex flex-row items-center px-6 py-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {icon ? icon : <div className="w-8 h-8 rounded bg-[#800000]"></div>}
                                <h2 className="text-[30px] font-normal leading-[36px] text-[#800000] dark:text-red-400">
                                    {title}
                                </h2>
                            </div>
                            <p className="text-[18px] font-normal leading-[16px] ml-11 text-[#800000]">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="mx-auto w-full max-w-[1440px] p-6">
                {children}
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

// const SECTIONS = ['BSCPE 3-1', 'BSCPE 3-2', 'BSCPE 3-3', 'BSCPE 3-4'];

// const PANELISTS = [
//     { id: 1, name: 'Dr. Maria Santos' },
//     { id: 2, name: 'Engr. Juan Dela Cruz' },
//     { id: 3, name: 'Dr. Pedro Reyes' },
//     { id: 4, name: 'Prof. Ana Lim' },
// ];

// const THESIS_TITLES = [
//     {
//         id: 1,
//         title: 'AI-Powered Student Performance Analytics System',
//         authors: 'Juan Dela Cruz, Maria Santos, Pedro Reyes',
//         adviser: 'Dr. Maria Santos',
//         section: 'BSCPE 3-3',
//         date: 'May 3, 2025'
//     },
//     {
//         id: 2,
//         title: 'IoT Based Flood Monitoring System',
//         authors: 'Group 2 Members',
//         adviser: 'Engr. Smith',
//         section: 'BSCPE 3-3',
//         date: 'May 3, 2025'
//     }
// ];

const CONFLICT_REQUESTS = Array(6).fill({
    id: 1,
    adviser: 'Dr. Maria Santos',
    title: 'AI-Powered Student...',
    date: '11/29/2025',
    reason: 'Boracay',
    document: 'comment'
}).map((item, index) => ({ ...item, id: index }));

// ----------------------------------------------------------------------
// TYPE
// ----------------------------------------------------------------------

// Represents a faculty member available for a panel
interface Panelist {
    id: number;
    name: string;
  }
  
  interface Section {
    section: string;
  }
  
  interface Thesis {
    thesis_id: number;
    title: string;
    authors: string;  // Note: Appears as a comma-separated string in your dd()
    adviser: string;
    section: string;  // e.g., "1" or "4"
    date: string;     // e.g., "2026-01-03"
  }
  
  /**
   * The key in endorsed_thesis appears to be a section identifier.
   * Based on your dd(), it is a Collection/Array of Thesis objects.
   */
  interface DashboardProps {
    sections: Section[];
    available_panel: Panelist[];
    endorsed_thesis: Thesis[];
  }

// ----------------------------------------------------------------------
// MAIN DASHBOARD
// ----------------------------------------------------------------------

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Panel Assignment',
        href: panel_assign().url,
    },
];

export default function Dashboard({sections, available_panel, endorsed_thesis}: DashboardProps) {
    // State
    const [selectedSection, setSelectedSection] = useState<string>('');
    useEffect(() => {
        setExpandedTheses(new Set());
    }, [selectedSection]);

    const [activeTab, setActiveTab] = useState<'assignments' | 'conflicts'>('assignments');
    const [expandedTheses, setExpandedTheses] = useState<Set<number>>(new Set());

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Panel Assignment" />

            <AppContent
                variant="header"
                title="Panel Assignment"
                subtitle="Assign and manage panel members"
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#800000] text-white">
                        <Users className="h-5 w-5" />
                    </div>
                }
            >
                {/* 1. Page Tabs (Top Level) - Using custom TabButton */}
                <div className="flex items-end gap-1 mb-0 border-b border-[#800000]/10 pb-0">
                    <TabButton isActive={true}>
                        Panel Assignment
                    </TabButton>
                    <TabButton 
                        isActive={false} 
                        onClick={() => router.get(matrix().url)} // Navigation logic
                    >
                        Matrix Management
                    </TabButton>
                </div>

                {/* Main Content Area */}
                <div className="space-y-6 pt-6">

                    {/* 2. Controls & Filters */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        
                        {/* Sub-Tabs (Toggle Group Style) */}
                        <ToggleGroup 
                            type="single" 
                            value={activeTab} 
                            onValueChange={(value) => { if(value) setActiveTab(value as 'assignments' | 'conflicts') }}
                            className="bg-[#F3E5CA] rounded-lg p-1 gap-1 inline-flex"
                        >
                            <ToggleGroupItem 
                                value="assignments" 
                                className="whitespace-nowrap w-auto data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] hover:bg-[#800000]/10 hover:text-[#800000] h-8 px-4 text-xs font-bold"
                            >
                                Panel Assignments
                            </ToggleGroupItem>
                            <ToggleGroupItem 
                                value="conflicts" 
                                className="whitespace-nowrap w-auto data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] hover:bg-[#800000]/10 hover:text-[#800000] h-8 px-4 text-xs font-bold"
                            >
                                Conflict Approvals
                            </ToggleGroupItem>
                        </ToggleGroup>

                        {/* Section Selector (Only visible in Assignments view) */}
                        {activeTab === 'assignments' && (
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="primary" 
                                            >
                                            <span className={selectedSection ? "text-foreground" : ""}>
                                                {selectedSection || "Select Section"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    {/* <DropdownMenuContent className="w-[200px]">
                                        <DropdownMenuRadioGroup value={selectedSection} onValueChange={setSelectedSection}>
                                            {sections.map((sec) => (
                                                <DropdownMenuRadioItem key={sec} value={sec}>
                                                    {sec}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent> */}
                                    <DropdownMenuContent className="w-[200px]">
                                        <DropdownMenuRadioGroup value={selectedSection} onValueChange={setSelectedSection}>
                                            {sections.map((sec, index) => (
                                                <DropdownMenuRadioItem key={index} value={sec.section}>
                                                    {sec.section}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* 3. Content Views */}
                    <div className="min-h-[600px]">
                        {activeTab === 'assignments' ? (
                            /* ================= PANEL ASSIGNMENTS VIEW ================= */
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                                {/* Left Sidebar: Available Panelists */}
                                <div className="col-span-1 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-center gap-3 border-b pb-4">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
                                            <Users className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Available Panelists</h3>
                                            <p className="text-xs text-muted-foreground">Drag to assign</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: '600px' }}>
                                        {available_panel.map((panelist) => (
                                            <div
                                                key={panelist.id}
                                                className="group flex cursor-grab items-center gap-3 rounded-lg border bg-background p-3 shadow-sm transition-all hover:border-red-200 hover:shadow-md active:cursor-grabbing"
                                            >
                                                <GripVertical className="text-muted-foreground/50 group-hover:text-red-500" size={16} />
                                                <span className="text-sm font-medium text-red-900/80">
                                                    {panelist.name}
                                                </span>
                                            </div>
                                        ))}
                                    <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: '600px' }}>
                                        {available_panel.map((panelist) => (
                                            <div key={panelist.id} className="group flex cursor-grab items-center gap-3 rounded-lg border bg-background p-3 shadow-sm transition-all hover:border-red-200">
                                                <GripVertical className="text-muted-foreground/50 group-hover:text-red-500" size={16} />
                                                <span className="text-sm font-medium text-red-900/80">
                                                    {panelist.name} {/* Changed from .name to .faculty_name */}
                                                </span>
                                            </div>
                                        ))}
                                    </div>                                        
                                    </div>
                                </div>

                                {/* Right Content: Thesis Accordions */}
                                <div className="col-span-1 lg:col-span-3">
                                    {!selectedSection ? (
                                        <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20">
                                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                                            <div className="z-10 text-center">
                                                <BookOpen className="mx-auto mb-2 size-10 text-muted-foreground/50" />
                                                <h3 className="text-lg font-medium">Select a Section</h3>
                                                <p className="text-sm text-muted-foreground">Please select a section to view thesis titles.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {endorsed_thesis.filter((thesis) => thesis.section === selectedSection).length === 0 ? (
                                                <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20">
                                                    <div className="z-10 text-center">
                                                        <BookOpen className="mx-auto mb-2 size-10 text-muted-foreground/50" />
                                                        <h3 className="text-lg font-medium">No Theses Found</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            No theses found for section {selectedSection}.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                endorsed_thesis
                                                    .filter((thesis) => thesis.section === selectedSection)
                                                    .map((thesis) => {
                                                        const isOpen = expandedTheses.has(thesis.thesis_id);

                                                        return (
                                                            <div key={thesis.thesis_id} className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
                                                                <div
                                                                    onClick={() => {
                                                                        setExpandedTheses(prev => {
                                                                            // Allow to have multiple accordion open, aslong it clicked
                                                                            const next = new Set(prev);
                                                                            isOpen ? next.delete(thesis.thesis_id) : next.add(thesis.thesis_id);
                                                                            return next;
                                                                        });
                                                                    }}
                                                                    className="cursor-pointer bg-white p-6 hover:bg-neutral-50/50"
                                                                >
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="space-y-1">
                                                                            <h2 className="text-xl font-bold text-foreground">{thesis.title}</h2>
                                                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Users size={14} />
                                                                                    <span>{thesis.authors}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Users size={14} />
                                                                                    <span className="font-medium text-foreground">Adviser: {thesis.adviser}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <BookOpen size={14} />
                                                                                    <span>{thesis.section}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Calendar size={14} />
                                                                                    <span>{thesis.date}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <button className="text-muted-foreground transition-transform duration-200">
                                                                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {isOpen && (
                                                                    <div className="grid grid-cols-1 gap-6 border-t bg-neutral-50/30 p-6 md:grid-cols-2">
                                                                        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-center transition-colors hover:border-red-300 hover:bg-red-50/10">
                                                                            <span className="text-sm text-muted-foreground">Drag and drop panel members here</span>
                                                                        </div>
                                                                        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-center transition-colors hover:border-red-300 hover:bg-red-50/10">
                                                                            <span className="text-sm text-muted-foreground">Drag and drop backup panelists here</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                            )} 
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* ================= CONFLICT APPROVALS VIEW ================= */
                            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#800000] text-white">
                                            <tr>
                                                <th className="px-6 py-4 font-medium text-center">Thesis Adviser</th>
                                                <th className="px-6 py-4 font-medium text-center">Thesis Title</th>
                                                <th className="px-6 py-4 font-medium text-center">Defense Date</th>
                                                <th className="px-6 py-4 font-medium text-center">Conflict Reason</th>
                                                <th className="px-6 py-4 font-medium text-center">Documents</th>
                                                <th className="px-6 py-4 font-medium text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {CONFLICT_REQUESTS.map((req) => (
                                                <tr key={req.id} className="hover:bg-neutral-50">
                                                    <td className="px-6 py-4 font-medium text-neutral-900 text-center">{req.adviser}</td>
                                                    <td className="max-w-[250px] truncate px-6 py-4 text-neutral-600" title={req.title}>
                                                        {req.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-600 text-center">{req.date}</td>
                                                    <td className="px-6 py-4 text-neutral-600 text-center">{req.reason}</td>
                                                    <td className="px-6 py-4 justify-items-center">
                                                        <button className="flex items-center gap-1 font-medium text-blue-600 hover:underline">
                                                            <FileText size={14} />
                                                            {req.document}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 justify-items-center">
                                                        <div className="flex items-center gap-2">
                                                            <button className="rounded-md bg-[#800000] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#991b1b]">
                                                                Approve
                                                            </button>
                                                            <button className="rounded-md bg-[#fef3c7] px-4 py-1.5 text-xs font-semibold text-[#800000] shadow-sm hover:bg-[#fde68a]">
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppContent>
        </AppLayout>
    );
}