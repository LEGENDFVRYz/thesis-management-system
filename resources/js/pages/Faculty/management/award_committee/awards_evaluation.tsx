import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { evaluation } from '@/routes/faculty/award/index'; 
import { NavFooter } from '@/components/nav-footer';
import { type BreadcrumbItem } from '@/types';

import FacultyManagementLayout from '@/pages/Faculty/management/index';

// AWARDS COMMITTEE COMPONENTS
import { TabNavigation } from './awards_tabNavigation';
import { PageHeader } from './awards_pageHeader';
import { EvaluationPage } from './awards_evaluationPage';
import { ResultsPage } from './awards_resultsPage';
import { ViewEvaluateModal } from './awards_ViewandEval_modal';
import { ViewResultsModal } from './awards_viewEvalResult_modal';

// UTILITIES AND SAMPLE DATA
import { EvaluationRow } from './awards_types';
import { getEvaluationStatus } from './awards_utils';
import { evaluationData, resultsData, detailedEvaluationResults } from './awards_sampleData';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Awards Evaluation',
        href: evaluation().url,
    },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'evaluation' | 'results'>('evaluation');
    const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRow | null>(null);
    const [selectedResultsData, setSelectedResultsData] = useState<any>(null);

    const handleViewEvaluate = (row: EvaluationRow) => {
        setSelectedEvaluation(row);
        setIsEvaluateModalOpen(true);
    };

    const handleViewEvaluationResults = (groupCode: string) => {
        const detailedResults = detailedEvaluationResults[groupCode as keyof typeof detailedEvaluationResults];
        if (detailedResults) {
            setSelectedResultsData(detailedResults);
            setIsResultsModalOpen(true);
        }
    };

    const handleExport = () => {
        // Export btn logic here
    };

    const evaluationStatus = getEvaluationStatus(resultsData);

    return (
        <>
            <Head title="Awards Evaluation" />
            
            <FacultyManagementLayout
                breadcrumbs={breadcrumbs}
                title={activeTab === 'evaluation' ? 'Evaluation Page' : 'Results Page'}
                description={
                    activeTab === 'evaluation'
                        ? 'Page for evaluating top 10 project groups based on output, defense, and tech development'
                        : 'View summarized scores, rankings, and awards results'
                }
            >
                <div className="border border-primary mb-4"></div>
                
                {/* Header Section with Tabs */}
                <div className="mb-6">
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                    <PageHeader 
                        activeTab={activeTab} 
                        evaluationStatus={activeTab === 'results' ? evaluationStatus : undefined}
                    />
                </div>

                {/* Content Based on Active Tab */}
                {activeTab === 'evaluation' ? (
                    <EvaluationPage 
                        evaluationData={evaluationData}
                        onViewEvaluate={handleViewEvaluate}
                    />
                ) : (
                    <ResultsPage 
                        resultsData={resultsData}
                        onViewEvaluation={handleViewEvaluationResults}
                        onExport={handleExport}
                    />
                )}
            </FacultyManagementLayout>

            <NavFooter />

            {/* View & Evaluate Modal (for Evaluation Page) */}
            <ViewEvaluateModal
                isOpen={isEvaluateModalOpen}
                onClose={() => setIsEvaluateModalOpen(false)}
                evaluationData={selectedEvaluation ? {
                    groupCode: selectedEvaluation.groupCode,
                    title: selectedEvaluation.title,
                    proponents: selectedEvaluation.proponents,
                    adviser: selectedEvaluation.adviser,
                    criteria1Status: selectedEvaluation.criteria1,
                    criteria2Status: selectedEvaluation.criteria2,
                    criteria3Status: selectedEvaluation.criteria3
                } : null}
            />

            {/* View Results Modal (for Results Page) */}
            <ViewResultsModal
                isOpen={isResultsModalOpen}
                onClose={() => setIsResultsModalOpen(false)}
                evaluationData={selectedResultsData}
            />
        </>
    );
}