import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Loader2,
    ClipboardCheck,
    AlertTriangle
} from 'lucide-react';

// --- GLOBAL COMPONENTS ---
import { AppHeader } from '@/components/app-header';
import { NavFooter } from '@/components/nav-footer';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface PageProps {
    auth: {
        user: {
            name: string;
            role_in_group: 'Leader' | 'Member';
        };
    };
}

export default function IpPlagiarism({ auth }: PageProps) {
    const isLeader = auth.user.role_in_group === 'Leader';
    
    // --- UI STATES ---
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    // --- FORM DATA (Inertia) ---
    const { data, setData, post, processing } = useForm({
        compliance_checked_1: false,
        compliance_checked_2: false,
        compliance_checked_3: false,
        plagiarism_report: null as File | null,
        detected_score: null as number | null,  
    });

    // --- LOGIC: HANDLE FILE SCANNING (Real Axios) ---
    const handleFileSelect = async (file: File) => {
        if (!isLeader) return;

        // 1. Reset states & set loading
        setIsScanning(true);
        setScanError(null);
        setData(prev => ({ ...prev, plagiarism_report: file, detected_score: null }));

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 2. REAL API CALL to your Laravel Backend
            const response = await axios.post(route('plagiarism.scan'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setData(prev => ({ 
                    ...prev, 
                    plagiarism_report: file,
                    detected_score: response.data.score 
                }));
            } else {
                setScanError(response.data.message || "Unable to read similarity score.");
                setData(prev => ({ ...prev, plagiarism_report: null, detected_score: null }));
            }
        } catch (error: any) {
            console.error("Scan Failed:", error);
            setScanError(
                error.response?.data?.message || 
                "Server error: Could not scan document. Please check your connection."
            );
            setData(prev => ({ ...prev, plagiarism_report: null, detected_score: null }));
        } finally {
            setIsScanning(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submits the verified form to the database
        post(route('compliance.store'));
    };

    // --- LOGIC GATES ---
    const hasScore = data.detected_score !== null;
    const isPassing = hasScore && data.detected_score! <= 15;
    const allChecked = data.compliance_checked_1 && data.compliance_checked_2 && data.compliance_checked_3;
    const isReadyToSubmit = isLeader && hasScore && isPassing && allChecked;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
            <Head title="IP & Compliance" />

            <AppHeader variant="student" />

            {/* --- 1. HEADER STRIP --- */}
            <div className="bg-white border-b-2 border-[#800000]/60 px-6 md:px-[5%] py-6 flex items-start gap-4">
                <div className="mt-1">
                    <ClipboardCheck className="w-10 h-10 text-[#800000] stroke-[2.5]" />
                </div>
                <div>
                    <h1 className="text-[#FFD700] text-3xl font-medium tracking-wide">IP & Plagiarism</h1>
                    <p className="text-[#800000] text-lg font-medium mt-1 leading-tight">
                        Ensure IP compliance and submit plagiarism reports
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto w-full my-8 md:my-10 px-6 space-y-8">

                {/* --- 2. STATUS BANNER --- */}
                <div className={`
                    w-full border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm transition-all duration-500
                    ${!hasScore 
                        ? "bg-white border-[#800000]" 
                        : isPassing 
                            ? "bg-green-50 border-green-600" 
                            : "bg-red-50 border-red-600"}
                `}>
                    <div className="text-left w-full">
                        <h2 className={`text-3xl font-bold tracking-tight ${
                            !hasScore ? "text-[#800000]" : isPassing ? "text-green-800" : "text-red-800"
                        }`}>
                            {!hasScore ? "Compliance Pending" : isPassing ? "Compliance Verified" : "Verification Failed"}
                        </h2>
                        <p className={`text-sm md:text-base font-medium mt-1 ${
                            !hasScore ? "text-black" : isPassing ? "text-green-700" : "text-red-700"
                        }`}>
                            {!hasScore && "Please upload your plagiarism report. The server will verify the score automatically."}
                            {hasScore && isPassing && `Server detected ${data.detected_score}%. You may proceed to sign the declaration.`}
                            {hasScore && !isPassing && `Server detected ${data.detected_score}%, which exceeds the 15% threshold.`}
                        </p>
                    </div>

                    {isPassing && (
                         <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-green-700 font-bold bg-green-100 px-4 py-2 rounded-full">
                                <CheckCircle className="w-5 h-5" />
                                <span>Passed</span>
                            </div>
                         </div>
                    )}
                </div>

                {/* --- 3. MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* --- LEFT COLUMN: SUBMISSION --- */}
                    <div className="bg-white rounded-xl border border-[#800000] overflow-hidden flex flex-col h-full shadow-sm">
                        {/* Header */}
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-medium text-lg tracking-wide">
                            Submission & Verification
                        </div>
                        
                        <div className="p-6 flex flex-col gap-6 h-full">
                            
                            {/* File Upload Section */}
                            <div>
                                <label className="block text-base font-medium text-black mb-3">
                                    1. Plagiarism Check Report (PDF)
                                </label>

                                {isScanning ? (
                                    <div className="border-2 border-dashed border-[#800000]/60 rounded-lg p-10 text-center bg-gray-50">
                                        <Loader2 className="w-8 h-8 text-[#800000] animate-spin mb-2 mx-auto" />
                                        <p className="text-[#800000] font-medium">Server Analyzing...</p>
                                        <p className="text-xs text-gray-500">Extracting score from PDF</p>
                                    </div>
                                ) : (
                                    <>
                                        <FileUpload
                                            onFileSelect={(files) => {
                                                if (files.length > 0 && isLeader) {
                                                    handleFileSelect(files[0]);
                                                }
                                            }}
                                            onError={(error) => setScanError(error)}
                                            maxSizeMB={10}
                                            acceptedFileTypes={['.pdf']}
                                            multiple={false}
                                            isUploading={isScanning}
                                        />
                                        {scanError && (
                                            <div className="mt-4 bg-red-100 text-red-600 text-xs py-2 px-3 rounded flex items-center justify-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                {scanError}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Scan Result Display */}
                            {hasScore && !isScanning && (
                                <div className={`border rounded-lg p-4 ${isPassing ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-gray-800 truncate pr-2">{data.plagiarism_report?.name}</p>
                                            <p className={`text-xs ${isPassing ? 'text-green-700' : 'text-red-700'}`}>
                                                {isPassing ? 'Pass: Within threshold' : 'Fail: Similarity too high'}
                                            </p>
                                        </div>
                                        <div className={`text-2xl font-bold whitespace-nowrap ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                                            {data.detected_score}%
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Checkboxes - Only visible if passing */}
                            <div className={`transition-all duration-500 ${!isPassing ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                                <label className="block text-base font-medium text-black mb-3">
                                    2. Declaration of Compliance
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Checkbox 
                                            id="c1"
                                            checked={data.compliance_checked_1}
                                            onCheckedChange={(c) => setData('compliance_checked_1', !!c)}
                                            className="mt-1 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                        />
                                        <label htmlFor="c1" className="text-sm text-black leading-tight cursor-pointer pt-0.5">
                                            We certify that this manuscript is our original work and contains no plagiarized material.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Checkbox 
                                            id="c2"
                                            checked={data.compliance_checked_2}
                                            onCheckedChange={(c) => setData('compliance_checked_2', !!c)}
                                            className="mt-1 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                        />
                                        <label htmlFor="c2" className="text-sm text-black leading-tight cursor-pointer pt-0.5">
                                            We have read and understood the University IP Policy displayed on the right.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Checkbox 
                                            id="c3"
                                            checked={data.compliance_checked_3}
                                            onCheckedChange={(c) => setData('compliance_checked_3', !!c)}
                                            className="mt-1 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                        />
                                        <label htmlFor="c3" className="text-sm text-black leading-tight cursor-pointer pt-0.5">
                                            We grant the Department permission to archive this work in the library repository.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                onClick={handleSubmit}
                                disabled={!isReadyToSubmit || processing}
                                className={`
                                    w-full font-bold py-6 text-base rounded-lg mt-auto shadow-md transition-all
                                    ${isReadyToSubmit 
                                        ? 'bg-[#800000] hover:bg-[#660000] text-white hover:scale-[1.01]' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                                `}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                    </span>
                                ) : "Confirm & Submit Compliance"}
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: POLICY TEXT --- */}
                    <div className="bg-white rounded-xl border border-[#800000] overflow-hidden flex flex-col h-[700px] shadow-sm">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-medium text-lg tracking-wide flex items-center gap-2">
                            IP Policy Guidelines
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-white text-black text-sm md:text-[15px] leading-relaxed custom-scrollbar">
                            <h3 className="font-bold text-center text-lg mb-6 text-[#800000]">Intellectual Property & Integrity Policy</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="font-bold">Section 1. Student Ownership.</p>
                                    <p>In accordance with the Intellectual Property Code of the Philippines (RA 8293), the University recognizes that the student author(s) own the copyright of their thesis, dissertation, or capstone project, provided that the work was created as part of their regular academic requirements.</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-bold">Section 2. Co-Ownership.</p>
                                    <p>In cases where the thesis resulted from a project funded by the University or involved substantial use of University resources (beyond standard library/laboratory access), the University shall retain joint ownership of the patent or copyright.</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-bold">Article II. Institutional Repository Rights</p>
                                    <p>By submitting this manuscript, the author(s) grant the University a non-exclusive, royalty-free, and perpetual license to:</p>
                                    <ul className="list-disc pl-5 space-y-1 mt-1">
                                        <li>Archive the work in the University Library's digital and physical repository.</li>
                                        <li>Make the work accessible to the academic community for research and educational purposes.</li>
                                        <li>Migrate the work to any medium or format for the purpose of preservation.</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-bold">Article III. Originality and Plagiarism</p>
                                    <p><strong>Section 1. Zero Tolerance.</strong> The University maintains a strict policy against plagiarism. All submissions must be the original work of the authors.</p>
                                    <p><strong>Section 2. Similarity Index.</strong> All thesis manuscripts must undergo a plagiarism detection check. A similarity index of <span className="text-red-600 font-bold bg-red-50 px-1 rounded">above 15%</span> will be flagged for mandatory revision.</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-bold">Article IV. Third-Party Materials</p>
                                    <p>It is the sole responsibility of the student author(s) to obtain written permission for any copyrighted third-party material (images, survey instruments, code, or extensive text) included in the thesis.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <NavFooter />
        </div>
    );
}