import * as React from 'react'
import { SidebarInset } from '@/components/ui/sidebar';

interface HeaderCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

function HeaderCard({ title = 'Page Title', subtitle = 'Subtitle', icon }: HeaderCardProps) {
  return (
    <div className="w-full h-[124px] border-b flex flex-row items-center px-6 py-8" style={{ backgroundColor: 'var(--primary-foreground)', borderColor: 'var(--sidebar-gradient-mid)' }}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {icon ? icon : <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>}
          <h2 className="text-[30px] font-normal leading-[36px]" style={{ color: 'var(--primary-foreground-2)' }}>
            {title}
          </h2>
        </div>
        <p className="text-[18px] font-normal leading-[16px] ml-11" style={{ color: 'var(--primary)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

interface AppContentProps extends React.ComponentProps<'div'> {
  variant?: 'header' | 'sidebar';
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AppContent({
  variant = 'header',
  title,
  subtitle,
  icon,
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

  // Header variant: adds HeaderCard, centered max-width layout
  return (
    <div
      className="flex h-full w-full flex-1 flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }}
      {...props}
    >
      {(title || subtitle) && (
        <div className="w-full border-b" style={{ borderColor: 'var(--sidebar-gradient-mid)' }}>
          <div className="mx-auto max-w-[1440px] h-[124px] flex flex-row items-center px-6 py-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {icon ? icon : <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>}
                <h2 className="text-[30px] font-normal leading-[36px]" style={{ color: 'var(--primary-foreground-2)' }}>
                  {title}
                </h2>
              </div>
              <p className="text-[18px] font-normal leading-[16px] ml-11" style={{ color: 'var(--primary)' }}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-[1440px] p-6">
        {children}
      </div>
    </div>
  )
}
