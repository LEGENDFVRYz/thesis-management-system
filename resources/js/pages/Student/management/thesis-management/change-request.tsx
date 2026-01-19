// pages/change-request.tsx
import ThesisIcon from '@/components/Icons/thesis_icon.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from './components/confirm-dialog';
import { SuccessDialog } from './components/success-dialog';
import { ThesisTabs } from './components/thesis-tabs';

const REQUEST_HISTORY = [
    {
        id: 1,
        title: 'Change Research Focus',
        type: 'Topic Change',
        date: 'December 19, 2025',
        status: 'Approved',
        justification: 'DL methods are better.',
    },
    {
        id: 2,
        title: 'Add New Member',
        type: 'Group Composition',
        date: 'December 19, 2025',
        status: 'Pending Review',
        justification: 'Need UI/UX.',
    },
];

const pageHeader: PageHeaderProps = {
    title: 'Thesis Management',
    subtitle: 'Access and manage your thesis documents',
    icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
};

export default function ThesisChangeRequest() {
    const [isSubmitChangeOpen, setIsSubmitChangeOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Change Request', href: '#' },
    ];

    const handleSubmitChange = () => {
        setIsSubmitChangeOpen(false);
        setIsSuccessOpen(true);
    };

    return (
        <ThesisManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Change Request" />
            <ThesisTabs activeTab="change_request" />

            <div
                className="-mt-[16px] rounded-tr-xl rounded-b-xl bg-white p-6"
                style={{
                    border: '1px solid #73000042',
                    boxShadow: '0 8px 24px #00000040',
                }}
            >
                <h2 className="mb-4 text-3xl font-medium text-[#730000]">
                    Change Request
                </h2>

                <div className="mb-6 rounded-lg border border-[#F0E5C8] bg-[#FFF9E6] p-4">
                    <h3 className="mb-3 text-sm font-semibold text-[#730000]">
                        Request Deadlines
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-800">
                        <li>
                            • Topic changes:{' '}
                            <span className="font-semibold">
                                Before March 31
                            </span>
                        </li>
                        <li>
                            • Processing time:{' '}
                            <span className="font-semibold">
                                7-10 business days
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="mb-6 grid grid-cols-[1fr_280px] gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Request Title
                            </label>
                            <Input
                                type="text"
                                placeholder="Brief Description"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Justification
                            </label>
                            <textarea
                                rows={6}
                                className="w-full rounded-lg border bg-[#F3EFD0] px-4 py-3"
                                placeholder="Detailed justification..."
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Request Type
                            </label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="topic">
                                        Topic Change
                                    </SelectItem>
                                    <SelectItem value="group">
                                        Group Change
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="primary"
                                className="px-8"
                                onClick={() => setIsSubmitChangeOpen(true)}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="grid grid-cols-[1fr_280px] gap-6">
                    <div>
                        <h3 className="mb-4 text-2xl font-medium text-[#730000]">
                            Request History
                        </h3>
                        <div className="space-y-4">
                            {REQUEST_HISTORY.map((req) => (
                                <div
                                    key={req.id}
                                    className="rounded-lg border border-[#E5E5E5] bg-white p-4"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <h4 className="mb-1 text-base font-semibold text-gray-900">
                                                {req.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                                <span className="rounded bg-[#F3EFD0] px-2 py-1">
                                                    {req.type}
                                                </span>
                                                <span>{req.date}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center gap-1.5">
                                            {req.status === 'Approved' ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <span className="text-xs text-green-600">
                                                        Approved
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-4 w-4 text-yellow-600" />
                                                    <span className="text-xs text-yellow-700">
                                                        Pending
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-700">
                                        {req.justification}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 text-2xl font-medium text-[#730000]">
                            Request Status
                        </h3>
                        <div className="grid grid-cols-3 gap-4 rounded-lg border border-[#E5E5E5] bg-white p-4 text-center shadow-sm">
                            <div>
                                <div className="text-3xl font-bold text-[#730000]">
                                    3/4
                                </div>
                                <div className="text-xs text-gray-600">
                                    Total
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#730000]">
                                    3/4
                                </div>
                                <div className="text-xs text-gray-600">
                                    Pending
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#730000]">
                                    8/8
                                </div>
                                <div className="text-xs text-gray-600">
                                    Approved
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={isSubmitChangeOpen}
                onOpenChange={setIsSubmitChangeOpen}
                title="Submit Request?"
                description="Undone action."
                confirmLabel="Submit"
                cancelLabel="Cancel"
                onConfirm={handleSubmitChange}
            />
            <SuccessDialog
                open={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
                message="Request submitted!"
            />
        </ThesisManagementLayout>
    );
}
