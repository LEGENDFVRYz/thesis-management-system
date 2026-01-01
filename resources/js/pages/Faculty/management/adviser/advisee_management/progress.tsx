import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { SearchBar } from '@/components/filter-search';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft, Filter, Users } from 'lucide-react';
import { useState } from 'react';
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

interface ProgressProps {
    groups: Groups[];
}

// sample data
const sampleGroups: Groups[] = Array(10).fill({
    group_code: '3301',
    title: 'Machine Learning Applications in Healthcare',
    proponents: '4',
    student_name: 'Juan Dela Cruz',
    block: 'BSCPE 3-3',
    thesis_stage: 'Manuscript Submission',
    status: 2,
});

export default function Dashboard({ groups = [] }: ProgressProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
    const displayGroups = groups.length > 0 ? groups : sampleGroups;

    // Helper function to get the correct status badge component
    const getStatusBadgeComponent = (status: number) => {
        const statusMap: Record<number, BadgeName> = {
            0: 'statusBadgePendingReview',
            1: 'statusBadgeApproved',
            2: 'statusBadgeDenied',
        };
        const badgeName = statusMap[status] || 'statusBadgePendingReview';
        const BadgeComponent = badgesRegistry[badgeName];
        return <BadgeComponent />;
    };

    const filteredGroups = displayGroups.filter(
        (group) =>
            group.student_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            group.group_code
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            group.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleViewClick = (group: Groups) => {
        setSelectedGroup(group);
    };

    const handleBackToList = () => {
        setSelectedGroup(null);
    };

    // If a group is selected, show detail view
    if (selectedGroup) {
        return (
            <AdviseeManagementLayout
                breadcrumbs={breadcrumb}
                title={`Group ${selectedGroup.group_code} Details`}
                description="View detailed information about this thesis group"
            >
                <Head title={`Group ${selectedGroup.group_code} Details`} />

                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 font-dm"
                    onClick={handleBackToList}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Progress Monitoring
                </Button>

                {/* Group Information Card */}
                <div className="h-30 rounded-lg bg-primary p-8 shadow">
                    <p className="text-body-1 text-primary-foreground">
                        Group Details
                    </p>
                    <p className="text-primary-foreground-2">
                        {selectedGroup.title}
                    </p>
                    <p className="text-body-1 text-primary-foreground">
                        {selectedGroup.group_code}
                    </p>
                </div>
                <div className="mb-6 rounded-lg bg-white p-8 shadow">
                    <h2 className="mb-6 font-dm text-2xl font-bold text-primary">
                        Group Information
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="mb-1 font-dm text-sm text-alert-desc">
                                Group Code
                            </p>
                            <p className="font-dm font-medium">
                                {selectedGroup.group_code}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 font-dm text-sm text-alert-desc">
                                Block
                            </p>
                            <p className="font-dm font-medium">
                                {selectedGroup.block}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="mb-1 font-dm text-sm text-alert-desc">
                                Thesis Title
                            </p>
                            <p className="font-dm font-medium">
                                {selectedGroup.title}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 font-dm text-sm text-alert-desc">
                                Number of Proponents
                            </p>
                            <p className="font-dm font-medium">
                                {selectedGroup.proponents}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 font-dm text-sm text-alert-desc">
                                Student Name
                            </p>
                            <p className="font-dm font-medium">
                                {selectedGroup.student_name}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 font-dm text-sm text-alert-desc">
                                Current Stage
                            </p>
                            <p className="font-dm font-medium">
                                {selectedGroup.thesis_stage}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 font-dm text-sm text-alert-desc">
                                Status
                            </p>
                            {getStatusBadgeComponent(selectedGroup.status)}
                        </div>
                    </div>
                </div>

                {/* Thesis Progress Card */}
                <div className="mb-6 rounded-lg bg-white p-8 shadow">
                    <h2 className="mb-6 font-dm text-2xl font-bold text-primary">
                        Thesis Progress
                    </h2>

                    <div className="mb-6">
                        <p className="mb-2 font-dm text-sm text-alert-desc">
                            Overall Progress
                        </p>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: '65%' }}
                            />
                        </div>
                        <p className="mt-1 font-dm text-sm font-medium">
                            65% Complete
                        </p>
                    </div>
                </div>

                {/* Recent Milestones Card */}
                <div className="rounded-lg bg-white p-8 shadow">
                    <h2 className="mb-6 font-dm text-2xl font-bold text-primary">
                        Recent Milestones
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                            <div>
                                <p className="font-dm font-medium">
                                    Title Defense
                                </p>
                                <p className="font-dm text-sm text-alert-desc">
                                    Completed on Dec 15, 2024
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                            <div>
                                <p className="font-dm font-medium">
                                    Proposal Submission
                                </p>
                                <p className="font-dm text-sm text-alert-desc">
                                    Completed on Nov 20, 2024
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="mt-2 h-2 w-2 rounded-full bg-gray-300" />
                            <div>
                                <p className="font-dm font-medium">
                                    Initial Consultation
                                </p>
                                <p className="font-dm text-sm text-alert-desc">
                                    Completed on Oct 5, 2024
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdviseeManagementLayout>
        );
    }

    // Default: Show list view
    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            title="Progress Monitoring"
            description="Track milestone completion and submission history of all advisees"
        >
            <Head title="Progress Monitoring" />

            <div className="mb-6 box-border flex h-[125.6px] w-full max-w-[1360px] flex-col items-start gap-4 self-stretch rounded-[10px] border-[0.8px] border-primary/20 bg-card p-[24.8px_24.8px_0.8px_24.8px] font-dm shadow-sm transition-all duration-200">
                {/* Header Section */}
                <div className="flex h-6 w-full flex-row items-center gap-2 self-stretch rounded-none font-dm">
                    <Filter className="h-5 w-5 text-primary" />
                    <h2 className="font-dm text-base leading-6 font-normal text-primary">
                        Filters & Search
                    </h2>
                </div>

                {/* Controls Row */}
                <div className="flex w-full flex-row items-center justify-center gap-[10px] self-stretch font-dm">
                    {/* Search Box */}
                    <div className="flex-1 font-dm">
                        <SearchBar
                            variant="filter-section"
                            placeholder="Search student, group code, or thesis title..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center gap-[10px] font-dm">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>

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

            <Badge variant="default" className="mb-4">
                Total Groups ({filteredGroups.length})
            </Badge>

            {/* Table */}
            <div className="w-full overflow-hidden rounded-lg border-1 border-[var(--primary)] bg-primary-foreground shadow">
                <Table className="w-full table-fixed">
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
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center font-medium">
                                        {group.group_code}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] text-center break-words whitespace-normal">
                                        {group.title}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {group.proponents}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {group.block}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {group.thesis_stage}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                        <div className="flex items-center justify-center">
                                            {getStatusBadgeComponent(
                                                group.status,
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="tertiary"
                                            size="sm"
                                            onClick={() =>
                                                handleViewClick(group)
                                            }
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64">
                                    <div className="flex flex-col items-center justify-center text-alert-desc">
                                        <Users className="mb-4 h-12 w-12" />
                                        <p className="text-lg font-medium">
                                            No records found
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery
                                                ? 'Try adjusting your search'
                                                : 'Groups will appear once available'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="border-t px-6 py-4 text-center text-sm text-alert-desc">
                    {filteredGroups.length} of {displayGroups.length} Groups
                </div>
            </div>
        </AdviseeManagementLayout>
    );
}
