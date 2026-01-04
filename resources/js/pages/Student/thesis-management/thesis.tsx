import { useState } from 'react'
import type { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import ThesisManagementLayout from '@/pages/Student/thesis-management/index'
import { TabButton } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { thesisManagement } from '@/routes/student'
import { ThesisDocumentsHeader, ThesisDocumentRow } from '@/pages/Student/thesis-management/thesis-table'
import { FileUpload } from '@/components/file-upload'
import ThesisIcon from '@/components/Icons/thesis_icon.svg'
import DocumentPreview from '@/pages/Student/thesis-management/thesis-preview'
import { Download, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

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
    id: 2,
    title: 'Machine Learning Applications',
    description: 'Initial thesis proposal document',
    type: 'Thesis Proposal',
    version: 'v1',
    date: 'December 19, 2025',
    status: 'Rejected',
  },
  {
    id: 3,
    title: 'Machine Learning Applications',
    description: 'Initial thesis proposal document',
    type: 'Thesis Proposal',
    version: 'v1',
    date: 'December 19, 2025',
    status: 'Approved',
  },
]

const HISTORY_DOCUMENTS = [
  {
    id: 1,
    title: 'Machine Learning Applications',
    type: 'Thesis Proposal',
    version: 'v3',
    date: 'December 19, 2025',
  },
  {
    id: 2,
    title: 'Machine Learning Applications',
    type: 'Thesis Proposal',
    version: 'v3',
    date: 'December 19, 2025',
  },
  {
    id: 3,
    title: 'Machine Learning Applications',
    type: 'Thesis Proposal',
    version: 'v3',
    date: 'December 19, 2025',
  },
  {
    id: 4,
    title: 'Machine Learning Applications',
    type: 'Thesis Proposal',
    version: 'v2',
    date: 'December 18, 2025',
  },
  {
    id: 5,
    title: 'Machine Learning Applications',
    type: 'Thesis Proposal',
    version: 'v2',
    date: 'December 18, 2025',
  },
  {
    id: 6,
    title: 'Machine Learning Applications',
    type: 'Thesis Proposal',
    version: 'v2',
    date: 'December 18, 2025',
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
    <ThesisManagementLayout 
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

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="flex gap-6">
            {/* Left Panel - Latest Documents */}
            <div className="w-96 bg-[#F3EFD0] rounded-lg p-4">
              <h3 className="text-lg font-medium text-[#730000] mb-4">Latest Documents</h3>
              <div className="space-y-3">
                {HISTORY_DOCUMENTS.slice(0, 3).map(doc => (
                  <Dialog key={doc.id}>
                    <div className="bg-white rounded-lg p-4 border border-[#73000042]">
                      <div className="flex flex-col gap-2">
                        <h4 className="font-medium text-sm text-gray-900">{doc.title}</h4>
                        <p className="text-xs text-gray-600">{doc.type}</p>
                        <p className="text-xs text-gray-600">{doc.version}</p>
                        <p className="text-xs text-gray-500">{doc.date}</p>
                        <div className="flex gap-2 mt-2">
                          <DialogTrigger asChild>
                            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-[#730000] bg-white border border-[#730000] rounded hover:bg-gray-50">
                              <FileText className="w-3 h-3" />
                              Preview
                            </button>
                          </DialogTrigger>
                          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#730000] rounded hover:bg-[#5a0000]">
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DocumentPreview
                        documentTitle={doc.title}
                        onClose={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>

            {/* Right Panel - History Table */}
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-medium text-[#730000]">History</h2>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-[#730000] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Document</th>
                      <th className="px-6 py-3 text-left font-medium">Type</th>
                      <th className="px-6 py-3 text-left font-medium">Version</th>
                      <th className="px-6 py-3 text-left font-medium">Date</th>
                      <th className="px-6 py-3 text-left font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {HISTORY_DOCUMENTS.map(doc => (
                      <Dialog key={doc.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900">{doc.title}</td>
                          <td className="px-6 py-4 text-gray-700">{doc.type}</td>
                          <td className="px-6 py-4 text-gray-700">{doc.version}</td>
                          <td className="px-6 py-4 text-gray-700">{doc.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <DialogTrigger asChild>
                                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#730000] bg-white border border-[#730000] rounded hover:bg-gray-50">
                                  <FileText className="w-3 h-3" />
                                  Preview
                                </button>
                              </DialogTrigger>
                              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#730000] rounded hover:bg-[#5a0000]">
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                        <DialogContent className="max-w-4xl max-h-[90vh]">
                          <DocumentPreview
                            documentTitle={doc.title}
                            onClose={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PLACEHOLDER TABS */}
        {activeTab !== 'documents' && activeTab !== 'upload' && activeTab !== 'history' && (
          <div className="py-20 text-center text-gray-500">
            <p className="text-sm">
              This section is under development.
            </p>
          </div>
        )}
      </div>
    </ThesisManagementLayout>
  )
}
