import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { group_comp } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import AdviseeManagementLayout from '.';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Monitoring',
        href: group_comp().url,
    },
];

interface Groups {
    group_code: string;
    title: string;
    proponents: string;
    student_name: string;
    block: string;
    thesis_stage: string;
    status: number;
}

const statusMap: Record<number, { label: string; variant: any }> = {
    0: { label: 'Pending', variant: 'secondary' },
    1: { label: 'Approved', variant: 'success' },
    2: { label: 'Denied', variant: 'destructive' },
};

interface ProgressProps {
    groups: Groups[];
}

// sample fallback data
const sampleGroups: Groups[] = Array(10).fill({
    group_code: '3301',
    title: 'Machine Learning Applications in Healthcare',
    proponents: 'Juan Dela Cruz, Maria Santos',
    student_name: 'Juan Dela Cruz',
    block: 'BSCPE 3-3',
    thesis_stage: 'Manuscript Submission',
});

export default function Dashboard({ groups = [] }: ProgressProps) {
    const displayGroups = groups.length > 0 ? groups : sampleGroups;

    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            title="Progress Monitoring"
            description="Track milestone completion and submission history of all advisees"
        >
            <Head title="Progress Monitoring" />

            {/* Filters & Search */}
            <div className="border-border-primary-muted mb-6 rounded-lg border bg-primary-foreground p-6 shadow">
                <p className="mb-4 text-primary">Filters & Search</p>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search student, group code, or thesis title..."
                        className="flex-1 border-[var(--border-primary-muted)] bg-[var(--breadcrumb)] p-4 text-[var(--text-primary)] placeholder:text-[var(--alert-desc)] focus:ring-0"
                    />
                    <Button variant="primary">Clear Filter</Button>
                </div>
            </div>

            <Badge variant="default" className="mb-4">
                Total Groups ({displayGroups.length})
            </Badge>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border-1 border-[var(--primary)] bg-primary-foreground shadow">
                <Table className="w-[1400px]">
                    <TableHeader>
                        <TableRow className="bg-primary hover:bg-primary">
                            <TableHead className="text-center text-primary-foreground">
                                Group Code
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Thesis Title
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Proponents
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Block
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Thesis Stage
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Status
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {displayGroups.length > 0 ? (
                            displayGroups.map((group, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center font-medium">
                                        {group.group_code}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {group.title}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {group.proponents}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {group.block}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">
                                            {group.thesis_stage}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="tertiary" size="sm">
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64">
                                    <div className="flex flex-col items-center justify-center text-alert-desc">
                                        <Users className="mb-4 h-12 w-12" />
                                        <p className="text-lg font-medium">
                                            No records found
                                        </p>
                                        <p className="text-sm">
                                            Groups will appear once available
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="border-t px-6 py-4 text-center text-sm text-alert-desc">
                    {displayGroups.length} of {displayGroups.length} Groups
                </div>
            </div>
        </AdviseeManagementLayout>
    );
}
