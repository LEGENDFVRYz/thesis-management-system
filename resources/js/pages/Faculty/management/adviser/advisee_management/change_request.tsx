import { useState } from 'react'
import { Icon } from '@/components/icon-index';
import type { BreadcrumbItem, PageHeaderProps } from '@/types'
import { Head } from '@inertiajs/react'
import AdviseeManagementLayout from '@/pages/Faculty/management/adviser/advisee_management/index'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

// Setup
const pageHeader: PageHeaderProps = {
    title: "Advisee Management",
    subtitle: "Manage your advisees and their requests",
    icon: (
            <Icon
                name="calendarDefault"
                className="w-8 h-8 text-primary"
            />
        ),
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Change Request',
        href: '#',
    },
]

/* SAMPLE DATA */
const CHANGE_REQUESTS = [
  {
    id: 1,
    studentName: 'John Doe',
    groupName: '3301',
    title: 'Change Research Focus from ML to Deep Learning',
    type: 'Topic Change',
    date: 'December 19, 2025',
    status: 'Pending Review',
    justification: 'After initial research, found that deep learning approaches are more suitable for the dataset and research objectives. Recent literature also shows better results with DL methods.',
    originalTopic: 'Machine Learning Applications',
    proposedTopic: 'Deep Learning Applications in Healthcare',
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    groupName: '3302',
    title: 'Add New Member to Research Group',
    type: 'Group Composition',
    date: 'December 18, 2025',
    status: 'Pending Review',
    justification: 'Project scope has expanded. Need additional expertise in data visualization and UI/UX design. Candidate has relevant skills and is available.',
    currentMembers: ['Jane Smith', 'Mike Johnson'],
    proposedMember: 'Alice Brown',
  },
  {
    id: 3,
    studentName: 'Mike Johnson',
    groupName: '3303',
    title: 'Change Dataset Source',
    type: 'Topic Change',
    date: 'December 17, 2025',
    status: 'Approved',
    justification: 'Original dataset is no longer accessible. Found a more comprehensive alternative dataset with better documentation.',
    originalTopic: 'COVID-19 Dataset Analysis',
    proposedTopic: 'Healthcare Dataset Analysis using Public Health Records',
  },
]

