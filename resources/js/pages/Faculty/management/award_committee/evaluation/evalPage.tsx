import { useState } from 'react';

// AWARDS COMMITTEE COMPONENTS
import { PageHeader } from '../components/awards_pageHeader';
import { EvaluationPageTable } from '../components/awards_evaluationPageTable';
import { ViewEvaluateModal } from '../components/awards_ViewandEval_modal';

// UTILITIES AND SAMPLE DATA
import { EvaluationRow } from '../components/awards_utils';
import { evaluationData } from '../components/awards_sampleData';


export default function EvalPage() {
    const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRow | null>(null);

    const handleViewEvaluate = (row: EvaluationRow) => {
        setSelectedEvaluation(row);
        setIsEvaluateModalOpen(true);
    };

    return (
        <>
            {/* Page Header Desc */}
            <PageHeader activeTab="evaluation" />
            

            {/* EvalPage Content */}
            <EvaluationPageTable 
                evaluationData={evaluationData}
                onViewEvaluate={handleViewEvaluate}
            />


            {/* View & Evaluate Modal */}
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
        </>
    );
}