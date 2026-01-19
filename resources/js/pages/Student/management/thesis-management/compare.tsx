import { useState } from 'react'
import type { BreadcrumbItem, PageHeaderProps } from '@/types'
import { Head } from '@inertiajs/react'
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index'
import { TabButton } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StageSwitchToggle from '@/components/stage-toggle'
import ThesisIcon from '@/components/Icons/thesis_icon.svg'
import { FileText } from 'lucide-react'
import { router } from '@inertiajs/react'

// Setup
const pageHeader: PageHeaderProps = {
  title: "Thesis Management",
  subtitle: "Access and manage your thesis documents",
  icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Compare', href: '' },
]

const COMPARE_VERSIONS = [
  { value: 'v1', label: 'v1 - December 19, 2025' },
  { value: 'v2', label: 'v2 - December 20, 2025' },
  { value: 'v3', label: 'v3 - December 30, 2025' },
]

const MILESTONES = [
  { key: 'mor', label: 'MOR' },
  { key: 'dp1', label: 'DP1' },
  { key: 'dp2', label: 'DP2' },
]

/* TABS */
const LEADER_TABS = [
  { key: 'documents', label: 'Documents', href: '/management/thesis/documents' },
  { key: 'compare', label: 'Compare', href: '/management/thesis/compare' },
  { key: 'comments', label: 'Comments', href: '/management/thesis/comments' },
  { key: 'final_submission', label: 'Final Submission', href: '/management/thesis/final-submission' },
  { key: 'change_request', label: 'Change Request', href: '/management/thesis/change-request' },
]

export default function ComparePage({ currentMilestone }: { currentMilestone?: string }) {
  const studentCurrentMilestone = currentMilestone ?? 'dp2'
  const currentMilestoneIndex = Math.max(
    MILESTONES.findIndex(milestone => milestone.key === studentCurrentMilestone),
    0
  )
  const availableMilestones = MILESTONES.slice(0, currentMilestoneIndex + 1)
  const defaultMilestoneKey = availableMilestones.find(m => m.key === studentCurrentMilestone)?.key ?? MILESTONES[0].key

  const [selectedMilestone, setSelectedMilestone] = useState(defaultMilestoneKey)

  // Hide Final Submission tab until DP2
  const hasPassedDP2 = studentCurrentMilestone === 'dp2'
  const TABS = hasPassedDP2 ? LEADER_TABS : LEADER_TABS.filter(tab => tab.key !== 'final_submission')

  return (
    <ThesisManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
      <Head title="Thesis Management - Compare" />

      {/* Milestone Toggle */}
      <div className="mt-1">
        <StageSwitchToggle
          value={selectedMilestone as 'mor' | 'dp1' | 'dp2'}
          onChange={(stage) => setSelectedMilestone(stage)}
        />
      </div>

      {/* TABS */}
      <div className="flex mt-2">
        {TABS.map(tab => (
          <TabButton
            key={tab.key}
            isActive={tab.key === 'compare'}
            onClick={() => router.visit(tab.href)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* CONTENT */}
      <div
        className="rounded-b-xl rounded-tr-xl bg-white p-6 -mt-[16px]"
        style={{ border: '1px solid #73000042', boxShadow: '0 8px 24px #00000040' }}
      >
        <h2 className="mb-6 text-3xl font-medium text-[#730000]">Compare Documents</h2>

        <div className="space-y-6">
          {/* Document Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
            <Input
              type="text"
              placeholder="Document Title"
              inputSize="full"
              className="placeholder:text-gray-500"
            />
          </div>

          {/* Version Selects */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Version</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  {COMPARE_VERSIONS.map(version => (
                    <SelectItem key={version.value} value={version.value}>{version.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Version</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  {COMPARE_VERSIONS.map(version => (
                    <SelectItem key={version.value} value={version.value}>{version.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Side-by-side Document Preview Panels */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-[#F5F5F7] rounded-lg p-8 min-h-[500px] flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Select a version to preview</p>
              </div>
            </div>

            <div className="bg-[#F5F5F7] rounded-lg p-8 min-h-[500px] flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Select a version to preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThesisManagementLayout>
  )
}
