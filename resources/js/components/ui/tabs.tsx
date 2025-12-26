import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Individual Tab Button
interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
    ({ className, isActive = false, children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'h-9 px-[15px] flex flex-col justify-center items-center gap-2.5',
                'rounded-t-[10px] transition-colors',
                'shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]',
                isActive ? 'bg-[#9b000a]' : 'bg-primary', // Lighter when active (opposite)
                className
            )}
            {...props}
        >
            <div className="flex justify-center items-center gap-2.5">
                <span className="text-primary-foreground-2 font-medium text-[19px] leading-normal whitespace-nowrap font-dm">
                    {children}
                </span>
            </div>
        </button>
    )
);
TabButton.displayName = 'TabButton';

// Interactive Tabs Container
interface TabsProps {
    tabs: string[];
    defaultTab?: string;
    className?: string;
}

const Tabs = ({ tabs, defaultTab, className }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

    return (
        <div className={cn('inline-flex', className)}>
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
    );
};

export { Tabs, TabButton };
