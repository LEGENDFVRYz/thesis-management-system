import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { eval_n_grading } from '@/routes/faculty/management/adviser';
import StageSwitchToggle from '@/components/stage-toggle';
import { NavFooter } from '@/components/nav-footer';
import { 
    ArrowUpDown, 
    Trash2, 
    Users, 
    FilePenLine,
    ChevronLeft,
    Download,
    FileText,
    Save, 
    Send,
    Calendar,
    Search,
    X,
    Clock,
    MapPin,
    GraduationCap,
    Upload,
    NotebookPen,
    Filter,
    Pencil,
    File 
} from 'lucide-react';


type Stage = 'mor' | 'dp1' | 'dp2';


const mockGroups = [
    { code: '3301', title: 'Machine Learning Applications in Healthcare Diagnostics', proponents: 4, status: 'Complete', count: '3/3', id: 1 },
    { code: '3302', title: 'Machine Learning Something with...', proponents: 4, status: 'In Progress', count: '2/3', id: 2 },
    { code: '3303', title: 'Machine Learning Something with...', proponents: 4, status: 'Not Yet Started', count: '0/3', id: 3 },
    { code: '3304', title: 'Machine Learning Something with...', proponents: 5, status: 'In Progress', count: '2/3', id: 4 },
    { code: '3305', title: 'Machine Learning Something with...', proponents: 4, status: 'Complete', count: '3/3', id: 5 },
    { code: '3306', title: 'Machine Learning Something with...', proponents: 4, status: 'In Progress', count: '2/3', id: 6 },
    { code: '3307', title: 'Machine Learning Something with...', proponents: 4, status: 'Complete', count: '3/3', id: 7 },
    { code: '3308', title: 'Machine Learning Something with...', proponents: 4, status: 'Complete', count: '3/3', id: 8 },
    { code: '3309', title: 'Machine Learning Something with...', proponents: 4, status: 'Complete', count: '3/3', id: 9 },
    { code: '3310', title: 'Machine Learning Something with...', proponents: 4, status: 'Complete', count: '3/3', id: 10 },
];

