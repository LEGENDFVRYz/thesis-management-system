import React, { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Paperclip, Clock, ListChecks, Users, CloudUpload } from 'lucide-react';

// --- GLOBAL COMPONENTS ---
import { AppHeader } from '@/components/app-header';
import { NavFooter } from '@/components/nav-footer';
import { FileUpload } from '@/components/file-upload'; 
import { BreadcrumbItem, PageHeaderProps } from '@/types';
import StudentManagementLayout from '..';
import { ip } from '@/routes/student/management/compliance';


// Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Public presentation", 
        href: ip().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Public presentation",
    subtitle: "Register and submit proof of public presentation",
    icon: (
        // pa correct nalang
        <Users className="w-8 h-8 fill-current" />
    ),
};



// --- TYPES ---
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
    thesis: {
        title: string;
        id: number;
    };
    audit_trail?: AuditLog[];
    status?: 'draft' | 'submitted' | 'approved' | 'verified'; 
}

export default function PublicPresentation({ auth, thesis, audit_trail = [], status = 'draft' }: PageProps) {
    const isLeader = auth?.user?.role_in_group === 'Leader';

    // Fallback mock data if DB is empty
    const logs: AuditLog[] = audit_trail.length > 0 ? audit_trail : [
        { id: 1, date: 'Oct 20, 2023 • 10:00 AM', user: 'System', role: 'Admin', action: 'Initialized', details: 'Form ready for submission', type: 'created' },
    ];

    // --- FORM HANDLER ---
    const { data, setData, post, processing, errors } = useForm({
        title: thesis?.title || '', // Dynamic Title from Database
        event_name: '',
        venue: '',
        event_date: '',
        engagement_type: 'Conference Presentation',
        materials_file: null as File | null,
        proof_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('public-presentation.store'), {
            preserveScroll: true,
            forceFormData: true, 
            onSuccess: () => {
                console.log("Submitted successfully");
            }
        });
    };

    // --- UI LOGIC ---
    const isEventDetailsFilled = !!(data.event_name && data.venue && data.event_date);
    const isMaterialsUploaded = !!data.materials_file;
    const isProofUploaded = !!data.proof_file;
    const isCertificateUploaded = status === 'verified'; 

    const currentStepIndex = useMemo(() => {
        switch(status) {
            case 'verified': return 4;
            case 'approved': return 3;
            case 'submitted': return 2;
            case 'draft': default: return 1;
        }
    }, [status]);

    const steps = [
        { title: 'Draft Created', date: logs.find(l => l.type === 'created')?.date || '--', stepIdx: 1 },
        { title: 'Submitted for Review', date: status !== 'draft' ? 'Done' : 'Pending', stepIdx: 2 },
        { title: 'Department Approval', date: status === 'approved' || status === 'verified' ? 'Approved' : 'Pending', stepIdx: 3 },
        { title: 'Presentation Verified', date: status === 'verified' ? 'Verified' : '--', stepIdx: 4 },
    ];

    return (
        <StudentManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >

            <Head title="Public Presentation" />

            {/* === NEW DESIGN HEADER === */}
            
            {/* <div className="w-full bg-white border-b-[3px] border-[#dca5a5] px-6 py-6 md:px-10">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="text-[#6d2929]">
                            
                        </div>
                        <h1 className="text-3xl font-bold text-[#fbbf24] tracking-tight">
                            Public presentation
                        </h1>
                    </div>

                    <p className="text-[#6d2929] mt-2 text-sm font-medium">
                        Register and submit proof of public presentation
                    </p>
                </div>
            </div> */}

            {/* === CONTENT WRAPPER === */}
            <div className="max-w-[1440px] mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

                {/* === LEFT ASIDE (Sticky) === */}
                <aside className="sticky top-0 space-y-6 order-2 lg:order-1">
                    
                    {/* CARD: Approval Status */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-[#800000] overflow-hidden">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-semibold tracking-wide flex items-center gap-2">
                            <Clock className="w-4 h-4 opacity-80" />
                            Approval Status
                        </div>
                        <div className="p-6">
                            <div className="relative pl-5 mt-2 space-y-0 before:absolute before:left-0 before:top-[5px] before:bottom-0 before:w-0.5 before:bg-[#eee]">
                                {steps.map((step, index) => {
                                    let circleClass = "bg-[#e0e0e0] border-[#ddd] shadow-[#ddd]";
                                    if (currentStepIndex > step.stepIdx) {
                                        circleClass = "bg-[#198754] border-white shadow-[#198754]";
                                    } else if (currentStepIndex === step.stepIdx) {
                                        circleClass = "bg-[#ffc107] border-white shadow-[#ffc107]";
                                    }

                                    return (
                                        <div key={index} className={`relative pl-6 ${index !== steps.length - 1 ? 'pb-8' : ''}`}>
                                            <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-[3px] shadow-[0_0_0_1px] ${circleClass} transition-all`}></div>
                                            <div className="text-[0.95rem] font-bold text-[#333]">{step.title}</div>
                                            <div className="text-xs text-[#666] mt-0.5">{step.date}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CARD: Requirements Checklist */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-[#800000] overflow-hidden">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-semibold tracking-wide flex items-center gap-2">
                            <ListChecks className="w-4 h-4 opacity-80" />
                            Requirements
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg transition-colors ${isEventDetailsFilled ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isEventDetailsFilled ? '✔' : '○'}
                                    </span> 
                                    Event Details Filled
                                </li>
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg transition-colors ${isMaterialsUploaded ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isMaterialsUploaded ? '✔' : '○'}
                                    </span>
                                    Slides Uploaded
                                </li>
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg transition-colors ${isCertificateUploaded ? 'text-[#198754]' : 'text-[#ccc]'}`}>
                                        {isCertificateUploaded ? '✔' : '○'}
                                    </span>
                                    Certificate of Attendance
                                </li>
                                <li className="flex gap-3 items-center text-[0.95rem]">
                                    <span className={`font-bold text-lg transition-colors ${isProofUploaded ? 'text-[#198754]' : 'text-[#ccc]'}`}>
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
                <main className="space-y-6 order-1 lg:order-2">

                    {/* CARD: Registration Form */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-[#800000] overflow-hidden">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-semibold tracking-wide">
                            Registration & Submission
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <h3 className="text-[1.1rem] font-bold text-[#800000] mb-4 border-b pb-2">1. Event Details</h3>

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
                                            {errors.event_name && <div className="text-red-600 text-xs mt-1">{errors.event_name}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-[#444]">Venue / Platform</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors" 
                                                placeholder="e.g. Zoom or SMX"
                                                value={data.venue}
                                                onChange={e => setData('venue', e.target.value)}
                                                disabled={!isLeader}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-[#444]">Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors"
                                                value={data.event_date}
                                                onChange={e => setData('event_date', e.target.value)}
                                                disabled={!isLeader}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-[#444]">Type</label>
                                            <select 
                                                className="w-full p-3 border border-[#ccc] rounded-md text-[0.95rem] focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-colors bg-white"
                                                value={data.engagement_type}
                                                onChange={e => setData('engagement_type', e.target.value)}
                                                disabled={!isLeader}
                                            >
                                                <option>Conference Presentation</option>
                                                <option>Research Colloquium</option>
                                                <option>Seminar Speaker</option>
                                                <option>Poster Presentation</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* --- UPLOAD SECTION 1: MATERIALS --- */}
                                    <div className="mt-8 pt-6 border-t border-dashed border-[#ddd]">
                                        <h3 className="text-[1.1rem] font-bold text-[#800000] mb-4">2. Presentation Materials (Pre-Event)</h3>

                                        <FileUpload
                                            onFileSelect={(files) => {
                                                if (files.length > 0 && isLeader) {
                                                    setData('materials_file', files[0]);
                                                }
                                            }}
                                            onError={(error) => console.error('Upload error:', error)}
                                            acceptedFileTypes={['.pdf', '.ppt', '.pptx']}
                                            maxSizeMB={50}
                                            multiple={false}
                                        />
                                        <p className="text-[0.85rem] text-[#999] mt-2 text-center">Required for Adviser review before the event</p>

                                        {/* Uploaded State */}
                                        {data.materials_file && (
                                            <div className="mt-4 bg-[#f0fdf4] p-2.5 rounded border border-[#bbf7d0] flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <Paperclip className="w-4 h-4 text-[#666]" />
                                                    <strong className="text-sm">{data.materials_file.name || 'Uploaded File'}</strong>
                                                </div>
                                                <span className="text-[#198754] font-bold text-[0.9rem]">Uploaded ✔</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- UPLOAD SECTION 2: PROOF --- */}
                                    <div className="mt-8 pt-6 border-t border-dashed border-[#ddd]">
                                        <h3 className="text-[1.1rem] font-bold text-[#800000] mb-4">3. Proof of Completion (Post-Event)</h3>

                                        <FileUpload
                                            onFileSelect={(files) => {
                                                if (files.length > 0 && isLeader) {
                                                    setData('proof_file', files[0]);
                                                }
                                            }}
                                            onError={(error) => console.error('Upload error:', error)}
                                            acceptedFileTypes={['.pdf', '.jpg', '.png']}
                                            maxSizeMB={20}
                                            multiple={false}
                                        />
                                        <p className="text-[0.85rem] text-[#999] mt-2 text-center">Upload this after the event to complete the requirement</p>

                                        {/* Uploaded State */}
                                        {data.proof_file && (
                                            <div className="mt-4 bg-[#f0fdf4] p-2.5 rounded border border-[#bbf7d0] flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <Paperclip className="w-4 h-4 text-[#666]" />
                                                    <strong className="text-sm">{data.proof_file.name || 'Uploaded File'}</strong>
                                                </div>
                                                <span className="text-[#198754] font-bold text-[0.9rem]">Uploaded ✔</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 overflow-hidden">
                                        {isLeader ? (
                                            <button 
                                                type="submit" 
                                                disabled={processing}
                                                className="float-right bg-[#800000] hover:bg-[#600000] text-white px-10 py-3.5 rounded-md font-bold text-[1rem] transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {processing ? "Saving..." : "Save & Submit Registration"}
                                            </button>
                                        ) : (
                                            <button disabled className="float-right bg-gray-400 text-white px-10 py-3.5 rounded-md font-bold text-[1rem] cursor-not-allowed">
                                                View Only
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* CARD: Audit Trail Table */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-[#800000] overflow-hidden">
                        <div className="bg-[#800000] text-[#FFD700] px-6 py-4 font-semibold tracking-wide">
                            Audit Trail
                        </div>
                        <div className="overflow-x-auto">
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

            {/* <NavFooter /> */}

        </StudentManagementLayout>
    );
}