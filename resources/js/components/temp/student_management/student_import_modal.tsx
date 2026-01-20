import { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { X, CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { WizardStepper, WizardSteps, WizardStep, WizardNavigation, WizardButton } from '@/components/ui/wizard-stepper';
import { FileUpload } from '@/components/file-upload';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { store } from '@/routes/admin/management/student/index'; // Ensure this path is correct based on your project

// --- Types ---
interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportComplete?: (data: any) => void;
}

interface ColumnMapping {
    systemKey: string; // The key sent to DB (e.g., 'student_id')
    label: string;     // The display label (e.g., 'Student ID')
    sourceHeader: string;
    required: boolean;
    mapped: boolean;
}

// Based on your OLD LOGIC
const SYSTEM_FIELDS = [
    { key: 'student_id', label: 'Student ID', required: true },
    { key: 'name',       label: 'Student Name', required: true },
    { key: 'email',      label: 'PUP Webmail',  required: true },
    { key: 'block',      label: 'Block',        required: true },
];

export function StudentImportModal({ isOpen, onClose, onImportComplete }: ImportModalProps) {
    // --- UI State ---
    const [currentStep, setCurrentStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState(''); // Global error/success message

    // --- Data State ---
    const [file, setFile] = useState<File | null>(null);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [sampleData, setSampleData] = useState<any[]>([]); // Array of rows for preview
    
    // Mappings
    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>(
        SYSTEM_FIELDS.map(f => ({
            systemKey: f.key,
            label: f.label,
            sourceHeader: '',
            required: f.required,
            mapped: false,
        }))
    );

    const [updateAction, setUpdateAction] = useState<'update' | 'skip'>('skip'); // Default to skip based on your old logic

    // --- Backend Results State ---
    const [importStats, setImportStats] = useState({ to_create: 0, to_update: 0 });
    const [importErrors, setImportErrors] = useState<any[]>([]);

    if (!isOpen) return null;

    const steps = [
        { number: 1, title: 'Import File', description: 'Upload CSV' },
        { number: 2, title: 'Map Columns', description: 'Match fields' },
        { number: 3, title: 'Review & Import', description: 'Verify data' },
    ];

    // --- Logic: Handle File Selection & Parsing ---
    const handleFileSelect = (files: File[]) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setFile(selectedFile);
            setIsUploading(true);
            setUploadProgress(10); // Start progress

            // PapaParse Logic from Old Implementation
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                preview: 50, // Get first 50 rows for preview
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    setCsvHeaders(headers);
                    setSampleData(results.data);

                    // Auto-map Logic
                    setColumnMappings(prev => prev.map(mapping => {
                        // Try to find a match in CSV headers
                        const match = headers.find(h => 
                            h.toLowerCase().replace(/_/g, '').trim() === mapping.label.toLowerCase().replace(/ /g, '').trim() ||
                            h.toLowerCase() === mapping.systemKey.toLowerCase()
                        );
                        
                        return {
                            ...mapping,
                            sourceHeader: match || '',
                            mapped: !!match
                        };
                    }));

                    setUploadProgress(100);
                    setIsUploading(false);
                },
                error: (error) => {
                    alert(`Error parsing CSV: ${error.message}`);
                    setIsUploading(false);
                }
            });
        }
    };

    // --- Logic: Handle Mapping Change ---
    const handleColumnMapping = (systemKey: string, value: string) => {
        setColumnMappings(prev =>
            prev.map(mapping =>
                mapping.systemKey === systemKey
                    ? { ...mapping, sourceHeader: value, mapped: value !== '' }
                    : mapping
            )
        );
    };

    // --- Logic: Validation / Dry Run (Moving from Step 2 to 3) ---
    const handleDryRun = async () => {
        if (!file) return;

        // 1. Prepare Simple Mapping Object for Backend { systemKey: csvHeader }
        const simpleMapping: Record<string, string> = {};
        columnMappings.forEach(m => {
            if (m.sourceHeader) simpleMapping[m.systemKey] = m.sourceHeader;
        });

        // 2. Validate Required Fields
        const missing = columnMappings.filter(m => m.required && !m.mapped);
        if (missing.length > 0) {
            alert(`Please map required fields: ${missing.map(m => m.label).join(', ')}`);
            return;
        }

        // 3. Send Request
        setIsUploading(true); // Reuse loading state
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(simpleMapping));
        formData.append('action', updateAction);
        formData.append('dry_run', '1');

        try {
            const response = await axios.post(store().url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Set Stats & Errors from Backend
            setImportStats({
                to_create: response.data.stats.to_create || 0,
                to_update: response.data.stats.to_update || 0
            });
            setImportErrors(response.data.error_rows || []);
            
            // Proceed to Step 3
            setCurrentStep(3);
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Validation failed.');
        } finally {
            setIsUploading(false);
        }
    };

    // --- Logic: Final Import ---
    const handleConfirmImport = async () => {
        if (!file) return;

        setIsUploading(true);
        const simpleMapping: Record<string, string> = {};
        columnMappings.forEach(m => {
            if (m.sourceHeader) simpleMapping[m.systemKey] = m.sourceHeader;
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(simpleMapping));
        formData.append('action', updateAction);
        formData.append('dry_run', '0');

        try {
            const response = await axios.post(store().url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            onImportComplete?.({ success: true, message: response.data.message });
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Import failed.');
        } finally {
            setIsUploading(false);
        }
    };

    // --- Navigation Handlers ---
    const handleNext = () => {
        if (currentStep === 2) {
            handleDryRun(); // Trigger Dry Run before moving to Step 3
        } else if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const getStepState = (stepNumber: number): 'before' | 'current' | 'after' => {
        if (stepNumber < currentStep) return 'after';
        if (stepNumber === currentStep) return 'current';
        return 'before';
    };

    const canGoNext = () => {
        if (currentStep === 1) return file !== null && uploadProgress === 100;
        // Logic for Step 2 validation is handled in handleDryRun
        return true; 
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-[#7D1F1F]"> IMPORT STUDENT ACCOUNT</h2>
                    <Button onClick={onClose} variant="link">
                        <X className="w-6 h-6 text-black" />
                    </Button>
                </div>

                {/* Content with Wizard */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Wizard Stepper */}
                        <WizardStepper>
                            <WizardSteps>
                                {steps.map((step, index) => (
                                    <WizardStep
                                        key={step.number}
                                        stepNumber={step.number}
                                        title={step.title}
                                        description={step.description}
                                        state={getStepState(step.number)}
                                        isLast={index === steps.length - 1}
                                    />
                                ))}
                            </WizardSteps>
                        </WizardStepper>

                        {/* Step Content */}
                        <div>
                            {/* Step 1: Import File */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    {!file && (
                                        <FileUpload
                                            onFileSelect={handleFileSelect}
                                            maxSizeMB={10}
                                            acceptedFileTypes={['.csv']}
                                            multiple={false}
                                            isUploading={isUploading}
                                            uploadProgress={uploadProgress}
                                            onError={(error) => alert(error)}
                                        />
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Button variant="link" className="text-sm hover:underline font-medium text-[#7D1F1F]">
                                            Download Sample Template
                                        </Button>
                                        <p className="text-xs text-gray-500">Supported formats: .csv</p>
                                    </div>

                                    {/* Successfully Uploaded File Display */}
                                    {file && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-700">Uploaded File</h3>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(file.size / (1024)).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="text-xs px-3 py-1 text-green-700 bg-green-50 rounded-full font-medium border border-green-200">
                                                        Ready to Map
                                                    </span>
                                                    <Button variant="link"
                                                        onClick={() => {
                                                            setFile(null);
                                                            setUploadProgress(0);
                                                            setCsvHeaders([]);
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors">
                                                        <X className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Map Columns */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="grid grid-cols-3 bg-[#7D1F1F] text-white font-medium">
                                            <div className="p-3 border-r border-white/20">System Field</div>
                                            <div className="p-3 border-r border-white/20">Source Header</div>
                                            <div className="p-3">Sample Data (Row 1)</div>
                                        </div>

                                        {columnMappings.map((mapping) => (
                                            <div key={mapping.systemKey} className="grid grid-cols-3 border-t">
                                                <div className="p-3 border-r bg-gray-50 flex items-center">
                                                    <span className="text-sm font-medium">
                                                        {mapping.label} {mapping.required && <span className="text-red-500">*</span>}
                                                    </span>
                                                </div>
                                                <div className="p-3 border-r flex items-center">
                                                    <Select 
                                                        value={mapping.sourceHeader} 
                                                        onValueChange={(value) => handleColumnMapping(mapping.systemKey, value)}
                                                    >
                                                        <SelectTrigger className="w-full bg-[#FFF9E6]">
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        
                                                        {/* ADD z-[99999] HERE to ensure it floats above the modal */}
                                                        <SelectContent className="z-[99999] max-h-[200px]"> 
                                                            {csvHeaders.map(h => (
                                                                <SelectItem key={h} value={h}>{h}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="p-3 flex items-center justify-between overflow-hidden">
                                                    <span className="text-sm text-gray-600 truncate block w-full">
                                                        {mapping.mapped && sampleData.length > 0
                                                            ? sampleData[0][mapping.sourceHeader]
                                                            : '—'}
                                                    </span>
                                                    <div className="ml-2 shrink-0">
                                                        {mapping.mapped ? 
                                                            <CheckCircle className="w-5 h-5 text-green-600" /> : 
                                                            (mapping.required && <XCircle className="w-5 h-5 text-gray-300" />)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-medium text-[#7D1F1F]">Actions</h3>
                                        <p className="text-sm text-gray-600">If a student record already exists (based on Student ID):</p>

                                        <RadioGroup value={updateAction} onValueChange={(value) => setUpdateAction(value as 'update' | 'skip')}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="skip" id="skip" />
                                                <Label htmlFor="skip" className="text-sm font-normal cursor-pointer">
                                                    Skip (Do not overwrite)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="update" id="update" />
                                                <Label htmlFor="update" className="text-sm font-normal cursor-pointer">
                                                    Update Existing Records
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Import */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#7D1F1F] mb-4">DATA PREVIEW</h3>
                                        <div className="flex gap-6 mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold">{importStats.to_create}</span>
                                                <span className="text-sm text-gray-600">New accounts will be added</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold">{importStats.to_update}</span>
                                                <span className="text-sm text-gray-600">Existing accounts will be updated</span>
                                            </div>
                                        </div>

                                        {/* Data Preview Container (First 5 valid rows) */}
                                        <div className="border rounded-lg overflow-hidden bg-gray-50 min-h-[150px]">
                                            <div className="overflow-x-auto max-h-64 overflow-y-auto">
                                                <table className="w-full text-sm bg-white">
                                                    <thead className="bg-gray-50 sticky top-0">
                                                        <tr>
                                                            {SYSTEM_FIELDS.map((field) => (
                                                                <th key={field.key} className="p-2 text-left font-medium border-r last:border-r-0">
                                                                    {field.label}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sampleData.slice(0, 5).map((row, i) => (
                                                            <tr key={i} className="border-t hover:bg-gray-50">
                                                                {columnMappings.map((map) => (
                                                                    <td key={map.systemKey} className="p-2 border-r last:border-r-0">
                                                                        {row[map.sourceHeader] || '—'}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Section Container */}
                                    {importErrors.length > 0 ? (
                                        <div className="border border-red-200 rounded-lg overflow-hidden bg-red-50">
                                            <div className="p-4">
                                                <div className="flex gap-3 mb-3">
                                                    <AlertCircle className="w-5 h-5 text-red-700 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-semibold text-red-800 mb-1">ERROR(S) FOUND</h4>
                                                        <p className="text-sm text-red-700">
                                                            Records with errors are shown below and will not be imported.
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-sm font-medium text-red-800 mb-3">({importErrors.length}) Errors found</p>
                                                
                                                {/* Error Table */}
                                                <div className="border border-red-200 rounded-lg overflow-x-auto mb-4 bg-white max-h-48">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-red-50 text-red-900">
                                                            <tr>
                                                                <th className="p-2 text-left font-medium border-r">Row</th>
                                                                {SYSTEM_FIELDS.map((field) => (
                                                                    <th key={field.key} className="p-2 text-left font-medium border-r">
                                                                        {field.label}
                                                                    </th>
                                                                ))}
                                                                <th className="p-2 text-left font-medium">Issue</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {importErrors.map((error, i) => (
                                                                <tr key={i} className="border-t hover:bg-red-50">
                                                                    <td className="p-2 border-r text-red-700 font-medium">{error.row || i + 1}</td>
                                                                    {/* Dynamically render columns based on mapping */}
                                                                    {columnMappings.map(map => (
                                                                        <td key={map.systemKey} className="p-2 border-r">
                                                                            {error.values ? error.values[map.sourceHeader] : 'N/A'}
                                                                        </td>
                                                                    ))}
                                                                    <td className="p-2 text-red-600 bg-red-50">
                                                                        {Array.isArray(error.errors) ? error.errors.join(', ') : error.errors}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded-lg bg-green-50 p-4 flex items-center justify-center border-green-200">
                                            <p className="text-sm text-green-700 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> No errors found. All data is valid.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <WizardNavigation>
                            {currentStep > 1 ? (
                                <WizardButton variant="secondary" onClick={handlePrevious} disabled={isUploading}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    <span>Previous</span>
                                </WizardButton>
                            ) : <div />}

                            {currentStep < steps.length ? (
                                <WizardButton
                                    variant="primary"
                                    onClick={handleNext}
                                    disabled={!canGoNext() || isUploading}
                                    className="bg-[#800000] hover:bg-[#600000]"
                                >
                                    {isUploading ? 'Validating...' : 'Continue'}
                                    {!isUploading && <ArrowRight className="w-4 h-4 ml-2" />}
                                </WizardButton>
                            ) : (
                                <WizardButton
                                    variant="primary"
                                    onClick={handleConfirmImport}
                                    disabled={isUploading}
                                    className="bg-[#FFC107] hover:bg-yellow-500 text-black"
                                >
                                    {isUploading ? 'Importing...' : 'Confirm Import'}
                                </WizardButton>
                            )}
                        </WizardNavigation>
                    </div>
                </div>
            </div>
        </div>
    );
}