export default function ChangeRequest() {
  const [selectedRequest, setSelectedRequest] = useState<typeof CHANGE_REQUESTS[0] | null>(null)
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleAccept = () => {
    console.log('Request accepted:', selectedRequest?.id)
    setShowAcceptConfirm(false)
    setSuccessMessage('Request accepted successfully.')
    setShowSuccessModal(true)
  }

  const handleReject = () => {
    console.log('Request rejected:', selectedRequest?.id)
    setShowRejectConfirm(false)
    setSuccessMessage('Request rejected successfully.')
    setShowSuccessModal(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-[var(--alert-success)]" />
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-[var(--alert-warning)]" />
      default:
        return <Clock className="w-4 h-4 text-[var(--alert-yellow-warning)]" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded"
    switch (status) {
      case 'Approved':
        return `${baseClasses} bg-[var(--alert-success)] text-[var(--primary-foreground)]`
      case 'Rejected':
        return `${baseClasses} bg-[var(--sidebar-gradient-mid)] text-[var(--primary-foreground)]`
      default:
        return `${baseClasses} bg-[var(--alert-yellow-warning)] text-[var(--primary-foreground)]`
    }
  }

  return (
    <AdviseeManagementLayout
      breadcrumbs={breadcrumbs}
      pageHeader={pageHeader}
    >
      <Head title="Change Request - Advisee Management" />

      {/* CONTENT CONTAINER */}
      <div
        className="rounded-b-xl rounded-tr-xl bg-[var(--card)] p-6 -mt-[16px]"
        style={{
          border: '1px solid var(--border-primary-muted)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h2 className="mb-4 text-3xl font-medium text-[var(--primary)]">
          Change Requests
        </h2>

        {/* Deadlines & Restrictions Notice */}
        <div className="mb-6 bg-[#FFF9E6] rounded-lg p-4 border border-[#F0E5C8]">
          <h3 className="font-semibold text-sm text-[var(--primary)] mb-3">
            Request Guidelines & Restrictions
          </h3>
          <ul className="space-y-1 text-xs text-[var(--foreground)]">
            <li>• Topic changes: <span className="font-semibold">Must be requested before March 31, 2025</span></li>
            <li>• Group composition changes: <span className="font-semibold">Must be requested before April 15, 2025</span></li>
            <li>• All requests require approval from thesis advisor</li>
            <li>• Processing time: <span className="font-semibold">7-10 business days</span></li>
            <li>• Maximum <span className="font-semibold">2 change requests</span> per group per academic term</li>
          </ul>
        </div>

        <div className="grid grid-cols-[1fr_400px] gap-6">
          {/* Left Panel - Request List */}
          <div>
            <h3 className="text-xl font-medium text-[var(--primary)] mb-4">All Requests</h3>
            <div className="space-y-4">
              {CHANGE_REQUESTS.map(request => (
                <div
                  key={request.id}
                  className={`bg-[var(--card)] rounded-lg p-4 border cursor-pointer transition-all ${
                    selectedRequest?.id === request.id
                      ? 'border-[var(--primary)] shadow-md'
                      : 'border-[var(--border)] hover:border-[var(--border-primary-muted)]'
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-[var(--foreground)] mb-1">
                        {request.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span className="bg-[var(--breadcrumb)] px-2 py-1 rounded">
                          {request.type}
                        </span>
                        <span>{request.date}</span>
                      </div>
                      <div className="mt-2 text-sm text-[var(--foreground)]">
                        <p><span className="font-medium">Student:</span> {request.studentName}</p>
                        <p><span className="font-medium">Group:</span> {request.groupName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-4">
                      {getStatusIcon(request.status)}
                      <span className={getStatusBadge(request.status)}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Request Details */}
          <div>
            <h3 className="text-xl font-medium text-[var(--primary)] mb-4">Request Details</h3>
            {selectedRequest ? (
              <div className="bg-[var(--accent)] rounded-lg p-6 border border-[var(--border)] shadow-sm">
                {/* Request Header */}
                <div className="mb-4">
                  <h4 className="font-semibold text-lg text-[var(--primary)] mb-2">
                    {selectedRequest.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="bg-[var(--breadcrumb)] px-2 py-1 rounded text-xs">
                      {selectedRequest.type}
                    </span>
                    <span>•</span>
                    <span>{selectedRequest.date}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Student & Group Info */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--primary)]">Student Name</p>
                    <p className="text-sm text-[var(--foreground)]">{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--primary)]">Group</p>
                    <p className="text-sm text-[var(--foreground)]">{selectedRequest.groupName}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Request Details */}
                <div className="space-y-3 mb-4">
                  {selectedRequest.type === 'Topic Change' ? (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-[var(--primary)]">Original Topic</p>
                        <p className="text-sm text-[var(--foreground)]">{selectedRequest.originalTopic}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--primary)]">Proposed Topic</p>
                        <p className="text-sm text-[var(--foreground)]">{selectedRequest.proposedTopic}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-[var(--primary)]">Current Members</p>
                        <p className="text-sm text-[var(--foreground)]">
                          {selectedRequest.currentMembers?.join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--primary)]">Proposed New Member</p>
                        <p className="text-sm text-[var(--foreground)]">{selectedRequest.proposedMember}</p>
                      </div>
                    </>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Justification */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-[var(--primary)] mb-2">Justification</p>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">
                    {selectedRequest.justification}
                  </p>
                </div>

                {/* Action Buttons - Only show if pending */}
                {selectedRequest.status === 'Pending Review' && (
                <div className="flex gap-3">
                    <Button
                        variant="negative"
                        className="flex-1 cursor-pointer"
                        onClick={() => setShowRejectConfirm(true)}
                    >
                        Reject Request
                    </Button>

                    <Button
                        variant="primary"
                        className="flex-1 cursor-pointer bg-[var(--alert-success)] hover:bg-[var(--alert-selected)] active:bg-[var(--alert-success)] border-[var(--alert-success)]"
                        onClick={() => setShowAcceptConfirm(true)}
                    >
                        Accept Request
                    </Button>
                </div>
                )}

                {/* Status Display - Show if not pending */}
                {selectedRequest.status !== 'Pending Review' && (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--background)]">
                    {getStatusIcon(selectedRequest.status)}
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      This request has been {selectedRequest.status.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[var(--accent)] rounded-lg p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-[var(--muted-foreground)] mb-4" />
                <p className="text-sm text-[var(--muted-foreground)]">
                  Select a request to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Accept Confirmation Modal */}
        {showAcceptConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className="w-[400px] rounded-lg bg-background p-6"
              style={{
                border: "1px solid var(--alert-success)",
                boxShadow: "0 10px 20px rgb(0 128 0 / 0.25)",
              }}
            >
              <CheckCircle
                size={48}
                className="mx-auto mb-5"
                style={{ color: "var(--alert-success)" }}
              />

              <p
                className="mb-2 text-center font-dm font-medium text-body-2"
                style={{ color: "var(--alert-success)" }}
              >
                Are you sure you want to accept this change request?
              </p>

              <p
                className="mb-6 text-center font-dm text-body-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <Button
                    variant="secondary"
                    className="rounded-full px-8 cursor-pointer"
                    onClick={() => setShowAcceptConfirm(false)}
                    size="default"
                >
                    Cancel
                </Button>

                <Button
                    variant="secondary"
                    className="rounded-full px-10 bg-alert-success text-primary-foreground hover:bg-alert-success cursor-pointer"
                    onClick={handleAccept}
                    size="default"
                >
                    Accept
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Confirmation Modal */}
        {showRejectConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className="w-[400px] rounded-lg bg-background p-6"
              style={{
                border: "1px solid var(--primary)",
                boxShadow: "0 10px 20px rgb(115 0 0 / 0.25)",
              }}
            >
              <AlertCircle
                size={48}
                className="mx-auto mb-5"
                style={{ color: "var(--primary)" }}
              />

              <p
                className="mb-2 text-center font-dm font-medium text-body-2"
                style={{ color: "var(--primary)" }}
              >
                Are you sure you want to reject this change request?
              </p>

              <p
                className="mb-6 text-center font-dm text-body-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  className="rounded-full px-8 cursor-pointer"
                  onClick={() => setShowRejectConfirm(false)}
                  size="default"
                >
                  Cancel
                </Button>

                <Button
                  variant="negative"
                  className="rounded-full px-8 cursor-pointer"
                  onClick={handleReject}
                  size="default"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className="w-[400px] rounded-lg bg-background p-6"
              style={{
                border: "1px solid var(--alert-success)",
                boxShadow: "0 10px 20px rgb(0 128 0 / 0.25)",
              }}
            >
              <CheckCircle
                size={48}
                className="mx-auto mb-5"
                style={{ color: "var(--alert-success)" }}
              />

              <p
                className="mb-6 text-center font-dm font-medium text-body-2"
                style={{ color: "var(--alert-success)" }}
              >
                {successMessage}
              </p>

              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  className="rounded-full px-10 bg-alert-success text-primary-foreground hover:bg-alert-success cursor-pointer"
                  onClick={() => setShowSuccessModal(false)}
                  size="default"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdviseeManagementLayout>
  )
}