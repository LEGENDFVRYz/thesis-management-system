
/* =======================
   TYPES & INTERFACES
======================= */

export interface EvaluationRow {
    groupCode: string;
    title: string;
    criteria1: string;
    criteria2: string;
    criteria3: string;
    status: string;
    count: string;
    proponents: string[];
    adviser: string;
}

export interface ResultRow {
    rank: number;
    groupCode: string;
    title: string;
    criteria1: number | null;
    criteria2: number | null;
    criteria3: number | null;
    totalScore: number | null;
    isComplete: boolean;
}

export interface EvaluationStatus {
    status: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
}


export const getCriteriaColor = (value: string): string => {
    return value === 'Graded' ? 'text-green-600' : 'text-primary';
};

export const getStatusColor = (status: string): string => {
    if (status === 'Complete') return 'text-green-600';
    if (status === 'In Progress') return 'text-primary-foreground-2';
    return 'text-primary';
};

export const getRankColor = (rank: number): string => {
    if (rank === 1) return 'text-black text-[40px] font-bold';
    return 'text-black font-medium';
};

/* =======================
   STATUS EVALUATOR
======================= */

export const getEvaluationStatus = (resultsData: ResultRow[]): EvaluationStatus => {
    const completeCount = resultsData.filter(row => row.isComplete).length;
    const totalCount = resultsData.length;

    if (completeCount === totalCount && totalCount > 0) {
        return {
            status: 'Complete',
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700'
        };
    }

    if (completeCount > 0) {
        return {
            status: 'In Progress',
            color: 'primary-foreground-2',
            bgColor: 'bg-breadcrumb',
            borderColor: 'border-yellow-200',
            textColor: 'text-primary-foreground-2'
        };
    }

    return {
        status: 'Incomplete',
        color: 'primary',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-primary'
    };
};
