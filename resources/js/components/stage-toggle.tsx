import { useState } from 'react';
import { cn } from '@/lib/utils';

type Stage = 'mor' | 'dp1' | 'dp2';

export default function StageSwitchToggle({
  value = 'mor',
  onChange,
  className,
}: {
  value?: Stage;
  onChange?: (stage: Stage) => void;
  className?: string;
}) {
  const handleClick = (stage: Stage) => {
    onChange?.(stage);
  };

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
        onClick={() => handleClick('mor')}
        className={cn(
          'flex-1 rounded-[10px] text-[12px] font-medium transition-all duration-200',
          value === 'mor'
            ? 'bg-primary text-white'
            : 'bg-transparent text-primary hover:bg-white hover:border hover:border-primary'
        )}
      >
        MOR
      </button>

      {/* DP1 */}
      <button
        type="button"
        onClick={() => handleClick('dp1')}
        className={cn(
          'flex-1 rounded-[10px] text-[12px] font-medium transition-all duration-200',
          value === 'dp1'
            ? 'bg-primary text-white'
            : 'bg-transparent text-primary hover:bg-white hover:border hover:border-primary'
        )}
      >
        DP1
      </button>

      {/* DP2 */}
      <button
        type="button"
        onClick={() => handleClick('dp2')}
        className={cn(
          'flex-1 rounded-[10px] text-[12px] font-medium transition-all duration-200',
          value === 'dp2'
            ? 'bg-primary text-white'
            : 'bg-transparent text-primary hover:bg-white hover:border hover:border-primary'
        )}
      >
        DP2
      </button>
    </div>
  );
}
