import { useState } from 'react'
import type { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import RepositoryLayout from '@/pages/Student/thesis-management/index'
import { TabButton } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { thesisManagement } from '@/routes/student'
import { ThesisDocumentsHeader, ThesisDocumentRow } from '@/pages/Student/thesis-management/thesis-table'
import { FileUpload } from '@/components/file-upload'
import ThesisIcon from '@/components/Icons/thesis_icon.svg'

/* TABS */
const LEADER_TABS = [
  { key: 'documents', label: 'Documents' },
  { key: 'upload', label: 'Upload' },
  { key: 'history', label: 'History' },
  { key: 'compare', label: 'Compare' },
  { key: 'workflow', label: 'Workflow' },
  { key: 'final_submission', label: 'Final Submission' },
  { key: 'change_request', label: 'Change Request' },
]

const MEMBER_TABS = [
  { key: 'documents', label: 'Documents' },
  { key: 'history', label: 'History' },
  { key: 'compare', label: 'Compare' },
  { key: 'workflow', label: 'Workflow' },
  { key: 'transfer_request', label: 'Transfer Request' },
]

/* SAMPLE DATA  */
const DOCUMENTS = [
  {
    id: 1,
    title: 'Machine Learning Applications',
    description: 'Initial thesis proposal document',
    type: 'Thesis Proposal',
    version: 'v1',
    date: 'December 19, 2025',
    status: 'For Revision',
  },
  {
    id: 1,
    title: 'Machine Learning Applications',
    description: 'Initial thesis proposal document',
    type: 'Thesis Proposal',
    version: 'v1',
    date: 'December 19, 2025',
    status: 'Rejected',
  },
  {
    id: 1,
    title: 'Machine Learning Applications',
    description: 'Initial thesis proposal document',
    type: 'Thesis Proposal',
    version: 'v1',
    date: 'December 19, 2025',
    status: 'Approved',
  },

]

export default function ThesisManagement() {
  const [activeTab, setActiveTab] = useState('documents')
  const [userRole, setUserRole] = useState<'leader' | 'member'>('leader') // Change default role as needed
  // User role 
  const TABS = userRole === 'leader' ? LEADER_TABS : MEMBER_TABS

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Thesis Management', href: thesisManagement().url },
    {
      title: TABS.find(t => t.key === activeTab)?.label ?? '',
      href: thesisManagement().url,
    },
  ]

  return (
    <RepositoryLayout 
      breadcrumbs={breadcrumbs}
      title={
        <div className="flex items-center gap-2">
          <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />
          <span className="font-medium">Thesis Management</span>
        </div>
      }
      description="Access and manage your thesis documents"
    >
      <Head title="Thesis Management" />

      {/* TABS */}
      <div className="flex mt-6">
        {TABS.map(tab => (
          <TabButton
            key={tab.key}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* CONTENT CONTAINER */}
      <div
        className="rounded-b-xl rounded-tr-xl bg-white p-6 -mt-[16px]"
        style={{
          border: '1px solid #73000042',
          boxShadow: '0 8px 24px #00000040',
        }}
      >
        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <>
            <h2 className="mb-4 text-3xl font-medium text-[#730000]">
              Documents
            </h2>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm align-middle">
                <ThesisDocumentsHeader />
                <tbody>
                  {DOCUMENTS.map(doc => (
                    <ThesisDocumentRow
                      key={doc.id}
                      document={doc.title}
                      description={doc.description}
                      type={doc.type}
                      version={doc.version}
                      date={doc.date}
                      status={doc.status}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* UPLOAD TAB - PLACEHOLDER */}
        {activeTab === 'upload' && (
          <>
            <h2 className="mb-4 text-xl font-medium text-[#730000]">
              Upload Document
            </h2>

            <div className="space-y-6">
              <input
                className="w-full rounded-md border bg-[#F3EFD0] px-4 py-2"
                placeholder="Document Title"
              />

              <textarea
                rows={3}
                className="w-full rounded-md border bg-[#F3EFD0] px-4 py-2"
                placeholder="Description"
              />

              <FileUpload />

              <div className="flex justify-center">
                <Button variant="primary">
                  Submit
                </Button>
              </div>
            </div>
          </>
        )}

        {/* PLACEHOLDER TABS */}
        {activeTab !== 'documents' && activeTab !== 'upload' && (
          <div className="py-20 text-center text-gray-500">
            <p className="text-sm">
              This section is under development.
            </p>
          </div>
        )}
      </div>
    </RepositoryLayout>
  )
}
