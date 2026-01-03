import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import * as React from 'react';

interface RubricRow {
    indicator: string;
    columns: string[]; // 4 grading levels
}

interface RubricTableProps {
    rubricNumber: number;
    percentage: number;
    description: string;
    rows: RubricRow[];
}

export const RubricTable: React.FC<RubricTableProps> = ({
    rubricNumber,
    percentage,
    description,
    rows,
}) => {
    // Track selected rating per row
    const [selectedRatings, setSelectedRatings] = React.useState<number[]>(
        Array(rows.length).fill(0),
    );

    const handleSelect = (rowIdx: number, value: number) => {
        const newRatings = [...selectedRatings];
        newRatings[rowIdx] = value;
        setSelectedRatings(newRatings);
    };

    return (
        <div className="w-full">
            <div className="mb-4">
                <h2 className="text-body-2 mb-1 font-bold text-primary">
                    Rubric No. {rubricNumber} ({percentage}%)
                </h2>
                <p className="text-body-2 text-pending-font-color">
                    {description}
                </p>
            </div>

            <Table className="w-full table-fixed border-separate border-spacing-0">
                {/* Header */}
                <TableHeader>
                    <TableRow>
                        <TableHead className="rounded-tl-lg border border-gray-300 bg-primary p-2 text-center text-primary-foreground">
                            Performance Indicator
                        </TableHead>
                        {[
                            '1 Insufficient',
                            '2 Developing',
                            '3 Proficient',
                            '4 Advanced',
                        ].map((label, idx) => (
                            <TableHead
                                key={idx}
                                className="border border-gray-300 bg-breadcrumb p-2 text-center"
                            >
                                <div className="flex flex-col items-center">
                                    <span>{label.split(' ')[0]}</span>
                                    <span className="text-xs">
                                        {label.split(' ')[1]}
                                    </span>
                                </div>
                            </TableHead>
                        ))}
                        <TableHead className="rounded-tr-lg border border-gray-300 bg-pending-border p-2 text-center">
                            Rating
                        </TableHead>
                    </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                    {rows.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                            <TableCell className="border border-gray-300 p-2 font-bold break-words whitespace-normal">
                                {row.indicator}
                            </TableCell>

                            {row.columns.map((col, colIdx) => (
                                <TableCell
                                    key={colIdx}
                                    className="border border-gray-300 p-2 break-words whitespace-normal"
                                >
                                    {col}
                                </TableCell>
                            ))}

                            {/* Rating column with selectable rings */}
                            <TableCell className="border border-gray-300 p-2">
                                <div className="grid grid-cols-4 justify-items-center gap-2 divide-x divide-gray-300">
                                    {[1, 2, 3, 4].map((value) => (
                                        <div
                                            key={value}
                                            onClick={() =>
                                                handleSelect(rowIdx, value)
                                            }
                                            className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-colors ${
                                                selectedRatings[rowIdx] ===
                                                value
                                                    ? 'border-primary bg-alert-default/80'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {selectedRatings[rowIdx] ===
                                                value && (
                                                <div className="h-3 w-3 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
