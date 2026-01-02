import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { SearchBar } from '@/components/filter-search';
import { iconRegistry } from '@/components/icons-registry';
import { type TimelineEvent } from '@/components/timeline';
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
import { TimelineState } from '@/components/ui/wizard-timeline';
import { group_comp } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Filter, Users } from 'lucide-react';
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

const groupTimeline: TimelineEvent[] = [
    {
        id: '1',
        title: 'DP1 Manuscript',
        dateRange: 'Oct 10 – Oct 20',
        description: 'Draft manuscript submission',
        status: 'current',
        isCurrent: true,
    },
];

const DocuIcon = iconRegistry.docuDefault;
const BackIcon = iconRegistry.backDefault;
const PeopleIcon = iconRegistry.peopleLinear;

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
                title="Progress Monitoring"
                description="Track milestone completion and submission history of all advisees"
            >
                <Head title="Progress Monitoring" />

                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={handleBackToList}
                >
                    <BackIcon className="h-6 w-6 shrink-0 text-primary" />
                    <p className="text-title-3 text-primary underline">
                        Return
                    </p>
                </div>

                {/* Group Information Card */}
                <div className="flex flex-col gap-4 rounded-lg bg-primary p-8 shadow">
                    {/* Card Header */}
                    <div>
                        <p className="text-body-1 font-semibold text-primary-foreground">
                            Group Details
                        </p>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col gap-1">
                        <p className="text-primary-foreground-2">
                            {selectedGroup.title}
                        </p>

                        <p className="text-body-1 text-primary-foreground">
                            {selectedGroup.group_code}
                        </p>
                    </div>
                </div>
                <div className="rounded-lg border-1 border-primary/20 shadow">
                    {/* Group Members Card */}
                    <div className="rounded-lg bg-white p-8">
                        <h2 className="mb-6 font-dm text-xl font-bold text-primary">
                            Group Members
                        </h2>

                        <div className="space-y-3">
                            {[
                                { name: 'Rona Dela Cruz', isLeader: true },
                                { name: 'Rona Dela Cruz', isLeader: false },
                                { name: 'Rona Dela Cruz', isLeader: false },
                                { name: 'Rona Dela Cruz', isLeader: false },
                            ].map((member, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg bg-breadcrumb p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-dm font-semibold text-white">
                                            RDC
                                        </div>
                                        <div>
                                            <p className="font-dm font-medium text-primary">
                                                {member.name}
                                            </p>
                                            <p className="font-dm text-sm text-alert-default">
                                                2022-12345-MN-0
                                            </p>
                                            <p className="font-dm text-xs text-alert-default">
                                                ronadelacruz@iskolarngbayan.pup.edu.ph
                                            </p>
                                        </div>
                                    </div>
                                    {member.isLeader && (
                                        <Badge variant="default">Leader</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Milestone Progress Card */}
                    <div className="-mt-8 rounded-lg bg-white p-8 shadow">
                        <h2 className="mb-6 font-dm text-xl font-bold text-primary">
                            Milestone Progress
                        </h2>
                        {/* Progress + Timeline Container */}
                        <div className="rounded-lg bg-breadcrumb p-6">
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-body-2 font-dm font-bold text-primary">
                                        Progress
                                    </p>
                                    <p className="font-dm text-sm font-semibold text-primary">
                                        60% Complete
                                    </p>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div className="h-full w-[60%] rounded-full bg-primary bg-gradient-to-r" />
                                </div>
                            </div>

                            {/* Timeline with Milestones */}
                            <div className="space-y-0">
                                {[
                                    {
                                        title: 'DP1 Manuscript',
                                        due: 'October 5, 2025',
                                        submitted: 'October 1, 2025',
                                        statusBadge:
                                            'statusBadgeApproved' as BadgeName,
                                    },
                                    {
                                        title: 'Title Proposal',
                                        due: 'October 15, 2025',
                                        submitted: 'October 10, 2025',
                                        statusBadge:
                                            'statusBadgeApproved' as BadgeName,
                                    },
                                    {
                                        title: 'Chapter 1 Submission',
                                        due: 'November 5, 2025',
                                        submitted: null,
                                        statusBadge:
                                            'statusBadgePendingReview' as BadgeName,
                                    },
                                ].map((milestone, index, array) => {
                                    const BadgeComponent =
                                        badgesRegistry[milestone.statusBadge];

                                    const state =
                                        milestone.statusBadge ===
                                        'statusBadgeApproved'
                                            ? index === 0
                                                ? 'past'
                                                : 'current'
                                            : 'upcoming';

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-start gap-4"
                                        >
                                            {/* Timeline State Column */}
                                            <div className="flex flex-col items-center pt-1">
                                                <TimelineState
                                                    state={state}
                                                    className={
                                                        index ===
                                                        array.length - 1
                                                            ? '[&_svg]:hidden'
                                                            : ''
                                                    }
                                                />
                                            </div>

                                            {/* Content Card */}
                                            <div className="mb-4 flex-1 rounded-lg border border-primary/20 bg-breadcrumb p-4 shadow-md">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <p className="mb-1 font-dm font-semibold text-primary">
                                                            {milestone.title}
                                                        </p>
                                                        <p className="font-dm text-sm text-primary">
                                                            Due: {milestone.due}
                                                        </p>
                                                        {milestone.submitted && (
                                                            <p className="font-dm text-sm text-alert-selected">
                                                                Submitted:{' '}
                                                                {
                                                                    milestone.submitted
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <BadgeComponent />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Submissions Card */}
                    <div className="-mt-8 rounded-lg bg-primary-foreground p-8 shadow">
                        <h2 className="mb-6 font-dm text-xl font-bold text-primary">
                            Recent Submissions
                        </h2>

                        <div className="divide-y divide-border overflow-hidden rounded-lg border border-primary/20">
                            {[
                                'BSCPE_4-3_DP1_Manuscript.pdf',
                                'BSCPE_4-3_Title Proposal.pdf',
                            ].map((file, index) => (
                                <div
                                    key={index}
                                    className="group flex cursor-pointer items-center gap-3 border-l-4 border-transparent bg-gray-50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/30"
                                >
                                    {/* Document Icon */}
                                    <DocuIcon className="h-6 w-6 shrink-0 text-primary" />

                                    {/* File Name */}
                                    <p className="truncate font-dm font-medium text-primary">
                                        {file}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={handleBackToList}>
                        Cancel
                    </Button>

                    <Button variant="default">Send Message / Feedback</Button>
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
