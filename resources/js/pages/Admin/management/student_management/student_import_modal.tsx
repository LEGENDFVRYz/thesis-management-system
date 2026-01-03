import { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { WizardStepper, WizardSteps, WizardStep, WizardNavigation, WizardButton, InteractiveWizard } from '@/components/ui/wizard-stepper';
import { FileUpload } from '@/components/file-upload';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (data: any) => void;
}

interface ColumnMapping {
  systemField: string;
  sourceHeader: string;
  required: boolean;
  mapped: boolean;
}

interface ImportError {
  row: number;
  studentId: string;
  studentName: string;
  email: string;
  groupCode: string;
  block: string;
  specialization: string;
  thesisAdviser: string;
  errors: string[];
}

const SYSTEM_FIELDS = [
  { field: 'Student ID', required: true },
  { field: 'Student Name', required: true },
  { field: 'PUP Webmail', required: true },
  { field: 'Group Code', required: true },
  { field: 'Block', required: true },
  { field: 'Specialization', required: true },
  { field: 'Thesis Adviser', required: true },
];

export function StudentImportModal({ isOpen, onClose, onImportComplete }: ImportModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sampleData, setSampleData] = useState<{ [key: string]: string }>({});
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>(
    SYSTEM_FIELDS.map(f => ({
      systemField: f.field,
      sourceHeader: '', //manggagaling sa uplaoded file 
      required: f.required,
      mapped: false,
    }))
  );
  const [updateAction, setUpdateAction] = useState<'update' | 'skip'>('update');
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [newAccountsCount, setNewAccountsCount] = useState(0);
  const [updateAccountsCount, setUpdateAccountsCount] = useState(0);

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Import File', description: 'Upload CSV/Excel' },
    { number: 2, title: 'Map Columns', description: 'Match fields' },
    { number: 3, title: 'Review & Import', description: 'Verify data' },
  ];

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleColumnMapping = (systemField: string, value: string) => {
    setColumnMappings(prev =>
      prev.map(mapping =>
        mapping.systemField === systemField
          ? { ...mapping, sourceHeader: value, mapped: value !== '' }
          : mapping
      )
    );
  };

  const allRequiredMapped = columnMappings
    .filter(m => m.required)
    .every(m => m.mapped);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirmImport = () => {
    onImportComplete?.({ success: true });
    onClose();
  };

  const getStepState = (stepNumber: number): 'before' | 'current' | 'after' => {
    if (stepNumber < currentStep) return 'after';
    if (stepNumber === currentStep) return 'current';
    return 'before';
  };

  const canGoNext = () => {
    // Temporarily disabled muna validation to check UI
    // if (currentStep === 1) return uploadedFiles.length > 0 && uploadProgress === 100;
    // if (currentStep === 2) return allRequiredMapped;
    return true;
  };

  //IMPORT MODAL
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
                  {!(uploadedFiles.length > 0 && uploadProgress === 100) && (
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      maxSizeMB={100}
                      acceptedFileTypes={['.csv', '.xlsx', '.xls']}
                      multiple={false}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                      onError={(error) => alert(error)}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <Button variant="link" className="text-sm hover:underline font-medium">
                      Download Sample Template
                    </Button>
                    <p className="text-xs text-gray-500">Supported formats: .csv, .xlsx, .xls</p>
                  </div>

                  {/* Uploaded Files Display sa baba*/}
                  {uploadedFiles.length > 0 && uploadProgress === 100 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700">Uploaded Files</h3>
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs px-3 py-1 text-evaluated-font-color rounded-full font-medium border border-evaluated-font-color">
                              Upload Successful
                            </span>
                            <Button variant="link"
                              onClick={() => {
                                setUploadedFiles([]);
                                setUploadProgress(0);
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors">
                              <X className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
                      <div className="p-3">Sample Data </div>
                    </div>

                    {columnMappings.map((mapping) => (
                      <div key={mapping.systemField} className="grid grid-cols-3 border-t">
                        <div className="p-3 border-r bg-gray-50 flex items-center">
                          <span className="text-sm font-medium">
                            {mapping.systemField} {mapping.required && <span className="text-red-500">*</span>}
                          </span>
                        </div>
                        <div className="p-3 border-r flex items-center">
                          <Select 
                            value={mapping.sourceHeader} 
                            onValueChange={(value) => handleColumnMapping(mapping.systemField, value)}
                          >
                            <SelectTrigger className="w-full bg-[#FFF9E6]">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Item sa dropdown ay header sa uploaded file */}
                              <SelectItem value={mapping.systemField}>{mapping.systemField}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <span className="text-sm text-gray-600 truncate">
                            {mapping.mapped && sampleData[mapping.sourceHeader] 
                              ? sampleData[mapping.sourceHeader] 
                              : '—'}
                          </span>
                          {mapping.mapped && <CheckCircle className="w-5 h-5 text-evaluated-font-color flex-shrink-0 ml-2" />}
                          {!mapping.mapped && mapping.required && <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-[#7D1F1F]">Actions</h3>
                    <p className="text-sm text-gray-600">Please specify the desired action for existing student accounts.</p>
                    
                    <RadioGroup value={updateAction} onValueChange={(value) => setUpdateAction(value as 'update' | 'skip')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="update" id="update" />
                        <Label htmlFor="update" className="text-sm font-normal cursor-pointer">
                          Update Existing Records
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="skip" id="skip" />
                        <Label htmlFor="skip" className="text-sm font-normal cursor-pointer">
                          Skip
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
                        <span className="text-2xl font-bold">{newAccountsCount}</span>
                        <span className="text-sm text-gray-600">New accounts will be added</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{updateAccountsCount}</span>
                        <span className="text-sm text-gray-600">Existing accounts will be updated</span>
                      </div>
                    </div>

                    {previewData.length > 0 && (
                      <div className="border rounded-lg overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              {SYSTEM_FIELDS.map((field) => (
                                <th key={field.field} className="p-2 text-left font-medium border-r last:border-r-0">
                                  {field.field}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, i) => (
                              <tr key={i} className="border-t hover:bg-gray-50">
                                {SYSTEM_FIELDS.map((field) => (
                                  <td key={field.field} className="p-2 border-r last:border-r-0">
                                    {row[field.field] || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Only show error section if there are errors */}
                  {importErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded p-4">
                      <div className="flex gap-3 mb-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-1">ERROR(S) FOUND DURING IMPORT</h4>
                          <p className="text-sm text-red-700">
                            Records with errors are shown below and will not be imported. You can download the error report to correct the source file and re-import.
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-red-800 mb-3">({importErrors.length}) Errors found</p>
                      <ul className="text-sm text-red-700 space-y-1 mb-4">
                        {importErrors.map((error, i) => (
                          <li key={i}>• Row {error.row}: {error.errors.join(', ')}</li>
                        ))}
                      </ul>

                      <div className="border rounded-lg overflow-x-auto mb-4 bg-white">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-2 text-left font-medium border-r">#</th>
                              {SYSTEM_FIELDS.map((field) => (
                                <th key={field.field} className="p-2 text-left font-medium border-r last:border-r-0">
                                  {field.field}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {importErrors.map((error) => (
                              <tr key={error.row} className="border-t hover:bg-gray-50">
                                <td className="p-2 border-r">{error.row}</td>
                                <td className="p-2 border-r">{error.studentId}</td>
                                <td className="p-2 border-r">{error.studentName}</td>
                                <td className={`p-2 border-r ${
                                  error.errors.some(e => e.includes('PUP Webmail')) ? "bg-red-100" : ""
                                }`}>{error.email}</td>
                                <td className="p-2 border-r">{error.groupCode}</td>
                                <td className="p-2 border-r">{error.block}</td>
                                <td className="p-2 border-r">{error.specialization}</td>
                                <td className={`p-2 ${
                                  error.errors.some(e => e.includes('Thesis Adviser')) ? "bg-red-100" : ""
                                }`}>{error.thesisAdviser}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <WizardNavigation>
              {currentStep > 1 ? (
                <WizardButton variant="secondary" onClick={handlePrevious}>
                  <ArrowLeft className="w-6 h-6" strokeWidth={2} />
                  <span>Previous</span>
                </WizardButton>
              ) : (
                <div />
              )}

              {currentStep < steps.length ? (
                <WizardButton
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-6 h-6" strokeWidth={2} />
                </WizardButton>
              ) : (
                <WizardButton
                  variant="primary"
                  onClick={handleConfirmImport}
                  className="ml-auto"
                >
                  <span>Confirm Import</span>
                </WizardButton>
              )}
              
            </WizardNavigation>
          </div>
        </div>
      </div>
    </div>
  );
}