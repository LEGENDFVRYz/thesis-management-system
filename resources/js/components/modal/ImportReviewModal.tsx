import React from 'react';
import { X, AlertCircle, ArrowLeft, Download } from 'lucide-react';

interface ImportReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onBack: () => void;
    stats: {
        created: number;
        updated: number;
        errors: number;
    };
    previewData: any[]; // The valid data to show in "Data Preview"
    errorData: any[];   // The rows with errors
}

export default function ImportReviewModal({
    isOpen,
    onClose,
    onConfirm,
    onBack,
    stats,
    previewData,
    errorData,
}: ImportReviewModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* --- Header --- */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-[#800000] uppercase tracking-wide">
                        Import Student Account
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* --- Stepper --- */}
                <div className="py-6 bg-white dark:bg-zinc-900 shrink-0">
                    <div className="flex items-center justify-center max-w-2xl mx-auto relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full" />
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#800000] -z-10 -translate-y-1/2 rounded-full"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} />

                        {/* Steps */}
                        <div className="flex justify-between w-full px-4">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 px-2">
                                <div className="w-10 h-10 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-white dark:ring-zinc-900">1</div>
                                <span className="text-sm font-semibold text-[#800000]">Import File</span>
                            </div>
                            {/* Step 2 */}
                            <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 px-2">
                                <div className="w-10 h-10 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-white dark:ring-zinc-900">2</div>
                                <span className="text-sm font-semibold text-[#800000]">Map Columns</span>
                            </div>
                            {/* Step 3 (Active) */}
                            <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 px-2">
                                <div className="w-10 h-10 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white dark:ring-zinc-900">3</div>
                                <span className="text-sm font-bold text-[#800000]">Review & Import</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Scrollable Content --- */}
                <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 bg-gray-50/50 dark:bg-zinc-900/50">

                    {/* Section: Valid Data Preview */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-[#800000]">DATA PREVIEW</h3>
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.created}</span>
                                    <span className="ml-2 text-gray-500">New accounts will be created</span>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.updated}</span>
                                    <span className="ml-2 text-gray-500">Existing accounts will be updated</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm max-h-[300px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-xs">
                                <thead className="bg-gray-100 dark:bg-zinc-800 sticky top-0 z-10">
                                    <tr>
                                        {Object.keys(previewData[0] || {}).map((header) => (
                                            <th key={header} className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider border-b">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {previewData.slice(0, 10).map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                            {Object.values(row).map((val: any, cIdx) => (
                                                <td key={cIdx} className="px-4 py-2 text-gray-600 whitespace-nowrap">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section: Errors (Conditional) */}
                    {errorData.length > 0 && (
                        <section className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                            {/* Error Banner */}
                            <div className="bg-red-100/80 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-[#800000] shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[#800000] font-bold text-base mb-1">ERROR(S) FOUND DURING IMPORT</h4>
                                    <p className="text-sm text-red-800">
                                        Records with errors are shown below and will not be imported. You can download the error report to correct the source file and re-import.
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-[#800000] font-bold mb-2">({errorData.length}) Errors found</h4>

                            {/* Error Details List */}
                            <ul className="list-disc list-inside text-sm text-gray-600 mb-4 pl-2 space-y-1">
                                {/* Mocking generic error messages based on the image */}
                                <li>Row 6: Missing data — Thesis Adviser cannot be blank.</li>
                                <li>Row 22: Invalid PUP Webmail format.</li>
                            </ul>

                            {/* Error Table */}
                            <div className="border border-red-200 rounded-lg overflow-hidden bg-white shadow-sm mb-4">
                                <table className="min-w-full divide-y divide-red-100 text-xs">
                                    <thead className="bg-red-50 text-[#800000]">
                                        <tr>
                                            <th className="px-2 py-3 w-10 text-center font-bold">#</th>
                                            {Object.keys(errorData[0] || {}).map((header) => (
                                                <th key={header} className="px-4 py-3 text-left font-semibold uppercase">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-50">
                                        {errorData.map((row, idx) => (
                                            <tr key={idx} className="bg-white">
                                                <td className="px-2 py-2 text-center text-red-600 font-bold bg-red-50/30 border-r border-red-100">
                                                    {/* Simulating Row Numbers from image (6, 22) */}
                                                    {idx === 0 ? 6 : 22}
                                                </td>
                                                {Object.entries(row).map(([key, val]: any, cIdx) => {
                                                    // Logic to highlight specific error cells red (mock logic)
                                                    const isErrorCell = (val === '' || (String(val).includes('@') && !String(val).includes('.com')));
                                                    return (
                                                        <td key={cIdx} className={`px-4 py-2 whitespace-nowrap ${isErrorCell ? 'bg-red-100 text-red-800 font-medium' : 'text-gray-600'}`}>
                                                            {val}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button className="flex items-center gap-2 bg-[#800000] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-900 transition-colors shadow-sm">
                                <Download className="w-4 h-4" />
                                Download Error Report
                            </button>
                        </section>
                    )}
                </div>

                {/* --- Footer Actions --- */}
                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center shrink-0">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-8 py-2.5 rounded-lg bg-[#FFC107] text-black font-bold hover:bg-yellow-400 transition-colors shadow-md text-base"
                    >
                        Confirm Import
                    </button>
                </div>

            </div>
        </div>
    );
}