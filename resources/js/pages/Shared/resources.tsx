import { HeaderCard } from '@/components/ui/card';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { NavFooter } from '@/components/nav-footer';
import AppLayout from '@/layouts/app-layout';
import { resources } from '@/routes/admin/index';
import { toggle, remove, store } from '@/routes/admin/resources/index';
import { download } from '@/routes/resources/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { BookMarked, Upload, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resources',
        href: resources().url,
    },
];

interface Resource {
    id: number;
    file_name: string;
    file_type: string;
    file_path: string;
    file_size: string;
    uploaded_by: string;
    uploaded_at: string;
    is_active: boolean;
}

interface Props {
    resources: Resource[];
}


export default function Resources({ resources }: Props) {
    const totalCount = resources?.length ?? 0;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const uploadForm = useForm<{ file: File | null }>({
        file: null,
    });

    const { patch, delete: destroy, processing, reset, setData, post } = uploadForm;

    // Toggle the view mode status
    const toggleStatus = (resource: Resource) => {
        patch(toggle(resource.id).url, {
            preserveScroll: true,
        });
    };

    // Remove the resorce in the record
    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        destroy(remove(id).url, {
            preserveScroll: true,
        });
    };

    // download the recorded resource
    const handleDownload = (filePath: string) => {
        // window.open(download(filePath).url, '_blank');
        window.location.href = download(filePath).url
    };

    // Upload the file in the resources
    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.data.file) return;

        post(store().url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsUploadModalOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8">
                
                {/* 1. Header */}
                <HeaderCard 
                    title="Resources" 
                    description="Access official department templates and resources with full administrative controls"
                    icon={<BookMarked className="w-8 h-8 text-primary" />}
                    className="w-full lg:w-full rounded-none border-t-0 border-x-0" 
                />

                {/* 2. Main Content */}
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    <div className="w-full [&>*]:max-w-full">
                        <FilterSearchSection variant="DefenseManagement" />
                    </div>

                    {/* Action Row */}
                    <div className="flex justify-end w-full">
                        <Button 
                            onClick={() => setIsUploadModalOpen(true)}
                            disabled={processing}
                            variant="primary" 
                            className="flex items-center gap-2 px-4 py-2 font-dm tracking-wider"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Document
                        </Button>
                    </div>

                    {/* Table Section */}
                    <div className="rounded-lg border border-sidebar-border/70 overflow-hidden bg-card shadow-sm w-full">
                        <Table>
                            <TableHeader className="bg-primary">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">File Name</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">File Type</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Uploaded By</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Date Uploaded</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Status</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.length > 0 ? (
                                    resources.map((file) => (
                                        <TableRow key={file.id} className="text-center">
                                            <TableCell className="text-left py-4">
                                                <div className="flex items-center gap-2 justify-start px-2">
                                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{file.type}</TableCell>
                                            <TableCell>{file.uploadedBy}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="font-medium text-foreground">{file.date}</span>
                                                    <span className="font-medium text-foreground">{file.time}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span 
                                                    className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold border"
                                                    style={file.status === 'Active' ? {
                                                        backgroundColor: 'var(--completed-bg)', 
                                                        borderColor: 'var(--completed-border)', 
                                                        color: 'var(--completed-font-color)' 
                                                    } : {
                                                        backgroundColor: 'var(--pending-bg)', 
                                                        borderColor: 'var(--pending-border)', 
                                                        color: 'var(--pending-font-color)' 
                                                    }}
                                                >
                                                    {file.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="tertiary" size="sm" className="h-8 px-4 font-bold">
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No Resources have been uploaded yet!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableCaption className="border-t py-4">
                                {totalCount} of {totalCount} Templates and Resources
                            </TableCaption>
                        </Table>
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>

            {/* Upload Testing Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Upload Resource</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={submitUpload}>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={(e) =>
                                        uploadForm.setData('file', e.target.files ? e.target.files[0] : null)
                                    }
                                    className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-violet-50 file:text-violet-700
                                        hover:file:bg-violet-100
                                    "
                                />
                                {uploadForm.errors.file && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        {uploadForm.errors.file}
                                    </p>
                                )}
                                {uploadForm.progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                        <div
                                            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadForm.progress.percentage}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadForm.processing}
                                    className="rounded-lg px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {uploadForm.processing ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}