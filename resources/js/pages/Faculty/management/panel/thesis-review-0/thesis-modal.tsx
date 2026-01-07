import React from 'react';
  import { X, Calendar, Clock, MapPin, User } from 'lucide-react';
  import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogClose,} from '@/components/ui/dialog';
  import { badgesRegistry } from '@/components/badges-registry';

  const CompletedBadge = badgesRegistry.scheduledBadgesCompleted;

  interface Defense {
    id: string;
    title: string;
    proponents: number;
    adviser: string;
    block: string;
    dateTime: string;
    type: string;
  }

  interface ThesisModalProps {
    defense: Defense | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    status?: 'pending' | 'approved';
  }

  export default function ThesisModal({ defense, open, onOpenChange, status = 'pending' }: ThesisModalProps) {
    if (!defense) return null;

    const [date, time] = defense.dateTime.split('\n');

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!w-[728px] !max-w-[728px] p-0 gap-0 rounded-[10px] border-[0.8px] border-black/10 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
          {/* Header with border-bottom */}
          <div className="px-6 pt-[17px] pb-[5px] border-b-[0.8px] border-[#E5E7EB]">
            <DialogHeader className="flex flex-col items-start">
              <DialogTitle className="text-[22px] font-medium leading-[29px] text-[#0A0A0A]">
                Defense Details
              </DialogTitle>
              <DialogDescription className="text-[15px] font-medium leading-[20px] text-[#717182]">
                Complete information about the thesis defense
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Defense Info - Scrollable content area */}
          <div className="px-6 py-5 space-y-[10px] max-h-[calc(90vh-100px)] overflow-y-auto">
            {/* Defense ID */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Defense ID</div>
                <div className="text-[16px] font-medium leading-[21px] text-[#000000]">{defense.id}</div>
              </div>
              {/* Conditional Badge based on status */}
              {status === 'pending' ? (
                <div className="flex flex-row justify-center items-center px-2 py-[2px] gap-1 w-[74.08px] h-[21.59px] bg-[#730000] rounded-lg">
                  <span className="w-16 h-4 font-medium text-[12px] leading-4 text-white">
                    Upcoming
                  </span>
                </div>
              ) : (
                <div className="flex flex-row justify-center items-center px-2 py-[2px] gap-1 w-[74.08px] h-[21.59px] bg-[#007000] rounded-lg">
                  <span className="w-16 h-4 font-medium text-[12px] leading-4 text-white">
                    Completed
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Thesis Title</div>
              <div className="text-[16px] font-medium leading-[21px] text-[#0A0A0A]">{defense.title}</div>
            </div>

            {/* Date, Time, Venue */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Date</div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} strokeWidth={1.33} color="#99A1AF" />
                  <span className="text-[16px] font-medium leading-[21px] text-[#0A0A0A]">{date}</span>
                </div>
              </div>
              <div>
                <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Time</div>
                <div className="flex items-center gap-2">
                  <Clock size={16} strokeWidth={1.33} color="#99A1AF" />
                  <span className="text-[16px] font-medium leading-[21px] text-[#0A0A0A]">{time}</span>
                </div>
              </div>
              <div>
                <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Venue</div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} strokeWidth={1.33} color="#99A1AF" />
                  <span className="text-[16px] font-medium leading-[21px] text-[#0A0A0A]">Room 313, CEA</span>
                </div>
              </div>
            </div>

            {/* Block & Adviser */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Block</div>
                <div className="inline-flex items-center justify-center px-[5px] py-[5px] rounded-lg border-[0.8px] border-black/10 text-[12px] font-medium leading-4 text-[#0A0A0A] h-[26px]">
                  {defense.block}
                </div>
              </div>
              <div>
                <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-1">Thesis Adviser</div>
                <div className="text-[16px] font-medium leading-[21px] text-[#0A0A0A]">{defense.adviser}</div>
              </div>
            </div>

            {/* Proponents */}
            <div>
              <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-2">Proponents</div>
              <div className="flex flex-wrap gap-2">
                {Array(defense.proponents).fill(null).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex w-fit items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-0.75"
                  >
                    <User className="h-4 w-4" />
                    {idx === 0 ? 'John Doe' : idx === 1 ? 'Jane Smith' : idx === 2 ? 'Mike Johnson' : 'John Doe'}
                  </div>
                ))}
              </div>
            </div>

            {/* Defense Panel */}
            <div>
              <div className="text-[16px] font-bold leading-[21px] text-[#730000] mb-2">Defense Panel</div>
              <div className="space-y-2">
                {[
                  { initial: 'P1', name: 'Dr. Robert Chen' },
                  { initial: 'P2', name: 'Dr. Sofia Smith' },
                  { initial: 'P3', name: 'Engr. John Johnson' }
                ].map((panelist, idx) => (
                  <div key={idx} className="flex items-center gap-[10px] bg-[#F9FAFB] px-[10px] rounded-[4px] h-12">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(115,0,0,0.5)] text-[#730000] text-[16px] font-medium leading-[21px]">
                      {panelist.initial}
                    </div>
                    <span className="text-[16px] font-medium leading-[21px] text-[#0A0A0A]">{panelist.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }