import { Icon } from '@/components/icon-index';
import EvalGradingLayout from './index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { useMemo } from 'react';

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

// --- Types ---
interface PanelReview {
    name: string;
    grade: number | string | null;
    comment: string | null;
    remarks: string | null;
}

interface Props {
    advisory: any; 
    id: number;
}

export default function DocumentReview({ advisory, id }: Props) {
    
    // Breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        { 
            title: 'Evaluation and Grading', 
            href: '/faculty/management/adviser/eval_n_grading'
        },
        { 
            title: 'Document Review', 
            href: '#' 
        },
    ];

    // Parse Panel Reviews (Same logic as the modal)
    const parsedReviews: PanelReview[] = useMemo(() => {
        try {
            return advisory.panel_reviews ? JSON.parse(advisory.panel_reviews) : [];
        } catch (e) {
            console.error("Error parsing panel reviews", e);
            return [];
        }
    }, [advisory.panel_reviews]);

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

            <div className="flex flex-col xl:flex-row gap-6">
                
                {/* ---------------------------------------------------------------------- 
                    LEFT COLUMN: DEFENSE DETAILS
                   ---------------------------------------------------------------------- */}
                <div className="w-full xl:w-1/3 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                Defense Details
                            </h2>
                            <div className="flex items-center gap-2 mb-1 mt-1">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Defense ID #{advisory.id}</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    {advisory.group_code}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Body Content */}
                    <div className="p-6 space-y-8">
                        
                        {/* Thesis Title */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Thesis Title</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                                {advisory.thesis_title}
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            {/* 1. SEPARATE DATE */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">🗓️</div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {advisory.defense_date}
                                    </p>
                                </div>
                            </div>

                            {/* 2. SEPARATE TIME */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">⏰</div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {advisory.defense_time}
                                    </p>
                                </div>
                            </div>

                            {/* 3. VENUE */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">📍</div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Venue</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        Room {advisory.defense_room || 'TBA'}
                                    </p>
                                </div>
                            </div>

                            {/* 4. BLOCK */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">🎓</div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Course / Block</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        BSCPE {advisory.year_level}-{advisory.block}
                                    </p>
                                </div>
                            </div>

                            {/* 5. ADVISER */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">👨‍🏫</div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Adviser</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{advisory.adviser_name}</p>
                                </div>
                            </div>
                        </div>

                        {/* People Lists */}
                        <div className="space-y-6">
                            {/* Proponents List */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Proponents</h3>
                                </div>
                                <ul className="space-y-2">
                                    {advisory.proponent_names ? (
                                        advisory.proponent_names.split(', ').map((name: any, i: number) => (
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
                                        parsedReviews.map((review, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500/60"></div>
                                                {review.name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-400 italic">Pending confirmation</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------------------------- 
                    RIGHT COLUMN: DOCUMENT PREVIEW CONTENT
                   ---------------------------------------------------------------------- */}
                <div className="w-full xl:w-2/3">
                    <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[800px] flex items-center justify-center text-gray-400 flex-col gap-4">
                       <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl">
                            📄
                       </div>
                       <p className="font-medium">Document Previewer</p>
                       <p className="font-medium">{advisory.thesis_title}</p>
                       <p className="text-sm text-gray-500">PDF manuscript will be displayed here.</p>
                    </div>
                </div>

            </div>
        </EvalGradingLayout>
    );
}