import { EvaluationStatus } from './awards_types';

interface PageHeaderProps {
    activeTab: 'evaluation' | 'results';
    evaluationStatus?: EvaluationStatus;
}

export const PageHeader = ({ activeTab, evaluationStatus }: PageHeaderProps) => {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-[35px] font-bold text-primary mb-2">
                    {activeTab === 'evaluation'
                        ? 'Top 10 Candidate Groups for Best Design Project Award'
                        : 'RESULTS'}
                </h1>
                <p className="text-black-60">
                    {activeTab === 'evaluation'
                        ? 'The candidates for the Best Design Project Award are listed below for evaluation.'
                        : 'Rankings based on completed evaluations across all criteria.'}
                </p>
            </div>
            
            {/* Evaluation Status on Results Page */}
            {activeTab === 'results' && evaluationStatus && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${evaluationStatus.bgColor} ${evaluationStatus.borderColor}`}>
                    <span className="text-sm font-bold">Evaluation Status:</span>
                    <span className={`text-sm font-semibold ${evaluationStatus.textColor}`}>
                        {evaluationStatus.status}
                    </span>
                </div>
            )}
        </div>
    );
};