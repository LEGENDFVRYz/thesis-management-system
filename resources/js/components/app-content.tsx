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
      {/* Header content */}
      <div className="h-[100px] flex items-center justify-center">
        <p className="text-white text-lg">Header Placeholder</p>
      </div>
      {/* Subheader with Breadcrumb */}
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
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#730000] rounded"></div>
                <h2 className="text-[30px] font-normal leading-[36px] text-[#FFBD00]">
                    Page Title
                </h2>
            </div>
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
      <div>
        <ThesisHeader />
        <HeaderCard />
        {/* MAIN CONTENT */}
        <div className="p-4 space-y-4">
          {/* TOP ROW: two containers */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left container */}
            <div
              className="flex-1 rounded-lg p-6 min-h-[300px]"
              style={{
                background: 'var(--accent)',
                border: '1px solid rgba(115, 0, 0, 0.26)',
                boxShadow:
                  '0px 0.5px 1.75px rgba(0, 0, 0, 0.039), 0px 1.85px 6.25px rgba(0, 0, 0, 0.25)',
                boxSizing: 'border-box',
              }}
            >
              Left Container
            </div>

            {/* Right container */}
            <div
              className="flex-1 rounded-lg p-6 min-h-[300px]"
              style={{
                background: 'var(--accent)',
                border: '1px solid rgba(115, 0, 0, 0.26)',
                boxShadow:
                  '0px 0.5px 1.75px rgba(0, 0, 0, 0.039), 0px 1.85px 6.25px rgba(0, 0, 0, 0.25)',
                boxSizing: 'border-box',
              }}
            >
              Right Container
            </div>
          </div>

          {/* BOTTOM ROW: long container */}
          <div
            className="w-full rounded-lg p-6 min-h-[350px]"
            style={{
              background: 'var(--accent)',
              border: '1px solid rgba(115, 0, 0, 0.26)',
              boxShadow:
                '0px 0.5px 1.75px rgba(0, 0, 0, 0.039), 0px 1.85px 6.25px rgba(0, 0, 0, 0.25)',
              boxSizing: 'border-box',
            }}
          >
            Long Container 
          </div>
        </div>
      </div>

      <ThesisFooter />
    </main>
  )
}
