import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { resources } from '@/routes/admin/index';
import { toggle, remove, store } from '@/routes/admin/resources/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

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

    const handleDownload = (filePath: string) => {
        window.open(`/storage/${filePath}`, '_blank');
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
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] p-8 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-between pb-4">
                        <h1 className='font-bold pb-5'>RESOURCES</h1>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            disabled={processing}
                            className="py-2 px-4 bg-primary text-sm text-primary-foreground rounded-sm disabled:opacity-50"
                        >
                            Upload
                        </button>
                    </div>

                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">File Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">File Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Uploaded By</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Date Uploaded</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {resources.length > 0 ? (
                                resources.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">{res.file_name}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">{res.file_type}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">{res.uploaded_by}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">{new Date(res.uploaded_at).toLocaleDateString()}</td>
                                        
                                        {/* STATUS TOGGLE */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleStatus(res)}
                                                disabled={processing}
                                                className={`py-1 px-4 text-primary-foreground rounded-full cursor-pointer w-25
                                                    ${res.is_active
                                                        ? 'bg-green-700'
                                                        : 'bg-gray-400'}
                                                `}
                                            >
                                                {res.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>

                                        {/* ACTION BUTTONS */}
                                        <td className="px-6 py-4 flex gap-2 font-medium text-gray-900 dark:text-gray-100 justify-center">
                                            <button
                                                className="py-1 px-4 bg-primary text-primary-foreground hover:text-primary-foreground-2 cursor-pointer rounded-sm"
                                                onClick={() => handleDownload(res.file_path)}
                                            >
                                                Download
                                            </button>
                                            <button
                                                className="py-1 px-4 bg-primary text-primary-foreground hover:text-primary-foreground-2 cursor-pointer rounded-sm"
                                                onClick={() => handleDelete(res.id)}
                                                disabled={processing}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No Resources have been uploaded yet!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
