// ----------------------------------------------------------------------
// ProgressTracking Page
// ----------------------------------------------------------------------

import { useState } from 'react';
import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ShieldCheck, Check, Calendar, AlertCircle, Bell, Upload, Files } from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TabButton } from '@/components/ui/tabs';
import StageSwitchToggle from '@/components/stage-toggle';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Avatar } from '@radix-ui/react-avatar';
import { NavFooter } from '@/components/nav-footer';

// ----------------------------------------------------------------------
// DATA & MOCK CONTENT
// ----------------------------------------------------------------------

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Progress Tracking', href: '' },
];

// Types
type Stage = "MOR" | "DP1" | "DP2";

type Consultation = {
  id: string;
  title: string;
  date: string;
  description: string;
  version: string;
  stage: Stage;
};

type StatusReport = {
  id: string;
  title: string;
  date: string;
  description: string;
  stage: Stage;
};

// Mock Data - Consultations
const mockConsultations: Consultation[] = [
  { id: "1", title: "Title Selection", date: "Jan 15, 2025", description: "Project scope and research questions.", version: "v1", stage: "MOR" },
  { id: "2", title: "Literature Review", date: "Feb 3, 2025", description: "Reviewed 15 papers. Identified gaps.", version: "v2", stage: "MOR" },
  { id: "3", title: "Design Approval", date: "Feb 20, 2025", description: "System architecture approved.", version: "v1", stage: "DP1" },
  { id: "4", title: "Implementation Review", date: "Mar 5, 2025", description: "Prototype demo and integration review.", version: "v2", stage: "DP1" },
  { id: "5", title: "Testing Discussion", date: "Mar 18, 2025", description: "Test results and optimization.", version: "v1", stage: "DP2" },
];


// Timeline Events Data
const timelineEventsByStage = {
  MOR: [
    { id: '1', title: 'Title Proposal Submission', dateRange: 'Oct 1 – Nov 15', description: 'Submission of initial research proposal.', status: 'past', isCurrent: false },
    { id: '2', title: 'Chapter 1–3 Defense', dateRange: 'Nov 20', description: 'Defense of chapters 1 to 3.', status: 'current', isCurrent: true },
    { id: '3', title: 'Final Defense', dateRange: 'January', description: 'Final thesis defense.', status: 'upcoming', isCurrent: false },
  ],
  DP1: [
    { id: '4', title: 'DP1 Task 1', dateRange: 'Nov 25', description: 'DP1 milestone.', status: 'upcoming', isCurrent: false },
    { id: '5', title: 'DP1 Task 2', dateRange: 'Dec 5', description: 'Second DP1 milestone.', status: 'upcoming', isCurrent: false },
  ],
  DP2: [
    { id: '6', title: 'DP2 Final Task', dateRange: 'January', description: 'Final DP2 milestone.', status: 'upcoming', isCurrent: false },
  ],
};

// Track by Stage Table Data
const trackByStageData = {
  MOR: [
    { requirement: 'Title Proposal Submission', duration: '2 Weeks', status: 'Completed', color: 'green' },
    { requirement: 'Chapter 1–3 Manuscript Submission', duration: '3 Weeks', status: 'Completed', color: 'green' },
    { requirement: '7 Consultations', duration: '2 Months', status: 'Completed', color: 'green' },
    { requirement: 'Final Defense', duration: '1 Day', status: 'Completed', color: 'green' },
  ],
  DP1: [
    { requirement: 'DP1 Task 1', duration: '1 Week', status: 'Pending', color: 'blue' },
    { requirement: 'DP1 Task 2', duration: '2 Weeks', status: 'Revisions', color: 'yellow' },
  ],
  DP2: [
    { requirement: 'DP2 Final Task', duration: '1 Day', status: 'Completed', color: 'green' },
  ],
};

// Feedback Reviewers Data
const feedbackReviewers = [
  { name: "Dr. Robert Chen", initials: "RC" },
  { name: "Prof. Maria Santos", initials: "MS" },
  { name: "Dr. James Wilson", initials: "JW" },
];

