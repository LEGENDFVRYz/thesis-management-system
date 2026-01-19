import { useState } from 'react';

// AWARDS COMMITTEE COMPONENTS
import { PageHeader } from '../components/awards_pageHeader';
import { ResultsPageTable } from '../components/awards_resultsPageTable';
import { ViewResultsModal } from '../components/awards_viewEvalResult_modal';

// UTILITIES AND SAMPLE DATA
import { getEvaluationStatus } from '../components/awards_utils';
import { resultsData, detailedEvaluationResults } from '../components/awards_sampleData';

export default function ResultsPage() {
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [selectedResultsData, setSelectedResultsData] = useState<any>(null);

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
            {/* Page Header Descriptipn (below Tab Navigation)*/}
            <PageHeader 
                activeTab="results" 
                evaluationStatus={evaluationStatus}
            />

            {/* Results Page Table Content */}
            <ResultsPageTable
                resultsData={resultsData}
                onViewEvaluation={handleViewEvaluationResults}
                onExport={handleExport}
            />

            {/* View Results Button Modal */}
            <ViewResultsModal
                isOpen={isResultsModalOpen}
                onClose={() => setIsResultsModalOpen(false)}
                evaluationData={selectedResultsData}
            />
        </>
    );
}