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
    GraduationCap
} from 'lucide-react';

// --- Types ---
type Stage = 'mor' | 'dp1' | 'dp2';

// --- Mock Data ---
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Evaluation and Grading', href: eval_n_grading().url },
    { title: 'Grade Input', href: '#' },
];

// --- Rubric Data (Full Set) ---
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
    {
        id: 2,
        title: "Rubric No. 2 (20%)",
        description: "Function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.",
        indicators: [
            { name: "Individual Contribution", desc1: "Minimal contributions to team activities. Lacks initiative to fulfill responsibility.", desc2: "Some contributions to team activities. Shows limited initiative, need occasional guidance.", desc3: "Significant contributions to team activities. Takes initiative and fulfills individual responsibilities.", desc4: "Exceptional contributions to team activities. Display leadership, initiative and consistencies, fulfill individual responsibilities." },
        ]
    },
    {
        id: 3,
        title: "Rubric No. 3 (20%)",
        description: "Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences",
        indicators: [
            { name: "Problem Identification", desc1: "Struggles to identify or define problems. Lacks understanding of problem background.", desc2: "Partially identifies problems but lacks clarity or precision. Shows limited understanding of problem background.", desc3: "Clearly identifies and defines problems. Demonstrates a good understanding of problem background.", desc4: "Skillfully identifies and defines problems. Shows exceptional understanding of problem background." },
            { name: "Problem Formulation", desc1: "Formulates problems with limited specificity or lacks focus. Does not consider relevant variables or constraints.", desc2: "Formulates problems with some specificity but lacks precision or may overlook certain variables or constraints.", desc3: "Formulates problems with clarity and specificity. Considers relevant variables and constraints appropriately.", desc4: "Formulates problems precisely and comprehensively. Identifies and incorporates all relevant variables and constraints." },
            { name: "Research Literature", desc1: "Shows limited ability to research and gather relevant literature.", desc2: "Display some ability to research and gather literature with inconsistency.", desc3: "Research and gather relevant literature effectively. Shows good strength of references.", desc4: "Research and gather comprehensive literature from credible sources. Displays exceptional strength of references." },
        ]
    },
    {
        id: 4,
        title: "Rubric No. 4 (20%)",
        description: "Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
        indicators: [
            { name: "Technical Content Comprehension", desc1: "Display limited understanding of activities. Struggles to comprehend content or terminology.", desc2: "Shows some understanding of activities but require clarification or explanation of content or terminology.", desc3: "Displays a good understanding of activities. Comprehend content and terminology.", desc4: "Displays exceptional understanding of activities. Comprehend content and terminology with ease and fluency." },
            { name: "Oral Presentation", desc1: "Delivers oral presentation with limited clarity, coherence or effective use of visual aids.", desc2: "Delivers oral presentation with some clarity and coherence. Uses visual aids to some extent.", desc3: "Delivers oral presentation with clarity, coherence and effectiveness. Uses visual aids effectively. Display confidence in public speaking.", desc4: "Delivers presentation with exceptional clarity, coherence, and effectiveness. Uses visual aids creatively and strategically. Display exceptional confidence in speaking engagement." },
            { name: "Documentation", desc1: "Produces written documentation with limited clarity and organization. Lack of effective use of technical term and formatting.", desc2: "Produces written documentation with some clarity and organization. Uses technical term and appropriate formatting to a certain extent.", desc3: "Produces written documentation with clarity, organization and coherence. Uses technical language and appropriate formatting effectively.", desc4: "Produces written documentation with exceptional clarity, organization and coherence. Uses technical term and appropriate formatting with precision." },
        ]
    },
    {
        id: 5,
        title: "Rubric No. 5 (20%)",
        description: "Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences",
        indicators: [
            { name: "Technological Change Awareness", desc1: "Display limited awareness of implication of technological change. Needs understanding of emerging technologies.", desc2: "Shows some awareness of technological change but not consistently keep up.", desc3: "Displays a good awareness of technological change and keeps up with emerging technologies.", desc4: "Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background." },
            { name: "Independent Learning Preparation", desc1: "Needs preparation and planning for independent learning. May strive to identify learning needs.", desc2: "Displays some preparation and planning for independent learning but not consistently identify learning needs.", desc3: "Displays effective preparation and planning for independent learning. Identifies learning needs and relevant learning goals.", desc4: "Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details." },
            { name: "Learning Strategies", desc1: "Needs awareness of effective learning strategies. Does not utilize strategies to enhance learning or address challenges.", desc2: "Displays some awareness of learning strategies but not consistently use them effectively or adapt to different learning contexts.", desc3: "Applies effective learning strategies to enhance learning and address challenges. Displays flexibility in adapting strategies to different learning contexts.", desc4: "Applies a wide range of effective learning strategies with consistency and adaptability. Displays exceptional self-aware skills in selecting and adjusting strategies based on learning objectives and contexts." },
            { name: "Resource Utilization", desc1: "Does not effectively utilize available resources for learning. Needs awareness of relevant resources.", desc2: "Utilizes some resources for learning but not fully maximize their potential. Obtain relevant resources.", desc3: "Effectively identifies and utilizes available resources for learning. Shows good creativity and seeks out additional resources.", desc4: "Displays exceptional ability to identify and utilize a wide range of resources effectively. Shows creativity in seeking out and critically evaluating new resources." },
            { name: "Continuous Improvement", desc1: "Shows resistance to feedback and limited willingness to make improvements. Does not take proactive steps to enhance skills or knowledge.", desc2: "Displays some openness to feedback and makes occasional upgrades. Takes limited initiative in enhancing skills or knowledge.", desc3: "Shows openness to feedback and actively seeks opportunities for improvement. Takes initiative in enhancing skills or knowledge based on feedback and self-reflection.", desc4: "Embraces feedback with enthusiasm and actively seeks continuous improvement opportunities. Takes proactive and deliberate measures to enhance skills, knowledge, and professional development." },
        ]
    }
];

