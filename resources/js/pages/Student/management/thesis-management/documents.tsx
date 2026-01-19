// pages/documents.tsx
import { FileUpload } from '@/components/file-upload';
import ThesisIcon from '@/components/Icons/thesis_icon.svg';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index';
import {
    ThesisDocumentRow,
    ThesisDocumentsHeader,
} from './components/thesis-table';
import type { BreadcrumbItem, PageHeaderProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from './components/confirm-dialog';
import { SuccessDialog } from './components/success-dialog';
import { ThesisTabs } from './components/thesis-tabs'; // Import the shared tabs

// --- TYPES & MOCK DATA ---
type DocumentEntry = {
    id: number;
    title: string;
    type: string;
    description: string;
    date: string;
    status: string;
};

const MILESTONES = [
    { key: 'mor', label: 'MOR' },
    { key: 'dp1', label: 'DP1' },
    { key: 'dp2', label: 'DP2' },
];

const INITIAL_DOCUMENTS_BY_MILESTONE: Record<string, DocumentEntry[]> = {
    mor: [
        {
            id: 1,
            title: 'Machine Learning Applications',
            type: 'Thesis Proposal',
            description: 'Initial thesis proposal document',
            date: 'December 19, 2025',
            status: 'For Revision',
        },
        {
            id: 2,
            title: 'Research Methodology',
            type: 'Chapter',
            description: 'Chapter 1: Methodology and approach',
            date: 'December 18, 2025',
            status: 'Approved',
        },
        {
            id: 3,
            title: 'Literature Review',
            type: 'Chapter',
            description: 'Comprehensive literature review section',
            date: 'December 17, 2025',
            status: 'For Revision',
        },
        {
            id: 4,
            title: 'Initial Research Data',
            type: 'Supporting Document',
            description: 'Preliminary findings',
            date: 'December 16, 2025',
            status: 'Approved',
        },
    ],
    dp1: [
        {
            id: 5,
            title: 'Machine Learning Applications',
            type: 'Thesis Proposal',
            description: 'Revised proposal addressing feedback',
            date: 'December 20, 2025',
            status: 'Rejected',
        },
        {
            id: 6,
            title: 'Implementation Framework',
            type: 'Chapter',
            description: 'Framework and architecture design',
            date: 'December 21, 2025',
            status: 'For Revision',
        },
        {
            id: 7,
            title: 'Experimental Results',
            type: 'Chapter',
            description: 'Results from initial experiments',
            date: 'December 22, 2025',
            status: 'Approved',
        },
    ],
    dp2: [
        {
            id: 8,
            title: 'Machine Learning Applications',
            type: 'Thesis Proposal',
            description: 'Final refined proposal version',
            date: 'December 22, 2025',
            status: 'Approved',
        },
        {
            id: 9,
            title: 'Analysis and Discussion',
            type: 'Chapter',
            description: 'Detailed analysis of results',
            date: 'December 23, 2025',
            status: 'Approved',
        },
        {
            id: 10,
            title: 'Conclusion and Future Work',
            type: 'Chapter',
            description: 'Conclusions and recommendations',
            date: 'December 24, 2025',
            status: 'For Revision',
        },
        {
            id: 11,
            title: 'Source Code and Documentation',
            type: 'Supporting Document',
            description: 'Complete source code with comments',
            date: 'December 25, 2025',
            status: 'Approved',
        },
    ],
};

const pageHeader: PageHeaderProps = {
    title: 'Thesis Management',
    subtitle: 'Access and manage your thesis documents',
    icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
};

export default function ThesisDocuments({
    currentMilestone = 'dp2',
}: {
    currentMilestone?: string;
}) {
    // Milestone Logic
    const currentMilestoneIndex = Math.max(
        MILESTONES.findIndex((m) => m.key === currentMilestone),
        0,
    );
    const availableMilestones = MILESTONES.slice(0, currentMilestoneIndex + 1);
    const defaultMilestoneKey =
        availableMilestones.find((m) => m.key === currentMilestone)?.key ??
        MILESTONES[0].key;

    const [selectedMilestone, setSelectedMilestone] =
        useState(defaultMilestoneKey);
    const selectedMilestoneLabel =
        availableMilestones.find((m) => m.key === selectedMilestone)?.label ??
        '';
    const [documentsByMilestone, setDocumentsByMilestone] = useState(
        INITIAL_DOCUMENTS_BY_MILESTONE,
    );
    const documentsForMilestone = documentsByMilestone[selectedMilestone] ?? [];

    // UI States
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSubmitDocsOpen, setIsSubmitDocsOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form States
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadType, setUploadType] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Documents', href: '#' }];

    const handleSaveDocument = () => {
        const newDoc: DocumentEntry = {
            id: Date.now(),
            title: uploadTitle.trim() || 'Untitled Document',
            type: uploadType || 'Unspecified',
            description: uploadDescription.trim() || 'Uploaded document',
            date: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
            status: 'For Revision',
        };

        setDocumentsByMilestone((prev) => ({
            ...prev,
            [selectedMilestone]: [newDoc, ...(prev[selectedMilestone] ?? [])],
        }));

        setIsUploadModalOpen(false);
        setUploadTitle('');
        setUploadType('');
        setUploadDescription('');
        setSuccessMessage(`Document saved for ${selectedMilestoneLabel}`);
        setIsSuccessOpen(true);
    };

    const handleSubmitDocuments = () => {
        setIsSubmitDocsOpen(false);
        setSuccessMessage(`Documents submitted for ${selectedMilestoneLabel}`);
        setIsSuccessOpen(true);
    };

    return (
        <ThesisManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Thesis Documents" />
            <ThesisTabs activeTab="documents" />

            {/* Main Content */}
            <div
                className="-mt-[16px] rounded-tr-xl rounded-b-xl bg-white p-6"
                style={{
                    border: '1px solid #73000042',
                    boxShadow: '0 8px 24px #00000040',
                }}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex-1 text-3xl font-medium text-[#730000]">
                        Documents
                    </h2>

                    {/* Action Buttpons and filteser */}
                    <div className="flex flex-row items-center justify-center gap-3">
                        {/* Milestone Filter */}
                        <Select
                            value={selectedMilestone}
                            onValueChange={setSelectedMilestone}
                        >
                            <SelectTrigger className="flex h-10 w-40 items-center justify-center border-2 border-primary bg-[#FFF9E6] text-primary">
                                <SelectValue placeholder="Select milestone" />
                            </SelectTrigger>

                            <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                {availableMilestones.map((milestone) => (
                                    <SelectItem
                                        key={milestone.key}
                                        value={milestone.key}
                                    >
                                        {milestone.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Upload Button */}
                        <Button
                            variant="primary"
                            className="px-5"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full align-middle text-sm">
                        <ThesisDocumentsHeader />
                        <tbody>
                            {documentsForMilestone.map((doc) => (
                                <ThesisDocumentRow
                                    key={doc.id}
                                    document={doc.title}
                                    description={doc.description}
                                    type={doc.type}
                                    date={doc.date}
                                    status={doc.status}
                                />
                            ))}
                            {documentsForMilestone.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-sm text-gray-600"
                                    >
                                        No submissions yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <Button
                        variant="primary"
                        onClick={() => setIsSubmitDocsOpen(true)}
                        disabled={documentsForMilestone.length === 0}
                    >
                        Submit
                    </Button>
                </div>
            </div>

            {/* Upload Modal */}
            <Dialog
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
            >
                <DialogContent className="max-w-3xl">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold text-[#730000]">
                                Upload Document
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            <div className="space-y-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Document Title
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Document Title"
                                    className="h-10 max-w-xs bg-[#F3EFD0] px-3 py-2 font-[DM_Sans] placeholder:text-gray-600"
                                    value={uploadTitle}
                                    onChange={(e) =>
                                        setUploadTitle(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <Select
                                    value={uploadType}
                                    onValueChange={setUploadType}
                                >
                                    <SelectTrigger className="h-10 w-full bg-[#F3EFD0] px-3 py-2 placeholder:text-gray-500">
                                        <SelectValue placeholder="Specify Document Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="thesis-proposal">
                                            Thesis Proposal
                                        </SelectItem>
                                        <SelectItem value="chapter">
                                            Chapter
                                        </SelectItem>
                                        <SelectItem value="supporting-document">
                                            Supporting Document
                                        </SelectItem>
                                        <SelectItem value="final-thesis">
                                            Final Thesis
                                        </SelectItem>
                                        <SelectItem value="others">
                                            Others
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Document Description
                            </label>
                            <textarea
                                rows={3}
                                className="w-full rounded-md border bg-[#F3EFD0] px-4 py-2 placeholder:text-gray-500 focus:ring-2 focus:ring-[#730000] focus:outline-none"
                                placeholder="Description"
                                value={uploadDescription}
                                onChange={(e) =>
                                    setUploadDescription(e.target.value)
                                }
                            />
                        </div>

                        <FileUpload />

                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                className="px-8"
                                onClick={handleSaveDocument}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={isSubmitDocsOpen}
                onOpenChange={setIsSubmitDocsOpen}
                title="Submit documents?"
                description={`Submit all under ${selectedMilestoneLabel}.`}
                confirmLabel="Submit"
                cancelLabel="Cancel"
                onConfirm={handleSubmitDocuments}
            />
            <SuccessDialog
                open={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
                message={successMessage}
            />
        </ThesisManagementLayout>
    );
}
