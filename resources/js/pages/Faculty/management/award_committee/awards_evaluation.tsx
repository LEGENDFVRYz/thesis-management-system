import { useState } from 'react';

// SHARED COMPONENTS
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'evaluation' | 'results'>('evaluation');

    // Sample data with different statuses for evaluation page
    const evaluationData = [
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'Graded', status: 'Complete', count: '3/3' },
        { groupCode: '4102', title: 'AI-Powered Smart Home Security System', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'Graded', status: 'Complete', count: '3/3' },
        { groupCode: '4201', title: 'Blockchain-Based Supply Chain Management', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'Graded', status: 'Complete', count: '3/3' },
        { groupCode: '4202', title: 'IoT Agricultural Monitoring System', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'No Grades Yet', status: 'In Progress', count: '2/3' },
        { groupCode: '4301', title: 'Natural Language Processing Chatbot', criteria1: 'Graded', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'In Progress', count: '1/3' },
        { groupCode: '4302', title: 'Computer Vision Traffic Analysis', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'Graded', status: 'In Progress', count: '1/3' },
        { groupCode: '4404', title: 'Mobile Health Monitoring Application', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
        { groupCode: '4405', title: 'Renewable Energy Management System', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
        { groupCode: '4501', title: 'E-Learning Platform with Analytics', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
        { groupCode: '4602', title: 'Smart Waste Management System', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
    ];

    // Sample results data 
    const resultsData = [
        { rank: 1, groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 38, criteria2: 32, criteria3: 25, totalScore: 95, isComplete: true },
        { rank: 2, groupCode: '4102', title: 'AI-Powered Smart Home Security System', criteria1: 36, criteria2: 31, criteria3: 23, totalScore: 90, isComplete: true },
        { rank: 3, groupCode: '4201', title: 'Blockchain-Based Supply Chain Management', criteria1: 35, criteria2: 32, criteria3: 22, totalScore: 89, isComplete: true },
        { rank: 4, groupCode: '4202', title: 'IoT Agricultural Monitoring System', criteria1: 34, criteria2: 30, criteria3: null, totalScore: null, isComplete: false },
        { rank: 5, groupCode: '4301', title: 'Natural Language Processing Chatbot', criteria1: 34, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
        { rank: 6, groupCode: '4302', title: 'Computer Vision Traffic Analysis', criteria1: null, criteria2: null, criteria3: 21, totalScore: null, isComplete: false },
        { rank: 7, groupCode: '4404', title: 'Mobile Health Monitoring Application', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
        { rank: 8, groupCode: '4405', title: 'Renewable Energy Management System', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
        { rank: 9, groupCode: '4501', title: 'E-Learning Platform with Analytics', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
        { rank: 10, groupCode: '4602', title: 'Smart Waste Management System', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
    ];

    const getCriteriaColor = (value: string) => {
        return value === 'Graded' ? 'text-green-600' : 'text-primary';
    };

    const getStatusColor = (status: string) => {
        if (status === 'Complete') return 'text-green-600';
        if (status === 'In Progress') return 'text-primary-foreground-2';
        return 'text-primary';
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-black text-[40px] font-bold';
        return 'text-black font-medium';
    };

    // Check evaluation status
    const getEvaluationStatus = () => {
        const completeCount = resultsData.filter(row => row.isComplete).length;
        const totalCount = resultsData.length;
        
        if (completeCount === totalCount) {
            return { status: 'Complete', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' };
        } else if (completeCount > 0) {
            return { status: 'In Progress', color: 'primary-foreground-2', bgColor: 'bg-breadcrumb', borderColor: 'border-yellow-200', textColor: 'text-primary-foreground-2' };
        } else {
            return { status: 'Incomplete', color: 'primary', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-primary' };
        }
    };

    const evaluationStatus = getEvaluationStatus();

    return (
        <>
            <Head title="Awards Evaluation" />
            <AppHeader/>

            <AppContent
                title={activeTab === 'evaluation' ? 'Evaluation Page' : 'Results Page'}
                subtitle={
                    activeTab === 'evaluation'
                        ? 'Page for evaluating top 10 project groups based on output, defense, and tech development'
                        : 'View summarized scores, rankings, and awards results'
                }
            >
                {/* Header Section with Tabs */}
                <div className="mb-6">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-300 mb-8">
                        <button
                            onClick={() => setActiveTab('evaluation')}
                            className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${
                                activeTab === 'evaluation'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Evaluation Page
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${
                                activeTab === 'results'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Results Page
                        </button>
                    </div>

                    {/* Title Section */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[35px] font-bold text-primary mb-2">
                                {activeTab === 'evaluation'
                                    ? 'Top 10 Candidate Groups for Best Design Project Award'
                                    : 'RESULTS'}
                            </h1>
                            <p className="text-black-60">
                                {activeTab === 'evaluation'
                                    ? 'The candidates for the Best Design Project Award are listed below for evaluation.'
                                    : 'Rankings based on completed evaluations across all criteria.'}
                            </p>
                        </div>
                        
                        {/* Evaluation Status on Results Page*/}
                        {activeTab === 'results' && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${evaluationStatus.bgColor} ${evaluationStatus.borderColor}`}>
                                <span className="text-sm font-bold">Evaluation Status:</span>
                                <span className={`text-sm font-semibold ${evaluationStatus.textColor}`}>{evaluationStatus.status}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Evaluation Page Content */}
                {activeTab === 'evaluation' && (
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                        {/* Table Header */}
                        <div className="grid grid-cols-7 min-h-[72px] rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Group Code
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Thesis Title
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Criteria 1: Design Project Output
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Criteria 2: Design Project Proposal Defense Performance
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Criteria 3: Technological Development
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Evaluation Status
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2 sm:p-2.5">
                                <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                    Action
                                </span>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {evaluationData.map((row, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-7 border-b border-gray-200 hover:bg-breadcrumb transition-colors"
                            >
                                <div className="flex items-center justify-center p-3">
                                    <span className="text-center text-[13.33px] font-medium">
                                        {row.groupCode}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-3">
                                    <span className="text-center text-[13.33px] ">
                                        {row.title}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-3">
                                    <span className={`text-center text-[13.33px] font-medium ${getCriteriaColor(row.criteria1)}`}>
                                        {row.criteria1}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-3">
                                    <span className={`text-center text-[13.33px] font-medium ${getCriteriaColor(row.criteria2)}`}>
                                        {row.criteria2}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-3">
                                    <span className={`text-center text-[13.33px] font-medium ${getCriteriaColor(row.criteria3)}`}>
                                        {row.criteria3}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3">
                                    <span className={`text-center text-[13.33px] font-medium ${getStatusColor(row.status)}`}>
                                        {row.status}
                                    </span>
                                    <span className="text-center text-[11px] text-gray-500">
                                        ({row.count})
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-3">
                                    <Button variant="tertiary"> View & Evaluate  </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Page Content */}
                {activeTab === 'results' && (
                    <>
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">

                            {/* Table Header*/}
                            <div className="grid grid-cols-8 min-h-[72px] rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Rank
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Thesis Title
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Group Code
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Criteria 1 Score
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Criteria 2 Score
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Criteria 3 Score
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Total Score
                                    </span>
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-2.5">
                                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                                        Action
                                    </span>
                                </div>
                            </div>

                            {/* Table Rows for Resuls Page*/}
                            {resultsData.map((row, index) => (
                                <div
                                    key={index}
                                    className={`grid grid-cols-8 border-b border-gray-200 transition-colors ${
                                        row.rank === 1 
                                            ? 'border-l-10 border-primary-foreground-2 hover:bg-yellow-100 font-bold' //para ma-highlight si rank 1
                                            : 'hover:bg-breadcrumb'
                                    }`}
                                >
                                    <div className="flex items-center justify-center p-3">
                                        <span className={`text-center text-[13.33px] ${getRankColor(row.rank)}`}>
                                            {row.rank}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <span className="text-center text-[13.33px] text-gray-700">
                                            {row.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                            {row.groupCode}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                            {row.criteria1 !== null ? row.criteria1 : '--'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                            {row.criteria2 !== null ? row.criteria2 : '--'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                            {row.criteria3 !== null ? row.criteria3 : '--'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <span className={`text-center text-[13.33px] font-bold ${row.isComplete ? 'text-primary' : 'text-gray-500'}`}>
                                            {row.isComplete ? `${Math.round(row.totalScore)}/100` : '--/100'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center p-3">
                                        <Button variant="tertiary" size="sm"> View Evaluation </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Export Button */}
                        <div className="flex justify-end mt-6">
                            <Button> Export Evaluation Result </Button>
                        </div>
                    </>
                )}
            </AppContent>

            <NavFooter />
        </>
    );
}