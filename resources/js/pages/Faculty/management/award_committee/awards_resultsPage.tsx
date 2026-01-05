import { Button } from '@/components/ui/button';
import { ResultRow } from './awards_types';
import { getRankColor } from './awards_utils';

interface ResultsPageProps {
    resultsData: ResultRow[];
    onViewEvaluation: (groupCode: string) => void;
    onExport: () => void;
}

export const ResultsPage = ({ resultsData, onViewEvaluation, onExport }: ResultsPageProps) => {
    return (
        <>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-8 min-h-[72px] rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Rank
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Thesis Title
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Group Code
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Criteria 1 Score
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Criteria 2 Score
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Criteria 3 Score
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Total Score
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-2 sm:p-2.5">
                        <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                            Action
                        </span>
                    </div>
                </div>

                {/* Table Rows */}
                {resultsData.map((row, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-8 border-b border-gray-200 transition-colors ${
                            row.rank === 1 
                                ? 'border-l-10 border-primary-foreground-2 hover:bg-yellow-100 font-bold'
                                : 'hover:bg-breadcrumb'
                        }`}
                    >
                        <div className="flex items-center justify-center p-3">
                            <span className={`text-center text-[13.33px] ${getRankColor(row.rank)}`}>
                                {row.rank}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <span className="text-center text-[13.33px] text-gray-700">
                                {row.title}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                {row.groupCode}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                {row.criteria1 !== null ? row.criteria1 : '--'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                {row.criteria2 !== null ? row.criteria2 : '--'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <span className="text-center text-[13.33px] text-gray-700 font-medium">
                                {row.criteria3 !== null ? row.criteria3 : '--'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <span
                                className={`text-center text-[13.33px] font-bold ${
                                    row.isComplete ? 'text-primary' : 'text-gray-500'
                                }`}
                            >
                                {row.isComplete && row.totalScore !== null
                                    ? `${Math.round(row.totalScore)}/100`
                                    : '--/100'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center p-3">
                            <Button 
                                variant="tertiary" 
                                size="sm"
                                onClick={() => onViewEvaluation(row.groupCode)}
                            > 
                                View Evaluation 
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Export Button */}
            <div className="flex justify-end mt-6">
                <Button onClick={onExport}> Export Evaluation Result </Button>
            </div>
        </>
    );
};