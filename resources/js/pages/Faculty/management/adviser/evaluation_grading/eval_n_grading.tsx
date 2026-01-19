import { Icon } from '@/components/icon-index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import {
    document_review,
    index,
} from '@/routes/faculty/adviser/evaluation/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

// Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Evaluation and Grading',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: 'Evaluation and Grading',
    subtitle:
        'Input and submit grades for advisees per stage (MOR/DP1/DP2) based on panel evaluations',
    icon: (
        // pa correct nalang
        <Icon name="calendarDefault" className="h-8 w-8 text-primary" />
    ),
};

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

export default function EvalAndGrading({
    myAdvisories: advisory,
}: EvalGradingProps) {
    // --- STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(
        null,
    );
    const [parsedReviews, setParsedReviews] = useState<PanelReview[]>([]);

    // --- HANDLERS ---
    const openModal = (advisory: Advisory) => {
        setSelectedAdvisory(advisory);

        // Parse the JSON string from the backend into a usable array
        try {
            const reviews = advisory.panel_reviews
                ? JSON.parse(advisory.panel_reviews)
                : [];
            setParsedReviews(reviews);
        } catch (e) {
            console.error('Error parsing panel reviews', e);
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

            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="overflow-x-auto">
                    {/* --- TABLE SECTION --- */}
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-gray-200 bg-gray-50 tracking-wider uppercase dark:border-gray-700 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    Group Code
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    Thesis Title
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    Proponents
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    Block
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    Action
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    Grade Entry
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {advisory && advisory.length > 0 ? (
                                advisory.map((advisory, index) => (
                                    <tr
                                        key={index}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        {/* Group Code */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {advisory.group_code}
                                            </span>
                                        </td>

                                        {/* Title */}
                                        <td className="max-w-md px-6 py-4 whitespace-normal text-gray-900 dark:text-gray-100">
                                            <div
                                                className="line-clamp-2"
                                                title={advisory.thesis_title}
                                            >
                                                {advisory.thesis_title}
                                            </div>
                                        </td>

                                        {/* Proponents Count */}
                                        <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-400">
                                            {advisory.proponents_count}
                                        </td>

                                        {/* Block */}
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            BSCPE {advisory.year_level}-
                                            {advisory.block}
                                        </td>

                                        {/* Action Button */}
                                        <td className="px-6 py-4 text-left">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openModal(advisory)
                                                }
                                                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-accent hover:text-accent-foreground dark:text-gray-100"
                                            >
                                                View Details
                                            </button>
                                        </td>

                                        {/* Evaluate Link */}
                                        <td className="px-6 py-4 text-left">
                                            <Link
                                                href={document_review(
                                                    advisory.id,
                                                )}
                                                className="inline-flex h-9 items-center justify-center px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-accent-foreground dark:text-gray-100"
                                            >
                                                Evaluate
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                    >
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
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in">
                    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
                            <div>
                                <h2 className="text-xl leading-tight font-bold text-gray-900 dark:text-white">
                                    Defense Details
                                </h2>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        Defense ID #{selectedAdvisory.id}
                                    </span>
                                    <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                        {selectedAdvisory.group_code}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="space-y-8 overflow-y-auto p-6">
                            <div>
                                <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                    Thesis Title
                                </h3>
                                <p className="text-lg leading-snug font-semibold text-gray-900 dark:text-gray-100">
                                    {selectedAdvisory.thesis_title}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 rounded-lg border border-gray-100 bg-gray-50 p-4 md:grid-cols-2 dark:border-gray-700 dark:bg-gray-800/50">
                                {/* 1. SEPARATE DATE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🗓️</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Date
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedAdvisory.defense_date}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. SEPARATE TIME */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">⏰</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Time
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedAdvisory.defense_time}
                                        </p>
                                    </div>
                                </div>

                                {/* 3. VENUE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">📍</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Venue
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            Room{' '}
                                            {selectedAdvisory.defense_room ||
                                                'TBA'}
                                        </p>
                                    </div>
                                </div>

                                {/* 4. BLOCK */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🎓</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Course / Block
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            BSCPE {selectedAdvisory.year_level}-
                                            {selectedAdvisory.block}
                                        </p>
                                    </div>
                                </div>

                                {/* 5. ADVISER */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">👨‍🏫</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Adviser
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedAdvisory.adviser_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {/* Proponents List */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase dark:text-gray-100">
                                            Proponents
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {selectedAdvisory.proponent_names ? (
                                            selectedAdvisory.proponent_names
                                                .split(', ')
                                                .map((name: any, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                                    >
                                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                                                        {name}
                                                    </li>
                                                ))
                                        ) : (
                                            <li className="text-sm text-gray-400 italic">
                                                No proponents listed
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Panelists List */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase dark:text-gray-100">
                                            Panelists
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {parsedReviews.length > 0 ? (
                                            // USE parsedReviews instead of panelist_names string
                                            parsedReviews.map((review, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                                >
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
                                            <li className="text-sm text-gray-400 italic">
                                                Pending confirmation
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
                            <button
                                onClick={closeModal}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none"
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
