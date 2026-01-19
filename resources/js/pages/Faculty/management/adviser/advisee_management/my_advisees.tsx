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
import { index } from '@/routes/faculty/adviser/my_advisees/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import AdviseeManagementLayout from '.';
import { AdviseeFilterSearch } from './components/advisee-filter-search';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'My Advisees',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: 'My Advisees',
    subtitle:
        'View and manage all students under supervision with their current thesis stages',
    icon: <Icon name="peopleLinear" className="h-8 w-8 text-primary" />,
};

interface Advisee {
    student_id: string;
    student_name: string;
    pup_webmail: string;
    group_code: string;
    block: string;
    thesis_stage: string;
    thesis_title: string;
    co_researchers: string[];
    progress_percentage: number;
}

interface MyAdviseesProps {
    advisees: Advisee[];
}

// Sample data - with thesis_stage added
const sampleAdvisees: Advisee[] = Array(20)
    .fill(null)
    .map((_, index) => ({
        student_id: '2022-12345-MN-0',
        student_name: 'Rona Dela Cruz',
        pup_webmail: 'ronadelacruz@iskolarngbayan.pup.edu.ph',
        group_code: '3301',
        block: 'BSCPE 3-3',
        thesis_stage: [
            'Title Proposal',
            'Manuscript Submission',
            'DP1 Manuscript Revision',
        ][index % 3],
        thesis_title: [
            'Machine Learning Applications in Healthcare',
            'IoT-Based Smart Home System',
            'Blockchain for Supply Chain Management',
        ][index % 3],
        co_researchers: ['Jane Smith', 'John Doe', 'Alice Johnson'],
        progress_percentage: [40, 60, 80][index % 3],
    }));

export default function MyAdvisees({ advisees = [] }: MyAdviseesProps) {
    const displayAdvisees = advisees.length > 0 ? advisees : sampleAdvisees;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedAdvisee, setSelectedAdvisee] = useState<Advisee | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredAdvisees = displayAdvisees.filter((advisee) => {
        const matchesSearch =
            advisee.student_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            advisee.student_id
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            advisee.pup_webmail
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesBlock = !selectedBlock || advisee.block === selectedBlock;

        const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.includes(advisee.thesis_stage);

        return matchesSearch && matchesBlock && matchesTags;
    });

    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <Head title="My Advisees" />

            <AdviseeFilterSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedBlock={selectedBlock}
                onBlockChange={setSelectedBlock}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                onClearFilters={() => {
                    setSearchQuery('');
                    setSelectedBlock('');
                    setSelectedTags([]);
                }}
            />

            <Badge variant="default" className="mt-4 mb-4">
                Total Advisees ({filteredAdvisees.length})
            </Badge>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border-1 border-[var(--primary)] bg-primary-foreground shadow">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow className="bg-primary hover:bg-primary">
                            <TableHead className="text-center text-primary-foreground">
                                Student ID
                            </TableHead>
                            <TableHead className="w-[180px] text-center text-primary-foreground">
                                Student Name
                            </TableHead>
                            <TableHead className="w-[280px] text-center text-primary-foreground">
                                PUP Webmail
                            </TableHead>
                            <TableHead className="w-[120px] text-center text-primary-foreground">
                                Group Code
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Block
                            </TableHead>
                            <TableHead className="text-center text-primary-foreground">
                                Thesis Stage
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
                                    <TableCell className="w-[180px] text-center break-words whitespace-normal">
                                        {advisee.student_name}
                                    </TableCell>
                                    <TableCell className="w-[280px] text-center whitespace-nowrap">
                                        {advisee.pup_webmail}
                                    </TableCell>
                                    <TableCell className="w-[120px] text-center whitespace-nowrap">
                                        {advisee.group_code}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {advisee.block}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {advisee.thesis_stage}
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
                                    colSpan={7}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-alert-desc">
                                        <Users className="mb-4 h-12 w-12 text-alert-desc" />
                                        <p className="text-lg font-medium">
                                            No advisees found
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery ||
                                            selectedBlock ||
                                            selectedTags.length > 0
                                                ? 'Try adjusting your search or filters'
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
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            router.visit(
                                                `/faculty/adviser/progress`,
                                            );
                                        }}
                                    >
                                        View
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Thesis Title
                                        </p>
                                        <p className="font-medium">
                                            {selectedAdvisee?.thesis_title}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Co-researchers
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            {selectedAdvisee?.co_researchers.map(
                                                (researcher, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="rounded-full"
                                                    >
                                                        {researcher}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-body-3 text-alert-desc">
                                            Thesis Stage
                                        </p>
                                        <p className="font-medium">
                                            {selectedAdvisee?.thesis_stage}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-body-3 mb-2 text-alert-desc">
                                            Progress
                                        </p>
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-primary">
                                            <div
                                                className="h-full bg-primary-foreground-2"
                                                style={{
                                                    width: `${selectedAdvisee?.progress_percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm font-medium">
                                            {
                                                selectedAdvisee?.progress_percentage
                                            }
                                            % Complete
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
