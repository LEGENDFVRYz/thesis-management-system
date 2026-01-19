// pages/workflow.tsx
import ThesisIcon from '@/components/Icons/thesis_icon.svg';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index';
import type { BreadcrumbItem, PageHeaderProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ConfirmDialog } from './components/confirm-dialog';
import { SuccessDialog } from './components/success-dialog';
import { ThesisTabs } from './components/thesis-tabs';

// --- MOCK DATA ---
const WORKFLOW_STAGES = [
    { key: 'submitted', label: 'Submitted', completed: true },
    { key: 'under_review', label: 'Under Review', completed: false },
    { key: 'for_revision', label: 'For Revision', completed: false },
    { key: 'approved', label: 'Approved', completed: false },
];

const WORKFLOW_COMMENTS = [
    {
        id: 1,
        member: 'Member 1',
        date: '2025-12-05',
        comment:
            'Literature review is comprehensive. However, consider adding more recent studies from 2024-2025 on AI in education.',
    },
];

const pageHeader: PageHeaderProps = {
    title: 'Thesis Management',
    subtitle: 'Access and manage your thesis documents',
    icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
};

export default function ThesisWorkflow() {
    const [isSubmitFeedbackOpen, setIsSubmitFeedbackOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Workflow', href: '#' }];

    const handleSubmitFeedback = () => {
        setIsSubmitFeedbackOpen(false);
        setIsSuccessOpen(true);
    };

    return (
        <ThesisManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Thesis Workflow" />
            <ThesisTabs activeTab="workflow" />

            <div
                className="-mt-[16px] rounded-tr-xl rounded-b-xl bg-white p-6"
                style={{
                    border: '1px solid #73000042',
                    boxShadow: '0 8px 24px #00000040',
                }}
            >
                <h2 className="mb-4 text-3xl font-medium text-[#730000]">
                    Workflow
                </h2>

                {/* Document Dropdown */}
                <div className="mb-6">
                    <Select>
                        <SelectTrigger className="w-full border border-[#E5E5E5] bg-[#FFF9E6]">
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
                    <h3 className="mb-6 text-xl font-semibold text-[#730000]">
                        Progress
                    </h3>

                    {/* Progress Stepper */}
                    <div className="relative py-4">
                        <div className="flex items-start justify-between">
                            {WORKFLOW_STAGES.map((stage, index) => (
                                <div
                                    key={stage.key}
                                    className="relative flex flex-1 flex-col items-center"
                                >
                                    {/* Stage Circle - Using timeline component pattern */}
                                    <div className="relative z-10 mb-4 flex items-center justify-center">
                                        {stage.completed ? (
                                            <div
                                                className="relative"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                }}
                                            >
                                                {/* Outer layer */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            '#9B000A63',
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
                                                        transform:
                                                            'translate(-50%, -50%)',
                                                        backgroundColor:
                                                            '#9B000A',
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
                                                        transform:
                                                            'translate(-50%, -50%)',
                                                        backgroundColor:
                                                            '#730000',
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
                                                    backgroundColor: 'white',
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
                                    <span className="text-center text-sm font-medium text-gray-900">
                                        {stage.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comments and Feedbacks Section */}
                <div className="mb-6">
                    <h3 className="mb-4 text-xl font-semibold text-[#730000]">
                        Comments and Feedbacks
                    </h3>

                    <div className="space-y-3">
                        {WORKFLOW_COMMENTS.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-lg border border-[#E5E5E5] bg-[#FFF9E6] p-4"
                            >
                                <div className="mb-2">
                                    <h4 className="text-sm font-semibold text-[#730000]">
                                        {comment.member}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        {comment.date}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-800">
                                    {comment.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Provide Feedback Section */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Provide your feedback
                    </label>
                    <textarea
                        rows={8}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#730000] focus:outline-none"
                        placeholder="Text field input..."
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="primary"
                            className="px-8"
                            onClick={() => setIsSubmitFeedbackOpen(true)}
                        >
                            Submit
                        </Button>
                    </div>

                    {/* Confirmation Dialog */}
                    <ConfirmDialog
                        open={isSubmitFeedbackOpen}
                        onOpenChange={setIsSubmitFeedbackOpen}
                        title="Are you sure you want to submit?"
                        description="This action cannot be undone."
                        confirmLabel="Submit"
                        cancelLabel="Cancel"
                        onConfirm={handleSubmitFeedback}
                    />
                </div>
            </div>

            <SuccessDialog
                open={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
                message="Feedback submitted!"
            />
        </ThesisManagementLayout>
    );
}
