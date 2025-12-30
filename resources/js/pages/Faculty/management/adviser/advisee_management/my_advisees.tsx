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
import { my_advisees } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import AdviseeManagementLayout from '.';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'My Advisees',
        href: my_advisees().url,
    },
];

interface Advisee {
    student_id: string;
    student_name: string;
    pup_webmail: string;
    group_code: string;
    block: string;
}

interface MyAdviseesProps {
    advisees: Advisee[];
}

// Sample data - 1 student duplicated 20 times
const sampleAdvisees: Advisee[] = Array(20).fill({
    student_id: '2022-12345-MN-0',
    student_name: 'Rona Dela Cruz',
    pup_webmail: 'ronadelacruz@iskolarngbayan.pup.edu.ph',
    group_code: '3301',
    block: 'BSCPE 3-3',
});

export default function MyAdvisees({ advisees = [] }: MyAdviseesProps) {
    // Use sample data if no real data provided
    const displayAdvisees = advisees.length > 0 ? advisees : sampleAdvisees;

    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            title="My Advisees"
            description="View and manage all students under supervision with their current thesis stages"
        >
            <Head title="My Advisees" />

            {/* Filters & Search Section */}
            <div className="border-border-primary-muted] mb-6 rounded-lg border-[1px] bg-white p-6 shadow">
                <div className="mb-4">
                    <p className="text-body-2 mb-2 text-primary">
                        Filters & Search
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        placeholder="Search student name, student ID, or thesis title..."
                        className="flex-1 border-[var(--border-primary-muted)] bg-[var(--breadcrumb)] p-4 text-[var(--text-primary)] placeholder:text-[var(--alert-desc)] focus:ring-0"
                    />
                    <Button variant="primary">Clear Filter</Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border-1 border-[var(--primary)] bg-white shadow">
                <Table className="w-[1360px]">
                    <TableHeader>
                        <TableRow className="bg-[#730000] hover:bg-[#730000]">
                            <TableHead className="text-center text-white">
                                Student ID
                            </TableHead>
                            <TableHead className="text-center text-white">
                                Student Name
                            </TableHead>
                            <TableHead className="text-center text-white">
                                PUP Webmail
                            </TableHead>
                            <TableHead className="text-center text-white">
                                Group Code
                            </TableHead>
                            <TableHead className="text-center text-white">
                                Block
                            </TableHead>
                            <TableHead className="text-center text-white">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr]:border-b-0">
                        {displayAdvisees.length > 0 ? (
                            displayAdvisees.map((advisee, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center font-medium">
                                        {advisee.student_id}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {advisee.student_name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {advisee.pup_webmail}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {advisee.group_code}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {advisee.block}
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
                                <TableCell
                                    colSpan={6}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Users className="mb-4 h-12 w-12 text-gray-300" />
                                        <p className="text-lg font-medium">
                                            No advisees found
                                        </p>
                                        <p className="text-sm">
                                            Students will appear here once
                                            assigned
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdviseeManagementLayout>
    );
}
