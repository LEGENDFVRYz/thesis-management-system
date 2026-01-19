// pages/final-submission.tsx
import { FileUpload } from '@/components/file-upload';
import ThesisIcon from '@/components/Icons/thesis_icon.svg';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index';
import type { BreadcrumbItem, PageHeaderProps } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from './components/confirm-dialog';
import { DeleteDialog } from './components/delete-dialog';
import { DeleteSuccessDialog } from './components/delete-success-dialog';
import { SuccessDialog } from './components/success-dialog';
import { ThesisTabs } from './components/thesis-tabs';

// --- MOCK DATA ---
const REQUIRED_DOCUMENTS = [
    {
        id: 1,
        title: 'Final Research Journal Format',
        description: 'Complete research paper',
        uploadedFile: {
            name: 'Final_Research_Journal.pdf',
            date: 'December 19, 2025',
        },
    },
    {
        id: 2,
        title: 'Project Source Code',
        description: 'Source code zip',
        uploadedFile: {
            name: 'project_source_code.zip',
            date: 'December 19, 2025',
        },
    },
    {
        id: 4,
        title: 'Final Presentation Slides',
        description: 'PPT/PDF',
        uploadedFile: null,
    },
];

const COMPLETION_CHECKLIST = [
    { id: 1, label: 'All chapters reviewed and approved', checked: true },
    { id: 4, label: 'Plagiarism check completed (<15%)', checked: true },
    { id: 5, label: 'Source code documented', checked: true },
];

const pageHeader: PageHeaderProps = {
    title: 'Thesis Management',
    subtitle: 'Access and manage your thesis documents',
    icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
};

export default function ThesisFinalSubmission() {
    const [isSubmitFinalOpen, setIsSubmitFinalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
    const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Final Submission', href: '#' },
    ];

    const handleSubmitFinal = () => {
        setIsSubmitFinalOpen(false);
        setIsSuccessOpen(true);
    };

    const handleDeleteDoc = () => {
        setIsDeleteDocOpen(false);
        setIsDeleteSuccessOpen(true);
        setTimeout(() => setIsDeleteSuccessOpen(false), 2000);
    };

    return (
        <ThesisManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Final Submission" />
            <ThesisTabs activeTab="final_submission" />

            <div
                className="-mt-[16px] rounded-tr-xl rounded-b-xl bg-white p-6"
                style={{
                    border: '1px solid #73000042',
                    boxShadow: '0 8px 24px #00000040',
                }}
            >
                <h2 className="mb-4 text-3xl font-medium text-[#730000]">
                    Final Submission
                </h2>

                {/* Submission Deadline Notice */}
                <div className="mb-6 border-l-4 border-[#FFD700] bg-[#FFF9E6] p-4">
                    <p className="text-sm text-gray-800">
                        <span className="font-semibold">
                            Submission Deadline:
                        </span>{' '}
                        May 15, 2025 11:59 PM
                    </p>
                </div>

                <div className="grid grid-cols-[1fr_320px] gap-6">
                    {/* Left Panel - Required Documents */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-[#730000]">
                            Required Documents
                        </h3>
                        <div className="space-y-3">
                            {REQUIRED_DOCUMENTS.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="rounded-lg border border-[#E5E5E5] bg-[#FDFCF6] p-4"
                                >
                                    <div className="mb-2">
                                        <h4 className="text-sm font-semibold text-gray-900">
                                            {doc.title}
                                        </h4>
                                        <p className="mt-0.5 text-xs text-gray-600">
                                            {doc.description}
                                        </p>
                                    </div>

                                    {doc.uploadedFile ? (
                                        <div className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <FileText className="h-4 w-4 text-gray-600" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-900">
                                                        {doc.uploadedFile.name}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500">
                                                        Uploaded:{' '}
                                                        {doc.uploadedFile.date}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                                                onClick={() => {
                                                    setDocToDelete(doc.id);
                                                    setIsDeleteDocOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5">
                                            <p className="text-xs text-gray-500 italic">
                                                Not yet uploaded
                                            </p>
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
                            <h3 className="mb-4 text-lg font-semibold text-[#730000]">
                                Completion Checklist
                            </h3>
                            <div className="rounded-lg border border-[#E5E5E5] bg-[#FDFCF6] p-4">
                                <div className="space-y-3">
                                    {COMPLETION_CHECKLIST.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-2.5"
                                        >
                                            <Checkbox
                                                checked={item.checked}
                                                disabled
                                                className="mt-0.5"
                                            />
                                            <span className="text-[13px] leading-relaxed text-gray-800">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submission Status */}
                        <div className="rounded-lg border border-[#E5E5E5] bg-white p-4 shadow-sm">
                            <h3 className="mb-3 text-base font-semibold text-[#730000]">
                                Submission Status
                            </h3>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">
                                        Documents Uploaded:
                                    </span>
                                    <span className="text-sm font-bold text-[#730000]">
                                        {
                                            REQUIRED_DOCUMENTS.filter(
                                                (doc) => doc.uploadedFile,
                                            ).length
                                        }
                                        /{REQUIRED_DOCUMENTS.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">
                                        Checklist Items:
                                    </span>
                                    <span className="text-sm font-bold text-[#730000]">
                                        {
                                            COMPLETION_CHECKLIST.filter(
                                                (item) => item.checked,
                                            ).length
                                        }
                                        /{COMPLETION_CHECKLIST.length}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => setIsSubmitFinalOpen(true)}
                                >
                                    Submit for Review
                                </Button>
                            </div>

                            {/* Confirmation Dialog */}
                            <ConfirmDialog
                                open={isSubmitFinalOpen}
                                onOpenChange={setIsSubmitFinalOpen}
                                title="Are you sure you want to submit?"
                                description="This action cannot be undone."
                                confirmLabel="Submit"
                                cancelLabel="Cancel"
                                onConfirm={handleSubmitFinal}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <SuccessDialog
                open={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
                message="Final submission completed!"
            />
            <DeleteDialog
                open={isDeleteDocOpen}
                onOpenChange={setIsDeleteDocOpen}
                title="Delete Document?"
                description="Undone action."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteDoc}
            />
            <DeleteSuccessDialog
                open={isDeleteSuccessOpen}
                onOpenChange={setIsDeleteSuccessOpen}
                message="Deleted successfully!"
            />
        </ThesisManagementLayout>
    );
}
