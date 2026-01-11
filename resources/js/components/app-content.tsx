import * as React from 'react'
import { SidebarInset } from '@/components/ui/sidebar';
import { NavFooter } from './nav-footer';
import { PageHeaderProps } from '@/types';
import { HeaderCard } from './ui/card';

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
    pageHeader?: PageHeaderProps;
}

export function AppContent({
    variant = 'header',
    pageHeader,
    children,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset>
                <div className="flex-1 p-6" style={{ backgroundColor: 'var(--primary-foreground)' }} {...props}>
                    {children}
                </div>
            </SidebarInset>
        )
    }

    return (
        <div
            className="flex h-full w-full flex-1 flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }}
            {...props}
        >

            {/* --- PAGE HEADER --- */}
            {/* {pageHeader && (
                <div className="w-full border-b" style={{ borderColor: 'var(--sidebar-gradient-mid)' }}>
                    <div className="mx-auto max-w-[1440px] h-[124px] flex flex-row items-center px-6 py-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {pageHeader.icon ?? <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>}
                                <h2 className="text-[30px] font-normal leading-[36px]" style={{ color: 'var(--primary-foreground-2)' }}>
                                    {pageHeader.title}
                                </h2>
                            </div>
                            <p className="text-[18px] font-normal leading-[16px] ml-11" style={{ color: 'var(--primary)' }}>
                                {pageHeader.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            )} */}

            {/* NOTE: I think this page header is a good option, so i integrate it */}
            {pageHeader && (
                <div className="w-full border-b flex items-center justify-center" style={{ borderColor: 'var(--sidebar-gradient-mid)' }}>
                    <HeaderCard
                        title={pageHeader.title}
                        description={pageHeader.subtitle}
                        className="w-full rounded-none border-0 border-x-0 shadow-none my-auto"
                        icon={pageHeader.icon ?? null}
                    />
                </div>
            )}

            {/* Note: min-h-screen is only temporary soln to resolve navfooter problems */}
            <div className="flex flex-1 flex-col mx-auto w-full max-w-[1440px] min-h-screen p-6 h-full">
                {children}
            </div>

            <NavFooter />
        </div>
    )
}
