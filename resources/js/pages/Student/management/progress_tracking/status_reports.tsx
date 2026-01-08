import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ProgressTrackingLayout from './index';
import { MessageSquare } from 'lucide-react';

const breadcrumb: BreadcrumbItem[] = [
    {   title: 'Status Reports',
        href: '#'
    }
];

// --- Interfaces ---
interface EvaluationComment {
    id: number;
    course: string;
    faculty_id: number;
    evaluator_name: string;
    role_name: string; // 'Adviser', 'Panelist', etc.
    comment: string;
}

interface Props {
    groupedComments: Record<string, EvaluationComment[]>; 
}

export default function StatusReports({ groupedComments }: Props) {
    // Stages to display in order
    const stages = ['MOR', 'DP1', 'DP2'];

    const stageTitles: Record<string, string> = {
        'MOR': 'Methods of Research',
        'DP1': 'Project and Design 1',
        'DP2': 'Project and Design 2',
    };

    // Helper Component for the Card
    const FeedbackCard = ({ review, isAdviser = false }: { review: EvaluationComment, isAdviser?: boolean }) => (
        <div className="bg-[#FFFCF8] rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
            
            {/* Header: Badge & Name */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${isAdviser ? 'bg-[#800000]' : 'bg-[#A85A5A]'}`}>
                    {isAdviser ? 'A' : 'P'}{review.faculty_id}
                </div>
                <div>
                    <span className="block font-semibold text-gray-900 text-sm">
                        {review.evaluator_name}
                    </span>
                    {isAdviser && (
                        <span className="block text-[10px] uppercase font-bold text-[#800000] tracking-wider">
                            Adviser
                        </span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className='flex-1'> 
                <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-2">
                    Comments/Recommendations
                </p>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    {review.comment || <span className="italic">No comments provided.</span>}
                </p>
            </div>
        </div>
    );

    return (
        <ProgressTrackingLayout
            title="Progress Tracking"
            description="Access a comprehensive archive of student theses"
            breadcrumbs={breadcrumb}
        >
            <Head title="Status Reports" />

            <div className="space-y-10 pb-12">
                {stages.map((stage) => {
                    const comments = groupedComments[stage];

                    // Skip stage if no data
                    if (!comments || comments.length === 0) return null;

                    // Separate Adviser from Panelists
                    const adviserReviews = comments.filter(c => c.role_name === 'Adviser');
                    const panelReviews = comments.filter(c => c.role_name !== 'Adviser');

                    return (
                        <div key={stage} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Stage Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{stageTitles[stage] || stage} Feedbacks</h2>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <div className="flex w-full gap-6 overflow-x-auto pb-4">
                                {/* 1. Adviser Card */}
                                {adviserReviews.map((review) => (
                                    <div key={review.id} className="flex-1 min-w-0">
                                        <FeedbackCard review={review} isAdviser={true} />
                                    </div>
                                ))}

                                {/* 2. Panelist Cards */}
                                {panelReviews.map((review) => (
                                    <div key={review.id} className="flex-1 min-w-0">
                                        <FeedbackCard review={review} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {(!groupedComments || Object.keys(groupedComments).length === 0) && (
                    <div className="flex flex-col items-center justify-center p-16 bg-white border border-dashed border-gray-300 rounded-xl text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Feedbacks Yet</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-sm">
                            Evaluation comments from your defense will appear here once submitted by the panel.
                        </p>
                    </div>
                )}
            </div>
        </ProgressTrackingLayout>
    );
}

