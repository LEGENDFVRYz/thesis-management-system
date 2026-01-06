import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import StudentManagementLayout from '@/pages/Faculty/management/index';
import {  eval_n_grading } from '@/routes/student/management';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Evaluation and Grading',
        href: eval_n_grading().url,
    },
];

// --- Types ---
interface Evaluation {
    id: number;
    name: string;
    role: 'Adviser' | 'Panelist';
    grade: number;
    remarks: string;
    comment: string;
    faculty_id: number;
}

interface GradesSummary {
    adviser_score: string;
    panel_average: string;
    final_grade: string;
}

interface Props {
    evaluations: Evaluation[];
    grades?: GradesSummary;
}

export default function EvalnNGrading({ evaluations = [], grades }: Props) {

    // Separate Adviser and Panelists
    const adviserEval = evaluations.find(e => e.role === 'Adviser');
    const panelEvals = evaluations.filter(e => e.role === 'Panelist');

    // Helper for Badge Colors
    const getBadgeColor = (status: string) => {
        switch(status) {
            case 'Approved': return 'bg-[#1B5E20]'; 
            case 'Rejected': return 'bg-[#B71C1C]';
            case 'Approved with Major Revisions': return 'bg-gray-700';
            default: return 'bg-gray-500';
        }
    };

    // Reusable Card Component to ensure design consistency
    const FeedbackCard = ({ evaluator, isAdviser = false }: { evaluator: Evaluation, isAdviser?: boolean }) => (
        <div className={`bg-[#FFFCF8] rounded-lg border border-gray-100 p-6 shadow-sm h-full flex flex-col`}>
            {/* Header: Name */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${isAdviser ? 'bg-[#800000]' : 'bg-[#A85A5A]'}`}>
                    {isAdviser ? 'A' : 'P'}{evaluator.faculty_id}
                </div>
                <div>
                    <span className="block font-semibold text-gray-900">
                        {evaluator.name}
                    </span>
                    <span className={`block text-[10px] uppercase font-bold text-[#800000] tracking-wider ${isAdviser ? 'text-[#800000]' : 'text-gray-500'}`}>
                        {evaluator.role}
                    </span>
                </div>
            </div>

            {/* Score & Decision Row */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-1">Total Score</p>
                    <p className="text-xl font-bold text-gray-900">{Number(evaluator.grade).toFixed(1)}</p>
                </div>
                <div >
                    <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-1">Evaluation Decision</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(evaluator.remarks)}`}>
                        {evaluator.remarks}
                    </span>
                </div>
            </div>

            {/* Comments */}
            <div className="flex-1">
                <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-2">Comments/Recommendations</p>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    {evaluator.comment || <span className="italic">No comments provided.</span>}
                </p>
            </div>
        </div>
    );

    return (
        <StudentManagementLayout
            breadcrumbs={breadcrumbs}
            title="Evaluation and Grading" 
            description="View assessment results and feedback from the defense panel."
        >
            <Head title="Evaluation Results" />

            <div className="space-y-8 py-6">
                
                {/* 1. ADVISER SECTION (Full Width) */}
                {adviserEval ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* W-FULL makes it take the whole space */}
                        <div className="w-full">
                            <FeedbackCard evaluator={adviserEval} isAdviser={true} />
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-sm text-center">
                        Waiting for Adviser's Evaluation . . . 
                    </div>
                )}

                {/* 2. PANELISTS SECTION (Grid Layout) */}
                {panelEvals.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {panelEvals.map((evaluator) => (
                                <div key={evaluator.id} className="h-full">
                                    <FeedbackCard evaluator={evaluator} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                        <p className="text-gray-500">No panel evaluations available yet.</p>
                    </div>
                )}

                {/* 3. FINAL GRADE SUMMARY */}
                {grades && (
                    <div className="mt-8 border-t border-gray-200 pt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="bg-[#FFFCF8] rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                            
                            {/* Left Side: Title */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Final Computed Grade</h2>
                                <p className="text-gray-500 text-sm italic">
                                    Weighted Average: (Adviser 40%) + (Panel Average 60%)
                                </p>
                            </div>

                            {/* Right Side: Breakdown */}
                            <div className="flex items-center gap-8">
                                
                                {/* Adviser Score */}
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] uppercase font-bold text-center text-[#7A2E2E] mb-1">Adviser</p>
                                    <p className="font-bold text-xl text-gray-900">{grades.adviser_score}</p>
                                </div>

                                {/* Panel Average */}
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] uppercase font-bold text-center text-[#7A2E2E] mb-1">Panel Avg</p>
                                    <p className="font-bold text-xl text-gray-900">{grades.panel_average}</p>
                                </div>
                                
                                <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
                                
                                {/* Final Grade Display */}
                                <div className="bg-white px-6 py-3 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-4xl font-extrabold tracking-tight text-[#800000]">
                                        {grades.final_grade} %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StudentManagementLayout>
    );
}

