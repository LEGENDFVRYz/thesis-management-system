import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem, type PageHeaderProps } from '@/types';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { index } from '@/routes/faculty/adviser/evaluation/index';
import StageSwitchToggle from '@/components/stage-toggle'; 
import { NavFooter } from '@/components/nav-footer';
import { Icon } from '@/components/icon-index';
import { Badge } from '@/components/badges-index';
import { SearchBar, GeneralSort } from '@/components/filter-search';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import DocumentPreview from '@/components/document-preview';
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
    X, 
    Clock, 
    MapPin, 
    File, 
    Pencil,
    Upload,
    NotebookPen,
    Filter,
    User
} from 'lucide-react';

interface PanelReview {
    name: string;
    grade: number | string | null;
    comment: string | null;
    remarks: string | null;
    role?: string; 
}

interface Advisory {
    id: number;
    defense_room: string;
    thesis_title: string;
    block: string;
    group_code: string;
    defense_date: string;
    defense_time: string;
    defense_type: string;
    year_level: number;
    adviser_name: string;
    proponents_count: number;
    proponent_names: string; 
    panelist_names: string;
    panel_reviews: string; 
    status?: 'Complete' | 'In Progress' | 'Not Yet Started'; 
}

interface EvalGradingProps {
    myAdvisories: Advisory[];
}

type Stage = 'mor' | 'dp1' | 'dp2';

