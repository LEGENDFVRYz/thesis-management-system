import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    evaluationData: {
        groupCode: string;
        title: string;
        proponents: string[];
        adviser: string;
        criteria1Results: {
            criterion: string;
            score: number;
            maxScore: number;
        }[];
        criteria2Results: {
            criterion: string;
            score: number;
            maxScore: number;
        }[];
        criteria3Results: {
            criterion: string;
            score: number;
            maxScore: number;
        }[];
        criteria1Total: number;
        criteria2Total: number;
        criteria3Total: number;
        comments?: {
            evaluator: string;
            timestamp: string;
            comment: string;
        }[];
    } | null;
}

export const ViewResultsModal = ({ isOpen, onClose, evaluationData }: ViewResultsModalProps) => {
    if (!isOpen || !evaluationData) return null;

    const handleDownload = () => {
        console.log('Downloading evaluation results...');
        // Download logic heree
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-2xl font-semibold">Evaluation Results & Comments</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                    {/* Title Section */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-primary mb-2">
                            {evaluationData.title}
                        </h3>
                        <p className="text-lg font-semibold text-gray-800">
                            Group {evaluationData.groupCode} 
                        </p>
                    </div>

                    {/* Proponents and Adviser */}
                    <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b-2 border-gray-300">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Proponents:</p>
                            <p className="text-sm text-gray-800">
                                {evaluationData.proponents.join(', ')}
                            </p>
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-2">Adviser:</p>
                                <p className="text-sm text-gray-800">{evaluationData.adviser}</p>
                            </div>
                            <Button
                                onClick={handleDownload}
                                className="flex items-center gap-2"
                                size="sm"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                    </div>

                    {/* Criteria 1*/}
                    <div className="mb-6">
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                I. Design Project Output (40 points)
                            </h4>
                        </div>
                        {evaluationData.criteria1Results.length > 0 ? (
                            evaluationData.criteria1Results.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-between px-4 py-3 border-b"
                                >
                                    <p className="text-sm text-gray-700 flex-1 pr-4">
                                        • {item.criterion}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                        {item.score !== null ? `${item.score} / ${item.maxScore}` : '--'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-sm text-gray-500 italic">No grades yet</p>
                            </div>
                        )}
                    </div>

                    {/* Criteria 2*/}
                    <div className="mb-6">
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                II. Design Project Proposal Defense Performance (35 points)
                            </h4>
                        </div>
                        {evaluationData.criteria2Results.length > 0 ? (
                            evaluationData.criteria2Results.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-between px-4 py-3 border-b"
                                >
                                    <p className="text-sm text-gray-700 flex-1 pr-4">
                                        • {item.criterion}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                        {item.score !== null ? `${item.score} / ${item.maxScore}` : '--'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-sm text-gray-500 italic">No grades yet</p>
                            </div>
                        )}
                    </div>

                    {/* Criteria 3 */}
                    <div className="mb-6">
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                III. Technological Development (25 points)
                            </h4>
                        </div>
                        {evaluationData.criteria3Results.length > 0 ? (
                            evaluationData.criteria3Results.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-between px-4 py-3 border-b"
                                >
                                    <p className="text-sm text-gray-700 flex-1 pr-4">
                                        • {item.criterion}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                        {item.score !== null ? `${item.score} / ${item.maxScore}` : '--'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-sm text-gray-500 italic">No grades yet</p>
                            </div>
                        )}
                    </div>

                    {/* Total Scores Summary */}
                    <div className="bg-primary-foreground-2/50 rounded-lg p-6 mt-8">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">
                                Total Score:
                            </span>
                            <span className={`text-3xl font-bold ${
                                evaluationData.criteria1Total !== null && 
                                evaluationData.criteria2Total !== null && 
                                evaluationData.criteria3Total !== null 
                                    ? 'text-primary' 
                                    : 'text-gray-400'
                            }`}>
                                {evaluationData.criteria1Total !== null && 
                                 evaluationData.criteria2Total !== null && 
                                 evaluationData.criteria3Total !== null
                                    ? evaluationData.criteria1Total + 
                                      evaluationData.criteria2Total + 
                                      evaluationData.criteria3Total
                                    : '--'}
                            </span>
                        </div>
                    </div>

                    {/* Feedback/Comments Section */}
                    {evaluationData.comments && evaluationData.comments.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Feedback/Comments</h3>
                            <div className="space-y-4">
                                {evaluationData.comments.map((comment, index) => (
                                    <div 
                                        key={index}
                                        className="border border-gray-300 rounded-lg p-4"
                                    >
                                        <div className="mb-2">
                                            <p className="font-semibold text-gray-900">{comment.evaluator}</p>
                                            <p className="text-sm text-gray-500">{comment.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {comment.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};