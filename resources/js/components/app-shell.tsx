import { 
  SidebarProvider, 
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarHeader as SidebarHeaderUI,
  SidebarFooter as SidebarFooterUI,
} from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { NavMain } from '@/components/nav-main';

function ThesisHeader() {
  return (
    <div className="w-full h-[150px]" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="h-[100px] flex items-center justify-center">
        <p className= "text-lg" style={{ color: 'var(--primary-foreground)' }}>Header Placeholder</p>
      </div>
      <div className="h-[50px] flex items-center px-6" style={{ backgroundColor: 'var(--breadcrumb)' }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" style={{ color: 'var(--primary)' }}>
                Module Title
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: 'var(--primary)' }} />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold" style={{ color: 'var(--primary)' }}>
                Page Title
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function AppSidebar() {
  const navItems = [
    { title: 'Dashboard', href: '/'},
    { title: 'Documents', href: '/documents'},
    { title: 'Settings', href: '/settings'},
  ];

  return (
    <Sidebar>
      <SidebarHeaderUI>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 rounded" style={{ color: 'var(--primary)' }}></div>
        </div>
      </SidebarHeaderUI>
      
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>      
      <SidebarFooterUI>
      </SidebarFooterUI>
    </Sidebar>
  );
}

// Header for sidebar variant with toggle button
function SidebarHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">
              Module Title
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Page Title</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
  let isOpen = true;
  try {
    isOpen = usePage<SharedData>().props.sidebarOpen ?? true;
  } catch {
    isOpen = true;
  }

  // Header variant: includes ThesisHeader
  if (variant === 'header') {
    return (
      <div className="flex min-h-screen w-full flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }}>
        <ThesisHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Sidebar variant: provides sidebar structure
  // Wrapped in a container so it displays properly in showcases
  return (
    <div className="flex h-screen w-full">
      <SidebarProvider defaultOpen={isOpen}>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <SidebarHeader />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}