import { useState } from 'react';
import * as React from 'react';
import { communication } from '@/routes/faculty/coordinator/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';

import { 
    Megaphone, 
    Users, 
    FileText, 
    ChevronDown,
    User,
    Plus,   
    Check   
} from 'lucide-react';

// Import Shared Components
import { Button } from '@/components/ui/button'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FacultyManagementLayout from '..';

// ----------------------------------------------------------------------
// DATA: Audience Options
// ----------------------------------------------------------------------
const AUDIENCE_OPTIONS = [
    { id: 'everyone', label: 'Everyone', count: '699 members' },
    { id: 'advisers', label: 'All Advisers', count: '15 members' },
    { id: 'students', label: 'All Students', count: '300 members' },
    { id: 'panel', label: 'All Panel Members', count: '30 members' },
];

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Communication',
        href: communication().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Communication & Announcements",
    subtitle: "Conduct meetings with audience or send announcements",
    icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#800000] text-white">
            <Megaphone className="h-5 w-5" />
        </div>
    ),
};

export default function Dashboard() {
    // State to track the selected priority
    const [priority, setPriority] = useState<string>("");
    
    // State to track selected audiences
    const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);

    // Options for priority
    const priorities = ["Low", "Normal", "High", "Urgent"];

    // Handler to toggle audience selection
    const toggleAudience = (id: string) => {
        setSelectedAudiences(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <div className="flex flex-col gap-6">
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    
                    {/* LEFT COLUMN: Compose Announcement */}
                    <div className="lg:col-span-2">
                        <div className="h-full rounded-xl border bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar-accent/10">
                            {/* Header */}
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-[#800000] text-white">
                                    <Megaphone className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#800000] dark:text-red-400">Compose Announcement</h2>
                                    <p className="text-xs text-muted-foreground">Broadcast important information to multiple audience at once.</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form className="space-y-4">
                                {/* Subject */}
                                <div className="space-y-1">
                                    <label className="text-base font-medium text-[#800000] dark:text-red-400">Subject *</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter announcement subject..." 
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#800000] focus:outline-none focus:ring-1 focus:ring-[#800000] dark:bg-neutral-900 dark:border-neutral-700"
                                    />
                                </div>

                                {/* Priority Level */}
                                <div className="space-y-1">
                                    <label className="text-base font-medium text-[#800000] dark:text-red-400">Priority Level</label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button 
                                                type="button"
                                                className="flex w-full items-center justify-between rounded-md border border-gray-300 p-2 text-sm focus:border-[#800000] focus:outline-none focus:ring-1 focus:ring-[#800000] dark:bg-neutral-900 dark:border-neutral-700"
                                            >
                                                <span className={priority ? "text-foreground" : "text-muted-foreground"}>
                                                    {priority || "Select priority..."}
                                                </span>
                                                <ChevronDown className="size-4 opacity-50" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                                            {priorities.map((level) => (
                                                <DropdownMenuItem 
                                                    key={level} 
                                                    onClick={() => setPriority(level)}
                                                    className="cursor-pointer"
                                                >
                                                    {level}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Message */}
                                <div className="space-y-1">
                                    <label className="text-base font-medium text-[#800000] dark:text-red-400">Message *</label>
                                    <textarea 
                                        rows={12}
                                        placeholder="Type your announcement message here..." 
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#800000] focus:outline-none focus:ring-1 focus:ring-[#800000] dark:bg-neutral-900 dark:border-red-900"
                                    ></textarea>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex gap-3 pt-4">
                                    <Button 
                                        type="button"
                                        variant="default"
                                        className="flex-auto bg-[#800000] hover:bg-[#600000]"
                                    >
                                        <FileText className="size-4" />
                                        Send Announcement
                                    </Button>

                                    <Button 
                                        type="button" 
                                        variant="secondary"
                                        className="bg-[#F3E5CA] text-black hover:bg-[#e6d5b0]"
                                        onClick={() => setPriority("")} 
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Audience & Summary */}
                    <div className="space-y-6">
                        
                        {/* Audience Selector */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar-accent/10">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-[#800000] text-white">
                                    <Users className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#800000] dark:text-red-400">Select Audience</h2>
                                    <p className="text-xs text-muted-foreground">Choose who will receive this announcement</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {AUDIENCE_OPTIONS.map((audience) => {
                                    const isSelected = selectedAudiences.includes(audience.id);
                                    
                                    return (
                                        <div 
                                            key={audience.id}
                                            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-[#800000] hover:bg-red-50 dark:hover:bg-red-900/20 ${
                                                isSelected ? 'border-[#800000] bg-red-50 dark:bg-red-900/10' : ''
                                            }`}
                                            onClick={() => toggleAudience(audience.id)}
                                        >
                                            {/* Left Side: Icon & Text */}
                                            <div className="flex items-center gap-4">
                                                <User className="size-5 text-black dark:text-white" />
                                                <div>
                                                    <p className="font-semibold text-[#800000] dark:text-red-400">{audience.label}</p>
                                                    <p className="text-xs text-muted-foreground">{audience.count}</p>
                                                </div>
                                            </div>

                                            {/* Right Side: Button */}
                                            <Button
                                                type="button"
                                                variant={isSelected ? "default" : "outline"} // Change style based on state
                                                size="sm"
                                                className={isSelected ? "bg-[#800000] hover:bg-[#600000] h-8" : "h-8 border-[#800000] text-[#800000] hover:bg-red-50"}
                                            >
                                                {isSelected ? (
                                                    <>
                                                        <Check className="size-3.5 mr-1" />
                                                        Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="size-3.5 mr-1" />
                                                        Add
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar-accent/10">
                            <h3 className="mb-4 text-2xl font-bold text-[#800000] dark:text-red-400">Summary</h3>
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-[#800000] dark:text-red-300 flex justify-between">
                                    <span>Total Recipients:</span>
                                    <span>
                                        {selectedAudiences.length > 0 ? `${selectedAudiences.length} Groups` : '-'}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-[#800000] dark:text-red-300 flex justify-between">
                                    <span>Priority Level:</span>
                                    <span className={priority ? "text-black dark:text-white" : "text-gray-400"}>
                                        {priority || "Not selected"}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-[#800000] dark:text-red-300 flex justify-between">
                                    <span>Groups Selected:</span>
                                    <span className={selectedAudiences.length > 0 ? "text-black dark:text-white" : "text-gray-400"}>
                                        {selectedAudiences.length > 0 
                                            ? selectedAudiences.map(id => AUDIENCE_OPTIONS.find(opt => opt.id === id)?.label).join(", ") 
                                            : "None"}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </FacultyManagementLayout>
    );
}