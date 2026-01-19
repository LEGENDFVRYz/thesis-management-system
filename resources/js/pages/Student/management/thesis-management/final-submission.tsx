import { useState } from 'react'
import type { BreadcrumbItem, PageHeaderProps } from '@/types'
import { Head } from '@inertiajs/react'
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index'
import { TabButton } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import StageSwitchToggle from '@/components/stage-toggle'
import ThesisIcon from '@/components/Icons/thesis_icon.svg'
import { Trash2, FileText } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { FileUpload } from '@/components/file-upload'
import { router } from '@inertiajs/react'
import { ConfirmDialog } from './components/confirm-dialog'
import { SuccessDialog } from './components/success-dialog'
import { DeleteDialog } from './components/delete-dialog'
import { DeleteSuccessDialog } from './components/delete-success-dialog'

// Setup
const pageHeader: PageHeaderProps = {
  title: "Thesis Management",
  subtitle: "Access and manage your thesis documents",
  icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Final Submission', href: '' },
]

const MILESTONES = [
  { key: 'mor', label: 'MOR' },
  { key: 'dp1', label: 'DP1' },
  { key: 'dp2', label: 'DP2' },
]

const REQUIRED_DOCUMENTS = [
  {
    id: 1,
    title: 'Final Research Journal Format',
    description: 'Complete research paper in journal format (IEEE/ACM)',
    uploadedFile: { name: 'Final_Research_Journal.pdf', date: 'December 19, 2025' },
  },
  {
    id: 2,
    title: 'Project Source Code',
    description: 'Complete source code with documentation',
    uploadedFile: { name: 'project_source_code.zip', date: 'December 19, 2025' },
  },
  {
    id: 3,
    title: 'Installable Copy',
    description: 'Deployable/installable version of the project',
    uploadedFile: { name: 'application_installer.exe', date: 'December 19, 2025' },
  },
  {
    id: 4,
    title: 'Final Presentation Slides',
    description: 'PowerPoint/PDF presentation for defense',
    uploadedFile: null,
  },
]

const COMPLETION_CHECKLIST = [
  { id: 1, label: 'All chapters reviewed and approved', checked: true },
  { id: 2, label: 'Abstract and keywords finalized', checked: true },
  { id: 3, label: 'References formatted correctly', checked: true },
  { id: 4, label: 'Plagiarism check completed (<15%)', checked: true },
  { id: 5, label: 'Source code documented and commented', checked: true },
  { id: 6, label: 'User manual/documentation included', checked: true },
  { id: 7, label: 'Test cases and results documented', checked: true },
  { id: 8, label: 'Ethics approval obtained (if applicable)', checked: true },
]

/* TABS */
const LEADER_TABS = [
  { key: 'documents', label: 'Documents', href: '/management/thesis/documents' },
  { key: 'compare', label: 'Compare', href: '/management/thesis/compare' },
  { key: 'comments', label: 'Comments', href: '/management/thesis/comments' },
  { key: 'final_submission', label: 'Final Submission', href: '/management/thesis/final-submission' },
  { key: 'change_request', label: 'Change Request', href: '/management/thesis/change-request' },
]