// Status Reports Content by Stage
const statusReportContentByStage = {
  Software: {
    MOR: {
      finished: "MOR: Required Report Finished",
      finishedDesc: "Backend API 40% complete. Authentication module done.",
      next: "MOR: Next Required Report",
      nextDesc: "Complete remaining API endpoints.",
      feedback: "Check initial procurement quality.",
    },
    DP1: {
      finished: "DP1: Required Report Finished",
      finishedDesc: "Backend API 70% complete. User management and authentication done.",
      next: "DP1: Next Required Report",
      nextDesc: "Integrate frontend with backend and test modules.",
      feedback: "Ensure diagrams are correct.",
    },
    DP2: {
      finished: "DP2: Required Report Finished",
      finishedDesc: "Backend fully completed. All modules integrated and tested.",
      next: "DP2: Next Required Report",
      nextDesc: "Perform final testing and prepare for deployment.",
      feedback: "Verify final testing results.",
    },
  },
  Hardware: {
    MOR: {
      finished: "MOR: Required Report Finished",
      finishedDesc: "Initial procurement started for components.",
      next: "MOR: Next Required Report",
      nextDesc: "Prepare circuit diagrams and initial testing plan.",
      feedback: "Check initial procurement quality.",
    },
    DP1: {
      finished: "DP1: Required Report Finished",
      finishedDesc: "All major components procured. Circuit diagrams finalized.",
      next: "DP1: Next Required Report",
      nextDesc: "Perform full hardware assembly and integration testing.",
      feedback: "Ensure diagrams are correct.",
    },
    DP2: {
      finished: "DP2: Required Report Finished",
      finishedDesc: "Final testing completed. Hardware ready for integration.",
      next: "DP2: Next Required Report",
      nextDesc: "Finalize documentation for hardware handoff.",
      feedback: "Verify final testing results.",
    },
  },
  Documentation: {
    MOR: {
      finished: "MOR: Required Report Finished",
      finishedDesc: "Draft of initial documentation completed.",
      next: "MOR: Next Required Report",
      nextDesc: "Prepare initial references and formattinggg.",
      feedback: "Please check draft referencesss.",
    },
    DP1: {
      finished: "DP1: Required Report Finished",
      finishedDesc: "Documentation formatting and references added.",
      next: "DP1: Next Required Report",
      nextDesc: "Add references, verify formatting, and integrate content.",
      feedback: "Verify formatting and content accuracy.",
    },
    DP2: {
      finished: "DP2: Required Report Finished",
      finishedDesc: "Documentation ready for final review.",
      next: "DP2: Next Required Report",
      nextDesc: "Finalize for submission and review.",
      feedback: "Final review complete, ready for submission.",
    },
  },
};

// ----------------------------------------------------------------------
// REUSABLE COMPONENTS
// ----------------------------------------------------------------------

// WizardProgress Component
interface WizardProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber: number;
  stepLabel: string;
  state?: 'before' | 'current' | 'after';
  progress?: number;
}

