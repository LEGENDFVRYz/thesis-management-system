import React, { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Paperclip } from 'lucide-react';

// --- GLOBAL COMPONENTS ---
import NavBar from '@/components/app-header'; 
import Footer from '@/components/nav-footer'; 
import FileUpload from '@/components/file-upload'; 

interface AuditLog {
    id: number;
    user: string;
    role: string;
    action: string;
    details: string;
    date: string;
    type: 'created' | 'uploaded' | 'approved' | 'rejected';
}

interface PageProps {
    auth: {
        user: {
            name: string;
            role_in_group: 'Leader' | 'Member';
        };
    };
    audit_trail?: AuditLog[];
    // New Prop to drive the Timeline state
    status?: 'draft' | 'submitted' | 'approved' | 'verified'; 
}

export default function PublicPresentation({ auth, audit_trail = [], status = 'draft' }: PageProps) {
    const isLeader = auth?.user?.role_in_group === 'Leader';

    // Mock Logs
    const logs: AuditLog[] = audit_trail.length > 0 ? audit_trail : [
        { id: 1, date: 'Oct 20, 2023 • 10:00 AM', user: 'Juan Dela Cruz', role: 'Leader', action: 'Created', details: 'Initial registration draft created', type: 'created' },
        { id: 2, date: 'Oct 20, 2023 • 10:05 AM', user: 'Juan Dela Cruz', role: 'Leader', action: 'Uploaded', details: 'Uploaded Hydroponics_Final_Slides.pptx', type: 'uploaded' },
    ];

    // Form Logic
    const { data, setData, post, processing } = useForm({
        title: 'Automated Hydroponics System using IoT and Machine Learning', 
        event_name: '',
        venue: '',
        event_date: '',
        engagement_type: 'Conference Presentation',
        materials_file: null as File | null,
        proof_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Submission sent!");
    };

    // --- LOGIC 1: DYNAMIC CHECKLIST STATE ---
    // These booleans update automatically as the user types/uploads
    const isEventDetailsFilled = !!(data.event_name && data.venue && data.event_date);
    const isMaterialsUploaded = !!data.materials_file; // Or check existing file from backend
    const isProofUploaded = !!data.proof_file;
    const isCertificateUploaded = false; // Logic placeholder if you separate Certificate vs Photos

    // --- LOGIC 2: DYNAMIC TIMELINE STATE ---
    // Map status string to a numeric step for easy comparison
    const currentStepIndex = useMemo(() => {
        switch(status) {
            case 'verified': return 4;
            case 'approved': return 3;
            case 'submitted': return 2;
            case 'draft': default: return 1;
        }
    }, [status]);

    const steps = [
        { title: 'Draft Created', date: 'Oct 20, 2023 • 10:00 AM', stepIdx: 1 },
        { title: 'Submitted for Review', date: 'Pending Adviser Action', stepIdx: 2 },
        { title: 'Department Approval', date: 'Waiting for Step 2', stepIdx: 3 },
        { title: 'Presentation Verified', date: '--', stepIdx: 4 },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333]">
            <Head title="Public Presentation" />

            <NavBar user={auth?.user} />

            <div className="bg-[#FFF8DC] border-b border-[#e0d0b0] px-[5%] py-4 flex justify-between items-center">
                <h2 className="text-[#800000] text-xl font-bold flex items-center gap-2">
                    🎤 Public Presentation
                </h2>
                <span className="text-xs bg-[#800000] text-white px-3 py-1.5 rounded-full font-medium">
                    Logged in as {auth?.user?.role_in_group}
                </span>
            </div>

            <div className="max-w-[1440px] mx-auto my-10 px-10 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

                {/* === LEFT ASIDE (Sticky) === */}
                <aside className="sticky top-6 space-y-6">
                    
                    {/* CARD: Approval Status (Dynamic Timeline) */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#eaeaea] overflow-hidden">
                        <div className="bg-[#800000] text-white px-6 py-4 font-semibold tracking-wide">
                            Approval Status
                        </div>
                        <div className="p-6">
                            <div className="relative pl-5 mt-2 space-y-0 before:absolute before:left-0 before:top-[5px] before:bottom-0 before:w-0.5 before:bg-[#eee]">
                                
                                {steps.map((step, index) => {
                                    // Determine state: completed (green), active (yellow), or inactive (gray)
                                    let circleClass = "bg-[#e0e0e0] border-[#ddd] shadow-[#ddd]"; // Inactive default
                                    if (currentStepIndex > step.stepIdx) {
                                        circleClass = "bg-[#198754] border-white shadow-[#198754]"; // Completed
                                    } else if (currentStepIndex === step.stepIdx) {
                                        circleClass = "bg-[#ffc107] border-white shadow-[#ffc107]"; // Active
                                    }

                                    return (
                                        <div key={index} className={`relative pl-6 ${index !== steps.length - 1 ? 'pb-8' : ''}`}>
                                            <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-[3px] shadow-[0_0_0_1px] ${circleClass}`}></div>
                                            <div className="text-[0.95rem] font-bold text-[#333]">{step.title}</div>
                                            <div className="text-xs text-[#666] mt-0.5">{step.date}</div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>

                    {/* CARD: Requirements Checklist (Dynamic) */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#eaeaea] overflow-hidden">
                        <div className="bg-[#800000] text-white px-6 py-4 font-semibold tracking-wide">
                            Requirements Checklist
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {/* Checklist Item 1 */}
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg ${isEventDetailsFilled ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isEventDetailsFilled ? '✔' : '○'}
                                    </span> 
                                    Event Details Filled
                                </li>
                                {/* Checklist Item 2 */}
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg ${isMaterialsUploaded ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isMaterialsUploaded ? '✔' : '○'}
                                    </span>
                                    Slides Uploaded
                                </li>
                                {/* Checklist Item 3 */}
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg ${isCertificateUploaded ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isCertificateUploaded ? '✔' : '○'}
                                    </span>
                                    Certificate of Attendance
                                </li>
                                {/* Checklist Item 4 */}
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg ${isProofUploaded ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isProofUploaded ? '✔' : '○'}
                                    </span>
                                    Photo Evidence
                                </li>
                            </ul>
                            <hr className="my-4 border-t border-[#eee]" />
                            <div className="text-[0.85rem] text-[#666] italic">
                                Note: Once all items are checked, the "Verified" status will unlock.
                            </div>
                        </div>
                    </div>

                </aside>

                {/* === MAIN CONTENT === */}
                <main className="space-y-6">

                    {/* CARD: Registration Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#eaeaea] overflow-hidden">
                        <div className="bg-[#800000] text-white px-6 py-4 font-semibold tracking-wide">
                            Registration & Submission
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-[1.1rem] font-bold text-[#800000] mb-4">1. Event Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2 text-[#444]">Thesis / Project Title</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-[#ccc] rounded-md bg-[#f4f4f4] text-[#777] text-[0.95rem]" 
                                            value={data.title} 
                                            disabled 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#444]">Event / Conference Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors" 
                                            placeholder="e.g. 5th ICPEP Regional Convention"
                                            value={data.event_name}
                                            onChange={e => setData('event_name', e.target.value)}
                                            disabled={!isLeader}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#444]">Venue / Platform</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors" 
                                            placeholder="e.g. Zoom or SMX Convention Center"
                                            value={data.venue}
                                            onChange={e => setData('venue', e.target.value)}
                                            disabled={!isLeader}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#444]">Date of Presentation</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors"
                                            value={data.event_date}
                                            onChange={e => setData('event_date', e.target.value)}
                                            disabled={!isLeader}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-[#444]">Type of Engagement</label>
                                        <select 
                                            className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors bg-white"
                                            value={data.engagement_type}
                                            onChange={e => setData('engagement_type', e.target.value)}
                                            disabled={!isLeader}
                                        >
                                            <option>Research Colloquium</option>
                                            <option>Conference Presentation</option>
                                            <option>Seminar Speaker</option>
                                            <option>Poster Presentation</option>
                                        </select>
                                    </div>
                                </div>

                                {/* --- UPLOAD SECTION 1: MATERIALS --- */}
                                <div className="mt-8 pt-6 border-t border-dashed border-[#ddd]">
                                    <h3 className="text-[1.1rem] font-bold text-[#800000] mb-4">2. Presentation Materials (Pre-Event)</h3>
                                    
                                    <FileUpload 
                                        value={data.materials_file}
                                        onChange={(file) => setData('materials_file', file)}
                                        accept=".pdf,.ppt,.pptx"
                                        disabled={!isLeader}
                                        label="Click to Upload Slides (PPT/PDF)"
                                        className="bg-[#fafafa] hover:bg-[#fffcf5] border-2 border-dashed border-[#ccc] hover:border-[#800000]"
                                    />
                                    <p className="text-[0.85rem] text-[#999] mt-2 text-center">Required for Adviser review before the event</p>
                                    
                                    {/* Hardcoded visual per request, but checks state logic */}
                                    {!data.materials_file && (
                                        <div className="mt-4 bg-[#f0fdf4] p-2.5 rounded border border-[#bbf7d0] flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <Paperclip className="w-4 h-4 text-[#666]" />
                                                <strong className="text-sm">Hydroponics_Final_Slides.pptx</strong>
                                                <span className="text-[0.8rem] text-[#666]">(5.2 MB)</span>
                                            </div>
                                            <span className="text-[#198754] font-bold text-[0.9rem]">Uploaded ✔</span>
                                        </div>
                                    )}
                                </div>

                                {/* --- UPLOAD SECTION 2: PROOF --- */}
                                <div className="mt-8 pt-6 border-t border-dashed border-[#ddd]">
                                    <h3 className="text-[1.1rem] font-bold text-[#800000] mb-4">3. Proof of Completion (Post-Event)</h3>
                                    
                                    <FileUpload 
                                        value={data.proof_file}
                                        onChange={(file) => setData('proof_file', file)}
                                        accept=".pdf,.jpg,.png"
                                        disabled={!isLeader}
                                        label="Upload Certificate / Photos"
                                        className="bg-[#fafafa] hover:bg-[#fffcf5] border-2 border-dashed border-[#ccc] hover:border-[#800000]"
                                    />
                                    <p className="text-[0.85rem] text-[#999] mt-2 text-center">Upload this after the event to complete the requirement</p>
                                </div>

                                <div className="mt-8 overflow-hidden">
                                    {isLeader ? (
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="float-right bg-[#800000] hover:bg-[#600000] text-white px-10 py-3.5 rounded-md font-bold text-[1rem] transition-colors disabled:opacity-50"
                                        >
                                            {processing ? "Saving..." : "Save & Submit Registration"}
                                        </button>
                                    ) : (
                                        <button disabled className="float-right bg-gray-400 text-white px-10 py-3.5 rounded-md font-bold text-[1rem] cursor-not-allowed">
                                            View Only
                                        </button>
                                    )}
                                </div>

                            </form>
                        </div>
                    </div>

                    {/* CARD: Audit Trail Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#eaeaea] overflow-hidden">
                        <div className="bg-[#800000] text-white px-6 py-4 font-semibold tracking-wide">
                            Audit Trail
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left border-collapse text-[0.9rem]">
                                <thead>
                                    <tr>
                                        <th className="p-4 bg-[#f8f8f8] border-b-2 border-[#ddd] text-[#555] font-semibold">Date/Time</th>
                                        <th className="p-4 bg-[#f8f8f8] border-b-2 border-[#ddd] text-[#555] font-semibold">User</th>
                                        <th className="p-4 bg-[#f8f8f8] border-b-2 border-[#ddd] text-[#555] font-semibold">Action</th>
                                        <th className="p-4 bg-[#f8f8f8] border-b-2 border-[#ddd] text-[#555] font-semibold">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="border-b border-[#eee] last:border-0 hover:bg-gray-50">
                                            <td className="p-4 text-[#333] whitespace-nowrap">{log.date}</td>
                                            <td className="p-4 text-[#333] font-semibold">
                                                {log.user} ({log.role})
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-[10px] text-[0.8rem] ${
                                                    log.type === 'created' ? 'bg-[#e7f1ff] text-[#0d6efd]' :
                                                    log.type === 'uploaded' ? 'bg-[#d1e7dd] text-[#198754]' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[#666] italic">{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>

            </div>
            
            <Footer />
        </div>
    );
}