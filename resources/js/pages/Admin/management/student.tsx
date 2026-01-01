import { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Head } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { store } from '@/routes/admin/management/student/index';
import ImportReviewModal from '@/components/modal/ImportReviewModal'; 

//SHARED COMPONENTS

//ICONS

// --- Types ---
interface ImportStats {
    to_create: number;
    to_update: number;
    to_skip: number;
    errors: number;
}

const FIELDS = [
    { key: 'student_id',     label: 'Student ID',   required: true },
    { key: 'name',           label: 'Student Name', required: true },
    { key: 'email',          label: 'PUP Webmail',  required: true },
    { key: 'block',          label: 'Block',        required: true },
];

export default function StudentManagement({ students }: { students: any[] }) {
    const [file, setFile] = useState<File | null>(null);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [sampleData, setSampleData] = useState<any[]>([]);
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
    const [action, setAction] = useState<'update' | 'skip'>('skip');
    
    // Status States
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Modal & Data States
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState<ImportStats | null>(null);
    const [errorData, setErrorData] = useState<any[]>([]); // To store error rows

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setMessage(''); 
            
            // Preview: 0 (reads whole file) or set a number for performance
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                preview: 50, 
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    setCsvHeaders(headers);
                    setSampleData(results.data);
                    
                    // Auto-map logic
                    const initialMapping: Record<string, string> = {};
                    FIELDS.forEach(field => {
                        const match = headers.find(h => 
                            h.toLowerCase().replace(/_/g, '').trim() === field.label.toLowerCase().replace(/ /g, '').trim() ||
                            h.toLowerCase() === field.key.toLowerCase()
                        );
                        if (match) initialMapping[field.key] = match;
                    });
                    setColumnMapping(initialMapping);
                },
                error: (error) => setMessage(`Error parsing CSV: ${error.message}`)
            });
        }
    };

    const handleMappingChange = (systemKey: string, csvHeader: string) => {
        setColumnMapping(prev => ({ ...prev, [systemKey]: csvHeader }));
    };

    // --- Step 1: Validate & Dry Run ---
    const handleInitiateImport = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const missingFields = FIELDS.filter(f => f.required && !columnMapping[f.key]);
        if (missingFields.length > 0) {
            setMessage(`Please map: ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }

        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(columnMapping));
        formData.append('action', action);
        formData.append('dry_run', '1');

        try {
            const response = await axios.post(store().url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            // Backend return format: { dry_run: true, stats: {...}, error_rows: [...] }
            setStats(response.data.stats);
            
            // If backend sends specific rows that failed, set them here. 
            // Otherwise, default to empty array (modal will still show error count from stats)
            setErrorData(response.data.error_rows || []); 
            
            setShowModal(true); 
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Validation failed.');
        } finally {
            setLoading(false);
        }
    };

    // --- Step 2: Actual Import ---
    const handleConfirmImport = async () => {
        if (!file) return;

        setShowModal(false); 
        setLoading(true);    

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(columnMapping));
        formData.append('action', action);
        formData.append('dry_run', '0'); 

        try {
            const response = await axios.post(store().url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message || 'Import successful!');
            
            // Optional cleanup
            // setFile(null);
            // setCsvHeaders([]);
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Import failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Student Management" />
            <AppHeader variant="admin" />

            <AppContent
                title="Student Management"
                subtitle="View and Manage Student Accounts and Thesis Group Assignments"
            >
                {/* TEMPORARY SLOT FOR IMPORT  --- rushed ehh */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-sidebar-border shadow-sm relative mb-6">
                    
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

                    {/* Mapping Interface */}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase w-1/4">System Field</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase w-1/4">Source Header</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase w-2/4">Sample Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-zinc-800 dark:divide-zinc-700">
                                        {FIELDS.map((field) => (
                                            <tr key={field.key}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{field.label} {field.required && <span className="text-red-500">*</span>}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <select 
                                                        className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 
                                                            ${columnMapping[field.key] ? 'bg-amber-50 text-gray-900 ring-amber-300' : 'bg-gray-50 text-gray-400 ring-gray-300'}`}
                                                        value={columnMapping[field.key] || ''}
                                                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                                    >
                                                        <option value="">Select...</option>
                                                        {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {columnMapping[field.key] 
                                                        ? <span className="text-gray-700 dark:text-gray-300">{sampleData[0]?.[columnMapping[field.key]]}</span>
                                                        : <span className="italic text-gray-400">-- --</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Actions Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-2">Actions</h3>
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

                            {/* Initiate Button */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleInitiateImport} 
                                    disabled={loading}
                                    className={`text-white w-40 p-2 rounded-lg transition-colors
                                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#800000] hover:bg-red-800'}`}
                                >
                                    {loading ? 'Processing...' : 'Review Import'}
                                </button>
                                {message && <p className={`text-sm ${message.includes('failed') || message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                            </div>
                        </div>
                    )}
                </div>


                {/* TABLE */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Student No.</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Email</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Group Code</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Block</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Specialization</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Adviser</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {students && students.length > 0 ? (
                                    students.map((stud, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                {stud.student_number}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {stud.student_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {stud.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {stud.group_code ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {stud.group_code}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">No Group</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                BSCPE {stud.year_level} - {stud.block}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {stud.specialization || <span className="text-gray-400 italic">N/A</span>}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {stud.thesis_adviser || <span className="text-gray-400 italic">Unassigned</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                
                {/* --- Import Review Modal (Replaces old simple modal) --- */}
                <ImportReviewModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmImport}
                    onBack={() => setShowModal(false)}
                    stats={stats || { to_create: 0, to_update: 0, to_skip: 0, errors: 0 }}
                    previewData={sampleData} 
                    errorData={errorData} 
                />
            </AppContent>

            <NavFooter />
        </>
    );
}