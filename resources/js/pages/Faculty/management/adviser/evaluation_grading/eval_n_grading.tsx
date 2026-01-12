import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/adviser/evaluation/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Evaluation and Grading',
        href: index().url,
    },
];

// -- Types ---
interface PanelReview {
    name: string;
    grade: number | string | null;
    comment: string | null;
    remarks: string | null;
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
}

interface EvalGradingProps {
    myAdvisories: Advisory[];
}

export default function EvalAndGrading({ myAdvisories: advisory }: EvalGradingProps) {
    // --- STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);
    const [parsedReviews, setParsedReviews] = useState<PanelReview[]>([]);

    // --- HANDLERS ---
    const openModal = (advisory: Advisory) => { 
        setSelectedAdvisory(advisory); 
        
        // Parse the JSON string from the backend into a usable array
        try {
            const reviews = advisory.panel_reviews ? JSON.parse(advisory.panel_reviews) : [];
            setParsedReviews(reviews);
        } catch (e) {
            console.error("Error parsing panel reviews", e);
            setParsedReviews([]);
        }

        setIsModalOpen(true); 
    };

    const closeModal = () => { 
        setIsModalOpen(false); 
        setSelectedAdvisory(null);
        setParsedReviews([]);
    };

    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title="Evaluation and Grading" 
            description="Input and submit grades for advisees per stage (MOR/DP1/DP2) based on panel evaluations"
        >
            
            {/*
            * =============================================================================
            * NOTICE: TEMPORARY UI / PLACEHOLDER DESIGN
            * =============================================================================
            * The layout and styles in this file are temporary placeholders intended solely
            * to demonstrate backend logics, data rendering, and verify CRUD functionality.
            * =============================================================================
            */}

            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="overflow-x-auto">

                    {/* --- TABLE SECTION --- */}
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Group Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Thesis Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Proponents</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Block</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Action</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Grade Entry</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {advisory && advisory.length > 0 ? (
                                advisory.map((advisory, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        
                                        {/* Group Code */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {advisory.group_code}
                                            </span>
                                        </td>

                                        {/* Title */}
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 max-w-md whitespace-normal">
                                            <div className="line-clamp-2" title={advisory.thesis_title}>
                                                {advisory.thesis_title}
                                            </div>
                                        </td>

                                        {/* Proponents Count */}
                                        <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-400">
                                            {advisory.proponents_count}
                                        </td>

                                        {/* Block */}
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            BSCPE {advisory.year_level}-{advisory.block}  
                                        </td>

                                        {/* Action Button */}
                                        <td className="px-6 py-4 text-left">
                                            <button
                                                type="button"
                                                onClick={() => openModal(advisory)}
                                                className="inline-flex items-center justify-center rounded-md text-sm text-gray-500 dark:text-gray-100 font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>

                                        {/* Evaluate Link */}
                                        <td className="px-6 py-4 text-left">
                                            <Link
                                                href={`/faculty/management/adviser/eval_n_grading/document_review/${advisory.id}`}
                                                className="inline-flex items-center justify-center text-sm text-gray-500 dark:text-gray-100 font-medium hover:text-accent-foreground h-9 px-4 py-2 transition-colors"
                                            >
                                                Evaluate
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No advisories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && selectedAdvisory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                    Defense Details
                                </h2>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Defense ID #{selectedAdvisory.id}</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                        {selectedAdvisory.group_code}
                                    </span>
                                </div>
                            </div>
                            <button onClick={closeModal} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                ✖
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-6 overflow-y-auto space-y-8">
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Thesis Title</h3>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                                    {selectedAdvisory.thesis_title}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                {/* 1. SEPARATE DATE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🗓️</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedAdvisory.defense_date}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. SEPARATE TIME */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">⏰</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedAdvisory.defense_time}
                                        </p>
                                    </div>
                                </div>

                                {/* 3. VENUE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">📍</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Venue</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            Room {selectedAdvisory.defense_room || 'TBA'}
                                        </p>
                                    </div>
                                </div>

                                {/* 4. BLOCK */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🎓</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Course / Block</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            BSCPE {selectedAdvisory.year_level}-{selectedAdvisory.block}
                                        </p>
                                    </div>
                                </div>

                                {/* 5. ADVISER */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">👨‍🏫</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Adviser</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAdvisory.adviser_name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Proponents List */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Proponents</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {selectedAdvisory.proponent_names ? (
                                            selectedAdvisory.proponent_names.split(', ').map((name: any, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                                                    {name}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-sm text-gray-400 italic">No proponents listed</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Panelists List */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Panelists</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {parsedReviews.length > 0 ? (
                                            // USE parsedReviews instead of panelist_names string
                                            parsedReviews.map((review, i) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500/60"></div>
                                                        {review.name}
                                                    
                                                    {/* {review.remarks && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                            review.remarks === 'Passed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            review.remarks === 'Re-defense' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-gray-50 text-gray-500 border-gray-200'
                                                        }`}>
                                                            {review.remarks}
                                                        </span>
                                                    )} */}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-sm text-gray-400 italic">Pending confirmation</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex justify-end">
                            <button 
                                onClick={closeModal}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FacultyManagementLayout>
    );
}

