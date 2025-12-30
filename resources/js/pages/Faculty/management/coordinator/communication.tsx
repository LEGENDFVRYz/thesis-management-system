import { useState } from 'react';
import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { communication } from '@/routes/faculty/management/coordinator';
import { type BreadcrumbItem } from '@/types';
import { SidebarInset } from '@/components/ui/sidebar'; // Ensure this exists or adjust import

import { 
    Megaphone, 
    Users, 
    FileText, 
    LayoutGrid,
    ChevronDown
} from 'lucide-react';

// Import Shared Components
import { Button } from '@/components/ui/button'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ----------------------------------------------------------------------
// PROVIDED COMPONENTS (HeaderCard & AppContent)
// ----------------------------------------------------------------------

interface HeaderCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

function HeaderCard({ title = 'Page Title', subtitle = 'Subtitle', icon }: HeaderCardProps) {
  return (
    <div className="w-full h-[124px] border-b flex flex-row items-center px-6 py-8 bg-sidebar-accent/10 border-sidebar-border" style={{ backgroundColor: 'var(--primary-foreground)', borderColor: 'var(--sidebar-gradient-mid)' }}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {icon ? icon : <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>}
          <h2 className="text-[30px] font-normal leading-[36px] text-[#800000] dark:text-red-400" style={{ color: 'var(--primary-foreground-2)' }}>
            {title}
          </h2>
        </div>
        <p className="text-[18px] font-normal leading-[16px] ml-11 text-[#800000]" style={{ color: 'var(--primary)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

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

  // Header variant: adds HeaderCard, centered max-width layout
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
// MAIN PAGE
// ----------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Communication',
        href: communication().url,
    },
];

export default function Dashboard() {
    // State to track the selected priority
    const [priority, setPriority] = useState<string>("");

    // Options for priority
    const priorities = ["Low", "Normal", "High", "Urgent"];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <AppContent
                variant="header"
                title="Communication & Announcements"
                subtitle="Conduct meetings with audience or send announcements"
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#800000] text-white">
                        <Megaphone className="h-5 w-5" />
                    </div>
                }
            >
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

                                {/* Priority Level - REPLACED WITH DROPDOWN */}
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
                                {/* Audience Item: Everyone */}
                                <div className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-[#800000] hover:bg-red-50 transition-all dark:hover:bg-red-900/20">
                                    <LayoutGrid className="size-5 text-black dark:text-white" />
                                    <div>
                                        <p className="font-semibold text-[#800000] dark:text-red-400">Everyone</p>
                                        <p className="text-xs text-muted-foreground">699 members</p>
                                    </div>
                                </div>

                                 {/* Audience Item: Advisers */}
                                 <div className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-[#800000] hover:bg-red-50 transition-all dark:hover:bg-red-900/20">
                                    <LayoutGrid className="size-5 text-black dark:text-white" />
                                    <div>
                                        <p className="font-semibold text-[#800000] dark:text-red-400">All Advisers</p>
                                        <p className="text-xs text-muted-foreground">15 members</p>
                                    </div>
                                </div>

                                 {/* Audience Item: Students */}
                                 <div className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-[#800000] hover:bg-red-50 transition-all dark:hover:bg-red-900/20">
                                    <LayoutGrid className="size-5 text-black dark:text-white" />
                                    <div>
                                        <p className="font-semibold text-[#800000] dark:text-red-400">All Students</p>
                                        <p className="text-xs text-muted-foreground">300 members</p>
                                    </div>
                                </div>

                                 {/* Audience Item: Panel Members */}
                                 <div className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-[#800000] hover:bg-red-50 transition-all dark:hover:bg-red-900/20">
                                    <LayoutGrid className="size-5 text-black dark:text-white" />
                                    <div>
                                        <p className="font-semibold text-[#800000] dark:text-red-400">All Panel Members</p>
                                        <p className="text-xs text-muted-foreground">30 members</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar-accent/10">
                            <h3 className="mb-4 text-2xl font-bold text-[#800000] dark:text-red-400">Summary</h3>
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-[#800000] dark:text-red-300 flex justify-between">
                                    <span>Total Recipients:</span>
                                    <span>-</span>
                                </div>
                                <div className="text-sm font-medium text-[#800000] dark:text-red-300 flex justify-between">
                                    <span>Priority Level:</span>
                                    {/* This now updates based on selection */}
                                    <span className={priority ? "text-black dark:text-white" : "text-gray-400"}>
                                        {priority || "Not selected"}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-[#800000] dark:text-red-300 flex justify-between">
                                    <span>Groups Selected:</span>
                                    <span>-</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </AppContent>
        </AppLayout>
    );
}