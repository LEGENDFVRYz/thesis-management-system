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
import { Head, useForm } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { download, upload } from '@/routes/student/thesis/documents/index';
import { ConfirmDialog } from './components/confirm-dialog';
import { SuccessDialog } from './components/success-dialog';
import { ThesisTabs } from './components/thesis-tabs'; // Import the shared tabs

// --- TYPES & MOCK DATA ---
type DocumentEntry = {
    id: number | string;
    title: string;
    type: string;
    description: string;
    date: string;
    status: string;
    is_submitted?: boolean;
};

type Submission = {
    id: number;
    title: string;
    document_type: string;
    description: string;
    file_path: string;
    submitted_at: string;
    status: number; // 0=Pending, 1=Review, 2=Approved, etc.
};

type Milestone = {
    id: number;
    stage: number; // 1=MOR, 2=DP1, 3=DP2
    name: string;
    desc: string;
    submission?: Submission | null;
};

const MILESTONES = [
    { key: 'mor', label: 'MOR' },
    { key: 'dp1', label: 'DP1' },
    { key: 'dp2', label: 'DP2' },
];

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Documents', href: '#' }];

const pageHeader: PageHeaderProps = {
    title: 'Thesis Management',
    subtitle: 'Access and manage your thesis documents',
    icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
};

interface Props {
    documentsByMilestone: Record<string, DocumentEntry[]>;
    group_id: number;
    current_stage_key: string;
    active_event_id?: number | null;
}

export default function ThesisDocuments({ 
    documentsByMilestone,
    group_id,
    current_stage_key,
    active_event_id 
}: Props) {

    // --- FORM UPLOAD ---
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        title: '',
        document_type: '',
        description: '',
        file: null as File | null,
        event_id: null, // Backend handles this automatically if null
    });

    // --- UI STATES ---
    const [selectedMilestone, setSelectedMilestone] = useState(current_stage_key || 'mor');
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSubmitDocsOpen, setIsSubmitDocsOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // --- COMPUTED ---
    const documentsForMilestone = documentsByMilestone[selectedMilestone] || [];
    const selectedMilestoneLabel = MILESTONES.find((m) => m.key === selectedMilestone)?.label || '';

    // --- HANDLERS ---
    const handleSaveDocument = () => {
        post(upload().url, {
            onSuccess: () => {
                setIsUploadModalOpen(false);
                setSuccessMessage('Document uploaded successfully');
                setIsSuccessOpen(true);
                reset(); // Clear form
            },
            onError: (err) => {
                console.error("Upload failed", err);
            }
        });
    };

    const handleSubmitDocuments = () => {
        setIsSubmitDocsOpen(false);
        setSuccessMessage(`Documents submitted for ${selectedMilestoneLabel}`);
        setIsSuccessOpen(true);
    };

    const handleDownload = (doc: DocumentEntry) => {
        // Prevent downloading if it's just a placeholder requirement
        if (!doc.is_submitted) return;
        
        window.open(download(doc.id).url, '_self');
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
                                {MILESTONES.map((milestone) => (
                                    <SelectItem key={milestone.key} value={milestone.key}>
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
                                    id={doc.id}
                                    document={doc.title}
                                    description={doc.description}
                                    type={doc.type}
                                    date={doc.date}
                                    status={doc.status}
                                    onDownload={() => handleDownload(doc)}
                                    isSubmitted={doc.is_submitted}
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
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent className="max-w-3xl">
                    <div className="mb-4">
                        <h3 className="text-2xl font-semibold text-[#730000]">
                            Upload Document
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Document Title
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Document Title"
                                    className="h-10 max-w-xs bg-[#F3EFD0] px-3 py-2 font-[DM_Sans] placeholder:text-gray-600"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <Select
                                    value={data.document_type}
                                    onValueChange={(val) => setData('document_type', val)}
                                >
                                    <SelectTrigger className="h-10 w-full bg-[#F3EFD0] px-3 py-2 placeholder:text-gray-500">
                                        <SelectValue placeholder="Specify Document Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Thesis Proposal">Thesis Proposal</SelectItem>
                                        <SelectItem value="Chapter">Chapter</SelectItem>
                                        <SelectItem value="Supporting Document">Supporting Document</SelectItem>
                                        <SelectItem value="Final Thesis">Final Thesis</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.document_type && <span className="text-red-500 text-xs">{errors.document_type}</span>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Document Description
                            </label>
                            <textarea
                                rows={3}
                                className="w-full rounded-md border bg-[#F3EFD0] px-4 py-2 placeholder:text-gray-500 focus:ring-2 focus:ring-[#730000] focus:outline-none"
                                placeholder="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>

                        {/* UPDATED FILE UPLOAD COMPONENT */}
                        <div className="space-y-2">
                            <FileUpload
                                maxSizeMB={100}
                                multiple={false}
                                isUploading={processing}
                                uploadProgress={progress?.percentage ?? 0}
                                onFileSelect={(files: File[]) => {
                                    // We take the first file from the array
                                    setData('file', files[0] ?? null);
                                }}
                                onError={(err) => {
                                    // You can set a form error here manually if you wish
                                    console.error(err); 
                                }}
                            />
                            
                            {/* Show selected file name if not uploading yet */}
                            {data.file && !processing && (
                                <p className="text-sm text-green-600 mt-1">
                                    Ready to upload: <span className="font-medium">{data.file.name}</span>
                                </p>
                            )}
                            
                            {errors.file && <span className="text-red-500 text-xs">{errors.file}</span>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="secondary" 
                                onClick={() => setIsUploadModalOpen(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                className="px-8"
                                onClick={handleSaveDocument}
                                disabled={processing || !data.file}
                            >
                                {processing ? 'Uploading...' : 'Save'}
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
