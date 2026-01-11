import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { update } from '@/routes/admin/management/policies/guidelines/index';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { LuUpload } from 'react-icons/lu';



export default function OverallGuidelinesTab({ guidelineUrl }: { guidelineUrl: string | null }) {
    // --- 1. PDF Upload Form ---
    const pdfForm = useForm<{ pdf_file: File | null }>({
        pdf_file: null,
    });

    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const submitPdf: FormEventHandler = (e) => {
        e.preventDefault();
        pdfForm.post(update().url, {
            forceFormData: true,
            onSuccess: () => {
                setIsPdfModalOpen(false);
                pdfForm.reset();
            },
        });
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                    Overall Guidelines
                </h2>
                <Button 
                    onClick={() => setIsPdfModalOpen(true)}
                    variant="primary" 
                    className="flex items-center gap-2"
                >
                    <LuUpload className="w-4 h-4" />
                    Upload New Policy Guide
                </Button>
            </div>

            <div className="flex flex-1 min-h-[80vh] w-full border rounded-lg bg-muted/20">
                {/* GuideLine PDF container */}
                <div className="flex-1 w-full border rounded-lg bg-muted/20">
                    {guidelineUrl ? (
                        <iframe
                            // The URL already includes ?t=123123 from Laravel to prevent caching
                            src={guidelineUrl} 
                            className="w-full h-full"
                            title="Guideline PDF Viewer"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                            <span className="text-4xl">📄</span>
                            <p>No guidelines uploaded yet.</p>
                            <button 
                                onClick={() => setIsPdfModalOpen(true)}
                                className="text-primary underline text-sm"
                            >
                                Upload one now
                            </button>
                        </div>
                    )}
                </div>
            </div>
            

            {/* Upload Testing Modal */}
            {isPdfModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Update Guidelines</h2>
                            <button onClick={() => setIsPdfModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Uploading a new file will <strong>replace</strong> the existing PDF immediately.
                        </p>

                        <form onSubmit={submitPdf}>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Select PDF File
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => pdfForm.setData('pdf_file', e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-violet-50 file:text-violet-700
                                      hover:file:bg-violet-100
                                    "
                                />
                                {pdfForm.errors.pdf_file && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        {pdfForm.errors.pdf_file}
                                    </p>
                                )}
                                {pdfForm.progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                        <div
                                            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${pdfForm.progress.percentage}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsPdfModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={pdfForm.processing}
                                    className="rounded-lg px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {pdfForm.processing ? 'Uploading...' : 'Save & Replace'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}