import { SearchBar } from '@/components/filter-search';
import { Icon } from '@/components/icon-index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
import { Filter, Users } from 'lucide-react';
import { useState } from 'react';
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
    const displayAdvisees = advisees.length > 0 ? advisees : sampleAdvisees;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedAdvisee, setSelectedAdvisee] = useState<Advisee | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState('');

    // Filter advisees based on search query
    const filteredAdvisees = displayAdvisees.filter(
        (advisee) =>
            advisee.student_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            advisee.student_id
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            advisee.pup_webmail
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            advisee.group_code
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            advisee.block.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            title="My Advisees"
            description="View and manage all students under supervision with their current thesis stages"
        >
            <Head title="My Advisees" />

            {/* Filter & Search Section with Container Styling */}
            <div className="box-border flex h-[134px] w-full max-w-[1360px] flex-col items-start gap-4 self-stretch rounded-[10px] border-[0.8px] border-primary/20 bg-card p-[24.8px_24.8px_0.8px_24.8px] font-dm shadow-sm transition-all duration-200">
                {/* Header Section */}
                <div className="flex h-6 w-full flex-row items-center gap-2 self-stretch rounded-none font-dm">
                    <Filter className="h-5 w-5 text-primary" />
                    <h2 className="font-dm text-base leading-6 font-normal text-primary">
                        Search, Sort, & Filter
                    </h2>
                </div>

                {/* Controls Row */}
                <div className="flex w-full flex-row items-center justify-center gap-[10px] self-stretch font-dm">
                    {/* Search Box */}
                    <div className="flex-1 font-dm">
                        <SearchBar
                            variant="filter-section"
                            placeholder="Search student name, student ID, or thesis title..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center gap-[10px] font-dm">
                        {/* Sort Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                        >
                            <Icon name="sortDefault" size={16} />
                        </Button>

                        {/* Filter Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>

                        {/* Clear Filter Button */}
                        <Button
                            variant="negative"
                            className="h-9 min-w-[101px] gap-2 rounded-lg px-4 py-2 font-dm"
                            onClick={() => setSearchQuery('')}
                        >
                            <span className="font-dm text-[13.33px] font-medium">
                                Clear Filter
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border-1 border-[var(--primary)] bg-primary-foreground shadow">
                <Table className="w-[1360px]">
                    <TableHeader>
                        <TableRow className="bg-primary hover:bg-primary">
                            <TableHead className="text-center text-primary-foreground">
                                Student ID
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Student Name
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                PUP Webmail
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Group Code
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Block
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr]:border-b-0">
                        {filteredAdvisees.length > 0 ? (
                            filteredAdvisees.map((advisee, index) => (
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
                                        <Button
                                            variant="tertiary"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedAdvisee(advisee);
                                                setIsProfileOpen(true);
                                            }}
                                        >
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
                                    <div className="flex flex-col items-center justify-center text-alert-desc">
                                        <Users className="mb-4 h-12 w-12 text-alert-desc" />
                                        <p className="text-lg font-medium">
                                            No advisees found
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery
                                                ? 'Try adjusting your search'
                                                : 'Students will appear here once assigned'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="border-t border-gray-200 bg-primary-foreground px-6 py-4 text-center">
                    <p className="text-sm text-alert-desc">
                        {filteredAdvisees.length} of {displayAdvisees.length}{' '}
                        Student Accounts
                    </p>
                </div>
            </div>

            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent
                    className="p-0 [&_[data-slot=dialog-overlay]]:bg-foreground/20 [&_[data-slot=dialog-overlay]]:backdrop-blur-sm"
                    style={{ maxWidth: '800px' }}
                >
                    {/* Header */}
                    <div className="flex flex-col gap-1 rounded-t-lg bg-primary pt-6 pb-4 pl-6">
                        <p className="text-lg text-primary-foreground">
                            Student Profile
                        </p>
                        {selectedAdvisee && (
                            <p className="font-bold text-primary-foreground-2">
                                {selectedAdvisee.student_name} (
                                {selectedAdvisee.student_id})
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Left Column - Student Information */}
                        <div className="mb-6 grid grid-cols-2 gap-25">
                            <div>
                                <div className="mb-4">
                                    <p className="text-body-1 mb-4 pb-0 font-bold text-primary">
                                        STUDENT INFORMATION
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Student ID
                                        </p>
                                        <p className="text-body-2 font-medium">
                                            {selectedAdvisee?.student_id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            PUP Webmail
                                        </p>
                                        <p className="text-body-2 font-medium">
                                            {selectedAdvisee?.pup_webmail}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Block
                                        </p>
                                        <p className="text-body-2 font-medium">
                                            {selectedAdvisee?.block}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Group Code
                                        </p>
                                        <p className="text-body-2 font-medium">
                                            {selectedAdvisee?.group_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column - Thesis Information */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <p className="text-body-1 mb-2 pb-2 font-bold text-primary">
                                        THESIS INFORMATION
                                    </p>
                                    <Button variant="primary" size="sm">
                                        View
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Thesis Title
                                        </p>
                                        <p className="font-medium">
                                            Machine Learning Applications in
                                            Healthcare
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Co-researchers
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            <Badge
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                Jane Smith
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                Jane Smith
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                Jane Smith
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Thesis Stage
                                        </p>
                                        <p className="font-medium">
                                            Manuscript Submission
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-body-3 mb-2 text-alert-desc">
                                            Progress
                                        </p>
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-primary">
                                            <div
                                                className="h-full bg-primary-foreground-2"
                                                style={{ width: '60%' }}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm font-medium">
                                            60% Complete
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="negative"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary">
                                Send Message/Feedback
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdviseeManagementLayout>
    );
}
