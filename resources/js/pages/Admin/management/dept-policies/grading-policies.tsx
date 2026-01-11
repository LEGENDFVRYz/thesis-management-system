import { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import EditIcon from '@/components/Icons/ic_edit-Default.svg';
import DefensePoliciesRubrics from '@/pages/Admin/management/dep-policies-rubrics';

export type Rubric = {
    category: string;
    weight: string;
    minimum: number;
};

export default function GradingPoliciesTab() {
    const [rubricModalOpen, setRubricModalOpen] = useState(false);
    const [selectedRubricCategory, setSelectedRubricCategory] = useState<string>('');
    const [rubrics, setRubrics] = useState<Rubric[]>([
        { category: 'Research & Investigation Skills', weight: '20%', minimum: 15 },
        { category: 'Teamwork & Leadership', weight: '20%', minimum: 15 },
        { category: 'Engineering Problem Analysis', weight: '20%', minimum: 15 },
        { category: 'Engineering Communication', weight: '20%', minimum: 15 },
        { category: 'Independent & Lifelong Learning', weight: '20%', minimum: 15 },
    ]);

    const handleRubricUpdate = (oldCategory: string, newCategory: string, newWeight: string) => {
        setRubrics(prev => prev.map(rubric =>
            rubric.category === oldCategory
                ? { ...rubric, category: newCategory, weight: newWeight }
                : rubric
        ));
    };

    return (
        <div className="space-y-8">
            {/* DEFENSE RUBRICS TABLE */}
            <div>
                <h2 className="font-medium text-[#730000] mb-4" style={{ fontSize: '24px' }}>Defense Rubrics</h2>
                <div className="bg-white rounded-xl border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-[#730000] text-white">
                            <TableRow className="hover:bg-[#730000] border-none">
                                <TableHead className="px-6 py-3 text-center text-base text-white">Category</TableHead>
                                <TableHead className="px-6 py-3 text-center text-base text-white">Weight</TableHead>
                                <TableHead className="px-6 py-3 text-center text-base text-white">Minimum Score</TableHead>
                                <TableHead className="px-6 py-3 text-center text-base text-white">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rubrics.map((rubric, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-6 py-4 text-center">{rubric.category}</TableCell>
                                    <TableCell className="px-6 py-4 text-center">{rubric.weight}</TableCell>
                                    <TableCell className="px-6 py-4 text-center">{rubric.minimum}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <img
                                                src={EditIcon}
                                                className="w-5 h-5 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedRubricCategory(rubric.category);
                                                    setRubricModalOpen(true);
                                                }}
                                                alt="Edit"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* GRADING SCALE TABLE (Static) */}
            <div>
                <h2 className="font-medium text-[#730000] mb-4" style={{ fontSize: '24px' }}>Grading Scale</h2>
                <div className="bg-white rounded-xl border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-[#730000] text-white">
                            <TableRow className="hover:bg-[#730000] border-none">
                                <TableHead className="px-6 py-3 text-center text-base text-white">Grade</TableHead>
                                <TableHead className="px-6 py-3 text-center text-base text-white">Percentage / Equivalent</TableHead>
                                <TableHead className="px-6 py-3 text-center text-base text-white">Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { grade: '1.0', percentage: '97 - 100', description: 'Excellent' },
                                { grade: '1.25', percentage: '94 - 96', description: 'Excellent' },
                                { grade: '1.5', percentage: '91 - 93', description: 'Very Good' },
                                { grade: '1.75', percentage: '88 - 90', description: 'Very Good' },
                                { grade: '2.0', percentage: '85 - 87', description: 'Good' },
                                { grade: '2.25', percentage: '82 - 84', description: 'Good' },
                                { grade: '2.50', percentage: '79 - 81', description: 'Satisfactory' },
                                { grade: '2.75', percentage: '76 - 78', description: 'Satisfactory' },
                                { grade: '3.0', percentage: '75', description: 'Passing' },
                                { grade: '5.0', percentage: '65 - 74', description: 'Failure' },
                                { grade: 'INC', percentage: '-', description: 'Incomplete' },
                                { grade: 'W', percentage: '-', description: 'Withdrawn' },
                                { grade: 'D', percentage: '-', description: 'Dropped' },
                            ].map((scale, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-6 py-4 text-center">{scale.grade}</TableCell>
                                    <TableCell className="px-6 py-4 text-center">{scale.percentage}</TableCell>
                                    <TableCell className="px-6 py-4 text-center">{scale.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Rubric Edit Modal */}
            {rubricModalOpen && (
                <DefensePoliciesRubrics
                    category={selectedRubricCategory}
                    onClose={() => setRubricModalOpen(false)}
                    onUpdate={handleRubricUpdate}
                />
            )}
        </div>
    );
}