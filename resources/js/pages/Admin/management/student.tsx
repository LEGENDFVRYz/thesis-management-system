import { useState, useMemo } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';
import { student } from '@/routes/admin/management/index';
import { store } from '@/routes/admin/management/student/index';


const FIELDS = [
    { key: 'student_id',     label: 'Student ID',   required: true },
    { key: 'name',           label: 'Student Name', required: true },
    { key: 'email',          label: 'PUP Webmail',  required: true },
    { key: 'block',          label: 'Block',        required: true },
    // { key: 'group_code',     label: 'Group Code', required: true },
    // { key: 'specialization', label: 'Specialization', required: true },
    // { key: 'thesis_adviser', label: 'Thesis Adviser', required: true },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student',
        href: student().url,
    },
];


export default function DeadlinePage() {
    const [file, setFile] = useState<File | null>(null);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [sampleData, setSampleData] = useState<any[]>([]);
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
    const [action, setAction] = useState<'update' | 'skip'>('skip');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            
            // Parse CSV client-side to get headers and sample data
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                preview: 1, // Only read top 3 rows for sample data
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    setCsvHeaders(headers);
                    setSampleData(results.data);
                    
                    // Auto-map logic: Try to find matches (case-insensitive)
                    const initialMapping: Record<string, string> = {};
                    FIELDS.forEach(field => {
                        const match = headers.find(h => 
                            h.toLowerCase().replace(/_/g, '').trim() === field.label.toLowerCase().replace(/ /g, '').trim() ||
                            h.toLowerCase() === field.key.toLowerCase()
                        );
                        if (match) {
                            initialMapping[field.key] = match;
                        }
                    });
                    setColumnMapping(initialMapping);
                },
                error: (error) => {
                    setMessage(`Error parsing CSV: ${error.message}`);
                }
            });
        }
    };

    const handleMappingChange = (systemKey: string, csvHeader: string) => {
        setColumnMapping(prev => ({
            ...prev,
            [systemKey]: csvHeader
        }));
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        // Validate that all required fields are mapped
        const missingFields = FIELDS.filter(f => f.required && !columnMapping[f.key]);
        if (missingFields.length > 0) {
            setMessage(`Please map the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }

        console.log(action)

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(columnMapping)); // Send the mapping to backend
        formData.append('action', action); // Send the selected action


        try {
            const response = await axios.post(store().url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message || 'Import successful!');
            // Reset form optionally
        } catch (error: any) {
            console.log(error)
            setMessage(error.response?.data?.message || 'Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Student Management" 
            description="View and Manage Student Accounts and Thesis Group Assignments"
        >
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-sidebar-border shadow-sm">
                
                {/* File Upload Section */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Upload CSV File</label>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="file" 
                            accept=".csv"
                            onChange={handleFileChange} 
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                            file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground
                            hover:file:text-primary-foreground-2"
                        />
                    </div>
                </div>

                {/* 2. Mapping Interface */}
                {file && csvHeaders.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 text-sm" role="alert">
                            <p className="font-bold">Map Columns</p>
                            <p>Columns are automatically mapped if there are matching header names. Otherwise, select manually.</p>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#800000] text-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/4">System Field</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/4">Source Header</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-2/4">Sample Data (Row 1)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-zinc-800 dark:divide-zinc-700">
                                    {FIELDS.map((field) => {
                                        const isMapped = !!columnMapping[field.key];
                                        return (
                                            <tr key={field.key}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <select 
                                                        className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 
                                                            ${isMapped ? 'bg-amber-50 text-gray-900 ring-amber-300' : 'bg-gray-50 text-gray-400 ring-gray-300'}`}
                                                        value={columnMapping[field.key] || ''}
                                                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                                    >
                                                        <option value="">Select...</option>
                                                        {csvHeaders.map(header => (
                                                            <option key={header} value={header}>{header}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                    {isMapped && (
                                                        <span className="mr-3 text-green-600 inline-block">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    {/* Sample Data Field*/}
                                                    {columnMapping[field.key] 
                                                        ? <span className="text-gray-700 dark:text-gray-300">{sampleData[0]?.[columnMapping[field.key]]}</span>
                                                        : <span className="italic text-gray-400">-- --</span>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* 3. Actions Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-2">Actions</h3>
                            <p className="text-sm text-gray-500 mb-4">Please specify the desired action for existing student accounts.</p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="update"
                                        name="import-action"
                                        type="radio"
                                        value="update"
                                        checked={action === 'update'}
                                        onChange={() => setAction('update')}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="update" className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Update Existing Records
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="skip"
                                        name="import-action"
                                        type="radio"
                                        value="skip"
                                        checked={action === 'skip'}
                                        onChange={() => setAction('skip')}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="skip" className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Skip (Do not overwrite)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleUpload} 
                                disabled={loading}
                                className={`text-white w-40 p-2 rounded-lg transition-colors
                                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#800000] hover:bg-red-800'}`}
                            >
                                {loading ? 'Importing...' : 'Start Import'}
                            </button>
                            {message && <p className={`text-sm ${message.includes('failed') || message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                        </div>
                    </div>
                )}
            </div>
        </ManagementLayout>
    );
}