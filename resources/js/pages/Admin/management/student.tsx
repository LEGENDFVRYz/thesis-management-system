import { useState } from 'react';
import axios from 'axios';
import ManagementLayout from '@/pages/Admin/management/index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { student } from '@/routes/admin/management/index';

// NOTE: The route is defined in web.php as:
// Route::post('/file-import', [FileImportController::class, 'store'])->name('file.import');

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student',
        href: student().url,
    },
];

export default function DeadlinePage() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/file-import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Upload failed.');
        }
    };
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Student Management" 
            description="View and Manage Student Accounts and Thesis Group Assignments"
        >
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button 
                onClick={handleUpload} 
                className='text-amber-50 bg-primary w-40 p-2 rounded-lg cursor-pointer hover:bg-red-700'
            >
                Import
            </button>

            {message && <p className="mt-2">{message}</p>}

            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </ManagementLayout>
    );
}