import { useState } from 'react';
import { Head } from '@inertiajs/react';

// SHARED COMPONENTS
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';

//
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
        // Export logic here
        console.log('Exporting evaluation results...');
    };

    const evaluationStatus = getEvaluationStatus(resultsData);

    return (
        <>
            <Head title="Awards Evaluation" />
            <AppHeader />

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
            </AppContent>

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