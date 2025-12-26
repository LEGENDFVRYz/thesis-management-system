import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';


import { SidebarInset } from '@/components/ui/sidebar'
import * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NavFooter } from "@/components/nav-footer" 

function ThesisHeader() {
  return (
    <div className="w-full bg-[#730000] h-[150px]">
      <div className="h-[100px] flex items-center justify-center">
        <p className="text-white text-lg">Header Placeholder</p>
      </div>

      {/* Sub-bar with Breadcrumb */}
      <div className="bg-[#F3EFD0] h-[50px] flex items-center px-6 style={{ fontSize: 'var(--body-3)">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-[#730000]">
                Module Title
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[#730000]" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#730000] font-semibold">
                Page Title
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

function HeaderCard() {
  return (
    <div className="w-full h-[124px] bg-white border-b border-[#9B000A] flex flex-row items-center px-6 py-8">
        <div className="flex flex-col gap-3">
            {/* Container with logo and title */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#730000] rounded"></div>
                <h2 className="text-[30px] font-normal leading-[36px] text-[#FFBD00]">
                    Page Title
                </h2>
            </div>
            {/* Subtitle below */}
            <p className="text-[18px] font-normal leading-[16px] text-[#730000] ml-11">
                Subtitle
            </p>
        </div>
    </div>
  )
}

function ThesisFooter() {
  return <NavFooter />
}
interface AppContentProps extends React.ComponentProps<'main'> {
  variant?: 'header' | 'sidebar'
}

export function AppContent({
  variant = 'header',
  children,
  ...props
}: AppContentProps) {
  if (variant === 'sidebar') {
    return <SidebarInset {...props}>{children}</SidebarInset>
  }

  return (
    <main
      className="mx-auto flex h-full w-full max-w-[1440px] flex-1 flex-col justify-between gap-4 rounded-xl bg-white min-h-[1800px]"
      {...props}
    >
        <ThesisHeader />
        <HeaderCard />
        <ThesisFooter />
    </main>
  )
}



interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <ThesisHeader />
                <main className="flex-1 bg-white min-h-[1000px]">
                    {children}
                </main>
                <ThesisFooter />
            </div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