const WizardProgress = React.forwardRef<HTMLDivElement, WizardProgressProps>(
  ({ className, stepNumber, stepLabel, state = 'before', progress = 20, ...props }, ref) => {
    const renderCircle = () => {
      switch (state) {
        case 'after':
          return (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-primary-foreground-2" strokeWidth={3} />
            </div>
          );
        case 'current':
          return (
            <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground-2 font-medium text-[23px] leading-none font-dm">
                {stepNumber}
              </span>
            </div>
          );
        case 'before':
        default:
          return (
            <div className="w-10 h-10 rounded-full bg-[rgba(149,150,151,0.5)] flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground font-medium text-[23px] leading-none font-dm">
                {stepNumber}
              </span>
            </div>
          );
      }
    };

    const getProgressWidth = () => {
      switch (state) {
        case 'after':
          return '100%';
        case 'current':
          return `${progress}%`;
        case 'before':
        default:
          return '0%';
      }
    };

    const getProgressLabel = () => {
      if (state === 'after') return 'Completed';
      if (state === 'current') return `${progress}%`;
      return '0%';
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        <div className="flex items-center gap-3">
          {renderCircle()}
          <span className="text-primary font-bold text-[19px] leading-none font-dm whitespace-nowrap">
            {stepLabel}
          </span>
          <div className="flex-1 h-2 rounded-lg bg-muted relative overflow-hidden">
            <div
              className="h-full rounded-lg bg-primary-foreground-2 transition-all duration-300 ease-in-out"
              style={{ width: getProgressWidth() }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 font-medium ml-[42px]">{getProgressLabel()}</span>
      </div>
    );
  }
);
WizardProgress.displayName = 'WizardProgress';

// TrackerBox Component
function TrackerBox({ count, label, color = 'red', className }: any) {
  const colors: any = {
    blue: { bg: 'var(--alert-info)', text: 'var(--alert-info)' },
    yellow: { bg: 'var(--alert-yellow-warning)', text: 'var(--alert-yellow-warning)' },
    green: { bg: 'var(--alert-success)', text: 'var(--alert-success)' },
    red: { bg: 'var(--alert-warning)', text: 'var(--alert-warning)' },
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow flex flex-col overflow-hidden border-t-4',
        className
      )}
      style={{ borderTopColor: colors[color].bg }}
    >
      <div className="h-2" style={{ backgroundColor: colors[color].bg }} />
      <div className="flex flex-col items-center justify-center py-6">
        <span className="text-2xl font-bold" style={{ color: colors[color].text }}>
          {count}
        </span>
        <span className="text-sm mt-1 font-medium" style={{ color: colors[color].text }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// Consultation Item Component
function ConsultationItem({ consultation }: { consultation: Consultation }) {
  return (
    <div className="bg-white h-[97px] w-full relative">
      <div className="absolute flex gap-[12px] h-[64px] left-[16px] top-[16px] w-[618px]">
        <Files size={20} color="var(--primary)" />

        <div className="flex flex-col gap-[4px] w-full">
          <p className="text-[16px] font-medium text-[#0a0a0a]">
            {consultation.title} | {consultation.date}
          </p>
          <p className="text-[16px] text-[#4a5565]">{consultation.description}</p>
          <p className="text-[12px] text-[#6a7282]">{consultation.version}</p>
        </div>
      </div>
    </div>
  );
}


// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function ProgressTracking() {
  const [activeTab, setActiveTab] = useState<'Overall Progress' | 'Consultations' | 'Status Reports'>('Overall Progress');
  const tabs: typeof activeTab[] = ['Overall Progress', 'Consultations', 'Status Reports'];
  const [selectedStage, setSelectedStage] = useState<Stage>("MOR");

  const filteredConsultations = mockConsultations.filter(c => c.stage === selectedStage);
  const currentTrackData = trackByStageData[selectedStage];
  const currentTimelineEvents = timelineEventsByStage[selectedStage];

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-600';
      case 'Pending': return 'bg-blue-600';
      case 'Revisions': return 'bg-yellow-400';
      default: return 'bg-gray-600';
    }
  };

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <AppContent
          variant="header"
          title="Progress Tracking"
          subtitle="Access the progress tracking of student theses"
          icon={
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#730000] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
          }
        >
          {/* Tabs */}
          <div className="inline-flex">
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#fffdf6] border rounded-lg rounded-tl-none p-6 space-y-6">

            {/* Overall Progress Tab */}
            {activeTab === 'Overall Progress' && (
              <>
                {/* Wizard Progress */}
                <section className="space-y-4">
                  <h3 className="text-[24px] font-bold text-[#730000]">Overall Progress</h3>
                  <div className="flex gap-6">
                    <WizardProgress stepNumber={1} stepLabel="Methods of Research" state="after" className="flex-1" />
                    <WizardProgress stepNumber={2} stepLabel="Design Project 1" state="current" progress={50} className="flex-1" />
                    <WizardProgress stepNumber={3} stepLabel="Design Project 2" state="before" className="flex-1" />
                  </div>
                </section>

                {/* Tracker Boxes */}
                <div className="mt-6">
                  <div className="bg-[#730000] text-white text-center py-2 rounded-t text-[18px]">Overall Tracker</div>
                  <div className="bg-white rounded-b shadow p-6 space-y-6">
                    <div className="grid grid-cols-4 gap-6">
                      <TrackerBox count={3} label="Pending" color="blue" />
                      <TrackerBox count={2} label="Revisions" color="yellow" />
                      <TrackerBox count={3} label="Approved" color="green" />
                      <TrackerBox count={1} label="Urgent" color="red" />
                    </div>
                  </div>
                </div>

                {/* Track by Stage Table with Toggle */}
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-[#730000] text-[18px]">Track by Stage</h4>
                    <StageSwitchToggle
                      value={selectedStage.toLowerCase() as 'mor' | 'dp1' | 'dp2'}
                      onChange={(stage) => setSelectedStage(stage.toUpperCase() as Stage)}
                    />
                  </div>

                  {/* Table Header */}
                  <div className="flex rounded-t px-5 py-3" style={{ backgroundColor: '#730000' }}>
                    <span className="flex-1 text-[18px] text-white text-center">Requirements</span>
                    <span className="flex-1 text-[18px] text-white text-center">Duration</span>
                    <span className="flex-1 text-[18px] text-white text-center">Status</span>
                  </div>

                  {/* Table Rows */}
                  <div className="rounded-b divide-y">
                    {currentTrackData.map((item, index) => (
                      <div key={index} className="flex bg-white px-5 py-3 items-center">
                        <span className="flex-1 text-sm text-gray-800 text-center">{item.requirement}</span>
                        <span className="flex-1 text-sm text-gray-800 text-center">{item.duration}</span>
                        <span className="flex-1 text-center">
                          <Badge className={`${getBadgeColor(item.status)} border-transparent px-3 py-1`}>{item.status}</Badge>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative mt-8">
                  {/* Vertical yellow line */}
                  <div
                    className="absolute"
                    style={{
                      left: '12px',
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: '#FFBD00',
                      zIndex: 1,
                    }}
                  />

                  {/* Timeline events */}
                  {currentTimelineEvents.map((event) => (
                    <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center" style={{ width: '24px', zIndex: 2 }}>
                        <div className="relative flex items-center justify-center w-6 h-6">
                          {(event.isCurrent || event.status === 'past') ? (
                            <div className="relative w-full h-full">
                              <div className="absolute inset-0 rounded-full bg-[#9B000A63]" />
                              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#9B000A] transform -translate-x-1/2 -translate-y-1/2" />
                              <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-[#730000] transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                          ) : (
                            <div className="rounded-full w-6 h-6 border-4 border-[#9B000A] bg-white" />
                          )}
                        </div>
                      </div>

                      {/* Event Card */}
                      <Card
                        className="relative flex-1 p-3 overflow-hidden"
                        style={{
                          backgroundColor: event.status === 'past' ? '#95969766' : '#FFBD0099',
                          border: `2px solid ${event.status === 'past' ? '#959697' : '#FFBD00'}`,
                        }}
                      >
                        <div className="absolute left-0 top-0 h-full w-[3px]" style={{ backgroundColor: 'primary' }} />
                        <CardHeader className="p-0">
                          <CardTitle className="text-[15px] font-semibold" style={{ color: 'primary' }}>
                            {event.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar size={16} color="#730000" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'primary' }}>{event.dateRange}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'primary', lineHeight: '1.5' }}>{event.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </>
            )}



            {/* Consultations Tab */}
            {activeTab === 'Consultations' && (
              <section className="space-y-6">
                {/* Header */}
                <p className="text-primary text-[24px] font-bold">
                  Consultations
                </p>

                {/* Toggle + Upload Button Row */}
                <div className="flex items-center justify-end gap-4">
                  <Button variant="primary">
                    <Upload className="size-4" />
                    Upload Report
                  </Button>
                </div>

                <div className="bg-white rounded shadow overflow-hidden">
                  <div className="text-[18px] bg-primary text-white text-center py-2">Overall Tracker</div>
                  <div className="grid grid-cols-3 gap-10 max-w-5xl mx-auto p-6">
                    <TrackerBox count={5} label="Pending MOR" color="green" />
                    <TrackerBox count={2} label="Pending DP1" color="red" />
                    <TrackerBox count={3} label="Pending DP2" color="yellow" />
                  </div>

                  <div className="bg-primary px-[15px] py-[16px] flex justify-between items-center">
                    <p className="text-[18px] text-white text-center py-2">Consultation History</p>
                    <StageSwitchToggle
                      value={selectedStage.toLowerCase() as 'mor' | 'dp1' | 'dp2'}
                      onChange={(stage) => setSelectedStage(stage.toUpperCase() as Stage)}
                    />
                  </div>

                  <div className="w-full">
                    {filteredConsultations.map((consultation) => (
                      <ConsultationItem key={consultation.id} consultation={consultation} />
                    ))}

                    {filteredConsultations.length === 0 && (
                      <div className="bg-white h-[97px] flex items-center justify-center">
                        <p className="text-[#6a7282] text-[16px]">No consultations found for {selectedStage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Status Reports Tab */}
            {activeTab === 'Status Reports' && (
              <section className="space-y-6">
                {/* Header */}
                <p className="text-primary text-[24px] font-bold">
                  Status Reports
                </p>

                {/* Toggle + Upload Button Row */}
                <div className="flex items-center justify-end gap-4">
                  <StageSwitchToggle
                    value={selectedStage.toLowerCase() as 'mor' | 'dp1' | 'dp2'}
                    onChange={(stage) => setSelectedStage(stage.toUpperCase() as Stage)}
                  />
                  <Button variant="primary">
                    <Upload className="size-4" />
                    Upload Report
                  </Button>
                </div>

                {/* Collapsible Sections */}
                <div className="flex flex-col items-start w-full space-y-4">

                  {/* Software Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="text-[18px] bg-primary text-white hover:bg-primary">
                      Software
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 mb-4">
                        {/* Required Report Finished */}
                        <div className="flex gap-2 items-start bg-white p-4 rounded-md border-l-4 border-[#0d542b]">
                          <div className="w-9 h-9 bg-[#dcfce7] flex justify-center items-center rounded-md">
                            <AlertCircle className="text-green-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{statusReportContentByStage.Software[selectedStage].finished}</p>
                            <p className="text-[#717182] text-sm">
                              {statusReportContentByStage.Software[selectedStage].finishedDesc}
                            </p>
                          </div>
                        </div>

                        {/* Next Required Report */}
                        <div className="flex gap-2 items-start bg-white p-4 rounded-md border-l-4 border-[#ffbd00]">
                          <div className="w-9 h-9 bg-[#fffed4] flex justify-center items-center rounded-md">
                            <Bell className="text-yellow-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{statusReportContentByStage.Software[selectedStage].next}</p>
                            <p className="text-[#717182] text-sm">
                              {statusReportContentByStage.Software[selectedStage].nextDesc}
                            </p>
                          </div>
                        </div>

                        {/* Feedbacks */}
                        <div className="bg-white rounded-md border mt-2 p-4">
                          <p className="text-primary font-medium text-lg mb-3">Feedbacks</p>
                          <div className="flex gap-20 justify-center">
                            {feedbackReviewers.map((reviewer, i) => (
                              <div key={i} className="bg-[#fdfcf6] p-4 rounded-md w-[400px] border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar>
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                                      {reviewer.initials}
                                    </div>
                                  </Avatar>
                                  <p className="font-medium text-sm">{reviewer.name}</p>
                                </div>
                                <p className="font-semibold text-primary text-sm mb-1">
                                  Comments / Recommendations
                                </p>
                                <p className="text-sm text-black">
                                  {statusReportContentByStage.Software[selectedStage].feedback}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Hardware Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="text-[18px] bg-primary text-white hover:bg-primary">
                      Hardware
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 mb-4">
                        {/* Required Report Finished */}
                        <div className="flex gap-2 items-start bg-white p-4 rounded-md border-l-4 border-[#0d542b]">
                          <div className="w-9 h-9 bg-[#dcfce7] flex justify-center items-center rounded-md">
                            <AlertCircle className="text-[#0d542b]" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{statusReportContentByStage.Hardware[selectedStage].finished}</p>
                            <p className="text-[#717182] text-sm">
                              {statusReportContentByStage.Hardware[selectedStage].finishedDesc}
                            </p>
                          </div>
                        </div>

                        {/* Next Required Report */}
                        <div className="flex gap-2 items-start bg-white p-4 rounded-md border-l-4 border-[#ffbd00]">
                          <div className="w-9 h-9 bg-[#fffed4] flex justify-center items-center rounded-md">
                            <Bell className="text-[#ffbd00]" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{statusReportContentByStage.Hardware[selectedStage].next}</p>
                            <p className="text-[#717182] text-sm">
                              {statusReportContentByStage.Hardware[selectedStage].nextDesc}
                            </p>
                          </div>
                        </div>

                        {/* Feedbacks */}
                        <div className="bg-white rounded-md border mt-2 p-4">
                          <p className="text-[#730000] font-medium text-lg mb-3">Feedbacks</p>
                          <div className="flex gap-20 justify-center">
                            {feedbackReviewers.map((reviewer, i) => (
                              <div key={i} className="bg-[#fdfcf6] p-4 rounded-md w-[400px] border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar>
                                    <div className="w-10 h-10 rounded-full bg-[#730000] flex items-center justify-center text-white font-semibold">
                                      {reviewer.initials}
                                    </div>
                                  </Avatar>
                                  <p className="font-medium text-sm">{reviewer.name}</p>
                                </div>
                                <p className="font-semibold text-[#730000] text-sm mb-1">
                                  Comments / Recommendations
                                </p>
                                <p className="text-sm text-black">
                                  {statusReportContentByStage.Hardware[selectedStage].feedback}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Documentation Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="text-[18px] bg-[#800000] text-white hover:bg-[#800000]">
                      Documentation
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 mb-4">
                        {/* Required Report Finished */}
                        <div className="flex gap-2 items-start bg-white p-4 rounded-md border-l-4 border-[#0d542b]">
                          <div className="w-9 h-9 bg-[#dcfce7] flex justify-center items-center rounded-md">
                            <AlertCircle className="text-[#0d542b]" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{statusReportContentByStage.Documentation[selectedStage].finished}</p>
                            <p className="text-[#717182] text-sm">
                              {statusReportContentByStage.Documentation[selectedStage].finishedDesc}
                            </p>
                          </div>
                        </div>

                        {/* Next Required Report */}
                        <div className="flex gap-2 items-start bg-white p-4 rounded-md border-l-4 border-[#ffbd00]">
                          <div className="w-9 h-9 bg-[#fffed4] flex justify-center items-center rounded-md">
                            <Bell className="text-[#ffbd00]" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{statusReportContentByStage.Documentation[selectedStage].next}</p>
                            <p className="text-[#717182] text-sm">
                              {statusReportContentByStage.Documentation[selectedStage].nextDesc}
                            </p>
                          </div>
                        </div>

                        {/* Feedbacks */}
                        <div className="bg-white rounded-md border mt-2 p-4">
                          <p className="text-[#730000] font-medium text-lg mb-3">Feedbacks</p>
                          <div className="flex gap-20 justify-center">
                            {feedbackReviewers.map((reviewer, i) => (
                              <div key={i} className="bg-[#fdfcf6] p-4 rounded-md w-[400px] border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar>
                                    <div className="w-10 h-10 rounded-full bg-[#730000] flex items-center justify-center text-white font-semibold">
                                      {reviewer.initials}
                                    </div>
                                  </Avatar>
                                  <p className="font-medium text-sm">{reviewer.name}</p>
                                </div>
                                <p className="font-semibold text-[#730000] text-sm mb-1">
                                  Comments / Recommendations
                                </p>
                                <p className="text-sm text-black">
                                  {statusReportContentByStage.Documentation[selectedStage].feedback}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                </div>
              </section>
            )}

          </div>
        </AppContent>
      </AppLayout>
      <NavFooter />
    </>
  );
}