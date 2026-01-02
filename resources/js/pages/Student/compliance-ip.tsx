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
    XCircle,
    ShieldCheck,
    User,
    Bell
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

            {/* SUB-HEADER STRIP */}
            <div className="bg-[#FFF8DC] border-b border-[#e0d0b0] px-6 md:px-[5%] py-4 flex justify-between items-center">
                <h2 className="text-[#800000] text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="hidden md:inline">IP & Compliance</span>
                    <span className="md:hidden">Compliance</span>
                </h2>
                <span className="text-xs bg-[#800000] text-white px-3 py-1.5 rounded-full font-medium shadow-sm">
                    Logged in as {auth.user.role_in_group}
                </span>
            </div>

            <main className="max-w-[1440px] mx-auto w-full my-8 md:my-10 px-4 md:px-10 space-y-6">

                {/* --- 1. STATUS BANNER --- */}
                <div className={`
                    bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4
                    border-l-4 transition-all duration-300
                    ${isVerified ? 'border-green-600' : 'border-[#ffc107]'}
                `}>
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {isVerified ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                {isVerified ? 'Compliance Verified' : 'Compliance Pending'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {isVerified 
                                    ? 'All requirements met. You may now download your certificate.' 
                                    : 'Please upload a passing plagiarism report (<15%) to unlock compliance checks.'}
                            </p>
                        </div>
                    </div>

                    <Button 
                        disabled={!isVerified}
                        className={`
                            flex items-center gap-2 px-6 py-2.5 rounded font-semibold whitespace-nowrap transition-all shadow-lg
                            ${isVerified 
                                ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-white cursor-pointer hover:shadow-xl active:scale-95' 
                                : 'bg-[#D4AF37] text-white opacity-50 cursor-not-allowed'}
                        `}
                    >
                        {isVerified ? (
                            <><Download className="w-4 h-4" /> <span className="hidden sm:inline">Download Certificate</span><span className="sm:hidden">Certificate</span></>
                        ) : (
                            <><Lock className="w-4 h-4" /> <span className="hidden sm:inline">Download Certificate</span><span className="sm:hidden">Certificate</span></>
                        )}
                    </Button>
                </div>


                {/* --- MAIN GRID CONTENT --- */}
                <div className="grid gap-6 lg:grid-cols-2">
                    
                    {/* --- LEFT COLUMN: SUBMISSION --- */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-[#800000] overflow-hidden">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-semibold tracking-wide">
                            Submission & Verification
                        </div>
                        
                        <div className="p-6 space-y-6">
                            
                            {/* 1. File Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold mb-3 text-gray-700">
                                    1. Plagiarism Check Report
                                </label>
                                
                                {/* Upload Zone */}
                                <div 
                                    onClick={() => !isVerified && !isScanning && document.getElementById('file-upload')?.click()}
                                    className={`
                                        group border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
                                        ${isScanning 
                                            ? 'bg-gray-50 border-gray-300 cursor-wait pointer-events-none' 
                                            : 'bg-gray-50 hover:bg-[#fffcf5] border-gray-300 hover:border-[#800000]'}
                                    `}
                                >
                                    {/* Loading Overlay */}
                                    {isScanning ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                                            <p className="font-semibold text-[#800000]">Analyzing Document...</p>
                                            <p className="text-xs text-gray-600">Checking similarity index against database</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform">
                                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#800000]" />
                                            <div>
                                                <p className="font-bold text-gray-800">
                                                    {data.plagiarism_report ? "Click to Replace File" : "Click to Upload PDF"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">(Turnitin or Grammarly Report)</p>
                                                <p className="text-xs text-gray-400">Max size: 10 MB</p>
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
                                    <div className={`
                                        mt-4 border rounded-lg p-4 flex items-center justify-between
                                        ${scanResult.status === 'pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                                    `}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded ${scanResult.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {scanResult.status === 'pass' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{data.plagiarism_report.name}</p>
                                                <p className={`text-xs font-semibold ${scanResult.status === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                                                    {scanResult.status === 'pass' ? 'Result: Passed Acceptable Threshold' : 'Result: Threshold Exceeded (>15%)'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Similarity</div>
                                            <div className={`text-2xl font-bold ${scanResult.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                {scanResult.score}%
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Checklist Section (Disabled until file passes) */}
                            <div className={`transition-opacity ${!isReportValid ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label className="block text-sm font-semibold mb-3 text-gray-700 flex justify-between items-center">
                                    <span>2. Declaration of Compliance</span>
                                    {!isReportValid && <span className="text-xs text-red-500 font-normal italic">(Upload valid report to enable)</span>}
                                </label>
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <Checkbox 
                                            id="c1"
                                            checked={data.compliance_checked_1}
                                            onCheckedChange={(c) => setData('compliance_checked_1', !!c)}
                                            className="mt-1 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                            disabled={isVerified}
                                        />
                                        <label htmlFor="c1" className="text-sm text-gray-700 leading-tight cursor-pointer">
                                            We certify that this manuscript is our original work and contains no plagiarized material.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Checkbox 
                                            id="c2"
                                            checked={data.compliance_checked_2}
                                            onCheckedChange={(c) => setData('compliance_checked_2', !!c)}
                                            className="mt-1 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                            disabled={isVerified}
                                        />
                                        <label htmlFor="c2" className="text-sm text-gray-700 leading-tight cursor-pointer">
                                            We have read and understood the University IP Policy displayed on the right.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Checkbox 
                                            id="c3"
                                            checked={data.compliance_checked_3}
                                            onCheckedChange={(c) => setData('compliance_checked_3', !!c)}
                                            className="mt-1 data-[state=checked]:bg-[#800000] data-[state=checked]:border-[#800000]"
                                            disabled={isVerified}
                                        />
                                        <label htmlFor="c3" className="text-sm text-gray-700 leading-tight cursor-pointer">
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
                                    w-full py-3 text-base font-bold rounded-md transition-all shadow-lg
                                    ${isVerified 
                                        ? 'bg-gray-100 text-gray-500 cursor-default hover:bg-gray-100' 
                                        : !isReportValid
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-[#800000] hover:bg-[#600000] text-white active:scale-95'}
                                `}
                            >
                                {isVerified ? "Submitted & Verified ✓" : "Confirm & Submit Compliance"}
                            </Button>

                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: POLICY (COMPLETE FULL TEXT) --- */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-[#800000] overflow-hidden flex flex-col" style={{maxHeight: '700px'}}>
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-semibold tracking-wide">
                            IP Policy Guidelines
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 text-sm leading-relaxed text-gray-700" style={{scrollbarWidth: 'thin'}}>
                            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Intellectual Property & Integrity Policy</h3>
                                <p className="text-xs text-gray-500">Reference: Republic Act No. 8293 (IP Code of the Philippines)</p>
                            </div>
                            <div className="space-y-5">
                                
                                {/* ARTICLE I */}
                                <section>
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Section 1. Student Ownership</h4>
                                    <p>
                                        In accordance with the Intellectual Property Code of the Philippines (RA 8293), the University recognizes that the student author(s) own the copyright of their thesis, dissertation, or capstone project, provided that the work was created as part of their regular academic requirements.
                                    </p>
                                </section>

                                {/* ARTICLE II */}
                                <section>
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Section 2. Co-Ownership</h4>
                                    <p>
                                        In cases where the thesis resulted from a project funded by the University or involved substantial use of University resources (beyond standard library/laboratory access), the University shall retain joint ownership of the patent or copyright.
                                    </p>
                                </section>

                                {/* ARTICLE III */}
                                <section>
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Article II. Institutional Repository Rights</h4>
                                    <p className="mb-2">
                                        By submitting this manuscript, the author(s) grant the University a non-exclusive, royalty-free, and perpetual license to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                                        <li>Archive the work in the University Library's digital and physical repository.</li>
                                        <li>Make the work accessible to the public for research and educational purposes.</li>
                                        <li>Migrate the work to any medium or format for the purpose of preservation.</li>
                                    </ul>
                                </section>

                                {/* ARTICLE IV */}
                                <section>
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Article III. Originality and Plagiarism</h4>
                                    <p className="mb-2">
                                        <strong>Section 1. Zero Tolerance.</strong> The University maintains a strict policy against plagiarism. All submissions must be the original work of the authors.
                                    </p>
                                    <p>
                                        <strong>Section 2. Similarity Index.</strong> All thesis manuscripts must undergo a plagiarism detection check. A similarity index of <span className="text-red-600 font-bold">above 15%</span> will be flagged for mandatory revision.
                                    </p>
                                </section>

                                {/* ARTICLE V */}
                                <section>
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Article IV. Third-Party Materials</h4>
                                    <p>
                                        It is the sole responsibility of the student author(s) to obtain written permission for any copyrighted third-party material (images, survey instruments, code, or extensive text) included in the thesis.
                                    </p>
                                </section>

                                {/* ARTICLE VI */}
                                <section>
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Article V. Penalties and Sanctions</h4>
                                    <p>
                                        Any student found to have deliberately plagiarized content or manipulated similarity reports will be subject to disciplinary action, which may include a failing grade for the thesis, suspension, or expulsion.
                                    </p>
                                </section>

                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}