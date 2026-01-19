import { useState } from 'react'
import type { BreadcrumbItem, PageHeaderProps } from '@/types'
import { Head } from '@inertiajs/react'
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index'
import { TabButton } from '@/components/ui/tabs'
import StageSwitchToggle from '@/components/stage-toggle'
import ThesisIcon from '@/components/Icons/thesis_icon.svg'
import { router } from '@inertiajs/react'

// Setup
const pageHeader: PageHeaderProps = {
  title: "Thesis Management",
  subtitle: "Access and manage your thesis documents",
  icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Comments', href: '' },
]

const MILESTONES = [
  { key: 'mor', label: 'MOR' },
  { key: 'dp1', label: 'DP1' },
  { key: 'dp2', label: 'DP2' },
]

const WORKFLOW_COMMENTS = [
  {
    id: 1,
    member: 'Dr. Maria Santos (Adviser)',
    date: '2025-12-05',
    comment: 'Literature review is comprehensive. However, consider adding more recent studies from 2024-2025 on AI in education.',
  },
  {
    id: 2,
    member: 'Dr. Maria Santos (Adviser)',
    date: '2025-12-03',
    comment: 'Good progress on Chapter 2. Please revise the methodology section to include more details about your data collection process.',
  },
  {
    id: 3,
    member: 'Dr. Maria Santos (Adviser)',
    date: '2025-12-01',
    comment: 'Initial draft looks promising. Focus on strengthening your research questions and objectives.',
  },
]

/* TABS */
const LEADER_TABS = [
  { key: 'documents', label: 'Documents', href: '/management/thesis/documents' },
  { key: 'compare', label: 'Compare', href: '/management/thesis/compare' },
  { key: 'comments', label: 'Comments', href: '/management/thesis/comments' },
  { key: 'final_submission', label: 'Final Submission', href: '/management/thesis/final-submission' },
  { key: 'change_request', label: 'Change Request', href: '/management/thesis/change-request' },
]

export default function CommentsPage({ currentMilestone }: { currentMilestone?: string }) {
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
      <Head title="Thesis Management - Comments" />

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
            isActive={tab.key === 'comments'}
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
        <h2 className="mb-4 text-3xl font-medium text-[#730000]">Comments</h2>

        {/* Comments and Feedbacks Section */}
        <div>
          <h3 className="text-xl font-semibold text-[#730000] mb-4">Adviser Comments and Feedbacks</h3>

          <div className="space-y-3">
            {WORKFLOW_COMMENTS.map((comment) => (
              <div key={comment.id} className="bg-[#FFF9E6] rounded-lg p-4 border border-[#E5E5E5]">
                <div className="mb-2">
                  <h4 className="font-semibold text-sm text-[#730000]">{comment.member}</h4>
                  <p className="text-xs text-gray-600">{comment.date}</p>
                </div>
                <p className="text-sm text-gray-800">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThesisManagementLayout>
  )
}
