import * as React from 'react';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ProgressTrackingLayout from './index';
import { Check, Calendar } from 'lucide-react';
import ProgressTrackingIcon from '@/components/Icons/progress_tracking.svg';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Setup
const breadcrumb: BreadcrumbItem[] = [
    { title: 'Overall Progress', href: '#' }
];

const pageHeader: PageHeaderProps = {
    title: "Progress Tracking",
    subtitle: "Access a comprehensive archive of student theses",
    icon: <img src={ProgressTrackingIcon} alt="Progress Tracking" className="w-8 h-8" />
};

// The current course is automatically determined by student's year and semester:
// - 3rd Year, 2nd Sem = MOR (Methods of Research)
// - 4th Year, 1st Sem = DP1 (Design Project 1)
// - 4th Year, 2nd Sem = DP2 (Design Project 2)

// Milestone sets for each course
const morMilestones = [
  { milestone: 'Title Proposal Submission', duration: '2 Weeks', status: 'Completed' },
  { milestone: 'Chapter 1–3 Manuscript Submission', duration: '3 Weeks', status: 'Completed' },
  { milestone: '7 Consultations', duration: '2 Months', status: 'In Progress' },
  { milestone: 'Final Defense', duration: '1 Day', status: 'Not Started' },
];

const dp1Milestones = [
  { milestone: 'Project Proposal', duration: '2 Weeks', status: 'Not Started' },
  { milestone: 'Design Documentation', duration: '4 Weeks', status: 'Not Started' },
  { milestone: 'Mid-term Presentation', duration: '1 Day', status: 'Not Started' },
  { milestone: 'Final Project Defense', duration: '1 Day', status: 'Not Started' },
];

const dp2Milestones = [
  { milestone: 'Project Scope Definition', duration: '1 Week', status: 'Not Started' },
  { milestone: 'Implementation Phase', duration: '6 Weeks', status: 'Not Started' },
  { milestone: 'Testing & Documentation', duration: '2 Weeks', status: 'Not Started' },
  { milestone: 'Final Project Defense', duration: '1 Day', status: 'Not Started' },
];

// Simulate current student enrollment (In production, fetch from database/API)
const currentStudentYear = 3;
const currentStudentSemester = 1; // 1 = First Sem, 2 = Second Sem

// Determine current course and its milestones based on year and semester
const getCurrentCourseInfo = (year: number, semester: number) => {
  if (year === 3 && semester === 2) {
    return { courseName: 'Methods of Research', courseCode: 'MOR', milestones: morMilestones };
  } else if (year === 4 && semester === 1) {
    return { courseName: 'Design Project 1', courseCode: 'DP1', milestones: dp1Milestones };
  } else if (year === 4 && semester === 2) {
    return { courseName: 'Design Project 2', courseCode: 'DP2', milestones: dp2Milestones };
  }
  // Default to MOR if no match
  return { courseName: 'Methods of Research', courseCode: 'MOR', milestones: morMilestones };
};

const currentCourseInfo = getCurrentCourseInfo(currentStudentYear, currentStudentSemester);
const currentCourseMilestones = currentCourseInfo.milestones;

// Helper function to ensure sequential milestone status
const getSequentialMilestones = (milestones: typeof currentCourseMilestones) => {
  let canProceed = true;
  
  return milestones.map((milestone, index) => {
    // If previous milestone is not completed, this and all following should be "Not Started"
    if (!canProceed) {
      return { ...milestone, status: 'Not Started' };
    }
    
    // If current milestone is not completed or in progress, next ones should be "Not Started"
    if (milestone.status === 'Not Started' || milestone.status === 'Pending') {
      canProceed = false;
    } else if (milestone.status === 'In Progress') {
      canProceed = false;
    }
    
    return milestone;
  });
};

