import { useState } from 'react';

// AWARDS COMMITTEE COMPONENTS
import { PageHeader } from '../components/awards_pageHeader';
import { ResultsPageTable as ResultsPageComponent } from '../components/awards_resultsPageTable';
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
            {/* Page Header */}
            <PageHeader 
                activeTab="results" 
                evaluationStatus={evaluationStatus}
            />

            {/* Results Content */}
            <ResultsPageComponent 
                resultsData={resultsData}
                onViewEvaluation={handleViewEvaluationResults}
                onExport={handleExport}
            />

            {/* View Results Modal */}
            <ViewResultsModal
                isOpen={isResultsModalOpen}
                onClose={() => setIsResultsModalOpen(false)}
                evaluationData={selectedResultsData}
            />
        </>
    );
}