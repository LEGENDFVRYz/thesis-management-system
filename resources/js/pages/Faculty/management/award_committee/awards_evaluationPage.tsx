// EvaluationPage.tsx
import { Button } from '@/components/ui/button';
import { EvaluationRow } from './awards_types';
import { getCriteriaColor, getStatusColor } from './awards_utils';

interface EvaluationPageProps {
    evaluationData: EvaluationRow[];
    onViewEvaluate: (row: EvaluationRow) => void;
}

export const EvaluationPage = ({ evaluationData, onViewEvaluate }: EvaluationPageProps) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-7 min-h-[72px] rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Group Code
                    </span>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Thesis Title
                    </span>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Criteria 1: Design Project Output
                    </span>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Criteria 2: Design Project Proposal Defense Performance
                    </span>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Criteria 3: Technological Development
                    </span>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Evaluation Status
                    </span>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-2.5">
                    <span className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold leading-tight">
                        Action
                    </span>
                </div>
            </div>

            {/* Table Rows */}
            {evaluationData.map((row, index) => (
                <div
                    key={index}
                    className="grid grid-cols-7 border-b border-gray-200 hover:bg-breadcrumb transition-colors"
                >
                    <div className="flex items-center justify-center p-3">
                        <span className="text-center text-[13.33px] font-medium">
                            {row.groupCode}
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-3">
                        <span className="text-center text-[13.33px]">
                            {row.title}
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-3">
                        <span className={`text-center text-[13.33px] font-medium ${getCriteriaColor(row.criteria1)}`}>
                            {row.criteria1}
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-3">
                        <span className={`text-center text-[13.33px] font-medium ${getCriteriaColor(row.criteria2)}`}>
                            {row.criteria2}
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-3">
                        <span className={`text-center text-[13.33px] font-medium ${getCriteriaColor(row.criteria3)}`}>
                            {row.criteria3}
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3">
                        <span className={`text-center text-[13.33px] font-medium ${getStatusColor(row.status)}`}>
                            {row.status}
                        </span>
                        <span className="text-center text-[11px] text-gray-500">
                            ({row.count})
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-3">
                        <Button 
                            variant="tertiary" 
                            onClick={() => onViewEvaluate(row)}
                        > 
                            View & Evaluate  
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};