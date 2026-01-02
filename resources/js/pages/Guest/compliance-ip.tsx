import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    FileText, 
    Upload, 
    CheckCircle, 
    AlertTriangle, 
    BookOpen, 
    Download, 
    Lock,
    Loader2, 
    XCircle 
} from 'lucide-react';

// --- GLOBAL COMPONENTS ---
// Ensure these paths match your project structure
import NavBar from '@/components/app-header'; 
import Footer from '@/components/nav-footer'; 
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
    
    // --- STATE MANAGEMENT ---
    const [isVerified, setIsVerified] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    
    // Result state: null = no file, or { score: number, status: 'pass' | 'fail' }
    const [scanResult, setScanResult] = useState<{ score: number; status: 'pass' | 'fail' } | null>(null);

    const { data, setData, post, processing } = useForm({
        compliance_checked_1: false,
        compliance_checked_2: false,
        compliance_checked_3: false,
        plagiarism_report: null as File | null,
    });

    // --- LOGIC: HANDLE FILE SCANNING ---
    const handleFileSelect = (file: File) => {
        setData('plagiarism_report', file);
        setIsScanning(true);
        setScanResult(null); // Reset previous results

        // SIMULATE BACKEND API CHECK 
        // Logic: 2-second delay. If filename has "fail" or "high" -> Fail. Else -> Pass.
        setTimeout(() => {
            const isTestFail = file.name.toLowerCase().includes('fail') || file.name.toLowerCase().includes('high');
            
            // Random score generation based on filename trigger
            const mockScore = isTestFail 
                ? Math.floor(Math.random() * (99 - 16) + 16) // Result: 16% - 99%
                : Math.floor(Math.random() * 14);            // Result: 0% - 14%
            
            setScanResult({
                score: mockScore,
                status: mockScore > 15 ? 'fail' : 'pass'
            });
            setIsScanning(false);
        }, 2000); 
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Only submit if compliance is met
        if (scanResult && scanResult.status === 'pass') {
            setIsVerified(true); 
            // In a real app, you would uncomment the line below:
            // post(route('compliance.store'));
        }
    };

    // Helper booleans
    const isReportValid = scanResult?.status === 'pass';
    const allComplianceChecked = data.compliance_checked_1 && data.compliance_checked_2 && data.compliance_checked_3;

    return (
        <div className="min-h-screen bg-[#f4f4f4] font-sans text-[#333]">
            <Head title="IP & Compliance" />

            <NavBar user={auth.user} />

            {/* SUB-HEADER STRIP */}
            <div className="bg-[#FFF8DC] border-b border-[#e0d0b0] px-6 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#800000] text-sm tracking-wide">SUBMISSION / IP & COMPLIANCE</span>
                </div>
                <div className="text-xs bg-[#800000] text-white px-3 py-1 rounded shadow-sm">
                    Logged in as {auth.user.role_in_group}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* --- 1. STATUS BANNER --- */}
                <div className={`
                    bg-white rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4
                    border-l-[6px] transition-all duration-300
                    ${isVerified ? 'border-[#28a745]' : 'border-[#ffc107]'}
                `}>
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {isVerified ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#333]">
                                {isVerified ? 'Compliance Verified' : 'Compliance Pending'}
                            </h2>
                            <p className="text-sm text-[#666]">
                                {isVerified 
                                    ? 'All requirements met. You may now download your certificate.' 
                                    : 'Please upload a passing plagiarism report (<15%) to unlock compliance checks.'}
                            </p>
                        </div>
                    </div>

                    <Button 
                        disabled={!isVerified}
                        className={`
                            h-auto py-3 px-6 font-bold shadow-sm transition-all
                            ${isVerified 
                                ? 'bg-[#28a745] hover:bg-[#218838] text-white cursor-pointer' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                        `}
                    >
                        {isVerified ? (
                            <><Download className="w-5 h-5 mr-2" /> Download Certificate</>
                        ) : (
                            <><Lock className="w-4 h-4 mr-2" /> Certificate Locked</>
                        )}
                    </Button>
                </div>


                {/* --- MAIN GRID CONTENT --- */}
                <div className="grid gap-6 lg:grid-cols-12">
                    
                    {/* --- LEFT COLUMN: SUBMISSION --- */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-white">
                                <h3 className="text-lg font-bold text-[#800000] flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Submission & Verification
                                </h3>
                            </div>
                            
                            <div className="p-6 space-y-8">
                                
                                {/* 1. File Upload Section */}
                                <div>
                                    <label className="block text-sm font-bold text-[#333] mb-3">
                                        1. Plagiarism Check Report
                                    </label>
                                    
                                    {/* Upload Zone */}
                                    <div className={`
                                        group border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
                                        ${isScanning ? 'bg-gray-50 border-gray-300 cursor-wait' : 'border-[#800000]/30 bg-[#fffcf5] hover:bg-[#fff8e1]'}
                                    `}>
                                        {/* Loading Overlay */}
                                        {isScanning ? (
                                            <div className="flex flex-col items-center gap-3 animate-pulse">
                                                <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                                                <p className="font-bold text-[#800000]">Analyzing Document...</p>
                                                <p className="text-xs text-[#666]">Checking similarity index against database</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3" onClick={() => !isVerified && document.getElementById('file-upload')?.click()}>
                                                <div className="w-12 h-12 bg-[#800000]/10 rounded-full flex items-center justify-center text-[#800000] group-hover:scale-110 transition-transform">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#800000]">
                                                        {data.plagiarism_report ? "Replace File" : "Click to Upload PDF"}
                                                    </p>
                                                    <p className="text-xs text-[#666] mt-1">(Turnitin or Grammarly Report)</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <input 
                                            id="file-upload"
                                            type="file" 
                                            className="hidden" 
                                            accept=".pdf"
                                            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                                            disabled={!isLeader || isVerified || isScanning}
                                        />
                                    </div>

                                    {/* RESULTS DISPLAY LOGIC */}
                                    {data.plagiarism_report && !isScanning && scanResult && (
                                        <div className={`mt-4 border rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2
                                            ${scanResult.status === 'pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                                        `}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded ${scanResult.status === 'pass' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                                    {scanResult.status === 'pass' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#333]">{data.plagiarism_report.name}</p>
                                                    <p className={`text-xs font-semibold ${scanResult.status === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                                                        {scanResult.status === 'pass' ? 'Result: Passed Acceptable Threshold' : 'Result: Threshold Exceeded (>15%)'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-[#666] uppercase tracking-wider font-semibold">Similarity</div>
                                                <div className={`text-lg font-bold ${scanResult.status === 'pass' ? 'text-[#28a745]' : 'text-red-600'}`}>
                                                    {scanResult.score}%
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Checklist Section (Disabled until file passes) */}
                                <div className={!isReportValid ? 'opacity-50 pointer-events-none' : ''}>
                                    <label className="block text-sm font-bold text-[#333] mb-3 flex justify-between">
                                        <span>2. Declaration of Compliance</span>
                                        {!isReportValid && <span className="text-xs text-red-500 font-normal italic">(Upload valid report to enable)</span>}
                                    </label>
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <Checkbox 
                                                id="c1"
                                                checked={data.compliance_checked_1}
                                                onCheckedChange={(c) => setData('compliance_checked_1', !!c)}
                                                className="mt-1 border-gray-400 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                                disabled={isVerified}
                                            />
                                            <label htmlFor="c1" className="text-sm text-[#444] leading-tight cursor-pointer">
                                                We certify that this manuscript is our original work and contains no plagiarized material.
                                            </label>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Checkbox 
                                                id="c2"
                                                checked={data.compliance_checked_2}
                                                onCheckedChange={(c) => setData('compliance_checked_2', !!c)}
                                                className="mt-1 border-gray-400 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                                disabled={isVerified}
                                            />
                                            <label htmlFor="c2" className="text-sm text-[#444] leading-tight cursor-pointer">
                                                We have read and understood the University IP Policy displayed on the right.
                                            </label>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Checkbox 
                                                id="c3"
                                                checked={data.compliance_checked_3}
                                                onCheckedChange={(c) => setData('compliance_checked_3', !!c)}
                                                className="mt-1 border-gray-400 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                                disabled={isVerified}
                                            />
                                            <label htmlFor="c3" className="text-sm text-[#444] leading-tight cursor-pointer">
                                                We grant the Department permission to archive this work in the library repository.
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={!allComplianceChecked || !isReportValid || isVerified || processing}
                                    className={`
                                        w-full py-6 text-base font-bold shadow-md transition-all
                                        ${isVerified 
                                            ? 'bg-gray-100 text-gray-500 cursor-default hover:bg-gray-100' 
                                            : !isReportValid
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-[#800000] hover:bg-[#600000] text-white'
                                        }
                                    `}
                                >
                                    {isVerified ? "Submitted & Verified ✓" : "Confirm & Submit Compliance"}
                                </Button>

                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: POLICY (COMPLETE FULL TEXT) --- */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full max-h-[700px]">
                            <div className="px-6 py-4 border-b border-gray-100 bg-white">
                                <h3 className="text-lg font-bold text-[#800000] flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    IP Policy Guidelines
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-[#f9f9f9] text-sm leading-relaxed custom-scrollbar text-[#444]">
                                <div className="text-center border-b border-gray-200 pb-4 mb-6">
                                    <h3 className="text-[#800000] font-bold text-base mb-1">Intellectual Property & Integrity Policy</h3>
                                    <p className="text-xs text-[#666]">Reference: Republic Act No. 8293 (Intellectual Property Code)</p>
                                </div>
                                <div className="space-y-6">
                                    
                                    {/* ARTICLE I */}
                                    <section>
                                        <h4 className="font-bold text-[#333] border-b border-gray-200 pb-1 mb-2">Article I. Ownership of Copyright</h4>
                                        <p className="mb-2">
                                            <strong>Section 1. Student Ownership.</strong> In accordance with the Intellectual Property Code (RA 8293), copyright ownership of theses and dissertations belongs to the student author(s). The University recognizes the right of the student to be identified as the creator of the work.
                                        </p>
                                        <p>
                                            <strong>Section 2. Exceptions.</strong> Ownership may be shared or transferred if the work was created as part of a funded research project where the funding agreement specifies ownership, or if substantial University resources beyond standard academic facilities were utilized.
                                        </p>
                                    </section>

                                    {/* ARTICLE II */}
                                    <section>
                                        <h4 className="font-bold text-[#333] border-b border-gray-200 pb-1 mb-2">Article II. Archiving and Distribution</h4>
                                        <p className="mb-2">
                                            <strong>Section 1. Repository Rights.</strong> By submitting the final manuscript, the student grants the University a non-exclusive, royalty-free right to reproduce, archive, and communicate the work for academic and research purposes, provided that the author is properly attributed.
                                        </p>
                                        <p>
                                            <strong>Section 2. Public Access.</strong> Theses will be made available to the public via the University Library unless a specific embargo request has been approved by the Dean due to pending patent applications or sensitive data concerns.
                                        </p>
                                    </section>

                                    {/* ARTICLE III */}
                                    <section>
                                        <h4 className="font-bold text-[#333] border-b border-gray-200 pb-1 mb-2">Article III. Originality and Plagiarism</h4>
                                        <p className="mb-2">
                                            <strong>Section 1. Zero Tolerance.</strong> The University maintains a policy of zero tolerance for plagiarism, academic dishonesty, and falsification of data. All submissions must be the original work of the authors.
                                        </p>
                                        <p className="mb-2">
                                            <strong>Section 2. Similarity Threshold.</strong> All manuscripts must be subjected to a similarity check using the University-approved software (e.g., Turnitin). A similarity index of <span className="text-red-600 font-bold">above 15%</span> will be automatically flagged for mandatory revision. Submissions exceeding this threshold cannot proceed to the final binding stage.
                                        </p>
                                        <p>
                                            <strong>Section 3. Exclusions.</strong> The similarity index calculation may exclude standard bibliographic references, quoted material that is properly cited, and small matches of less than 1% (e.g., common phrases).
                                        </p>
                                    </section>
                                    
                                    {/* ARTICLE IV */}
                                    <section>
                                        <h4 className="font-bold text-[#333] border-b border-gray-200 pb-1 mb-2">Article IV. Penalties and Sanctions</h4>
                                        <p>
                                            <strong>Section 1. Violation Consequences.</strong> Any student found to have deliberately plagiarized content or manipulated similarity reports will be subject to disciplinary action, which may include a failing grade for the thesis, suspension, or expulsion, depending on the severity of the offense.
                                        </p>
                                    </section>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}