import { cn } from '@/lib/utils';
import * as React from 'react';
import { useState } from 'react';

// Individual Tab Button
interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
    ({ className, isActive = false, children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'flex h-9 flex-col items-center justify-center gap-2.5 px-[15px]',
                'rounded-t-[10px] transition-colors',
                'shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]',

                // Base background
                isActive ? 'bg-[#9b000a]' : 'bg-primary hover:bg-[#9b000a]',

                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-center gap-2.5">
                <span className="font-dm text-[19px] leading-normal font-medium whitespace-nowrap text-primary-foreground-2">
                    {children}
                </span>
            </div>
        </button>
    ),
);
TabButton.displayName = 'TabButton';

// Interactive Tabs Container
interface TabsProps {
    tabs: string[];
    defaultTab?: string;
    className?: string;
    onTabChange?: (tab: string) => void;
}

const Tabs = ({ tabs, defaultTab, className, onTabChange }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        onTabChange?.(tab); // notify parent if provided
    };

    return (
        <div className={cn('inline-flex', className)}>
            {tabs.map((tab) => (
                <TabButton
                    key={tab}
                    isActive={activeTab === tab}
                    onClick={() => handleTabClick(tab)} // use handler
                >
                    {tab}
                </TabButton>
            ))}
        </div>
    );
};

export { TabButton, Tabs };
