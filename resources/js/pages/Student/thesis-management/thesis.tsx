import { useState } from 'react'
import type { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import ThesisManagementLayout from '@/pages/Student/thesis-management/index'
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
import { thesisManagement } from '@/routes/student'
import { ThesisDocumentsHeader, ThesisDocumentRow } from '@/pages/Student/thesis-management/thesis-table'
import { FileUpload } from '@/components/file-upload'
import ThesisIcon from '@/components/Icons/thesis_icon.svg'
import DocumentPreview from '@/pages/Student/thesis-management/thesis-preview'
import { Download, FileText, Trash2, CheckCircle, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

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

const COMPARE_VERSIONS = [
  { value: 'v1', label: 'v1 - December 19, 2025' },
  { value: 'v2', label: 'v2 - December 20, 2025' },
  { value: 'v3', label: 'v3 - December 30, 2025' },
]

const REQUIRED_DOCUMENTS = [
  {
    id: 1,
    title: 'Final Research Journal Format',
    description: 'Complete research paper in journal format (IEEE/ACM)',
    uploadedFile: {
      name: 'Final_Research_Journal.pdf',
      date: 'December 19, 2025',
    },
  },
  {
    id: 2,
    title: 'Project Source Code',
    description: 'Complete source code with documentation',
    uploadedFile: {
      name: 'project_source_code.zip',
      date: 'December 19, 2025',
    },
  },
  {
    id: 3,
    title: 'Installable Copy',
    description: 'Deployable/installable version of the project',
    uploadedFile: {
      name: 'application_installer.exe',
      date: 'December 19, 2025',
    },
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

const WORKFLOW_COMMENTS = [
  {
    id: 1,
    member: 'Member 1',
    date: '2025-12-05',
    comment: 'Literature review is comprehensive. However, consider adding more recent studies from 2024-2025 on AI in education.',
  },
  {
    id: 2,
    member: 'Member 1',
    date: '2025-12-05',
    comment: 'Literature review is comprehensive. However, consider adding more recent studies from 2024-2025 on AI in education.',
  },
  {
    id: 3,
    member: 'Member 1',
    date: '2025-12-05',
    comment: 'Literature review is comprehensive. However, consider adding more recent studies from 2024-2025 on AI in education.',
  },
]

const WORKFLOW_STAGES = [
  { key: 'submitted', label: 'Submitted', completed: true },
  { key: 'under_review', label: 'Under Review', completed: false },
  { key: 'for_revision', label: 'For Revision', completed: false },
  { key: 'approved', label: 'Approved', completed: false },
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

        {/* COMPARE TAB */}
        {activeTab === 'compare' && (
          <>
            <h2 className="mb-6 text-3xl font-medium text-[#730000]">
              Compare Documents
            </h2>

            <div className="space-y-6">
              {/* Document Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <Input
                  type="text"
                  placeholder="e.g., AI Applications"
                  inputSize="full"
                />
              </div>

              {/* Version Selects */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Version
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Version" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPARE_VERSIONS.map(version => (
                        <SelectItem key={version.value} value={version.value}>
                          {version.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Version
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Version" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPARE_VERSIONS.map(version => (
                        <SelectItem key={version.value} value={version.value}>
                          {version.label}
                        </SelectItem>
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
          </>
        )}

        {/* FINAL SUBMISSION TAB */}
        {activeTab === 'final_submission' && (
          <>
            <h2 className="mb-4 text-3xl font-medium text-[#730000]">
              Final Submission
            </h2>

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
                    <div
                      key={doc.id}
                      className="bg-[#FDFCF6] rounded-lg p-4 border border-[#E5E5E5]"
                    >
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
                          <button className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium">
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
                          <Checkbox
                            checked={item.checked}
                            disabled
                            className="mt-0.5"
                          />
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
                    <Button variant="primary" className="w-full">
                      Submit for Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CHANGE REQUEST TAB */}
        {activeTab === 'change_request' && (
          <>
            <h2 className="mb-4 text-3xl font-medium text-[#730000]">
              Change Request
            </h2>

            {/* Deadlines & Restrictions Notice */}
            <div className="mb-6 bg-[#FFF9E6] rounded-lg p-4 border border-[#F0E5C8]">
              <h3 className="font-semibold text-sm text-[#730000] mb-3">
                Request Deadlines & Restrictions
              </h3>
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
                {/* Request Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Title
                  </label>
                  <Input
                    type="text"
                    placeholder="Brief Description of the Change"
                    inputSize="full"
                  />
                </div>

                {/* Justification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justification
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type
                  </label>
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
                  <Button variant="primary" className="px-8">
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
                    <div
                      key={request.id}
                      className="bg-white rounded-lg p-4 border border-[#E5E5E5]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base text-gray-900 mb-1">
                            {request.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="bg-[#F3EFD0] px-2 py-1 rounded">
                              {request.type}
                            </span>
                            <span>{request.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 ml-4">
                          {request.status === 'Approved' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                Approved
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                                Pending Review
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Justification</p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {request.justification}
                        </p>
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
          </>
        )}

        {/* WORKFLOW TAB */}
        {activeTab === 'workflow' && (
          <>
            <h2 className="mb-4 text-3xl font-medium text-[#730000]">
              Workflow
            </h2>

            {/* Document Dropdown */}
            <div className="mb-6">
              <Select>
                <SelectTrigger className="w-full bg-[#FFF9E6] border border-[#E5E5E5]">
                  <SelectValue placeholder="Document" />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="doc1">Document 1</SelectItem>
                  <SelectItem value="doc2">Document 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#730000] mb-6">Progress</h3>

              {/* Progress Stepper */}
              <div className="relative py-4">
                <div className="flex items-start justify-between">
                  {WORKFLOW_STAGES.map((stage, index) => (
                    <div key={stage.key} className="flex flex-col items-center flex-1 relative">
                      {/* Stage Circle - Using timeline component pattern */}
                      <div className="relative z-10 flex items-center justify-center mb-4">
                        {stage.completed ? (
                          <div className="relative" style={{ width: '32px', height: '32px' }}>
                            {/* Outer layer */}
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#9B000A63',
                              }}
                            />
                            {/* Middle layer */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#9B000A',
                              }}
                            />
                            {/* Inner layer */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#730000',
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="rounded-full"
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '4px solid #9B000A',
                              backgroundColor: 'white'
                            }}
                          />
                        )}
                      </div>

                      {/* Connecting Line */}
                      {index < WORKFLOW_STAGES.length - 1 && (
                        <div
                          className="absolute top-4 left-1/2 h-1 bg-[#FFBD00]"
                          style={{
                            width: 'calc(100% - 32px)',
                            transform: 'translateX(16px)',
                            zIndex: 1,
                          }}
                        />
                      )}

                      {/* Stage Label */}
                      <span className="text-sm font-medium text-gray-900 text-center">
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments and Feedbacks Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#730000] mb-4">Comments and Feedbacks</h3>

              <div className="space-y-3">
                {WORKFLOW_COMMENTS.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-[#FFF9E6] rounded-lg p-4 border border-[#E5E5E5]"
                  >
                    <div className="mb-2">
                      <h4 className="font-semibold text-sm text-[#730000]">{comment.member}</h4>
                      <p className="text-xs text-gray-600">{comment.date}</p>
                    </div>
                    <p className="text-sm text-gray-800">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Provide Feedback Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provide your feedback
              </label>
              <textarea
                rows={8}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#730000] focus:border-transparent"
                placeholder="Text field input..."
              />
              <div className="flex justify-end mt-4">
                <Button variant="primary" className="px-8">
                  Submit
                </Button>
              </div>
            </div>
          </>
        )}

        {/* PLACEHOLDER TABS */}
        {activeTab !== 'documents' && activeTab !== 'upload' && activeTab !== 'history' && activeTab !== 'compare' && activeTab !== 'final_submission' && activeTab !== 'change_request' && activeTab !== 'workflow' && (
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
