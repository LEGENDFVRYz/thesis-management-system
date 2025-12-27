import * as React from 'react'
import { SidebarInset } from '@/components/ui/sidebar';

function HeaderCard() {
  return (
    <div className="w-full h-[124px] border-b flex flex-row items-center px-6 py-8" style={{ backgroundColor: 'var(--primary-foreground)', borderColor: 'var(--sidebar-gradient-mid)' }}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>
          <h2 className="text-[30px] font-normal leading-[36px]" style={{ color: 'var(--primary-foreground-2)' }}>
            Page Title
          </h2>
        </div>
        <p className="text-[18px] font-normal leading-[16px] ml-11" style={{ color: 'var(--primary)' }}>
          Subtitle
        </p>
      </div>
    </div>
  )
}

interface AppContentProps extends React.ComponentProps<'div'> {
  variant?: 'header' | 'sidebar'
}

export function AppContent({
  variant = 'header',
  children,
  ...props
}: AppContentProps) {
  if (variant === 'sidebar') {
    return (
      <SidebarInset>
        <div className="flex-1p-6" style={{ backgroundColor: 'var(--primary-foreground)' }} {...props}>
          {children}
        </div>
      </SidebarInset>
    )
  }

  // Header variant: adds HeaderCard, centered max-width layout
  return (
    <div
      className="mx-auto flex h-full w-full max-w-[1440px] flex-1 flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }} 
      {...props}
    >
      <HeaderCard />
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}