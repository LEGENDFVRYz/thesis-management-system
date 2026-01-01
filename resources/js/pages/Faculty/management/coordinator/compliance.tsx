import { useState } from 'react';
import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { compliance } from '@/routes/faculty/management/coordinator';
import { type BreadcrumbItem } from '@/types';
import { SidebarInset } from '@/components/ui/sidebar'; // Ensure this exists or adjust import

import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Users as LucideUsers,
    ShieldCheck
} from 'lucide-react';

// Import UI components
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// Import Card components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
// DATA & UTILS
// ----------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Compliance and Eligibility',
        href: compliance().url,
    },
];

const studentData = [
    { id: '3301', title: 'Thesis Title A', adviser: 'Dr. Cherry D. Casuat', docs: '3/3', status: 'Compliant' },
    { id: '3302', title: 'Thesis Title B', adviser: 'Dr. Cherry D. Casuat', docs: '3/3', status: 'Compliant' },
    { id: '3303', title: 'Thesis Title C', adviser: 'Dr. Cherry D. Casuat', docs: '3/3', status: 'Compliant' },
    { id: '3304', title: 'Thesis Title D', adviser: 'Dr. Cherry D. Casuat', docs: '3/3', status: 'Compliant' },
    { id: '3305', title: 'Thesis Title E', adviser: 'Dr. Cherry D. Casuat', docs: '2/3', status: 'Pending' },
    { id: '3306', title: 'Thesis Title F', adviser: 'Dr. Cherry D. Casuat', docs: '1/3', status: 'Pending' },
    { id: '3307', title: 'Thesis Title G', adviser: 'Dr. Cherry D. Casuat', docs: '3/3', status: 'Pending' },
    { id: '3308', title: 'Thesis Title H', adviser: 'Dr. Cherry D. Casuat', docs: '1/3', status: 'Pending' },
    { id: '3309', title: 'Thesis Title I', adviser: 'Dr. Cherry D. Casuat', docs: '0/3', status: 'Incomplete' },
    { id: '3310', title: 'Thesis Title J', adviser: 'Dr. Cherry D. Casuat', docs: '1/3', status: 'Incomplete' },
];

const GRID_LAYOUT = "grid grid-cols-6 gap-4 items-center px-6 py-4";

// ----------------------------------------------------------------------
// ROW COMPONENT
// ----------------------------------------------------------------------
function StudentRow({ data }: { data: typeof studentData[0] }) {
    return (
        <div className={`${GRID_LAYOUT} hover:bg-gray-50 transition-colors bg-white`}>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">{data.id}</span>
            <span className="text-sm text-gray-800 dark:text-gray-300 truncate font-medium text-center">{data.title}</span>
            <span className="flex items-center justify-center gap-2 text-sm text-gray-800 dark:text-gray-300 truncate">
                <LucideUsers className="h-4 w-4 text-red-600 shrink-0" />
                <span className="truncate">{data.adviser}</span>
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-300 text-center">{data.docs}</span>
            <div className="flex justify-center">
                <Badge className={`border-transparent justify-center w-28
                    ${data.status === 'Compliant' ? 'bg-green-600 hover:bg-green-700' : 
                      data.status === 'Pending' ? 'bg-[#FFC107] text-black hover:bg-[#FFC107]/80' : 
                      'bg-[#B71C1C] hover:bg-[#B71C1C]/80'}`
                }>
                    {data.status}
                </Badge>
            </div>
            <div className="flex justify-center">
                <Badge 
                    variant="outline" 
                    className="cursor-pointer border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 justify-center w-28"
                >
                    View Details
                </Badge>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// HEADER ROW COMPONENT
// ----------------------------------------------------------------------
function HeaderRow() {
    return (
        <div className={`${GRID_LAYOUT} bg-[#800000] text-white text-sm font-bold`}>
            <span className="text-center">ID</span>
            <span className="text-center">Thesis Title</span>
            <span className="text-center">Adviser</span>
            <span className="text-center">Docs</span>
            <span className="text-center">Status</span>
            <span className="text-center">Actions</span>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("MOR");

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <AppContent
                variant="header"
                title="Compliance & Eligibility"
                subtitle="Assess all groups for compliance with minimum requirements and deliverables before they are eligible for defense"
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#800000] text-white">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                }
            >
                <div className="space-y-8 pb-10">
                    
                    {/* Top Controls (Tabs) */}
                    <div className="flex justify-end">
                        <ToggleGroup 
                            type="single" 
                            value={activeTab} 
                            onValueChange={(value) => { if (value) setActiveTab(value); }}
                        >
                            {["MOR", "DP1", "DP2"].map((tab) => (
                                <ToggleGroupItem 
                                    key={tab} 
                                    value={tab}
                                    className="px-6 py-1.5 text-xs font-bold text-[#800000] data-[state=on]:bg-[#800000] data-[state=on]:text-white hover:bg-[#800000]/10 transition-all"
                                >
                                    {tab}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    {/* Statistics Cards - REPLACED WITH SHARED CARD COMPONENTS */}
                    <div className="grid gap-6 md:grid-cols-3 justify-items-center">
                        
                        {/* Card 1: Compliant */}
                        <Card variant="metric" className="border-0 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                <CheckCircle2 className="size-5" />
                                <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">COMPLIANT GROUPS</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-green-600">286</span>
                                <span className="text-sm font-medium text-green-600">Ready for Defense</span>
                            </CardContent>
                        </Card>

                        {/* Card 2: Pending */}
                        <Card variant="metric" className="border-0 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                <Clock className="size-5" />
                                <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">PENDING REVIEW</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-amber-500">286</span>
                                <span className="text-sm font-medium text-amber-500">Awaiting Assessment</span>
                            </CardContent>
                        </Card>

                        {/* Card 3: Incomplete */}
                        <Card variant="metric" className="border-0 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                <AlertCircle className="size-5" />
                                <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">INCOMPLETE</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-red-700">286</span>
                                <span className="text-sm font-medium text-red-700">Incomplete Requirements</span>
                            </CardContent>
                        </Card>

                    </div>
                    

                    {/* MAIN TABLE SECTION */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:border-sidebar-border">
                        <HeaderRow />
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {studentData.map((student, index) => (
                                <StudentRow key={index} data={student} />
                            ))}
                        </div>
                    </div>

                </div>
            </AppContent>
        </AppLayout>
    );
}