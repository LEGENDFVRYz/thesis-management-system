import * as React from 'react';
import { cn } from '@/lib/utils';

// Timeline Stepper (Circle)
interface TimelineStepperProps extends React.HTMLAttributes<HTMLDivElement> {
    state?: 'upcoming' | 'current' | 'past';
}

const TimelineStepper = React.forwardRef<HTMLDivElement, TimelineStepperProps>(
    ({ className, state = 'upcoming', ...props }, ref) => {
        if (state === 'past') {
            return (
                <div
                    ref={ref}
                    className={cn(
                        'relative w-7 h-7 flex justify-center items-center flex-shrink-0',
                        className
                    )}
                    {...props}
                >
                    <div className="absolute w-7 h-7 rounded-full border-[5px] border-primary/[0.39] shadow-[0_0_0_4px_rgba(3,2,19,0.20)]" />
                    <div className="absolute w-[18px] h-[18px] rounded-full border-[5px] border-primary/[0.30] bg-[#9b000a] shadow-[0_0_0_4px_rgba(3,2,19,0.20)]" />
                </div>
            );
        }

        if (state === 'current') {
            return (
                <div
                    ref={ref}
                    className={cn(
                        'relative w-7 h-7 flex justify-center items-center flex-shrink-0',
                        className
                    )}
                    {...props}
                >
                    <div className="absolute w-7 h-7 rounded-full border-[5px] border-primary/[0.39] shadow-[0_0_0_4px_rgba(3,2,19,0.20)]" />
                    <div className="absolute w-[18px] h-[18px] rounded-full border-[5px] border-primary/[0.30] bg-[#9b000a] shadow-[0_0_0_4px_rgba(3,2,19,0.20)]" />
                </div>
            );
        }

        // Upcoming (hollow circle)
        return (
            <div
                ref={ref}
                className={cn(
                    'relative w-7 h-7 flex justify-center items-center flex-shrink-0',
                    className
                )}
                {...props}
            >
                <div className="w-7 h-7 rounded-full border-[5px] border-primary/70 shadow-[0_0_0_4px_rgba(3,2,19,0.20)]" />
            </div>
        );
    }
);
TimelineStepper.displayName = 'TimelineStepper';

// Timeline Connector (Line)
interface TimelineConnectorProps extends React.HTMLAttributes<SVGSVGElement> {
    state?: 'upcoming' | 'current' | 'past';
}

const TimelineConnector = React.forwardRef<SVGSVGElement, TimelineConnectorProps>(
    ({ className, state = 'upcoming', ...props }, ref) => {
        const isPast = state === 'past';
        
        return (
            <svg
                ref={ref}
                className={cn(
                    'flex w-1 h-[100px] flex-col flex-shrink-0',
                    className
                )}
                width="4"
                height="100"
                viewBox="0 0 4 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <rect
                    width="100"
                    height="4"
                    transform="matrix(0 1 -1 0 4 0)"
                    fill="var(--primary-foreground-2)" // Using CSS variable for yellow
                    fillOpacity={isPast ? '0.5' : '1'}
                />
            </svg>
        );
    }
);
TimelineConnector.displayName = 'TimelineConnector';

// Complete Timeline State (Circle + Connector as one unit)
interface TimelineStateProps {
    state: 'upcoming' | 'current' | 'past';
    label?: string;
    className?: string;
}

const TimelineState = ({ state, label, className }: TimelineStateProps) => {
    return (
        <div className={cn('flex flex-col items-center', className)}>
            <TimelineStepper state={state} />
            <TimelineConnector state={state} />
            {label && (
                <p className="text-xs text-white font-dm mt-2">{label}</p>
            )}
        </div>
    );
};

export { TimelineStepper, TimelineConnector, TimelineState };