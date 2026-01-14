//TABLE FOR resultsPage
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
import { getRankColor, ResultRow } from './awards_utils';


interface ResultsPageProps {
    resultsData: ResultRow[];
    onViewEvaluation: (groupCode: string) => void;
    onExport: () => void;
}

export const ResultsPageTable = ({ resultsData, onViewEvaluation, onExport }: ResultsPageProps) => {
    return (
        <>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary hover:bg-destructive-foreground transition-colors duration-200">
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold first:rounded-tl-lg whitespace-normal break-words">
                                Rank
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                                Thesis Title
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                                Group Code
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                                Criteria 1 Score
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                                Criteria 2 Score
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                                Criteria 3 Score
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold whitespace-normal break-words">
                                Total Score
                            </TableHead>
                            <TableHead className="text-white text-center text-[10px] sm:text-xs lg:text-[13.33px] font-semibold last:rounded-tr-lg whitespace-normal break-words">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resultsData.map((row, index) => (
                            <TableRow
                                key={index}
                                className={`transition-colors ${
                                    row.rank === 1 
                                        ? 'border-l-[10px] border-primary-foreground-2 hover:bg-yellow-100 font-bold'
                                        : 'hover:bg-breadcrumb'
                                }`}
                            >
                                <TableCell className="text-center whitespace-normal break-words">
                                    <span className={`text-[13.33px] ${getRankColor(row.rank)}`}>
                                        {row.rank}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center text-[13.33px] text-gray-700 whitespace-normal break-words">
                                    {row.title}
                                </TableCell>
                                <TableCell className="text-center text-[13.33px] text-gray-700 font-medium whitespace-normal break-words">
                                    {row.groupCode}
                                </TableCell>
                                <TableCell className="text-center text-[13.33px] text-gray-700 font-medium whitespace-normal break-words">
                                    {row.criteria1 !== null ? row.criteria1 : '--'}
                                </TableCell>
                                <TableCell className="text-center text-[13.33px] text-gray-700 font-medium whitespace-normal break-words">
                                    {row.criteria2 !== null ? row.criteria2 : '--'}
                                </TableCell>
                                <TableCell className="text-center text-[13.33px] text-gray-700 font-medium whitespace-normal break-words">
                                    {row.criteria3 !== null ? row.criteria3 : '--'}
                                </TableCell>
                                <TableCell className="text-center whitespace-normal break-words">
                                    <span
                                        className={`text-[13.33px] font-bold ${
                                            row.isComplete ? 'text-primary' : 'text-gray-500'
                                        }`}
                                    >
                                        {row.isComplete && row.totalScore !== null
                                            ? `${Math.round(row.totalScore)}/100`
                                            : '--/100'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center whitespace-normal">
                                    <Button 
                                        variant="tertiary" 
                                        size="sm"
                                        onClick={() => onViewEvaluation(row.groupCode)}
                                    >
                                        View Evaluation
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Export Button */}
            <div className="flex justify-end mt-6">
                <Button onClick={onExport}>Export Evaluation Result</Button>
            </div>
        </>
    );
};