// --- Sub-Component: Defense Details Modal ---
const DefenseDetailsModal = ({ group, onClose, onEdit }: { group: any, onClose: () => void, onEdit: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Header Section */}
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
                    {/* ID & Status */}
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

                    {/* Title */}
                    <div>
                        <h3 className="text-[#900000] text-sm font-bold mb-1">Thesis Title</h3>
                        <p className="text-gray-900 font-bold text-lg leading-snug">{group.title}</p>
                    </div>

                    {/* Info Grid */}
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

                    {/* Proponents */}
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

                    {/* Panel */}
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

// --- Sub-Component: Document Review View ---
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
                {/* Back Button */}
                <div className="mb-6">
                    <button onClick={onBack} className="flex items-center text-[#900000] font-bold hover:underline gap-1 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                        Return
                    </button>
                </div>

                <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-12">

                    {/* --- TABS SECTION --- */}
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

                        {/* --- CONTENT CONTAINER --- */}
                        <div className="bg-[#FFFDF5] border border-stone-200 rounded-b-xl rounded-tl-xl p-8 shadow-sm relative z-10">
                            
                            {/* --- DEFENSE DETAILS CARD (Updated Color) --- */}
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

                                {/* Header Grid Layout */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                                    {/* Left Side Group */}
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

                                    {/* Proponents Column */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-[#900000] text-xs font-bold">Proponents</h3>
                                        <div className="flex flex-col gap-2 mt-1">
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> John Doe</span>
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> Jane Smith</span>
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> Mike Johnson</span>
                                            <span className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1"><Users className="w-3 h-3" /> John Doe</span>
                                        </div>
                                    </div>

                                    {/* Defense Panel Column */}
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

                            {/* --- TAB CONTENT --- */}
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
                                    
                                    {/* --- FULL WIDTH COMMENTS/RECOMMENDATIONS SECTION (ADDED) --- */}
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
                                    
                                    {/* --- PANEL EVALUATIONS SUMMARY CARDS (Updated Color) --- */}
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

                                    {/* --- RUBRICS SINGLE CARD CONTAINER (Updated Color) --- */}
                                    <div className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-8 shadow-sm mt-10">
                                        
                                        {rubricSections.map((rubric, idx) => (
                                            <div key={rubric.id} className="space-y-4">
                                                
                                                {/* --- CONDITIONAL BLACK SEPARATOR LINE (INSIDE CARD) --- */}
                                                {/* Only show line if index > 0 */}
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
                                    
                                    {/* SCORING & FOOTER (Updated Color) */}
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

// --- Main Dashboard Component ---
export default function Dashboard() {
    const [activeStage, setActiveStage] = useState<Stage>('mor');
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for Full Page Grading View
    const [gradingGroup, setGradingGroup] = useState<any>(null);
    
    // State for Defense Details Modal
    const [viewDetailsGroup, setViewDetailsGroup] = useState<any>(null);

    // If gradingGroup is selected, render the Full Document Review View
    if (gradingGroup) {
        return <DocumentReviewView group={gradingGroup} onBack={() => setGradingGroup(null)} />;
    }

    // Otherwise, render the dashboard list
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

            {/* Defense Details Modal Overlay */}
            {viewDetailsGroup && (
                <DefenseDetailsModal 
                    group={viewDetailsGroup} 
                    onClose={() => setViewDetailsGroup(null)} 
                    onEdit={() => {
                        // Close modal and open grading view
                        setGradingGroup(viewDetailsGroup);
                        setViewDetailsGroup(null);
                    }}
                />
            )}

            <div className="flex flex-col w-full space-y-6 dm-sans"> 
                
                {/* --- Full Width Line --- */}
                <div className="w-screen relative h-px border-t-2 border-solid border-[#7e1416] my-8" style={{ left: 'calc(-50vw + 50%)' }} />
                
                {/* --- Stage Toggle Section --- */}
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
                                            onClick={() => setGradingGroup(group)}
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