const rubricFiles = [
    { id: 1, name: 'MOR_Rubrics_AY2526', year: '2025-2026', date: 'November 28, 2025', time: '09:00 AM' },
    { id: 2, name: 'MOR_Rubrics_AY2426', year: '2024-2025', date: 'November 28, 2025', time: '09:00 AM' },
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
    {
        id: 2,
        title: "Rubric No. 2 (20%)",
        description: "Apply engineering design to produce solutions that meet specified needs with consideration of public health, safety, and welfare, as well as global, cultural, social, environmental, and economic factors.",
        indicators: [
            { name: "Design Solution", desc1: "Solution does not meet specified needs.", desc2: "Solution meets some needs but ignores constraints.", desc3: "Solution meets specified needs and constraints.", desc4: "Solution effectively addresses needs with innovation." },
            { name: "Constraint Consideration", desc1: "Ignores public health, safety, or welfare constraints.", desc2: "Considers some constraints but lacks depth.", desc3: "Considers public health, safety, and welfare constraints.", desc4: "Comprehensive consideration of all constraints and factors." },
        ]
    },
    {
        id: 3,
        title: "Rubric No. 3 (20%)",
        description: "Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.",
        indicators: [
            { 
                name: "Problem Identification", 
                desc1: "Struggles to identify or define problems. Lacks understanding of problem background", 
                desc2: "Partially identifies problems but lacks clarity or precision. Shows limited understanding of problem background", 
                desc3: "Clearly identifies and defines problems. Demonstrates a good understanding of problem background", 
                desc4: "Skillfully identifies and defines problems. Shows exceptional understanding of problem background" 
            },
            { 
                name: "Problem Formulation", 
                desc1: "Formulates problems with limited specificity or lacks focus. Does not consider relevant variables or constraints", 
                desc2: "Formulates problems with some specificity but lacks precision or may overlook certain variables or constraints", 
                desc3: "Formulates problems with clarity and specificity. Considers relevant variables and constraints appropriately", 
                desc4: "Formulates problems precisely and comprehensively. Identifies and incorporates all relevant variables and constraints" 
            },
            { 
                name: "Research Literature", 
                desc1: "Shows limited ability to research and gather relevant literature", 
                desc2: "Display some ability to research and gather literature inconsistently", 
                desc3: "Research and gather relevant literature effectively. Shows good strength of references.", 
                desc4: "Research and gather comprehensive literature from credible sources. Displays exceptional strength of references" 
            },
        ]
    },
    {
        id: 4,
        title: "Rubric No. 4 (20%)",
        description: "Demonstrate comprehension of technical content and effective communication skills through oral presentation and written documentation.",
        indicators: [
            { 
                name: "Technical Content Comprehension", 
                desc1: "Display limited understanding of activities. Struggles to comprehend content or terminology", 
                desc2: "Shows some understanding of activities but require clarification or explanation of content or terminology", 
                desc3: "Displays a good understanding of activities. Comprehend content and terminology", 
                desc4: "Displays exceptional understanding of activities. Comprehend content and terminology with ease and fluency" 
            },
            { 
                name: "Oral Presentation", 
                desc1: "Delivers oral presentation with limited clarity, coherence or effective use of visual aids.", 
                desc2: "Delivers oral presentation with some clarity and coherence. Uses visual aids to some extent", 
                desc3: "Delivers oral presentation with clarity, coherence and effectiveness. Uses visual aids effectively. Display confidence in public speaking", 
                desc4: "Delivers presentation with exceptional clarity, coherence, and effectiveness. Uses visual aids creatively and strategically. Display exceptional confidence in speaking engagement" 
            },
            { 
                name: "Documentation", 
                desc1: "Produces written documentation with limited clarity and organization. Lack of effective use of technical term and formatting", 
                desc2: "Produces written documentation with some clarity and organization, Uses technical term and appropriate formatting to a certain extent", 
                desc3: "Produces written documentation with clarity, organization and coherence. Uses technical language and appropriate formatting effectively", 
                desc4: "Produces written documentation with exceptional clarity, organization and coherence. Uses technical term and appropriate formatting with precision" 
            },
        ]
    },
    {
        id: 5,
        title: "Rubric No. 5 (20%)",
        description: "Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.",
        indicators: [
            { 
                name: "Technological Change Awareness", 
                desc1: "Display limited awareness of implication of technological change. Needs understanding of emerging technologies", 
                desc2: "Shows some awareness of technological change but not consistently keep up", 
                desc3: "Displays a good awareness of technological change and keeps up with emerging technologies.", 
                desc4: "Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background." 
            },
            { 
                name: "Independent Learning Preparation", 
                desc1: "Needs preparation and planning for independent learning. May strive to identify learning needs", 
                desc2: "Displays some preparation and planning for independent learning but not consistently identify learning needs", 
                desc3: "Displays effective preparation and planning for independent learning. Identifies learning needs and relevant learning goals", 
                desc4: "Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details" 
            },
            { 
                name: "Learning Strategies", 
                desc1: "Needs awareness of effective learning strategies. Does not utilize strategies to enhance learning or address challenges", 
                desc2: "Displays some awareness of learning strategies but not consistently use them effectively or adapt to different learning contexts", 
                desc3: "Applies effective learning strategies to enhance learning and address challenges. Displays flexibility in adapting strategies to different learning contexts", 
                desc4: "Applies a wide range of effective learning strategies with consistency and adaptability. Displays exceptional self-aware skills in selecting and adjusting strategies based on learning objectives and contexts" 
            },
            { 
                name: "Resource Utilization", 
                desc1: "Does not effectively utilize available resources for learning. Needs awareness of relevant resources", 
                desc2: "Utilizes some resources for learning but not fully maximize their potential certain relevant resources", 
                desc3: "Effectively identifies and utilizes available resources for learning. Shows good creativity and seeks out additional resources", 
                desc4: "Displays exceptional ability to identify and utilize a wide range of resources effectively. Shows creativity in seeking out and critically evaluating new resources" 
            },
            { 
                name: "Continuous improvement", 
                desc1: "Shows resistance to feedback and limited willingness to make improvements. Does not take proactive steps to enhance skills or knowledge", 
                desc2: "Displays some openness to feedback and makes occasional upgrades. Takes limited initiative in enhancing skills or knowledge", 
                desc3: "Shows openness to feedback and actively seeks opportunities for improvement. Takes initiative in enhancing skills or knowledge based on feedback and self-reflection", 
                desc4: "Embraces feedback with enthusiasm and actively seeks continuous improvement opportunities. Takes proactive and deliberate measures to enhance skills, knowledge, and professional development" 
            },
        ]
    },
];