export default function FinalSubmissionPage({ currentMilestone }: { currentMilestone?: string }) {
  const studentCurrentMilestone = currentMilestone ?? 'dp2'
  const currentMilestoneIndex = Math.max(
    MILESTONES.findIndex(milestone => milestone.key === studentCurrentMilestone),
    0
  )
  const availableMilestones = MILESTONES.slice(0, currentMilestoneIndex + 1)
  const defaultMilestoneKey = availableMilestones.find(m => m.key === studentCurrentMilestone)?.key ?? MILESTONES[0].key

  const [selectedMilestone, setSelectedMilestone] = useState(defaultMilestoneKey)
  const [isSubmitFinalOpen, setIsSubmitFinalOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState<number | null>(null)

  // Only show this page if DP2
  const hasPassedDP2 = studentCurrentMilestone === 'dp2'
  const TABS = hasPassedDP2 ? LEADER_TABS : LEADER_TABS.filter(tab => tab.key !== 'final_submission')

  const handleSubmitFinal = () => {
    setIsSubmitFinalOpen(false)
    setSuccessMessage('Final submission completed successfully!')
    setIsSuccessOpen(true)
  }

  const handleDeleteDoc = () => {
    setIsDeleteDocOpen(false)
    setIsDeleteSuccessOpen(true)
    setTimeout(() => setIsDeleteSuccessOpen(false), 2000)
  }

  return (
    <ThesisManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
      <Head title="Thesis Management - Final Submission" />

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
            isActive={tab.key === 'final_submission'}
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
        <h2 className="mb-4 text-3xl font-medium text-[#730000]">Final Submission</h2>

        {/* Submission Deadline Notice */}
        <div className="mb-6 bg-[#FFF9E6] border-l-4 border-[#FFD700] p-4">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">Submission Deadline:</span> May 15, 2025 11:59 PM
          </p>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* Left Panel - Required Documents */}
          <div>
            <h3 className="text-lg font-semibold text-[#730000] mb-4">Required Documents</h3>
            <div className="space-y-3">
              {REQUIRED_DOCUMENTS.map(doc => (
                <div key={doc.id} className="bg-[#FDFCF6] rounded-lg p-4 border border-[#E5E5E5]">
                  <div className="mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{doc.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{doc.description}</p>
                  </div>

                  {doc.uploadedFile ? (
                    <div className="flex items-center justify-between bg-white rounded-md px-3 py-2.5 border border-gray-300">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-900">{doc.uploadedFile.name}</span>
                          <span className="text-[11px] text-gray-500">Uploaded: {doc.uploadedFile.date}</span>
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium"
                        onClick={() => { setDocToDelete(doc.id); setIsDeleteDocOpen(true); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-md px-3 py-2.5 border border-dashed border-gray-300">
                      <p className="text-xs text-gray-500 italic">Not yet uploaded</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* File Upload Area */}
            <div className="mt-6">
              <FileUpload />
            </div>
          </div>

          {/* Right Panel - Checklist and Status */}
          <div className="space-y-4">
            {/* Completion Checklist */}
            <div>
              <h3 className="text-lg font-semibold text-[#730000] mb-4">Completion Checklist</h3>
              <div className="bg-[#FDFCF6] rounded-lg p-4 border border-[#E5E5E5]">
                <div className="space-y-3">
                  {COMPLETION_CHECKLIST.map(item => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <Checkbox checked={item.checked} disabled className="mt-0.5" />
                      <span className="text-[13px] text-gray-800 leading-relaxed">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-white rounded-lg p-4 border border-[#E5E5E5] shadow-sm">
              <h3 className="text-base font-semibold text-[#730000] mb-3">Submission Status</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Documents Uploaded:</span>
                  <span className="text-sm font-bold text-[#730000]">
                    {REQUIRED_DOCUMENTS.filter(doc => doc.uploadedFile).length}/{REQUIRED_DOCUMENTS.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Checklist Items:</span>
                  <span className="text-sm font-bold text-[#730000]">
                    {COMPLETION_CHECKLIST.filter(item => item.checked).length}/{COMPLETION_CHECKLIST.length}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="primary" className="w-full" onClick={() => setIsSubmitFinalOpen(true)}>
                  Submit for Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={isSubmitFinalOpen}
        onOpenChange={setIsSubmitFinalOpen}
        title="Are you sure you want to submit?"
        description="This action cannot be undone."
        confirmLabel="Submit"
        cancelLabel="Cancel"
        onConfirm={handleSubmitFinal}
      />

      <DeleteDialog
        open={isDeleteDocOpen}
        onOpenChange={setIsDeleteDocOpen}
        title="Delete Document?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteDoc}
      />

      <DeleteSuccessDialog
        open={isDeleteSuccessOpen}
        onOpenChange={setIsDeleteSuccessOpen}
        message="Document deleted successfully!"
      />

      <SuccessDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        message={successMessage}
      />
    </ThesisManagementLayout>
  )
}
