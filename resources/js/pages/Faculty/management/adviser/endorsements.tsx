import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { endorsement } from '@/routes/faculty/management/adviser';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { Eye, CheckCircle, Layers, X, AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';
import DocumentPreview from '@/components/document-preview';

interface PanelMember {
    id: string;
    name: string;
    role: 'P1' | 'P2' | 'P3';
}

interface Proposal {
    id: string;
    title: string;
    groupCode: string;
    proponents: string[];
    block: string;
    adviser: string;
    approvalDate: string;
    panelMembers: PanelMember[];
    status: 'Endorsed';
    manuscriptUrl?: string;
}

const mockProposals: Proposal[] = Array(6).fill({
    id: '1',
    title: 'Cloud-Based Hospital Management System',
    groupCode: '[GROUP CODE e.g 2101]',
    proponents: ['William Brown', 'Amelia Wilson', 'Benjamin Lee'],
    block: 'BSCpE 3-3',
    adviser: 'Prof. James Lee',
    approvalDate: '12/5/2025',
    status: 'Endorsed',
    manuscriptUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf1.pdf',
    panelMembers: [
        { id: 'p1', role: 'P1', name: 'Dr. Robert Chen' },
        { id: 'p2', role: 'P2', name: 'Dr. Sofia Smith' },
        { id: 'p3', role: 'P3', name: 'Engr. John Johnson' },
    ],
}).map((item, index) => ({ ...item, id: index.toString() }));

const EndorsementCard = ({ data }: { data: Proposal }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showEndorseModal, setShowEndorseModal] = useState(false);
    const [remarks, setRemarks] = useState('');

    const handleEndorseSubmit = () => {
        console.log("Endorsing:", data.id, "Remarks:", remarks);
        setShowEndorseModal(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-sidebar dark:border-sidebar-border rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
            
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1">
                            {data.title}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase font-medium">
                            {data.groupCode}
                        </p>
                    </div>
                    
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {data.status}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="text-[10px] text-gray-500 mb-0.5">Proponents</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {data.proponents.join(', ')}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                        <p className="text-[10px] text-gray-500">Block</p>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{data.block}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500">Adviser</p>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{data.adviser}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500">Approval Date</p>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{data.approvalDate}</p>
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    <p className="text-[10px] text-gray-500 mb-2">Panel Members</p>
                    <div className="space-y-2">
                        {data.panelMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-2">
                                <div className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold
                                    ${member.role === 'P1' ? 'bg-[#C2410C]' : ''} 
                                    ${member.role === 'P2' ? 'bg-[#CD5C5C]' : ''}
                                    ${member.role === 'P3' ? 'bg-[#A0522D]' : ''}
                                `}>
                                    {member.role}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={() => setShowPreview(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded hover:bg-breadcrumb dark:hover:bg-gray-800 transition-colors">
                        <Eye size={14} /> 
                        View Manuscript
                    </button>
                    <button 
                        onClick={() => setShowEndorseModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded hover:bg-breadcrumb dark:hover:bg-gray-800 transition-colors">
                        <CheckCircle size={14} />
                        Endorse
                    </button>
                </div>
            </div>

            {showPreview && (
                <div 
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">{data.title}</h2>
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <DocumentPreview 
                                documentTitle={data.title}
                                documentUrl={data.manuscriptUrl}
                                showDownloadButton={true}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showEndorseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="bg-[#7e1416] text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Send className="w-5 h-5 -rotate-45" />
                                <h2 className="text-lg font-medium tracking-wide">Endorse Proposal for Defense</h2>
                            </div>
                            <button 
                                onClick={() => setShowEndorseModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 leading-snug">
                                {data.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Students:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{data.proponents.join(', ')}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className="w-20 text-gray-500">Adviser:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{data.adviser}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Block:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{data.block}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className="w-20 text-gray-500">Approval Date:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{data.approvalDate}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Assigned Panel Members</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.panelMembers.map((member) => (
                                        <div key={member.id} className="flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm">
                                            {member.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-900 mb-1">Endorsement Confirmation</h4>
                                    <p className="text-xs text-amber-800 mb-2">By endorsing this proposal, you confirm that:</p>
                                    <ul className="list-none space-y-1">
                                        {['All panel members have been properly assigned', 'The proposal meets defense requirements', 'The panel is ready to schedule the defense'].map((item, idx) => (
                                            <li key={idx} className="text-xs text-amber-800 flex items-start gap-1.5 font-medium">
                                                <span className="text-amber-600">›</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Remarks / Justification
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Text field input..."
                                    className="w-full min-h-[80px] p-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEndorseModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-breadcrumb focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndorseSubmit}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-breadcrumb focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                <CheckCircle size={16} />
                                Submit Endorsement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Endorsements',
        href: endorsement().url,
    },
];

export default function Dashboard() {
    return (
        <FacultyManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Panel Endorsement" 
            description="Endorse approved proposals/theses of your advisory class for formal review"
        >
            <Head title="Endorsements" />
            <div className="border-t-2 border-[#7e1416] my-4"></div>

            <div className="p-4 font-dm">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockProposals.map((proposal) => (
                        <EndorsementCard key={proposal.id} data={proposal} />
                    ))}
                </div>
            </div>

        </FacultyManagementLayout>
    );
}