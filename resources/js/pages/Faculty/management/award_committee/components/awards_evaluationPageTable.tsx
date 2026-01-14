//TABLE FOR evalPage
//UPDATE: Used existing table component
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EvaluationRow } from './awards_types';
import { getCriteriaColor, getStatusColor } from './awards_utils';

interface EvaluationPageProps {
    evaluationData: EvaluationRow[];
    onViewEvaluate: (row: EvaluationRow) => void;
}

export const EvaluationPageTable = ({ evaluationData, onViewEvaluate }: EvaluationPageProps) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-primary hover:bg-destructive-foreground transition-colors duration-200">
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold first:rounded-tl-lg whitespace-normal break-words">
                            Group Code
                        </TableHead>
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                            Thesis Title
                        </TableHead>
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                            Criteria 1: Design Project Output
                        </TableHead>
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                            Criteria 2: Design Project Proposal Defense Performance
                        </TableHead>
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                            Criteria 3: Technological Development
                        </TableHead>
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                            Evaluation Status
                        </TableHead>
                        <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold last:rounded-tr-lg whitespace-normal break-words">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {evaluationData.map((row, index) => (
                        <TableRow key={index} className="hover:bg-breadcrumb transition-colors">
                            <TableCell className="text-center text-[13.33px] font-medium whitespace-normal break-words">
                                {row.groupCode}
                            </TableCell>
                            <TableCell className="text-center text-[13.33px] whitespace-normal break-words">
                                {row.title}
                            </TableCell>
                            <TableCell className={`text-center text-[13.33px] font-medium whitespace-normal break-words ${getCriteriaColor(row.criteria1)}`}>
                                {row.criteria1}
                            </TableCell>
                            <TableCell className={`text-center text-[13.33px] font-medium whitespace-normal break-words ${getCriteriaColor(row.criteria2)}`}>
                                {row.criteria2}
                            </TableCell>
                            <TableCell className={`text-center text-[13.33px] font-medium whitespace-normal break-words ${getCriteriaColor(row.criteria3)}`}>
                                {row.criteria3}
                            </TableCell>
                            <TableCell className="text-center whitespace-normal break-words">
                                <div className="flex flex-col items-center">
                                    <span className={`text-[13.33px] font-medium ${getStatusColor(row.status)}`}>
                                        {row.status}
                                    </span>
                                    <span className="text-[11px] text-gray-500">
                                        ({row.count})
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center whitespace-normal">
                                <Button 
                                    variant="tertiary" 
                                    onClick={() => onViewEvaluate(row)}
                                >
                                    View & Evaluate
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};