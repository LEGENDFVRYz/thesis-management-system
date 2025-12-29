import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { TabButton } from './ui/tabs';
import { Icon } from './ui/icon';

export interface TimelineEvent {
  id: string;
  title: string;
  dateRange: string;
  description: string;
  status: 'current' | 'upcoming' | 'past';
  isCurrent?: boolean;
}

export interface TimelineViewProps {
  events?: TimelineEvent[];
  className?: string;
}


// Sample data for demonstration
const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'current',
    isCurrent: true,
  },
  {
    id: '2',
    title: 'Panel Assignment Deadline',
    dateRange: 'November 20',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'current',
  },
  {
    id: '3',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'current',
  },
  {
    id: '4',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'current',
  },
  {
    id: '5',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'current',
  },
  // Upcoming events
  {
    id: '6',
    title: 'Holiday Break',
    dateRange: 'December 23 - January 5',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'upcoming',
    isCurrent: true,
  },
  {
    id: '7',
    title: 'Classes Resume',
    dateRange: 'January 5',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'upcoming',
  },
  {
    id: '8',
    title: 'Re-Defense Week',
    dateRange: 'January 12 - 16',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'upcoming',
  },
  {
    id: '9',
    title: 'Upcoming Deadline',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'upcoming',
  },
  {
    id: '10',
    title: 'Upcoming Deadline',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'upcoming',
  },
  // Past events
  {
    id: '11',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'past',
    isCurrent: true,
  },
  {
    id: '12',
    title: 'Panel Assignment Deadline',
    dateRange: 'November 20',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'past',
  },
  {
    id: '13',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'past',
  },
  {
    id: '14',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'past',
  },
  {
    id: '15',
    title: 'Proposal Submission',
    dateRange: 'October 1 - November 15',
    description: 'Students can submit their thesis proposal during this period.',
    status: 'past',
  },
];

export function Timeline({ events = DEFAULT_EVENTS, className = '' }: TimelineViewProps) {
  const [activeTab, setActiveTab] = useState<'Current' | 'Upcoming' | 'Past'>('Current');

  const filteredEvents = events.filter((event) => {
    if (activeTab === 'Current') return event.status === 'current';
    if (activeTab === 'Upcoming') return event.status === 'upcoming';
    return event.status === 'past';
  });

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      {/* Tab Buttons using tabs.tsx */}
      <div className="flex gap-0 mb-6" style={{ width: 'fit-content' }}>
        {(['Current', 'Upcoming', 'Past'] as const).map((tab, index) => (
          <TabButton
            key={tab}
            isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className="px-8 py-2"
            style={{
              backgroundColor: activeTab === tab ? '#9B000A' : '#730000',
              boxShadow:
                activeTab === tab ? 'none' : 'inset 0 2px 8px rgba(0, 0, 0, 0.25)',
              borderTopLeftRadius: index === 0 ? '8px' : '0',
              borderBottomLeftRadius: index === 0 ? '8px' : '0',
              borderTopRightRadius: index === 2 ? '8px' : '0',
              borderBottomRightRadius: index === 2 ? '8px' : '0',
            }}
          >
            {tab}
          </TabButton>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          style={{
            position: 'absolute',
            left: '12px', 
            top: '12px', 
            bottom: '12px', 
            width: '3px',
            backgroundColor: '#FFBD00',
            zIndex: 1,
          }}
        />

        {filteredEvents.map((event) => (
          <div key={event.id} className="relative flex gap-4 pb-4 last:pb-0">

                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center" style={{ width: '24px', position: 'relative', zIndex: 2 }}>
                    <div className="relative flex items-center justify-center" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                      {(event.isCurrent || event.status === 'past') ? (
                        // Current first dot or Past event: 3-layer red circle
                        <div className="relative" style={{ width: '24px', height: '24px' }}>
                          {/* Outer layer */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#9B000A63',
                            }}
                          />
                          {/* Middle layer */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: '#9B000A',
                            }}
                          />
                          {/* Inner layer */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: '#730000',
                            }}
                          />
                        </div>
                      ) : (
                        // Non-current, non-past events (like other upcoming): outline circle
                        <div className="rounded-full" style={{ width: '24px', height: '24px', border: '4px solid #9B000A', backgroundColor: 'white' }} />
                      )}
                    </div>
                  </div>
            {/* Event Card using shared Card components */}
            <Card
            className="relative flex-1 p-3 overflow-hidden"
            style={{
                backgroundColor: activeTab === 'Past' ? '#95969766' : '#FFBD0099',
                border: activeTab === 'Past' ? '2px solid #959697' : '2px solid #FFBD00',
            }}
            >
            {/* Red side accent */}
            <div
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ backgroundColor: '#730000' }}
            />
              <CardHeader className="p-0">
                <CardTitle className="text-[15px] font-semibold" style={{ color: '#730000' }}>
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon iconNode={Calendar} className="w-[14px] h-[14px] text-[#730000]" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#730000' }}>{event.dateRange}</span>
                </div>

                <p style={{ fontSize: '13px', color: '#730000', lineHeight: '1.5' }}>{event.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
