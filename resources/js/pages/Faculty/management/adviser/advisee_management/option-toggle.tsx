import { cn } from '@/lib/utils';

interface OptionToggleProps {
  currentStatus: 'pending' | 'approved';
  onStatusChange: (status: 'pending' | 'approved') => void;
  pendingCount?: number;
  approvedCount?: number;
  pendingLabel?: string;
  approvedLabel?: string;
  className?: string;
}

export default function OptionToggle({
  currentStatus,
  onStatusChange,
  pendingCount = 0,
  approvedCount = 0,
  pendingLabel = 'Pending Groups',
  approvedLabel = 'Approved Groups',
  className = '',
}: OptionToggleProps) {
  return (
    <div
      className={cn(
        // dual_button
        'relative flex w-[448px] h-[36px] bg-[#ECECF0] rounded-[14px] p-[3px]',
        className
      )}
    >
      {/* Primary / Pending */}
      <button
        type="button"
        onClick={() => onStatusChange('pending')}
        className={cn(
          // primary_sizes
          'flex items-center justify-center w-[221px] h-[29px] rounded-[14px]',
          'font-["DM_Sans"] font-medium text-[13.33px] leading-[17px]',
          currentStatus === 'pending'
            ? 'bg-[#730000] text-white'
            : 'bg-[#F3EFD0] text-[#730000]'
        )}
      >
        {pendingLabel} ({pendingCount})
      </button>

      {/* Secondary / Approved */}
      <button
        type="button"
        onClick={() => onStatusChange('approved')}
        className={cn(
          // secondary_sizes
          'flex items-center justify-center w-[221px] h-[29px] rounded-[14px]',
          'font-["DM_Sans"] font-medium text-[13.33px] leading-[17px]',
          currentStatus === 'approved'
            ? 'bg-[#730000] text-white'
            : 'bg-[#F3EFD0] text-[#730000]'
        )}
      >
        {approvedLabel} ({approvedCount})
      </button>
    </div>
  );
}