const rubricFiles = [
    { id: 1, name: 'MOR_Rubrics_AY2526', year: '2025-2026', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 2, name: 'MOR_Rubrics_AY2426', year: '2024-2025', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 3, name: 'MOR_Rubrics_AY2526', year: '2025-2026', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 4, name: 'MOR_Rubrics_AY2426', year: '2024-2025', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 5, name: 'MOR_Rubrics_AY2526', year: '2025-2026', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 6, name: 'MOR_Rubrics_AY2426', year: '2024-2025', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 7, name: 'MOR_Rubrics_AY2526', year: '2025-2026', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 8, name: 'MOR_Rubrics_AY2426', year: '2024-2025', date: 'November 28, 2025', time: '09:00 AM' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Evaluation and Grading', href: eval_n_grading().url },
    { title: 'Grade Input', href: '#' },
];

const rubricSections = [
    {
        id: 1,
        title: "Rubric No. 1 (20%)",
        description: "Conduct investigations of complex engineering problems using research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions.",
        indicators: [
            { name: "Problem Understanding", desc1: "Demonstrates limited understanding of the problem or lacks awareness of key factors and background.", desc2: "Partially understands the problem but may have gaps in knowledge or limited awareness of key factors and background.", desc3: "Demonstrates a good understanding of problems. Identifies key factors and background.", desc4: "Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background." },
            { name: "Research Design", desc1: "Design analysis with inconsistency. Lacks attention to variables and controls.", desc2: "Design analysis with some consistency but with gaps. Includes key variables and controls.", desc3: "Design analysis with clear purpose, correct variables, and controls. Ensures the method is valid and reliable.", desc4: "Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details." },
            { name: "Data Collection and Analysis", desc1: "Collects and analyzes data with limited accuracy. Fails to use appropriate tools or techniques.", desc2: "Collects and analyzes data with some accuracy but with lack of consistency. Uses appropriate tools and techniques.", desc3: "Collects and analyzes data accurately. Uses appropriate tools and techniques effectively.", desc4: "Collects and analyzes data thoroughly, ensuring accuracy. Display exceptional use of advanced tools and techniques." },
        ]
    },
];

const DefenseDetailsModal = ({ group, onClose, onEdit }: { group: any, onClose: () => void, onEdit: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-in zoom-in-95 duration-200">

                <div className="flex justify-between items-start p-8 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Defense Details</h2>
                        <p className="text-gray-500 text-sm">Complete information about the thesis defense</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onEdit}
                            className="bg-[#700000] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#900000] transition-colors"
                        >
                            <FilePenLine className="w-4 h-4" />
                            Edit Evaluation
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6" />

                <div className="px-8 pb-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-[#900000] text-sm font-bold mb-1">Defense ID</h3>
                            <p className="text-gray-900 font-bold text-xl">{group.code}</p>
                        </div>
                        {group.status === 'Complete' && (
                            <span className="bg-[#1D6F42] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                Graded
                            </span>
                        )}
                    </div>

                    <div>
                        <h3 className="text-[#900000] text-sm font-bold mb-1">Thesis Title</h3>
                        <p className="text-gray-900 font-bold text-lg leading-snug">{group.title}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                        <div>
                            <h3 className="text-[#900000] text-sm font-bold mb-1">Date of Defense</h3>
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                11/25/2025
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[#900000] text-sm font-bold mb-1">Time</h3>
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <Clock className="w-4 h-4 text-gray-400" />
                                09:00 AM
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[#900000] text-sm font-bold mb-1">Venue</h3>
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Room 313, CEA
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[#900000] text-sm font-bold mb-1">Block</h3>
                            <span className="inline-block bg-white border border-gray-200 px-3 py-1 rounded text-sm font-bold text-gray-700">
                                BSCPE 3-3
                            </span>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-[#900000] text-sm font-bold mb-1">Thesis Adviser</h3>
                            <p className="text-gray-800 font-medium">Dr. Maria Santos</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[#900000] text-sm font-bold mb-3">Proponents</h3>
                        <div className="flex flex-wrap gap-2">
                            {['John Doe', 'Jane Smith', 'Mike Johnson', 'John Doe'].map((name, i) => (
                                <span key={i} className="bg-[#F5ECD5] text-[#700000] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                                    <Users className="w-3 h-3" />
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[#900000] text-sm font-bold mb-3">Defense Panel</h3>
                        <div className="space-y-2">
                            <div className="bg-[#FAFAFA] rounded-lg p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#BC8585] text-white flex items-center justify-center font-bold text-xs shadow-sm">P1</div>
                                <span className="font-bold text-gray-800">Dr. Robert Chen</span>
                            </div>
                            <div className="bg-[#FAFAFA] rounded-lg p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#BC8585] text-white flex items-center justify-center font-bold text-xs shadow-sm">P2</div>
                                <span className="font-bold text-gray-800">Dr. Sofia Smith</span>
                            </div>
                            <div className="bg-[#FAFAFA] rounded-lg p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#BC8585] text-white flex items-center justify-center font-bold text-xs shadow-sm">P3</div>
                                <span className="font-bold text-gray-800">Engr. John Johnson</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RubricsManagementView = ({ onBack }: { onBack: () => void }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('MOR');

    return (
        <FacultyManagementLayout breadcrumbs={[...breadcrumbs, { title: 'Rubrics and Guidelines', href: '#' }]} title="" description="">
            <Head title="Rubrics and Guidelines" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
                .dm-sans { font-family: "DM Sans", sans-serif; }
            `}</style>
            
            <div className="dm-sans w-full max-w-[1600px] mx-auto pb-12">
                
                <div className="flex flex-col space-y-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-4">
                            <NotebookPen className="w-8 h-8 text-amber-500 mt-1" />
                            <div>
                                <h1 className="text-2xl font-bold text-amber-500">Rubrics and Guidelines</h1>
                                <p className="text-[#900000] font-medium">Upload and manage scoring rubrics and grading criteria</p>
                            </div>
                        </div>

                        <div className="bg-[#F5ECD5] rounded-full p-1 inline-flex items-center shadow-sm border border-[#E0D0A0]">
                            {['MOR', 'DP1', 'DP2'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        activeTab === tab 
                                        ? 'bg-[#700000] text-white shadow-sm' 
                                        : 'text-[#700000] hover:bg-[#700000]/10'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#900000]/30" />

                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-700 ml-1">Search</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Keywords, Terms..." 
                                        className="w-full px-4 py-2.5 rounded-lg border border-[#E0D0A0] bg-[#F5ECD5] text-sm focus:outline-none focus:ring-1 focus:ring-[#700000] text-gray-700 placeholder:text-gray-400"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-700 ml-1">Academic Year</label>
                                <div className="relative">
                                    <select className="w-full px-4 py-2.5 rounded-lg border border-[#E0D0A0] bg-[#F5ECD5] text-sm focus:outline-none text-[#900000] font-bold cursor-pointer appearance-none">
                                        <option>2024 - 2025</option>
                                        <option>2025 - 2026</option>
                                    </select>
                                    <Calendar className="w-4 h-4 text-[#900000] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-700 ml-1">Sort By</label>
                                <div className="relative">
                                    <select className="w-full px-4 py-2.5 rounded-lg border border-[#E0D0A0] bg-[#F5ECD5] text-sm focus:outline-none text-gray-600 cursor-pointer appearance-none">
                                        <option>Sort by Date Added</option>
                                        <option>Sort by Name</option>
                                    </select>
                                    <Filter className="w-4 h-4 text-[#900000] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <button className="h-[42px] px-6 rounded-lg bg-[#900000] text-white hover:bg-[#700000] flex items-center gap-2 text-xs font-bold whitespace-nowrap shadow-sm transition-colors mb-[1px]">
                            <Trash2 className="h-4 w-4" />
                            Clear Filter
                        </button>
                    </div>
                    
                    <div className="flex justify-end">
                        <button className="bg-[#700000] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#900000] shadow-sm transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload Document
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <div className="lg:col-span-2 border border-[#900000]/20 rounded-xl overflow-hidden shadow-sm bg-white">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#700000] text-white">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-xs">Name</th>
                                        <th className="px-4 py-3 font-medium text-xs text-center">Academic Year</th>
                                        <th className="px-4 py-3 font-medium text-xs text-center">Date Added</th>
                                        <th className="px-4 py-3 font-medium text-xs text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rubricFiles.map((file, idx) => (
                                        <tr key={file.id} className={`hover:bg-[#F5ECD5]/50 transition-colors ${idx === 0 ? 'bg-[#F5ECD5]/50' : ''}`}>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-4 h-4 text-[#900000]" />
                                                    <span className="font-bold text-gray-800 text-xs">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs font-medium text-gray-600">{file.year}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col text-[10px] leading-tight text-gray-600 font-medium">
                                                    <span>{file.date}</span>
                                                    <span>{file.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 border border-slate-200"><Download className="w-4 h-4" /></button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 border border-slate-200"><Pencil className="w-4 h-4" /></button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 border border-slate-200"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-[#FFFDF9] border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col h-[600px]">
                            <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
                                <h3 className="text-[#900000] text-sm font-bold">Document Preview</h3>
                                <button className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                            </div>
                            
                            <div className="flex justify-end gap-2 mb-4">
                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 border border-slate-200"><Download className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 border border-slate-200"><Pencil className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 border border-slate-200"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="flex-1 bg-gray-50/50 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400">
                                <File className="w-12 h-12 mb-3 text-gray-300" />
                                <span className="text-xs font-bold text-gray-400">Document Preview Area</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-6 left-6">
                 <button onClick={onBack} className="flex items-center text-[#900000] font-bold hover:underline gap-1 transition-all bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Grading
                </button>
            </div>
            
        </FacultyManagementLayout>
    );
};


const DocumentReviewView = ({ group, onBack }: { group: any, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'review' | 'evaluation'>('review');
    const [ratings, setRatings] = useState<Record<string, number>>({});

    const handleRatingChange = (sectionId: number, indicatorIndex: number, value: number) => {
        setRatings(prev => ({ ...prev, [`${sectionId}-${indicatorIndex}`]: value }));
    };

    return (
        <FacultyManagementLayout breadcrumbs={[...breadcrumbs, { title: 'Document Review', href: '#' }]} title="" description="">
            <Head title="Document Review" />
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
                .dm-sans { font-family: "DM Sans", sans-serif; }
            `}</style>

            <div className="dm-sans">
                <div className="mb-6">
                    <button onClick={onBack} className="flex items-center text-[#900000] font-bold hover:underline gap-1 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                        Return
                    </button>
                </div>

                <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-12">

                    <div className="flex flex-col space-y-0">
                        <div className="flex justify-between items-end mb-[-1px] z-20 px-1">
                            <h2 className="text-[#900000] text-lg font-bold">
                                {activeTab === 'review' ? 'Document Review' : 'Evaluation Form'}
                            </h2>
                            <div className="flex gap-0">
                                <button 
                                    onClick={() => setActiveTab('review')}
                                    className={`px-6 py-2.5 text-xs font-bold rounded-t-lg transition-all border-t border-l border-r border-transparent ${activeTab === 'review' ? 'bg-[#9b000a] text-[#FFBD00] shadow-none z-10' : 'bg-[#730000] text-[#FFBD00]/70 hover:bg-[#850000] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-0'}`}
                                >
                                    Document Review
                                </button>
                                <button 
                                    onClick={() => setActiveTab('evaluation')}
                                    className={`px-6 py-2.5 text-xs font-bold rounded-t-lg transition-all border-t border-l border-r border-transparent ${activeTab === 'evaluation' ? 'bg-[#9b000a] text-[#FFBD00] shadow-none z-10' : 'bg-[#730000] text-[#FFBD00]/70 hover:bg-[#850000] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-0'}`}
                                >
                                    Evaluation
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#FFFDF5] border border-stone-200 rounded-b-xl rounded-tl-xl p-8 shadow-sm relative z-10">
                            
                            <div className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-6 shadow-sm mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-[#900000] font-bold text-lg">Defense Details</h2>
                                        <p className="text-gray-500 text-xs mt-1">Complete information about the thesis defense</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-gray-500 mb-1 block">Defense ID</span>
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="font-mono font-bold text-gray-800">DEF-{group.code}</span>
                                            <span className="bg-green-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Completed</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <h3 className="text-[#900000] text-xs font-bold mb-1">Thesis Title</h3>
                                    <p className="font-bold text-gray-800 text-sm">{group.title}</p>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">

                                    <div className="md:col-span-7 grid grid-cols-3 gap-y-6 gap-x-4">
                                        <div className="col-span-1">
                                            <h3 className="text-[#900000] text-xs font-bold">Block</h3>
                                            <span className="text-gray-600 text-xs mt-1 inline-block bg-stone-100 px-2 py-0.5 rounded border border-stone-200">BSCPE 3-3</span>
                                        </div>
                                        <div className="col-span-1">
                                            <h3 className="text-[#900000] text-xs font-bold">Venue</h3>
                                            <p className="text-gray-600 text-xs mt-1">Room 313, CEA</p>
                                        </div>
                                        <div className="col-span-1">
                                            <h3 className="text-[#900000] text-xs font-bold">Time</h3>
                                            <p className="text-gray-600 text-xs mt-1">09:00 AM</p>
                                        </div>
                                        <div className="col-span-1">
                                            <h3 className="text-[#900000] text-xs font-bold">Thesis Adviser</h3>
                                            <p className="text-gray-600 text-xs mt-1">Dr. Maria Santos</p>
                                        </div>
                                        <div className="col-span-2">
                                            <h3 className="text-[#900000] text-xs font-bold">Date</h3>
                                            <p className="text-gray-600 text-xs mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> 11/25/2025</p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <h3 className="text-[#900000] text-xs font-bold">Proponents</h3>
                                        <div className="flex flex-col gap-2 mt-1">
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> John Doe</span>
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> Jane Smith</span>
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> Mike Johnson</span>
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> John Doe</span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-3">
                                        <h3 className="text-[#900000] text-xs font-bold">Defense Panel</h3>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-stone-100 shadow-sm">
                                                <span className="bg-[#BC8585] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">P1</span>
                                                <span className="text-gray-800 text-xs font-bold">Dr. Robert Chen</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-stone-100 shadow-sm">
                                                <span className="bg-[#BC8585] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">P2</span>
                                                <span className="text-gray-800 text-xs font-bold">Dr. Sofia Smith</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-stone-100 shadow-sm">
                                                <span className="bg-[#BC8585] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">P3</span>
                                                <span className="text-gray-800 text-xs font-bold">Engr. John Johnson</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeTab === 'review' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col h-[600px]">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-[#900000] text-xs font-bold">Document Preview</h3>
                                                <button className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded flex items-center gap-2 font-bold hover:bg-amber-200 transition">
                                                    <Download className="w-3 h-3" /> Download Full
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                                <FileText className="w-12 h-12 mb-2 opacity-50" />
                                                <span className="text-xs font-medium">Document Preview Area</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                                                <h3 className="text-[#900000] text-xs font-bold mb-4">Submitted Documents</h3>
                                                <div className="space-y-3">
                                                    {['Manuscript.pdf', 'Survey_Results.pdf', 'Source_Code.pdf'].map((file, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                            <FileText className="w-4 h-4 text-red-700" />
                                                            <span className="text-xs font-bold text-gray-800 truncate">{file}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* --- SIDEBAR COMMENTS WIDGET --- */}
                                            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm h-[320px] flex flex-col">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-[#900000] text-xs font-bold">Comments</h3>
                                                    <button className="flex items-center gap-1 text-[#900000] text-[10px] font-bold hover:underline">
                                                        <Clock className="w-3 h-3" /> History
                                                    </button>
                                                </div>
                                                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
                                                    No comments yet
                                                </div>
                                                <div className="mt-2">
                                                    <textarea 
                                                        className="w-full p-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#900000] resize-none mb-2" 
                                                        rows={3} 
                                                        placeholder="Add a comment or inline feedback..."
                                                    ></textarea>
                                                    <button className="w-full py-2 bg-[#F5ECD5] text-[#700000] rounded-lg text-xs font-bold hover:bg-[#ebe0c0] transition-colors flex items-center justify-center gap-2">
                                                        <FilePenLine className="w-3 h-3" />
                                                        Add Comment
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    
                                    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-[#900000] font-bold text-sm mb-3">Comments/Recommendations</h3>
                                        <textarea 
                                            className="w-full h-40 p-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#900000] resize-none" 
                                            placeholder="Enter your comments and recommendations here..."
                                        ></textarea>
                                        <div className="flex justify-end mt-4">
                                            <button className="bg-[#700000] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#900000] transition-colors">
                                                Submit Comment
                                            </button>
                                        </div>
                                    </div>
                                    
                                </div>
                            ) : (
                                <div className="space-y-12 animate-in fade-in duration-300">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                                        {[
                                            { id: 1, role: "P1", name: "Dr. Robert Chen", score: 3.8, decision: "Accepted", comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." },
                                            { id: 2, role: "P2", name: "Dr. Sofia Smith", score: 3.0, decision: "Accepted", comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." },
                                            { id: 3, role: "P3", name: "Engr. John Johnson", score: 2.2, decision: "Rejected", comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." }
                                        ].map((panelist) => (
                                            <div key={panelist.id} className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-6 shadow-sm">
                                                {/* Header */}
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                                                    <div className="w-8 h-8 rounded-full bg-[#BC8585] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                                        {panelist.role}
                                                    </div>
                                                    <span className="font-bold text-gray-800 text-sm">{panelist.name}</span>
                                                </div>

                                                {/* Scores */}
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h4 className="text-[#900000] text-xs font-bold mb-1">Total Score</h4>
                                                        <span className="text-lg font-bold text-gray-800">{panelist.score}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <h4 className="text-[#900000] text-xs font-bold mb-1">Evaluation Decision</h4>
                                                         <span className={`text-[10px] px-3 py-1 rounded-full font-bold text-white shadow-sm ${panelist.decision === 'Accepted' ? 'bg-[#1D6F42]' : 'bg-[#900000]'}`}>
                                                            {panelist.decision}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Comments */}
                                                <div>
                                                    <h4 className="text-[#900000] text-xs font-bold mb-2">Comments/Recommendations</h4>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        {panelist.comments}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* --- RUBRICS SINGLE CARD CONTAINER --- */}
                                    <div className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-8 shadow-sm mt-10">
                                            
                                        {rubricSections.map((rubric, idx) => (
                                            <div key={rubric.id} className="space-y-4">
                                                
                                                {/* --- CONDITIONAL BLACK SEPARATOR LINE --- */}
                                                {idx > 0 && (
                                                    <div className="w-full h-px bg-black my-10" />
                                                )}

                                                <div className="mb-2">
                                                    <h3 className="text-[#900000] font-bold text-md">{rubric.title}</h3>
                                                    <p className="text-xs text-gray-700 max-w-4xl leading-relaxed">{rubric.description}</p>
                                                </div>

                                                {/* RUBRIC TABLE */}
                                                <div className="border border-[#D4A3A3] rounded-xl overflow-hidden shadow-sm">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="text-center text-xs">
                                                                <th className="px-4 py-3 w-[20%] text-left font-bold bg-[#700000] text-white">
                                                                    Performance Indicator
                                                                </th>
                                                                <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold border-r border-[#E0D0A0]">1<br/>Insufficient</th>
                                                                <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold border-r border-[#E0D0A0]">2<br/>Developing</th>
                                                                <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold border-r border-[#E0D0A0]">3<br/>Proficient</th>
                                                                <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold">4<br/>Advanced</th>
                                                                <th className="px-2 py-3 w-[8%] bg-[#E5E5E5] text-gray-700 font-bold border-l border-gray-300">Rating</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-xs">
                                                            {rubric.indicators.map((indicator, i) => (
                                                                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-red-50/20 transition-colors">
                                                                    <td className="px-4 py-4 font-bold text-gray-800 border-r border-gray-100 bg-white align-middle">
                                                                        {indicator.name}
                                                                    </td>
                                                                    {[indicator.desc1, indicator.desc2, indicator.desc3, indicator.desc4].map((desc, ratingIdx) => (
                                                                        <td key={ratingIdx} className="px-4 py-4 text-gray-600 border-r border-gray-100 bg-white align-top">
                                                                            <div className="flex flex-col h-full justify-between gap-2">
                                                                                <span className="leading-snug">{desc}</span>
                                                                            </div>
                                                                        </td>
                                                                    ))}
                                                                    <td className="px-2 py-4 bg-gray-50 text-center border-l border-gray-200 align-middle">
                                                                        <div className="flex justify-center gap-2">
                                                                            {[1, 2, 3, 4].map((val) => (
                                                                                <div key={val} className="flex flex-col items-center">
                                                                                    <span className="text-[9px] font-bold text-gray-400 mb-1">{val}</span>
                                                                                    <div className="relative flex items-center justify-center">
                                                                                        <input 
                                                                                            type="radio" 
                                                                                            name={`rating-${rubric.id}-${i}`}
                                                                                            checked={ratings[`${rubric.id}-${i}`] === val}
                                                                                            onChange={() => handleRatingChange(rubric.id, i, val)}
                                                                                            className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#900000] checked:border-[6px] transition-all cursor-pointer bg-white"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-full h-px bg-gray-200 my-8" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-[#FDFCF6] border border-[#D4A3A3] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center">
                                            <span className="text-[#900000] font-bold text-sm mb-1">Total Score</span>
                                            <span className="text-4xl font-bold text-gray-800">3.0</span>
                                        </div>
                                        <div className="bg-[#FDFCF6] border border-[#D4A3A3] rounded-xl p-6 shadow-sm md:col-span-2">
                                            <h3 className="text-[#900000] font-bold text-sm mb-4">Evaluation Decision</h3>
                                            <div className="flex gap-8">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input type="radio" name="decision" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#900000] checked:border-[6px] transition-all" defaultChecked />
                                                    </div>
                                                    <span className="font-bold text-gray-700 group-hover:text-[#900000] transition-colors">Accepted</span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input type="radio" name="decision" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#900000] checked:border-[6px] transition-all" />
                                                    </div>
                                                    <span className="font-bold text-gray-700 group-hover:text-[#900000] transition-colors">Rejected</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#FDFCF6] border border-[#D4A3A3] rounded-xl p-6 shadow-sm">
                                        <h3 className="text-[#900000] font-bold text-sm mb-3">Comments/Recommendations</h3>
                                        <textarea className="w-full h-32 p-4 rounded-lg border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:ring-1 focus:ring-[#900000] resize-none" placeholder="Enter your comments and recommendations here..."></textarea>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#730000] text-white text-sm font-bold hover:bg-[#850000] shadow-sm transition-all"><Save className="w-4 h-4" /> Save as Draft</button>
                                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#520000] text-white text-sm font-bold hover:bg-[#3d0000] shadow-sm transition-all"><Send className="w-4 h-4" /> Submit Grades</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8" />
            <NavFooter />
        </FacultyManagementLayout>
    );
};

export default function Dashboard() {
    const [activeStage, setActiveStage] = useState<Stage>('mor');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [gradingGroup, setGradingGroup] = useState<any>(null);
    
    const [viewDetailsGroup, setViewDetailsGroup] = useState<any>(null);

    const [showRubrics, setShowRubrics] = useState(false);

    if (gradingGroup) {
        return <DocumentReviewView group={gradingGroup} onBack={() => setGradingGroup(null)} />;
    }

    if (showRubrics) {
        return <RubricsManagementView onBack={() => setShowRubrics(false)} />;
    }

    return (
        <FacultyManagementLayout 
            breadcrumbs={breadcrumbs} 
            title="Grade Input" 
            description="Input and submit grades for advisees per stage (MOR/DP1/DP2) based on panel evaluations"
        >
            <Head title="Grade Input" />
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
                .dm-sans { font-family: "DM Sans", sans-serif; }
            `}</style>

            {viewDetailsGroup && (
                <DefenseDetailsModal 
                    group={viewDetailsGroup} 
                    onClose={() => setViewDetailsGroup(null)} 
                    onEdit={() => {
                        setGradingGroup(viewDetailsGroup);
                        setViewDetailsGroup(null);
                    }}
                />
            )}

            <div className="flex flex-col w-full space-y-6 dm-sans"> 
        
                <div className="w-screen relative h-px border-t-2 border-solid border-[#7e1416] my-8" style={{ left: 'calc(-50vw + 50%)' }} />
                
                <div className="flex justify-end w-full pr-4">
                    <StageSwitchToggle 
                        value={activeStage} 
                        onChange={setActiveStage}
                        className="shadow-sm border border-neutral-200" 
                    />
                </div>

                {/* --- Filters Bar --- */}
                <div className="flex flex-col md:flex-row gap-4 items-end justify-between p-1">
                    <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Search</label>
                            <input 
                                type="text" 
                                placeholder="Keywords, Terms..." 
                                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 bg-[#F5ECD5] text-sm focus:outline-none focus:ring-2 focus:ring-[#700000]/20 transition-all placeholder:text-gray-400 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Status</label>
                            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-[#F5ECD5] text-sm focus:outline-none text-gray-600 cursor-pointer shadow-sm">
                                <option>Filter by Status</option>
                                <option>Complete</option>
                                <option>In Progress</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-end gap-2 pb-[1px]">
                         <button className="h-[42px] px-3 rounded-lg bg-[#F5ECD5] border border-gray-200 text-[#700000] hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm">
                            <ArrowUpDown className="h-5 w-5" />
                        </button>
                        <button className="h-[42px] px-4 rounded-lg bg-[#900000] text-white hover:bg-[#700000] flex items-center gap-2 text-sm font-medium whitespace-nowrap shadow-sm transition-colors">
                            <Trash2 className="h-4 w-4" />
                            Clear Filter
                        </button>
                    </div>
                </div>

                {/* --- Main Table --- */}
                <div className="border border-[#D4A3A3] rounded-xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#700000] text-white">
                            <tr>
                                <th className="px-6 py-4 w-10 text-center"></th>
                                <th className="px-4 py-4 font-medium tracking-wide">Group Code</th>
                                <th className="px-4 py-4 font-medium tracking-wide">Title</th>
                                <th className="px-4 py-4 font-medium tracking-wide text-center">Proponents</th>
                                <th className="px-4 py-4 font-medium tracking-wide text-center">Status</th>
                                <th className="px-4 py-4 font-medium tracking-wide text-center">Actions</th>
                                <th className="px-4 py-4 font-medium tracking-wide">Grade Entry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockGroups.map((group) => (
                                <tr key={group.id} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="h-2 w-2 rounded-full bg-[#900000] mx-auto" />
                                    </td>
                                    <td className="px-4 py-4 font-bold text-gray-800">{group.code}</td>
                                    <td className="px-4 py-4 text-gray-600 font-medium">{group.title}</td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 text-gray-700 font-bold px-3 py-1 rounded-md">
                                            <Users className="h-4 w-4 text-[#900000]" />
                                            {group.proponents}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className={`flex flex-col text-xs font-bold ${
                                            group.status === 'Complete' ? 'text-green-600' : 
                                            group.status === 'In Progress' ? 'text-amber-500' : 'text-red-600'
                                        }`}>
                                            <span>{group.status}</span>
                                            <span className="text-gray-400 font-normal">({group.count})</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button 
                                            onClick={() => setViewDetailsGroup(group)}
                                            className="px-4 py-1.5 rounded border border-[#700000] text-[#700000] text-xs font-bold bg-white hover:bg-[#700000] hover:text-white transition-all shadow-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button 
                                            onClick={() => {
                                                if (group.code === '3310') {
                                                    setShowRubrics(true);
                                                } else {
                                                    setGradingGroup(group);
                                                }
                                            }}
                                            className="flex items-center gap-2 text-[#700000] hover:text-[#900000] transition-colors font-bold underline underline-offset-4 decoration-gray-300 hover:decoration-[#900000]"
                                        >
                                            <FilePenLine className="h-4 w-4" />
                                            {group.status === 'Complete' ? 'Edit Evaluation' : 'Evaluate Now'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="mt-16" />
            <NavFooter />
        </FacultyManagementLayout>
    );
}