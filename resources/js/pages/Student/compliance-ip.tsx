import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Upload, 
    CheckCircle, 
    XCircle, 
    Download, 
    Loader2, 
    ClipboardCheck, // Changed to match design icon
    ArrowUp
} from 'lucide-react';

// --- GLOBAL COMPONENTS ---
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
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
            <Head title="IP & Compliance" />

            <NavBar user={auth.user} />

            {/* --- 1. HEADER STRIP (Updated to White BG per request) --- */}
            <div className="bg-white border-b-2 border-[#800000]/60 px-6 md:px-[5%] py-6 flex items-start gap-4">
                <div className="mt-1">
                    <ClipboardCheck className="w-10 h-10 text-[#800000] stroke-[2.5]" />
                </div>
                <div>
                    <h1 className="text-[#FFD700] text-3xl font-medium tracking-wide">IP & plagiarism</h1>
                    <p className="text-[#800000] text-lg font-medium mt-1 leading-tight">
                        Ensure IP compliance and submit plagiarism reports
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto w-full my-8 md:my-10 px-6 space-y-8">

                {/* --- 2. STATUS BANNER --- */}
                <div className={`
                    w-full border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm transition-all duration-500
                    ${isVerified ? "bg-green-50 border-green-600" : "bg-white border-[#800000]"}
                `}>
                    <div className="text-left w-full">
                        <h2 className={`text-3xl font-bold tracking-tight ${isVerified ? "text-green-800" : "text-[#800000]"}`}>
                            {isVerified ? "Compliance Verified" : "Compliance Pending"}
                        </h2>
                        <p className={`text-sm md:text-base font-medium mt-1 ${isVerified ? "text-green-700" : "text-black"}`}>
                            {isVerified 
                                ? "All requirements met. You may now download your certificate." 
                                : "Please upload your plagiarism report and confirm IP adherence to unlock the certificate."}
                        </p>
                    </div>

                    <Button 
                        disabled={!isVerified}
                        className={`
                            whitespace-nowrap px-8 py-6 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2
                            ${isVerified 
                                ? "bg-[#D4AF37] text-white hover:bg-[#C5A028] hover:scale-105" 
                                : "bg-[#F3EAD3] text-[#800000] hover:bg-[#e8dec0]"}
                        `}
                    >
                        {isVerified && <Download className="w-4 h-4" />}
                        Download Certificate
                    </Button>
                </div>

                {/* --- 3. MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* --- LEFT COLUMN: SUBMISSION --- */}
                    <div className="bg-white rounded-xl border border-[#800000] overflow-hidden flex flex-col h-full">
                        {/* Header */}
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-medium text-lg tracking-wide">
                            Submission & Verification
                        </div>
                        
                        <div className="p-6 flex flex-col gap-6 h-full">
                            
                            {/* File Upload Section */}
                            <div>
                                <label className="block text-base font-medium text-black mb-3">
                                    1. Plagiarism Check Report
                                </label>
                                
                                {/* Dashed Upload Zone */}
                                <div 
                                    onClick={() => !isVerified && !isScanning && document.getElementById('file-upload')?.click()}
                                    className={`
                                        border-2 border-dashed border-[#800000]/60 rounded-lg p-10 text-center transition-colors group relative
                                        ${isScanning ? 'bg-gray-50 cursor-wait' : 'hover:bg-gray-50 cursor-pointer'}
                                    `}
                                >
                                    {isScanning ? (
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="w-8 h-8 text-[#800000] animate-spin mb-2" />
                                            <p className="text-[#800000] font-medium">Analyzing...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="border border-black rounded-lg w-10 h-10 flex items-center justify-center mx-auto mb-3">
                                                <ArrowUp className="w-5 h-5 text-black" />
                                            </div>
                                            <p className="text-gray-500 text-sm mb-1 group-hover:text-[#800000]">
                                                {data.plagiarism_report ? "Click to replace file" : "Drag and drop files here, or click to select"}
                                            </p>
                                            <p className="text-gray-400 text-xs">Max size: 100 MB</p>
                                        </>
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
                            </div>

                            {/* Scan Result Display */}
                            {scanResult && !isScanning && (
                                <div className={`border rounded-lg p-4 ${scanResult.status === 'pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{data.plagiarism_report?.name}</p>
                                            <p className={`text-xs ${scanResult.status === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                                                {scanResult.status === 'pass' ? 'Pass: Within threshold' : 'Fail: Similarity too high'}
                                            </p>
                                        </div>
                                        <div className={`text-2xl font-bold ${scanResult.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                            {scanResult.score}%
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Checkboxes */}
                            <div className={`transition-opacity duration-300 ${!isReportValid ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
                                        <label htmlFor="c1" className="text-sm text-black leading-tight cursor-pointer">
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
                                        <label htmlFor="c2" className="text-sm text-black leading-tight cursor-pointer">
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
                                        <label htmlFor="c3" className="text-sm text-black leading-tight cursor-pointer">
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
                                    w-full font-bold py-6 text-base rounded-lg mt-auto shadow-md transition-all
                                    ${isVerified 
                                        ? 'bg-gray-100 text-gray-500 cursor-default' 
                                        : 'bg-[#800000] text-white hover:bg-[#660000]'}
                                `}
                            >
                                {isVerified ? "Submitted & Verified" : "Confirm & Submit Compliance"}
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: POLICY TEXT --- */}
                    <div className="bg-white rounded-xl border border-[#800000] overflow-hidden flex flex-col h-[700px]">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-medium text-lg tracking-wide flex items-center gap-2">
                            IP Policy Guidelines
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-white text-black text-sm md:text-[15px] leading-relaxed custom-scrollbar">
                            <h3 className="font-bold text-center text-lg mb-6">Intellectual Property & Integrity Policy</h3>

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
                                    <p><strong>Section 2. Similarity Index.</strong> All thesis manuscripts must undergo a plagiarism detection check. A similarity index of <span className="text-red-600 font-bold">above 15%</span> will be flagged for mandatory revision.</p>
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
            <Footer />
        </div>
    );
}