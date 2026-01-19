import { useState } from 'react'
import type { BreadcrumbItem, PageHeaderProps } from '@/types'
import { Head } from '@inertiajs/react'
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index'
import { TabButton } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
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
import { CheckCircle, Clock } from 'lucide-react'
import { router } from '@inertiajs/react'
import { ConfirmDialog } from './components/confirm-dialog'
import { SuccessDialog } from './components/success-dialog'

// Setup
const pageHeader: PageHeaderProps = {
  title: "Thesis Management",
  subtitle: "Access and manage your thesis documents",
  icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Change Request', href: '' },
]

const MILESTONES = [
  { key: 'mor', label: 'MOR' },
  { key: 'dp1', label: 'DP1' },
  { key: 'dp2', label: 'DP2' },
]

const REQUEST_HISTORY = [
  {
    id: 1,
    title: 'Change Research Focus from ML to Deep Learning',
    type: 'Topic Change',
    date: 'December 19, 2025',
    status: 'Approved',
    justification: 'After initial research, found that deep learning approaches are more suitable for the dataset and research objectives. Recent literature also shows better results with DL methods.',
  },
  {
    id: 2,
    title: 'Add New Member to Research Group',
    type: 'Group Composition',
    date: 'December 19, 2025',
    status: 'Pending Review',
    justification: 'Project scope has expanded. Need additional expertise in data visualization and UI/UX design. Candidate has relevant skills and is available.',
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

export default function ChangeRequestPage({ currentMilestone }: { currentMilestone?: string }) {
  const studentCurrentMilestone = currentMilestone ?? 'dp2'
  const currentMilestoneIndex = Math.max(
    MILESTONES.findIndex(milestone => milestone.key === studentCurrentMilestone),
    0
  )
  const availableMilestones = MILESTONES.slice(0, currentMilestoneIndex + 1)
  const defaultMilestoneKey = availableMilestones.find(m => m.key === studentCurrentMilestone)?.key ?? MILESTONES[0].key

  const [selectedMilestone, setSelectedMilestone] = useState(defaultMilestoneKey)
  const [isSubmitChangeOpen, setIsSubmitChangeOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Hide Final Submission tab until DP2
  const hasPassedDP2 = studentCurrentMilestone === 'dp2'
  const TABS = hasPassedDP2 ? LEADER_TABS : LEADER_TABS.filter(tab => tab.key !== 'final_submission')

  const handleSubmitChange = () => {
    setIsSubmitChangeOpen(false)
    setSuccessMessage('Change request submitted successfully!')
    setIsSuccessOpen(true)
  }

  return (
    <ThesisManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
      <Head title="Thesis Management - Change Request" />

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
            isActive={tab.key === 'change_request'}
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
        <h2 className="mb-4 text-3xl font-medium text-[#730000]">Change Request</h2>

        {/* Deadlines & Restrictions Notice */}
        <div className="mb-6 bg-[#FFF9E6] rounded-lg p-4 border border-[#F0E5C8]">
          <h3 className="font-semibold text-sm text-[#730000] mb-3">Request Deadlines & Restrictions</h3>
          <ul className="space-y-1 text-xs text-gray-800">
            <li>• Topic changes: <span className="font-semibold">Must be requested before March 31, 2025</span></li>
            <li>• Group composition changes: <span className="font-semibold">Must be requested before April 15, 2025</span></li>
            <li>• All requests require approval from thesis advisor and committee</li>
            <li>• Processing time: <span className="font-semibold">7-10 business days</span></li>
            <li>• Maximum <span className="font-semibold">2 change requests</span> per academic term</li>
          </ul>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6 mb-6">
          {/* Left Panel - Request Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
              <Input type="text" placeholder="Brief Description of the Change" inputSize="full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Justification</label>
              <textarea
                rows={6}
                className="w-full rounded-lg border border-gray-300 bg-[#F3EFD0] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#730000] focus:border-transparent"
                placeholder="Provide detailed justification for this change request"
              />
            </div>
          </div>

          {/* Right Panel - Request Type & Submit */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Specify Request Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topic">Topic Change</SelectItem>
                  <SelectItem value="group">Group Composition Change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" className="px-8" onClick={() => setIsSubmitChangeOpen(true)}>
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Request History & Status */}
        <div className="grid grid-cols-[1fr_280px] gap-6">
          {/* Left Panel - Request History */}
          <div>
            <h3 className="text-2xl font-medium text-[#730000] mb-4">Request History</h3>
            <div className="space-y-4">
              {REQUEST_HISTORY.map(request => (
                <div key={request.id} className="bg-white rounded-lg p-4 border border-[#E5E5E5]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-gray-900 mb-1">{request.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="bg-[#F3EFD0] px-2 py-1 rounded">{request.type}</span>
                        <span>{request.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-4">
                      {request.status === 'Approved' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Approved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded">Pending Review</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Justification</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{request.justification}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Request Status */}
          <div>
            <h3 className="text-2xl font-medium text-[#730000] mb-4">Request Status</h3>
            <div className="bg-white rounded-lg p-4 border border-[#E5E5E5] shadow-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#730000] mb-1">3/4</div>
                  <div className="text-xs text-gray-600">Total Requests</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#730000] mb-1">3/4</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#730000] mb-1">8/8</div>
                  <div className="text-xs text-gray-600">Approved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={isSubmitChangeOpen}
        onOpenChange={setIsSubmitChangeOpen}
        title="Are you sure you want to submit?"
        description="This action cannot be undone."
        confirmLabel="Submit"
        cancelLabel="Cancel"
        onConfirm={handleSubmitChange}
      />

      <SuccessDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        message={successMessage}
      />
    </ThesisManagementLayout>
  )
}
