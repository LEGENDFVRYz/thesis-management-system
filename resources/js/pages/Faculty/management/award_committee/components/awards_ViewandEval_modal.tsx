//MODAL dor "View & Evaluate btn in Eval Page"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { EvaluationGradingModal } from './awards_evaluationGrading_modal';

interface EvaluationData {
    groupCode: string;
    title: string;
    proponents: string[];
    adviser: string;
    criteria1Status: string;
    criteria2Status: string;
    criteria3Status: string;
}

interface ViewEvaluateModalProps {
    isOpen: boolean;
    onClose: () => void;
    evaluationData: EvaluationData | null;
}

export function ViewEvaluateModal({ isOpen, onClose, evaluationData }: ViewEvaluateModalProps) {
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState<number>(1);

    if (!evaluationData) return null;

    const criteria = [
        {
            number: 1,
            title: 'Design Project Output (40 points)',
            evaluator: 'Design Project Coordinator',
            description: 'Assess the completeness based on requirements and the theoretical/conceptual correctness of the final project deliverable.',
            status: evaluationData.criteria1Status,
            hasEvaluateButton: evaluationData.criteria1Status === 'No Grades Yet'
        },
        {
            number: 2,
            title: 'Design Project Proposal Defense Performance (35 points)',
            evaluator: 'Proposal Defense Panelist',
            description: "Assess the proponents' authorship, contribution, and correct responses during the project defense.",
            status: evaluationData.criteria2Status,
            hasEvaluateButton: evaluationData.criteria2Status === 'No Grades Yet'
        },
        {
            number: 3,
            title: 'Technological Development (25 points)',
            evaluator: 'Design Project Adviser, Design Project Committee, Defense Panelist',
            description: "Assess the the project's originality, commercial viability, public benefit, and use of sustainable materials.",
            status: evaluationData.criteria3Status,
            hasEvaluateButton: evaluationData.criteria3Status === 'No Grades Yet'
        }
    ];

    const handleEvaluateClick = (criteriaNum: number) => {
        setSelectedCriteria(criteriaNum);
        setIsGradingModalOpen(true);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                    {/* Header */}
                    <DialogHeader className="border-b border-gray-200 p-6 pb-4 sticky top-0 bg-white z-10">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-semibold">View & Evaluate</DialogTitle>
                            <Button variant="link" onClick={onClose}>
                                <X/>
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="p-6 pt-4">
                        {/* Project Title */}
                        <h2 className="text-2xl font-bold text-primary mb-2">
                            {evaluationData.title}
                        </h2>
                        
                        {/* Group Code */}
                        <p className="text-xl mb-6">
                            Group {evaluationData.groupCode}
                        </p>

                        {/* Proponents and Adviser */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-gray-500 text-sm mb-2">Proponents:</h3>
                                <p className="text-black">
                                    {evaluationData.proponents.join(', ')}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm mb-2">Thesis Adviser:</h3>
                                <p className="text-black">{evaluationData.adviser}</p>
                            </div>
                        </div>

                        {/* Evaluation Criteria Section */}
                        <h3 className="text-2xl font-bold text-primary mb-6">
                            Evaluation Criteria for the Best Design Project Award
                        </h3>

                        {/* Criteria Cards */}
                        <div className="space-y-6">
                            {criteria.map((criterion) => (
                                <div key={criterion.number} className="border-b border-gray-200 pb-6 last:border-b-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {criterion.number}. {criterion.title}
                                        </h4>
                                        <span className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                                            criterion.status === 'Graded'
                                                ? 'text-evaluated-font-color border border-evaluated-font-color'
                                                : 'text-gray-700 border border-gray-300'
                                        }`}>
                                            {criterion.status}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600">
                                            To be evaluated by the <span className="font-medium text-gray-900">{criterion.evaluator}</span>.
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {criterion.description}
                                        </p>
                                    </div>

                                    {criterion.hasEvaluateButton && (
                                        <Button onClick={() => handleEvaluateClick(criterion.number)}>
                                            Evaluate
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Evaluation Grading Modal */}
            <EvaluationGradingModal
                isOpen={isGradingModalOpen}
                onClose={() => setIsGradingModalOpen(false)}
                criteriaNumber={selectedCriteria}
                groupCode={evaluationData.groupCode}
                title={evaluationData.title}
                proponents={evaluationData.proponents}
                adviser={evaluationData.adviser}
            />
        </>
    );
}