// Calculate wizard progress based on current course milestones
const calculateCourseProgress = (milestones: typeof currentCourseMilestones) => {
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const inProgressMilestones = milestones.filter(m => m.status === 'In Progress').length;
  
  // If there's an in-progress milestone, calculate partial progress
  // Completed milestones count as 100%, in-progress as 50%
  const progress = ((completedMilestones + (inProgressMilestones * 0.5)) / totalMilestones) * 100;
  
  return Math.round(progress);
};

// Determine wizard step states based on student's year and semester
const getWizardStates = (year: number, semester: number) => {
  const currentProgress = calculateCourseProgress(currentCourseMilestones);
  
  if (year === 3 && semester === 2) {
    // Currently in MOR
    return {
      mor: { state: 'current' as const, progress: currentProgress },
      dp1: { state: 'before' as const, progress: 0 },
      dp2: { state: 'before' as const, progress: 0 },
    };
  } else if (year === 4 && semester === 1) {
    // Currently in DP1
    return {
      mor: { state: 'after' as const, progress: 100 },
      dp1: { state: 'current' as const, progress: currentProgress },
      dp2: { state: 'before' as const, progress: 0 },
    };
  } else if (year === 4 && semester === 2) {
    // Currently in DP2
    return {
      mor: { state: 'after' as const, progress: 100 },
      dp1: { state: 'after' as const, progress: 100 },
      dp2: { state: 'current' as const, progress: currentProgress },
    };
  }
  
  // Default to MOR
  return {
    mor: { state: 'current' as const, progress: currentProgress },
    dp1: { state: 'before' as const, progress: 0 },
    dp2: { state: 'before' as const, progress: 0 },
  };
};

const wizardStates = getWizardStates(currentStudentYear, currentStudentSemester);

// Real-time Schedule Timeline Data (fetched from database with actual dates)
// In production, replace this with data from your API/database
const scheduleTimelineData = [
  { 
    id: '1', 
    title: 'Title Proposal Submission', 
    startDate: new Date('2026-01-16'),
    endDate: new Date('2026-01-16'),
    description: 'Submission deadline for initial research proposal.',
  },
  { 
    id: '2', 
    title: 'Chapter 1–3 Defense', 
    startDate: new Date('2026-01-18'),
    endDate: new Date('2026-01-18'),
    description: 'Scheduled defense of chapters 1 to 3.',
  },
  { 
    id: '3', 
    title: 'Final Defense', 
    startDate: new Date('2026-01-20'),
    endDate: new Date('2026-01-20'),
    description: 'Final thesis defense period.',
  },
];

// Helper function to format date range
const formatDateRange = (startDate: Date, endDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  
  // If same date, return single date with year
  if (startDate.getTime() === endDate.getTime()) {
    return startDate.toLocaleDateString('en-US', options);
  }
  
  // If same month and year, format as "Oct 1 – 15, 2024"
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    const monthDay = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const year = startDate.getFullYear();
    return `${monthDay} – ${endDate.getDate()}, ${year}`;
  }
  
  // If same year but different months, format as "Oct 1 – Nov 15, 2024"
  if (startDate.getFullYear() === endDate.getFullYear()) {
    const startMonthDay = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endMonthDay = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const year = startDate.getFullYear();
    return `${startMonthDay} – ${endMonthDay}, ${year}`;
  }
  
  // Different years, format as "Oct 1, 2024 – Nov 15, 2025"
  return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', options)}`;
};

