import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState } from 'react';

interface EvaluationGradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    criteriaNumber: number;
    groupCode: string;
    title: string;
    proponents: string[];
    adviser: string;
}

interface SubCriteria {
    text: string;
    maxScore: number;
}

export function EvaluationGradingModal({
    isOpen,
    onClose,
    criteriaNumber,
    groupCode,
    title,
    proponents,
    adviser
}: EvaluationGradingModalProps) {
    const [scores, setScores] = useState<{ [key: number]: string }>({});
    const [feedback, setFeedback] = useState('');

    // Define sub-criteria based on criteria number
    const getCriteriaData = () => {
        switch (criteriaNumber) {
            case 1:
                return {
                    title: 'Design Project Output (40 points)',
                    evaluator: 'Design Project Coordinator',
                    description: 'Assess the completeness based on requirements and the theoretical/conceptual correctness of the final project deliverable.',
                    maxScore: 40,
                    subCriteria: [
                        { text: 'The output of the group is complete in accordance with the specified requirements (20 points).', maxScore: 20 },
                        { text: 'The output of the group is correct in accordance with the theories and concept of the topic category (20 points).', maxScore: 20 }
                    ] as SubCriteria[]
                };
            case 2:
                return {
                    title: 'Design Project Proposal Defense Performance (35 points)',
                    evaluator: 'Proposal Defense Panelist',
                    description: "Assess the proponents' authorship, contribution, and correct responses during the project defense.",
                    maxScore: 35,
                    subCriteria: [
                        { text: 'The student was responsible for authoring at least 1/n (where n is the number of member in a group) of the content of the Project Proposal Documentation. (10 points)', maxScore: 10 },
                        { text: 'The student contributed significant ideas for discussion (10 points)', maxScore: 10 },
                        { text: 'The student correctly answered the question given by the panelist (10 points)', maxScore: 10 },
                        { text: 'The student contributed to the development of visual aids and exhibited preparedness in presenting the topic assigned for discussion (5 points)', maxScore: 5 }
                    ] as SubCriteria[]
                };
            case 3:
                return {
                    title: 'Technological Development (25 points)',
                    evaluator: 'Design Project Adviser, Design Project Committee, Defense Panelist',
                    description: "Assess the the project's originality, commercial viability, public benefit, and use of sustainable materials.",
                    maxScore: 25,
                    subCriteria: [
                        { text: 'Originality/novelty/usefulness, innovation/adaptation/patentability (5 points)', maxScore: 5 },
                        { text: 'Potential for local value-added. (5 points)', maxScore: 5 },
                        { text: 'Commercialization Scale / Profitability and Productivity (5 points)', maxScore: 5 },
                        { text: 'Use of environment-friendly materials/technology (5 points.)', maxScore: 5 },
                        { text: 'Benefits to the public (5 pts.)', maxScore: 5 }
                    ] as SubCriteria[]
                };
            default:
                return null;
        }
    };

    const criteriaData = getCriteriaData();
    
    if (!criteriaData) return null;

    const handleScoreChange = (index: number, value: string) => {
        // Only allow numbers
        if (value === '' || /^\d+$/.test(value)) {
            setScores({ ...scores, [index]: value });
        }
    };

    const calculateTotalScore = () => {
        return Object.values(scores).reduce((sum, score) => {
            return sum + (parseInt(score) || 0);
        }, 0);
    };

    const handleSaveDraft = () => {
        // Handle save draft logic
        console.log('Saving draft...', { scores, feedback });
    };

    const handleSubmitEvaluation = () => {
        // Handle submit evaluation logic
        console.log('Submitting evaluation...', { scores, feedback });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
                {/* Header */}
                <DialogHeader className="bg-primary text-white p-6 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Evaluation</DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="p-6">
                    {/* Project Title and Group Info */}
                    <div className="mb-6">
                        <h2 className="text-2xl text-primary font-bold mb-1">
                            {title}
                        </h2>
                        <p className="text-base text-gray-600">
                            Group {groupCode}
                        </p>
                    </div>

                    {/* Proponents and Adviser */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm text-gray-500 mb-1">Proponents:</h3>
                            <p className="text-sm text-gray-700">
                                {proponents.join(', ')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-500 mb-1">Thesis Adviser:</h3>
                            <p className="text-sm text-gray-700">{adviser}</p>
                        </div>
                    </div>

                    <hr className="my-6" />

                    {/* Evaluation Criteria Title */}
                    <h3 className="text-xl font-bold text-primary mb-6">
                        Evaluation Criteria for the Best Design Project Award
                    </h3>

                    {/* Criteria Section */}
                    <div className="mb-6">
                        <h4 className="text-base font-bold text-gray-900 mb-1">
                            {criteriaNumber}. {criteriaData.title}
                        </h4>
                        <p className="text-sm text-gray-500 mb-1">
                            To be evaluated by the <span className="font-medium text-gray-700">{criteriaData.evaluator}</span>.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            {criteriaData.description}
                        </p>

                        {/* Sub-criteria */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-3">Sub-criteria</h5>
                            <ul className="space-y-4">
                                {criteriaData.subCriteria.map((subCriterion, index) => (
                                    <li key={index} className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-gray-700 flex-1">
                                            • {subCriterion.text}
                                        </span>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Input
                                                type="text"
                                                value={scores[index] || ''}
                                                onChange={(e) => handleScoreChange(index, e.target.value)}
                                                placeholder="Enter Score"
                                                className="!w-25 h-9 text-center"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                / {subCriterion.maxScore}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Total Score */}
                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-300">
                                <span className="font-bold text-gray-900">Total Score:</span>
                                <span className="font-bold text-gray-900">
                                    {calculateTotalScore()} / {criteriaData.maxScore}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="mb-6">
                        <h5 className="font-semibold text-gray-900 mb-2">Feedback</h5>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide detailed feedback..."
                            className="w-full min-h-[120px] bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleSaveDraft}> Save Draft </Button>
                            
                        <Button onClick={handleSubmitEvaluation} 
                        className="bg-primary hover:bg-primary/90"> Submit Evaluation </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}