const DefenseDetailsModal = ({ advisory, onClose, onEdit }: { advisory: Advisory, onClose: () => void, onEdit: () => void }) => {
    let panelists: PanelReview[] = [];
    try {
        panelists = advisory.panel_reviews ? JSON.parse(advisory.panel_reviews) : [];
    } catch (e) { console.error(e); }

    const proponentList = advisory.proponent_names ? advisory.proponent_names.split(', ') : [];

    // Status badge helper - returns committee badge name
    const getStatusBadge = (status?: string): 'committeeBadgesEvaluated' | 'committeeBadgesUnderEval' | 'committeeBadgesForReview' => {
        if (status === 'Complete') return 'committeeBadgesEvaluated';
        if (status === 'In Progress') return 'committeeBadgesUnderEval';
        if (status === 'Not Yet Started') return 'committeeBadgesForReview';
        return 'committeeBadgesEvaluated';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] font-dm">
                <div className="flex justify-between items-start p-8 pb-4 bg-card border-b border-border">
                    <div>
                        <h2 className="text-title-3 font-bold text-foreground">Defense Details</h2>
                        <p className="text-muted-foreground text-body-3">Complete information about the thesis defense</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onEdit}
                            className="primary-btn px-4 py-2 rounded-lg text-body-3 font-bold flex items-center gap-2 transition-colors"
                        >
                            <FilePenLine className="w-4 h-4" />
                            Edit Evaluation
                        </button>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-6 space-y-6 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-primary text-body-3 font-bold mb-1">Defense ID</h3>
                            <p className="text-foreground font-bold text-body-1">{advisory.group_code}</p>
                        </div>
                        <Badge name={getStatusBadge(advisory.status)} size={90} />
                    </div>

                    <div>
                        <h3 className="text-primary text-body-3 font-bold mb-1">Thesis Title</h3>
                        <p className="text-foreground font-bold text-body-2 leading-snug">{advisory.thesis_title}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                        <div>
                            <h3 className="text-primary text-body-3 font-bold mb-1">Date of Defense</h3>
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {advisory.defense_date}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-primary text-body-3 font-bold mb-1">Time</h3>
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                {advisory.defense_time}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-primary text-body-3 font-bold mb-1">Venue</h3>
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                Room {advisory.defense_room}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-primary text-body-3 font-bold mb-1">Block</h3>
                            <span className="inline-block bg-card border border-border px-3 py-1 rounded text-body-3 font-bold text-foreground">
                                BSCPE {advisory.year_level}-{advisory.block}
                            </span>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-primary text-body-3 font-bold mb-1">Thesis Adviser</h3>
                            <p className="text-foreground font-medium">{advisory.adviser_name}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-primary text-body-3 font-bold mb-3">Proponents</h3>
                        <div className="flex flex-wrap gap-2">
                            {proponentList.map((name, i) => (
                                <span key={i} className="bg-breadcrumb text-primary px-3 py-1.5 rounded-full text-body-4 font-bold flex items-center gap-1.5">
                                    <Users className="w-3 h-3" />
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-primary text-body-3 font-bold mb-3">Defense Panel</h3>
                        <div className="space-y-2">
                            {panelists.length > 0 ? panelists.map((panel, idx) => (
                                <div key={idx} className="bg-muted rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sidebar-gradient-mid text-primary-foreground flex items-center justify-center font-bold text-body-4 shadow-sm">
                                        P{idx + 1}
                                    </div>
                                    <span className="font-bold text-foreground">{panel.name}</span>
                                    {panel.remarks && <span className="text-body-4 text-muted-foreground">({panel.remarks})</span>}
                                </div>
                            )) : (
                                <p className="text-body-3 text-muted-foreground italic">No panelists assigned or recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RubricsManagementView = ({ onBack }: { onBack: () => void }) => {
    return (
        <FacultyManagementLayout breadcrumbs={[{ title: 'Rubrics', href: '#' }]} pageHeader={{ title: '' }}>
             <div className="w-full max-w-[1600px] mx-auto pb-12 font-dm">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <NotebookPen className="w-8 h-8 text-sidebar-accent" />
                        <div>
                            <h1 className="text-title-3 font-bold text-sidebar-accent">Rubrics and Guidelines</h1>
                            <p className="text-primary font-medium">Upload and manage scoring rubrics</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 border border-primary/20 rounded-xl overflow-hidden shadow-sm bg-card">
                        <table className="w-full text-left text-body-3">
                            <thead className="bg-primary text-primary-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-body-4">Name</th>
                                    <th className="px-4 py-3 font-medium text-body-4 text-center">Year</th>
                                    <th className="px-4 py-3 font-medium text-body-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rubricFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-breadcrumb/50">
                                        <td className="px-6 py-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="font-bold text-foreground">{file.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{file.year}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><Download className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-accent border border-border rounded-xl p-6 shadow-sm h-[400px] flex items-center justify-center text-muted-foreground flex-col">
                         <File className="w-12 h-12 mb-3 text-border" />
                         <span className="text-body-4 font-bold">Document Preview Area</span>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-6 left-6">
                 <button onClick={onBack} className="flex items-center text-primary font-bold hover:underline gap-1 bg-card px-4 py-2 rounded-full shadow-md border border-border">
                    <ChevronLeft className="w-4 h-4" /> Back to Grading
                </button>
            </div>
        </FacultyManagementLayout>
    );
};

const submittedDocuments = [
    { id: 1, name: 'BSCPE_3-1_Manuscript.pdf', size: '2.4 MB', version: 'v3' },
    { id: 2, name: 'Appendix_A_Survey_Results.pdf', size: '856 KB', version: 'v1' },
    { id: 3, name: 'Source_Code_Documentation.pdf', size: '1.2 MB', version: 'v2' },
];

const DocumentReviewView = ({ advisory, onBack }: { advisory: Advisory, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'review' | 'evaluation'>('review');
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [decision, setDecision] = useState<string>('');
    const [selectedDocumentId, setSelectedDocumentId] = useState<number>(1);
    const [isExiting, setIsExiting] = useState(false);

    const handleReturn = () => {
        setIsExiting(true);
        setTimeout(() => {
            onBack();
        }, 200);
    };

    let panelists: PanelReview[] = [];
    try {
        panelists = advisory.panel_reviews ? JSON.parse(advisory.panel_reviews) : [];
    } catch (e) { console.error(e); }
    
    const proponentList = advisory.proponent_names ? advisory.proponent_names.split(', ') : [];

    const getStatusBadge = (status?: string): 'committeeBadgesEvaluated' | 'committeeBadgesUnderEval' | 'committeeBadgesForReview' => {
        if (status === 'Complete') return 'committeeBadgesEvaluated';
        if (status === 'In Progress') return 'committeeBadgesUnderEval';
        if (status === 'Not Yet Started') return 'committeeBadgesForReview';
        return 'committeeBadgesEvaluated';
    };

    const handleRatingChange = (sectionId: number, indicatorIndex: number, value: number) => {
        setRatings(prev => ({ ...prev, [`${sectionId}-${indicatorIndex}`]: value }));
    };

    const totalScore = useMemo(() => {
        let total = 0;

        rubricSections.forEach((section) => {
            const match = section.title.match(/\((\d+)%\)/);
            const weight = match ? parseFloat(match[1]) : 0;

            let sectionSum = 0;
            let maxSectionScore = section.indicators.length * 4; 

            section.indicators.forEach((_, indicatorIndex) => {
                const key = `${section.id}-${indicatorIndex}`;
                sectionSum += ratings[key] || 0;
            });

            if (maxSectionScore > 0) {
                const sectionScore = (sectionSum / maxSectionScore) * weight;
                total += sectionScore;
            }
        });

        return total.toFixed(1); 
    }, [ratings]);
    
    return (
        <FacultyManagementLayout breadcrumbs={[{ title: 'Evaluation', href: '#' }]} pageHeader={undefined}>
             <div className={`font-dm transition-all duration-200 ease-out ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <div className="mb-6">
                    <button onClick={handleReturn} className="flex items-center text-primary font-bold hover:underline gap-1 transition-transform hover:-translate-x-1">
                        <Icon name="backDefault" size={20} /> Return
                    </button>
                </div>

                <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-12">
                    <div className="flex flex-col space-y-0">
                        <div className="flex justify-between items-end mb-[-1px] z-20 px-1">
                            <h2 className="text-primary text-body-2 font-bold">
                                {activeTab === 'review' ? 'Document Review' : 'Evaluation Form'}
                            </h2>
                            <div className="flex gap-0">
                                <button 
                                    onClick={() => setActiveTab('review')}
                                    className={`px-6 py-2.5 text-body-4 font-bold rounded-t-lg transition-all border-t border-l border-r border-transparent ${activeTab === 'review' ? 'bg-sidebar-gradient-mid text-primary-foreground-2 shadow-none z-10' : 'bg-primary text-primary-foreground-2/70 hover:bg-sidebar-gradient-mid shadow-inner z-0'}`}
                                >
                                    Document Review
                                </button>
                                <button 
                                    onClick={() => setActiveTab('evaluation')}
                                    className={`px-6 py-2.5 text-body-4 font-bold rounded-t-lg transition-all border-t border-l border-r border-transparent ${activeTab === 'evaluation' ? 'bg-sidebar-gradient-mid text-primary-foreground-2 shadow-none z-10' : 'bg-primary text-primary-foreground-2/70 hover:bg-sidebar-gradient-mid shadow-inner z-0'}`}
                                >
                                    Evaluation
                                </button>
                            </div>
                        </div>

                        <div className="bg-accent border border-border rounded-b-xl rounded-tl-xl p-8 shadow-sm relative z-10">
                            
                            <div className="bg-[#FFFCF5] border border-gray-100 rounded-xl p-8 shadow-md mb-8 font-dm">
                                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#8B0000]">Defense Details</h2>
                                        <p className="text-gray-400 text-sm">Complete information about the thesis defense</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="text-[#8B0000] font-medium text-sm block">Defense ID</span>
                                            <span className="text-base font-bold text-black">{advisory.group_code || 'DEF-001'}</span>
                                        </div>
                                        <Badge name={getStatusBadge(advisory.status)} size={80} />
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-[#8B0000] font-medium text-base mb-2">Thesis Title</h3>
                                    <p className="text-black font-medium text-lg leading-tight max-w-4xl">
                                        {advisory.thesis_title}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                                    
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-[#8B0000] font-medium text-base mb-2">Block</h3>
                                            <span className="inline-block border border-gray-200 bg-white px-3 py-1.5 rounded text-sm font-semibold text-gray-700">
                                                BSCPE {advisory.year_level}-{advisory.block}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-[#8B0000] font-medium text-base mb-2">Thesis Adviser</h3>
                                            <p className="text-black font-medium text-base">{advisory.adviser_name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-[#8B0000] font-medium text-base mb-2">Venue</h3>
                                            <p className="text-black font-medium text-base">Room {advisory.defense_room}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-[#8B0000] font-medium text-base mb-2">Date</h3>
                                            <div className="flex items-center gap-2 text-black font-medium text-base">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {advisory.defense_date}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[#8B0000] font-medium text-base mb-2">Time</h3>
                                        <p className="text-black font-medium text-base">{advisory.defense_time}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-[#8B0000] font-medium text-base mb-3">Proponents</h3>
                                        <div className="flex flex-col gap-2">
                                            {proponentList.map((name, i) => (
                                                <div key={i} className="bg-[#FDE68A] text-[#92400E] px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-fit">
                                                    <User className="w-3.5 h-3.5" />
                                                    {name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[#8B0000] font-medium text-base mb-3">Defense Panel</h3>
                                        <div className="space-y-4">
                                            {panelists.length > 0 ? panelists.map((panel, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                                                        P{idx + 1}
                                                    </div>
                                                    <span className="font-medium text-black text-sm">{panel.name}</span>
                                                </div>
                                            )) : (
                                                <p className="text-sm text-gray-400 italic">No panel assigned</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>


                            {activeTab === 'review' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 [&_button:has(.lucide-x)]:hidden">
                                        <DocumentPreview 
                                            documentTitle={advisory.thesis_title || 'Manuscript'}
                                            documentUrl={undefined}
                                            showDownloadButton={true}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-accent border border-border rounded-xl overflow-hidden shadow-md">
                                            <div className="bg-primary px-4 py-3">
                                                <h3 className="text-primary-foreground font-bold text-sm">Submitted Documents</h3>
                                            </div>
                                            <div className="p-3 space-y-2">
                                                {submittedDocuments.map((doc) => (
                                                    <div 
                                                        key={doc.id}
                                                        onClick={() => setSelectedDocumentId(doc.id)}
                                                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                            selectedDocumentId === doc.id 
                                                                ? 'bg-cancelled-bg/50 border border-primary/20 border-l-4 border-l-primary' 
                                                                : 'hover:bg-muted'
                                                        }`}
                                                    >
                                                        <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium truncate ${selectedDocumentId === doc.id ? 'text-primary' : 'text-foreground'}`}>
                                                                {doc.name}
                                                            </p>
                                                            <p className={`text-xs ${selectedDocumentId === doc.id ? 'text-primary/70' : 'text-muted-foreground'}`}>
                                                                {doc.size}
                                                            </p>
                                                            <p className={`text-xs ${selectedDocumentId === doc.id ? 'text-primary/70' : 'text-muted-foreground'}`}>
                                                                {doc.version}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-accent border border-border rounded-xl overflow-hidden shadow-md">
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                                <h3 className="text-foreground font-bold text-sm">Comments</h3>
                                                <button className="flex items-center gap-1 text-primary text-xs font-medium hover:underline">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    History
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-center text-muted-foreground text-sm py-4">No comments yet</p>
                                                <textarea 
                                                    className="w-full p-3 text-sm border border-border rounded-lg bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                                                    placeholder="Add a comment or inline feedback..."
                                                    rows={3}
                                                />
                                                <button className="w-full mt-3 flex items-center justify-center gap-2 bg-breadcrumb hover:bg-revision-bg text-revision-font-color font-medium py-2.5 px-4 rounded-lg transition-colors border border-revision-border">
                                                    <Send className="w-4 h-4" />
                                                    Add Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card border border-border rounded-xl p-6 shadow-md col-span-full">
                                        <h3 className="text-primary text-body-2 font-bold mb-4">Comments/Recommendations</h3>
                                        <textarea
                                            className="w-full min-h-[120px] p-4 rounded-lg border border-border bg-background text-foreground text-body-2 focus:outline-none focus:ring-1 focus:ring-primary resize-y placeholder:text-muted-foreground/70"
                                            placeholder="Enter your comments and recommendations here..."
                                        ></textarea>
                                        <div className="flex justify-end mt-4">
                                            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-6 rounded-lg transition-colors">
                                                <Send className="w-4 h-4" />
                                                Submit Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="bg-accent border border-border rounded-xl p-8 shadow-sm mt-10">
                                        {rubricSections.map((rubric, idx) => (
                                            <div key={rubric.id} className="space-y-4">
                                                
                                                {idx > 0 && (
                                                    <div className="w-full h-px bg-foreground my-10" />
                                                )}

                                                <div className="mb-6 mt-4">
                                                    <h3 className="text-primary font-bold text-body-1 mb-2">{rubric.title}</h3>
                                                    <p className="text-body-2 text-foreground font-bold leading-relaxed" style={{ maxWidth: 'calc(95%)' }}>{rubric.description}</p>
                                                </div>

                                                <div className="border border-primary/30 rounded-xl overflow-hidden shadow-sm">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-3 w-[15%] text-left font-bold bg-[#8B0000] text-white border-r border-white/20 align-middle border-t border-l border-gray-400">
                                                                    Performance<br/>Indicator
                                                                </th>
                                                                <th className="px-4 py-3 w-[17%] bg-[#F5F5DC] text-[#8B0000] font-bold text-center border-r border-[#D4C3A3] align-middle border-t border-b border-gray-400">
                                                                    1<br/>Insufficient
                                                                </th>
                                                                <th className="px-4 py-3 w-[17%] bg-[#F5F5DC] text-[#8B0000] font-bold text-center border-r border-[#D4C3A3] align-middle border-t border-b border-gray-400">
                                                                    2<br/>Developing
                                                                </th>
                                                                <th className="px-4 py-3 w-[17%] bg-[#F5F5DC] text-[#8B0000] font-bold text-center border-r border-[#D4C3A3] align-middle border-t border-b border-gray-400">
                                                                    3<br/>Proficient
                                                                </th>
                                                                <th className="px-4 py-3 w-[17%] bg-[#F5F5DC] text-[#8B0000] font-bold text-center border-r border-[#D4C3A3] align-middle border-t border-b border-gray-400">
                                                                    4<br/>Advanced
                                                                </th>
                                                                <th colSpan={4} className="px-2 py-3 bg-[#E2E8F0] text-black font-bold text-center align-middle border-t border-r border-b border-gray-400">
                                                                    Rating
                                                                </th>
                                                            </tr>
                                                            <tr className="bg-[#E2E8F0]">
                                                                <th className="border-l border-b border-r border-gray-400"></th>
                                                                <th colSpan={4} className="border-r border-gray-300 border-b border-gray-400"></th>
                                                                
                                                                {[1, 2, 3, 4].map((val, idx) => (
                                                                    <th key={val} className={`px-2 py-1 text-center font-bold text-black w-[40px] border-b border-gray-400 ${idx === 3 ? 'border-r border-gray-400' : 'border-r border-gray-300'}`}>
                                                                            {val}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-body-4">
                                                            {rubric.indicators.map((indicator, i) => (
                                                                <tr key={i} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                                                                    <td className="px-4 py-4 font-bold text-foreground border-r border-border bg-card align-middle text-body-2">
                                                                        {indicator.name}
                                                                    </td>
                                                                    {[indicator.desc1, indicator.desc2, indicator.desc3, indicator.desc4].map((desc, ratingIdx) => (
                                                                        <td key={ratingIdx} className="px-4 py-4 text-muted-foreground border-r border-border bg-card align-top text-sm">
                                                                            <span className="leading-snug">{desc}</span>
                                                                        </td>
                                                                    ))}                                                                    
                                                                    {[1, 2, 3, 4].map((val) => (
                                                                        <td key={val} className="px-2 py-4 bg-[#FCFCFC] text-center border-r border-border align-middle w-[40px]">
                                                                            <div className="flex items-center justify-center h-full">
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name={`rating-${rubric.id}-${i}`}
                                                                                    checked={ratings[`${rubric.id}-${i}`] === val}
                                                                                    onChange={() => handleRatingChange(rubric.id, i, val)}
                                                                                    className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:border-gray-800 checked:border-[6px] transition-all cursor-pointer bg-white"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex items-center justify-between">
                                                    <span className="text-title-3 font-bold text-primary">Total Score:</span>
                                                    <span className="text-title-3 font-bold text-foreground">{totalScore} %</span>
                                                </div>

                                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col justify-center">
                                                    <h3 className="text-primary text-body-3 font-bold mb-4">Evaluation Decision</h3>
                                                    <div className="flex items-center gap-10">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="evaluation_decision"
                                                                    value="accepted"
                                                                    checked={decision === 'accepted'}
                                                                    onChange={() => setDecision('accepted')}
                                                                    className="peer appearance-none w-5 h-5 border-2 border-muted-foreground rounded-full checked:border-primary checked:border-[6px] transition-all cursor-pointer bg-card"
                                                                />
                                                            </div>
                                                            <span className="text-body-3 text-foreground font-bold group-hover:text-primary transition-colors">Accepted</span>
                                                        </label>

                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="evaluation_decision"
                                                                    value="rejected"
                                                                    checked={decision === 'rejected'}
                                                                    onChange={() => setDecision('rejected')}
                                                                    className="peer appearance-none w-5 h-5 border-2 border-muted-foreground rounded-full checked:border-primary checked:border-[6px] transition-all cursor-pointer bg-card"
                                                                />
                                                            </div>
                                                            <span className="text-body-3 text-foreground font-bold group-hover:text-primary transition-colors">Rejected</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                                <h3 className="text-primary text-body-2 font-bold mb-4">Comments/Recommendations</h3>
                                                <textarea
                                                    className="w-full min-h-[150px] p-4 rounded-lg border border-border bg-background text-foreground text-body-2 focus:outline-none focus:ring-1 focus:ring-primary resize-y placeholder:text-muted-foreground/70"
                                                    placeholder="Enter your comments and recommendations here..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                                            <button className="primary-btn px-6 py-2.5 rounded-lg text-body-3 font-bold">
                                                <Send className="w-4 h-4 inline mr-2" /> Submit Grades
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FacultyManagementLayout>
    );
};


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Evaluation and Grading',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Evaluation and Grading",
    subtitle: "Input and submit grades for advisees per stage (MOR/DP1/DP2) based on panel evaluations",
    icon: (
        <Icon
            name="evalIcon"
            size={40}
            className="text-primary"
        />
    ),
};

export default function EvalAndGrading({ myAdvisories }: EvalGradingProps) {
    const [activeStage, setActiveStage] = useState<Stage>('mor');;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    const [viewDetailsGroup, setViewDetailsGroup] = useState<Advisory | null>(null); 
    const [gradingGroup, setGradingGroup] = useState<Advisory | null>(null); 
    const [showRubrics, setShowRubrics] = useState(false); 
    
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
    };

    const handleApplySort = (sortBy: string) => {
        console.log("Applied Sort:", sortBy);
        setIsSortModalOpen(false);
    };

    if (gradingGroup) {
        return <DocumentReviewView advisory={gradingGroup} onBack={() => setGradingGroup(null)} />;
    }

    if (showRubrics) {
        return <RubricsManagementView onBack={() => setShowRubrics(false)} />;
    }

    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            {viewDetailsGroup && (
                <DefenseDetailsModal 
                    advisory={viewDetailsGroup} 
                    onClose={() => setViewDetailsGroup(null)}
                    onEdit={() => {
                        setGradingGroup(viewDetailsGroup);
                        setViewDetailsGroup(null);
                    }}
                />
            )}

            <div className="flex flex-col w-full space-y-6 font-dm">
                

                
                <div className="flex justify-end w-full pr-4">
                    <StageSwitchToggle 
                        value={activeStage} 
                        onChange={setActiveStage}
                        className="shadow-sm border border-neutral-200" 
                    />
                </div>

                <div className="flex flex-col items-start self-stretch w-full bg-card rounded-[10px] border-[0.8px] border-primary/20 shadow-sm p-6 gap-4 font-dm">
                    <div className="flex flex-row items-center gap-2 self-stretch w-full h-6">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="font-dm font-normal text-base leading-6 text-primary">
                            Filters & Search
                        </h2>
                    </div>

                    <div className="flex flex-row items-end gap-[10px] self-stretch w-full font-dm">
                        <div className="flex flex-col gap-2 flex-1 font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Search</label>
                            <SearchBar 
                                variant="filter-section" 
                                placeholder="Keywords, Terms..." 
                                value={searchQuery} 
                                onChange={setSearchQuery} 
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[280px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="bg-breadcrumb border-primary/10 h-9">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="evaluated">Evaluated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-row items-center gap-[10px] font-dm">
                            <Button 
                                variant="secondary" 
                                size="icon" 
                                className="rounded-lg border-none h-9 w-9" 
                                onClick={() => setIsSortModalOpen(true)}
                            >
                                <Icon name="sortDefault" size={16} />
                            </Button>
                            <Button 
                                variant="negative" 
                                className="px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px] font-dm"
                                onClick={handleClearFilters}
                            >
                                <Trash2 className="w-4 h-4 text-white" />
                                <span className="text-[13.33px] font-medium font-dm">Clear Filter</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <Dialog open={isSortModalOpen} onOpenChange={setIsSortModalOpen}>
                    <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none [&>button]:hidden justify-center">
                        <GeneralSort 
                            onClose={() => setIsSortModalOpen(false)} 
                            onApply={handleApplySort} 
                        />
                    </DialogContent>
                </Dialog>

                <div className="w-full border border-border rounded-lg overflow-hidden shadow-sm bg-card">
                    <Table className="border-separate border-spacing-0">
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary border-none [&>th]:text-primary-foreground">
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3 rounded-tl-lg">Defense ID</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Title</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Proponent</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Adviser</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Block</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Date & Time</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Status</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3">Details</TableHead>
                                <TableHead className="text-center font-medium px-4 py-3 text-body-3 rounded-tr-lg">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myAdvisories && myAdvisories.length > 0 ? (
                                myAdvisories.map((advisory, index) => (
                                    <TableRow key={index} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                                        <TableCell className="text-center px-4 py-3">
                                            <span className="text-body-3 font-semibold text-foreground">
                                                {advisory.group_code}
                                            </span>
                                        </TableCell>

                                        {/* Title */}
                                        <TableCell className="text-left px-4 py-3 max-w-[200px]">
                                            <div className="line-clamp-2 text-body-3 text-foreground font-medium" title={advisory.thesis_title}>
                                                {advisory.thesis_title}
                                            </div>
                                        </TableCell>

                                        {/* Proponent */}
                                        <TableCell className="text-center px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Users className="w-4 h-4 text-primary" />
                                                <span className="text-body-3 text-muted-foreground">{advisory.proponents_count}</span>
                                            </div>
                                        </TableCell>

                                        {/* Adviser */}
                                        <TableCell className="text-center px-4 py-3">
                                            <span className="text-body-3 text-foreground">{advisory.adviser_name}</span>
                                        </TableCell>

                                        {/* Block */}
                                        <TableCell className="text-center px-4 py-3">
                                            <span className="text-body-3 text-muted-foreground">BSCPE {advisory.year_level}-{advisory.block}</span>
                                        </TableCell>

                                        {/* Date & Time */}
                                        <TableCell className="text-center px-4 py-3">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-body-3 text-foreground">{advisory.defense_date}</span>
                                                <span className="text-body-4 text-muted-foreground">{advisory.defense_time}</span>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="text-center px-4 py-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-body-4 font-semibold border ${
                                                advisory.status === 'Complete' ? 'bg-evaluated-bg border-evaluated-border text-evaluated-font-color' :
                                                advisory.status === 'In Progress' ? 'bg-under-eval-bg border-under-eval-border text-under-eval-font-color' :
                                                'bg-revision-bg border-revision-border text-revision-font-color'
                                            }`}>
                                                {advisory.status || 'Pending'}
                                            </span>
                                        </TableCell>

                                        {/* Details */}
                                        <TableCell className="text-center px-4 py-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setViewDetailsGroup(advisory)}
                                                className="tertiary-btn border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-1.5" />
                                                View
                                            </Button>
                                        </TableCell>

                                        {/* Action */}
                                        <TableCell className="text-center px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    if (advisory.group_code === 'DEMO-RUBRIC') {
                                                        setShowRubrics(true);
                                                    } else {
                                                        setGradingGroup(advisory);
                                                    }
                                                }}
                                                className="flex items-center justify-center gap-1.5 text-primary hover:text-sidebar-gradient-mid transition-colors font-bold underline underline-offset-4 decoration-border hover:decoration-primary mx-auto"
                                            >
                                                <FilePenLine className="h-4 w-4" />
                                                <span className="text-body-3">Evaluate</span>
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <FilePenLine className="w-8 h-8 text-border" />
                                            <span className="text-body-3">No submissions found for grading.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </FacultyManagementLayout>
    );
}