// Calculate real-time status for each timeline event
const toLocalDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateTimelineStatus = () => {
  const today = toLocalDateOnly(new Date());

  const eventsWithStatus = scheduleTimelineData.map(event => {
    const start = toLocalDateOnly(event.startDate);
    const end = toLocalDateOnly(event.endDate);

    const isOngoing = today >= start && today <= end;
    const isPast = today > end;
    const isFuture = today < start;

    return {
      ...event,
      dateRange: formatDateRange(event.startDate, event.endDate),
      isOngoing,
      isPast,
      isFuture,
      startDateString: start,
    };
  });

  // Find the current event in the timeline:
  // 1. If there's an ongoing event, that's current
  // 2. Otherwise, find the most recent past event
  // 3. If no past events, the first future event is current
  
  let currentIndex = -1;
  
  // Check for ongoing event
  currentIndex = eventsWithStatus.findIndex(e => e.isOngoing);
  
  // If no ongoing event, find the most recent past event
  if (currentIndex === -1) {
    const pastEvents = eventsWithStatus
      .map((e, index) => ({ ...e, originalIndex: index }))
      .filter(e => e.isPast);
    
    if (pastEvents.length > 0) {
      // Get the most recent past event (last in the past events array)
      const mostRecent = pastEvents.reduce((latest, current) => 
        current.startDateString > latest.startDateString ? current : latest
      );
      currentIndex = mostRecent.originalIndex;
    }
  }
  
  // If still no current event (all are future), the first event is current
  if (currentIndex === -1) {
    currentIndex = 0;
  }

  return eventsWithStatus.map((event, index) => ({
    ...event,
    isCurrent: index === currentIndex,
  }));
};

interface WizardProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber: number;
  stepLabel: string;
  state?: 'before' | 'current' | 'after';
  progress?: number;
}

