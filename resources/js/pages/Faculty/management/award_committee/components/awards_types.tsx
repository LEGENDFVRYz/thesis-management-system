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