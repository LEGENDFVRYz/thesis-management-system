import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function StageSwitchToggle({
  className,
}: {
  className?: string;
}) {
  const [currentStage, setCurrentStage] = useState<'mor' | 'dp1' | 'dp2'>('mor');

  return (
    <div
      className={cn(
        'bg-breadcrumb flex h-[31px] w-[398px] justify-between rounded-[14px] p-[5px]',
        className
      )}
    >
      {/* MOR */}
      <button
        type="button"
        onClick={() => setCurrentStage('mor')}
        className={cn(
          'flex-1 rounded-[10px] text-[12px] font-medium transition-all duration-200',
          currentStage === 'mor'
            ? 'bg-[#730000] text-white'
            : 'bg-transparent text-[#730000] hover:bg-white hover:border hover:border-[#730000]'
        )}
      >
        MOR
      </button>

      {/* DP1 */}
      <button
        type="button"
        onClick={() => setCurrentStage('dp1')}
        className={cn(
          'flex-1 rounded-[10px] text-[12px] font-medium transition-all duration-200',
          currentStage === 'dp1'
            ? 'bg-[#730000] text-white'
            : 'bg-transparent text-[#730000] hover:bg-white hover:border hover:border-[#730000]'
        )}
      >
        DP1
      </button>

      {/* DP2 */}
      <button
        type="button"
        onClick={() => setCurrentStage('dp2')}
        className={cn(
          'flex-1 rounded-[10px] text-[12px] font-medium transition-all duration-200',
          currentStage === 'dp2'
            ? 'bg-[#730000] text-white'
            : 'bg-transparent text-[#730000] hover:bg-white hover:border hover:border-[#730000]'
        )}
      >
        DP2
      </button>
    </div>
  );
}
