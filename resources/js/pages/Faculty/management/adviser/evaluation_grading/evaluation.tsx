import EvalGradingLayout from './index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react'; // Import router for manual submission
import { Icon } from '@/components/icon-index';

// Setup
const pageHeader: PageHeaderProps = {
    title: "Evaluation and Grading",
    subtitle: "Input and submit grades for advisees per stage (MOR/DP1/DP2) based on panel evaluations",
    icon: (
        // pa correct nalang
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};


// --- Interfaces ---
interface PeerEvaluation {
    id: number;
    first_name: string;
    last_name: string;
    name_prefix: string;
    grade: number;
    remarks: string;
    comment: string;
}

interface RubricLevel {
    id: number;
    levels: number;
    description: string;
}

interface RubricItem {
    id: number;
    performance_indicator: string;
    levels: RubricLevel[];
}

interface GradingCriteria {
    id: number;
    category: string;
    weight: number;
    rubrics: RubricItem[];
}

interface Props {
    advisory: any;
    id: number;
    rubrics: GradingCriteria[];
    peerEvaluations: PeerEvaluation[];
}

export default function Evaluation({ advisory, id, rubrics, peerEvaluations }: Props) {
    
    // --- STATE ---
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [comment, setComment] = useState('');
    const [verdict, setVerdict] = useState<'Approved' | 'Rejected' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Evaluation and Grading',
            href: '/faculty/management/adviser/eval_n_grading'
        },
        {   title: 'Evaluation',
            href: '#'
        },
    ];

    // --- CALCULATE COMPLETION STATUS ---
    const totalRubricItems = useMemo(() => {
        return rubrics.reduce((total, criteria) => total + criteria.rubrics.length, 0);
    }, [rubrics]);

    const ratedCount = Object.keys(ratings).length;
    const isFormComplete = ratedCount === totalRubricItems;

    // --- COMPUTATION LOGIC ---
    // Calculates the total weighted score (0-100%)
    const totalScore = useMemo(() => {
        let total = 0;

        rubrics.forEach(criteria => {
            // Get ratings for all rows in this category
            let categoryRawScore = 0;
            let categoryMaxScore = 0;

            criteria.rubrics.forEach(row => {
                const rating = ratings[row.id] || 0; 
                categoryRawScore += rating;
                categoryMaxScore += 4; // Max rating is always 4
            });

            // Calculate Percentage for this Category
            if (categoryMaxScore > 0) {
                const categoryPercentage = (categoryRawScore / categoryMaxScore);
                
                // Apply Weight
                const weightedScore = categoryPercentage * criteria.weight;
                total += weightedScore;
            }
        });

        return parseFloat(total.toFixed(2)); // Round to 2 decimals
    }, [ratings, rubrics]);


    // --- HANDLERS ---
    const handleRatingChange = (rubricId: number, value: number) => {
        setRatings(prev => ({ ...prev, [rubricId]: value }));
    };

    const getDescription = (levels: RubricLevel[], levelNumber: number) => {
        const level = levels.find(l => l.levels === levelNumber);
        return level ? level.description : '';
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        
        // Use Inertia router to POST data
        router.post('/faculty/management/adviser/eval_n_grading/store', {
            defense_id: id,
            grade: totalScore,
            remarks: verdict,
            comment: comment,
            ratings: ratings // Sends object
        }, {
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                // Success notification
                alert('Evaluation Submitted Successfully!');
            }
        });
    };

    return (
        <EvalGradingLayout
            advisoryId={id}
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            
            {/*
            * =============================================================================
            * NOTICE: TEMPORARY UI / PLACEHOLDER DESIGN
            * =============================================================================
            * The layout and styles in this file are temporary placeholders intended solely
            * to demonstrate backend logics, data rendering, and verify CRUD functionality.
            * =============================================================================
            */}

            <div className="space-y-8 pb-12">

                {/* --- PEER EVALUATIONS SECTION --- */}
                {peerEvaluations && peerEvaluations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {peerEvaluations.map((evaluator) => (
                            <div key={evaluator.id} className="bg-[#FFFCF8] rounded-lg border border-gray-100 p-6 shadow-sm">
                                {/* Header: Name */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#A85A5A] flex items-center justify-center text-white text-xs font-bold">
                                        P{evaluator.id}
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {evaluator.name_prefix} {evaluator.first_name} {evaluator.last_name}
                                    </span>
                                </div>

                                {/* Score & Decision Row */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-1">Total Score</p>
                                        <p className="text-xl font-bold text-gray-900">{Number(evaluator.grade).toFixed(1)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-1">Evaluation Decision</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white
                                            ${evaluator.remarks === 'Approved' ? 'bg-[#1B5E20]' : 
                                              evaluator.remarks === 'Rejected' ? 'bg-[#B71C1C]' : 
                                              evaluator.remarks === 'Re-defense' ? 'bg-[#E65100]' : 'bg-gray-500'}`}>
                                            {evaluator.remarks}
                                        </span>
                                    </div>
                                </div>

                                {/* Comments */}
                                <div>
                                    <p className="text-xs font-bold text-[#7A2E2E] uppercase mb-2">Comments/Recommendations</p>
                                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                                        {evaluator.comment || <span className="italic">No comments provided.</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500 text-sm">
                        No other panel members have submitted their evaluations yet.
                    </div>
                )}
                
                {/* --- RUBRIC TABLES --- */}
                {rubrics.map((criteria) => (
                    <div key={criteria.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800/30 px-6 py-4">
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                                {criteria.category} ({criteria.weight}%)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm uppercase text-gray-500 dark:text-gray-400">
                                        <th className="p-4 font-bold border-r w-1/5">Performance Indicator</th>
                                        <th className="p-4 text-center border-r w-1/6 bg-red-50/50 text-red-800">1 - Insufficient</th>
                                        <th className="p-4 text-center border-r w-1/6 bg-orange-50/50 text-orange-800">2 - Developing</th>
                                        <th className="p-4 text-center border-r w-1/6 bg-yellow-50/50 text-yellow-800">3 - Proficient</th>
                                        <th className="p-4 text-center border-r w-1/6 bg-green-50/50 text-green-800">4 - Advanced</th>
                                        <th className="p-4 text-center w-24">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {criteria.rubrics.map((rubric) => (
                                        <tr key={rubric.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 align-top border-r">
                                                {rubric.performance_indicator}
                                            </td>
                                            {[1, 2, 3, 4].map((levelNum) => (
                                                <td key={levelNum} className="p-4 text-xs text-gray-600 dark:text-gray-300 align-top border-r leading-relaxed">
                                                    {getDescription(rubric.levels, levelNum)}
                                                </td>
                                            ))}
                                            <td className="p-4 align-middle text-center bg-gray-50/30">
                                                <div className="flex justify-center gap-2">
                                                    {[1, 2, 3, 4].map((val) => (
                                                        <label key={val} className="cursor-pointer group flex flex-col items-center gap-1">
                                                            <input
                                                                type="radio"
                                                                name={`rubric_${rubric.id}`}
                                                                value={val}
                                                                checked={ratings[rubric.id] === val}
                                                                onChange={() => handleRatingChange(rubric.id, val)}
                                                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                            />
                                                            <span className={`text-[10px] font-mono font-bold ${ratings[rubric.id] === val ? 'text-blue-600' : 'text-gray-300'}`}>
                                                                {val}
                                                            </span>
                                                        </label>
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

                {/* --- SUMMARY & SUBMISSION FOOTER --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    
                    {/* 1. Score & Decision Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
                        
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h4 className="text-sm font-bold uppercase text-red-800 mb-1">Total Score</h4>
                                <p className="text-xs text-gray-500">Auto-computed based on weights</p>
                            </div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                {totalScore}%
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase text-red-800 mb-3">Evaluation Decision</h4>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="verdict" 
                                        value="Approved"
                                        checked={verdict === 'Approved'}
                                        onChange={() => setVerdict('Approved')}
                                        className="w-5 h-5 text-green-600"
                                    />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Approved</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="verdict" 
                                        value="Rejected"
                                        checked={verdict === 'Rejected'}
                                        onChange={() => setVerdict('Rejected')}
                                        className="w-5 h-5 text-red-600"
                                    />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Rejected</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 2. Comments Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                        <h4 className="text-sm font-bold uppercase text-red-800 mb-3">Comments / Recommendations</h4>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-900 dark:border-gray-700"
                            placeholder="Enter your comments and recommendations here..."
                            rows={4}
                        ></textarea>
                    </div>

                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isFormComplete || verdict === ''}
                        className="px-8 py-3 bg-red-800 hover:bg-red-900 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Final Evaluation'}
                    </button>
                </div>
                
            </div>
        </EvalGradingLayout>
    );
}