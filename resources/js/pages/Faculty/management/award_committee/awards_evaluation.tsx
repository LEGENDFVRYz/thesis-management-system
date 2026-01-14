import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { evaluation } from '@/routes/faculty/awardee/index'; 
import { NavFooter } from '@/components/nav-footer';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';

import FacultyManagementLayout from '@/pages/Faculty/management/index';

// AWARDS COMMITTEE COMPONENTS
import { TabNavigation } from './components/awards_tabNavigation';
import { PageHeader } from './components/awards_pageHeader';
import { ViewEvaluateModal } from './components/awards_ViewandEval_modal';
import { ViewResultsModal } from './components/awards_viewEvalResult_modal';

// UTILITIES AND SAMPLE DATA
import { EvaluationRow } from './components/awards_types';
import { getEvaluationStatus } from './components/awards_utils';
import { evaluationData, resultsData, detailedEvaluationResults } from './components/awards_sampleData';
import { Icon } from '@/components/icon-index';

// SPLIT PAGES
import EvalPage from './evaluation/evalPage';
import ResultsPage from './evaluation/resultsPage';


// SETUP
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Awards Evaluation',
        href: evaluation().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Evaluation Page" ,
    subtitle: "Page for evaluating top 10 project groups based on output, defense, and tech development",
    icon: (
        // pa correct nalang
        <Icon
            name="docuDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};


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
                pageHeader={pageHeader}

                // Split the pages
                // Note: Hard code ko muna ung header, tytyy
                // title={activeTab === 'evaluation' ? 'Evaluation Page' : 'Results Page'}
                // description={
                //     activeTab === 'evaluation'
                //         ? 'Page for evaluating top 10 project groups based on output, defense, and tech development'
                //         : 'View summarized scores, rankings, and awards results'
                // }
            >
                {/* <div className="border border-primary mb-4"></div> */}
                
                 {/* Tab Navigation */}
                <div className="mb-6">
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* appropriate page based on the active tab */}
                {activeTab === 'evaluation' ? (
                    <EvalPage />
                ) : (
                    <ResultsPage />
                )}

            </FacultyManagementLayout>

            {/* <NavFooter /> */}

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