const WizardProgress = React.forwardRef<HTMLDivElement, WizardProgressProps>(
  (
    {
      className,
      stepNumber,
      stepLabel,
      state = 'before',
      progress = 20,
      ...props
    },
    ref
  ) => {
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
          return 100;
        case 'current':
          return progress;
        case 'before':
        default:
          return 0;
      }
    };

    const getProgressLabel = () => {
      if (state === 'after') return 'Completed';
      if (state === 'current') return `${progress.toFixed(1)}%`;
      return '0.0%';
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        <div className="flex items-center gap-5">
          {renderCircle()}

          <span className="text-primary font-bold text-[19px] leading-none font-dm whitespace-nowrap">
            {stepLabel}
          </span>

          {/* Progress bar */}
          <div className="flex-1 h-2 rounded-lg bg-muted overflow-hidden">
            <div
              className="h-2 rounded-lg bg-primary-foreground-2 transition-all duration-300 ease-in-out"
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
        </div>
        
        {/* Label centered below progress bar */}
        <div className="flex items-center gap-5">
          <div className="w-10"></div>
          <span className="invisible text-primary font-bold text-[19px] leading-none font-dm whitespace-nowrap">
            {stepLabel}
          </span>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-gray-500 font-medium">{getProgressLabel()}</span>
          </div>
        </div>
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
        <span className="text-sm mt-6 font-medium" style={{ color: colors[color].text }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function OverallProgress() {
    const getBadgeColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-600';
            case 'Pending': return 'bg-blue-600';
            case 'In Progress': return 'bg-blue-500';
            case 'Revisions': return 'bg-yellow-400';
            case 'Not Started': return 'bg-gray-400';
            default: return 'bg-gray-600';
        }
    };

    // Calculate timeline status inside component for real-time updates
    const scheduleTimeline = React.useMemo(() => calculateTimelineStatus(), []);

    return (
        <ProgressTrackingLayout 
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <Head title="Overall Progress" />

            <div className="space-y-2">
                {/* Wizard Progress */}
                <section className="space-y-2">
                    <h3 className="text-[24px] font-bold text-[#730000]">Overall Progress</h3>
                    <div className="flex gap-6">
                        <WizardProgress stepNumber={1} stepLabel="Methods of Research" state={wizardStates.mor.state} progress={wizardStates.mor.progress} className="flex-1" />
                        <WizardProgress stepNumber={2} stepLabel="Design Project 1" state={wizardStates.dp1.state} progress={wizardStates.dp1.progress} className="flex-1" />
                        <WizardProgress stepNumber={3} stepLabel="Design Project 2" state={wizardStates.dp2.state} progress={wizardStates.dp2.progress} className="flex-1" />
                    </div>
                </section>

                {/* Tracker Boxes */}
                <div className="mt-6">
                    <div className="bg-[#730000] text-white text-center py-2 rounded-t text-[18px]">Overall Tracker</div>
                    <div className="bg-white rounded-b shadow p-6 space-y-2">
                        <div className="grid grid-cols-4 gap-6">
                            <TrackerBox count={3} label="Pending" color="blue" />
                            <TrackerBox count={2} label="Revisions" color="yellow" />
                            <TrackerBox count={3} label="Approved" color="green" />
                            <TrackerBox count={1} label="Urgent" color="red" />
                        </div>
                    </div>
                </div>

                {/* Track by Milestones Table (Current Course Only - No Toggle) */}
                <div className="space-y-2 mt-6">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-[#730000] text-[18px]">
                            Track by Milestones - {currentCourseInfo.courseName} ({currentCourseInfo.courseCode})
                        </h4>
                    </div>

                    {/* Table Header */}
                    <div className="flex rounded-t px-5 py-3" style={{ backgroundColor: '#730000' }}>
                        <span className="flex-1 text-[18px] text-white text-center">Milestone</span>
                        <span className="flex-1 text-[18px] text-white text-center">Duration</span>
                        <span className="flex-1 text-[18px] text-white text-center">Status</span>
                    </div>

                    {/* Table Rows */}
                    <div className="rounded-b divide-y">
                        {getSequentialMilestones(currentCourseMilestones).map((item, index) => (
                            <div key={index} className="flex bg-white px-5 py-3 items-center">
                                <span className="flex-1 text-sm text-gray-800 text-center">{item.milestone}</span>
                                <span className="flex-1 text-sm text-gray-800 text-center">{item.duration}</span>
                                <span className="flex-1 text-center">
                                    <Badge className={`${getBadgeColor(item.status)} border-transparent px-3 py-1`}>{item.status}</Badge>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Schedule Timeline */}
                <div className="space-y-2 mt-6">
                    <h4 className="font-semibold text-[#730000] text-[18px]">Schedule Timeline</h4>
                    
                    <div className="relative">
                        {/* Vertical yellow line */}
                        <div
                            className="absolute"
                            style={{
                                left: '10.5px',
                                top: 0,
                                bottom: 0,
                                width: '3px',
                                backgroundColor: '#FFBD00',
                                zIndex: 1,
                            }}
                        />

                        {/* Timeline events */}
                        {scheduleTimeline.map((event) => (
                            <div key={event.id} className="relative flex gap-6 pb-6 last:pb-0">
                                {/* Timeline Dot */}
                                <div className="flex flex-col items-center" style={{ width: '24px', zIndex: 2 }}>
                                    <div className="relative flex items-center justify-center w-6 h-6">
                                        {event.isCurrent ? (
                                            <div className="relative w-full h-full">
                                                <div className="absolute inset-0 rounded-full bg-[#9B000A63]" />
                                                <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#9B000A] transform -translate-x-1/2 -translate-y-1/2" />
                                                <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-[#730000] transform -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                        ) : event.isPast ? (
                                            <div className="rounded-full w-6 h-6 bg-[#730000] border-4 border-[#730000]" />
                                        ) : (
                                            <div className="rounded-full w-6 h-6 border-4 border-[#9B000A] bg-white" />
                                        )}
                                    </div>
                                </div>

                                {/* Event Card */}
                                <Card
                                    className="relative flex-1 p-3 overflow-hidden"
                                    style={{
                                        backgroundColor: event.isCurrent || event.isPast ? '#FFBD0099' : '#F3F4F6',
                                        border: `2px solid ${event.isCurrent || event.isPast ? '#FFBD00' : '#D1D5DB'}`,
                                    }}
                                >
                                    <div className="absolute left-0 top-0 h-full w-[3px]" style={{ backgroundColor: '#730000' }} />
                                    <CardHeader className="p-0">
                                        <CardTitle className="text-[15px] font-semibold" style={{ color: '#730000' }}>
                                            {event.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-6 mb-1">
                                            <Calendar size={16} color="#730000" />
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#730000' }}>{event.dateRange}</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#730000', lineHeight: '1.5' }}>{event.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProgressTrackingLayout>
    );
}
