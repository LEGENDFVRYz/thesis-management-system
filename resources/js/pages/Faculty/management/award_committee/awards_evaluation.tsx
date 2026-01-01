import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    // Sample data with different statuses
    const evaluationData = [
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'Graded', status: 'Complete', count: '3/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'Graded', status: 'Complete', count: '3/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'Graded', status: 'Complete', count: '3/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'Graded', criteria2: 'Graded', criteria3: 'No Grades Yet', status: 'In Progress', count: '2/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'Graded', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'In Progress', count: '1/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'Graded', status: 'In Progress', count: '1/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
        { groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 'No Grades Yet', criteria2: 'No Grades Yet', criteria3: 'No Grades Yet', status: 'Not Yet Started', count: '0/3' },
    ];

    const getCriteriaColor = (value: string) => {
        return value === 'Graded' ? 'text-green-600' : 'text-primary';
    };

    const getStatusColor = (status: string) => {
        if (status === 'Complete') return 'text-green-600';
        if (status === 'In Progress') return 'text-primary-foreground-2';
        return 'text-primary';
    };

    return (
        <>
            <Head title="Awards Evaluation" />
            <AppHeader variant="faculty" />

            <AppContent
                title="Evaluation Page" 
                subtitle="Page for evaluating top 10 project groups based on output, defense, and tech development"
            >
                {/* Header Section with Tabs */}
                <div className="mb-6">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-300 mb-8">
                        <button className="flex items-center gap-2 pb-3 border-b-2 border-primary text-primary font-medium">
                            Evaluation Page
                        </button>
                        <button className="flex items-center gap-2 pb-3 text-gray-500 font-medium hover:text-gray-700">
                            Results Page
                        </button>
                    </div>

                    {/* Title Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">
                            Top 10 Candidate Groups for Best Design Project Award
                        </h1>
                        <p className="text-black-60">
                            The candidates for the Best Design Project Award are listed below for evaluation.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    {/* Table Header - 7 Columns */}
                    <div className="grid grid-cols-7 h-18 rounded-t-lg bg-primary">
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
                                Group Code
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
                                Thesis Title
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
                                Criteria 1: Design Project Output
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
                                Criteria 2: Design Project Proposal Defense Performance
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
                                Criteria 3: Technological Development
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
                                Evaluation Status
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-2.5">
                            <span className="text-white text-center text-[13.33px] font-semibold">
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
                                <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                    {row.groupCode}
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-3">
                                <span className="text-center text-[13.33px] text-gray-700">
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
                                <Button 
                                    variant="tertiary" 
                                    size="sm"
                                    className="text-primary border-primary hover:bg-primary hover:text-white"
                                >
                                    View & Evaluate
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </AppContent>

            <NavFooter />
        </>
    );
}
