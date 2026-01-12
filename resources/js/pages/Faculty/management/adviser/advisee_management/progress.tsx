import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { SearchBar } from '@/components/filter-search';
import { iconRegistry } from '@/components/icons-registry';
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
import { TimelineState } from '@/components/ui/wizard-timeline';
import { index } from '@/routes/faculty/adviser/group_comp/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Filter, Users } from 'lucide-react';
import { useState } from 'react';
import AdviseeManagementLayout from '.';
import { BlockAndTagsFilter } from './progress-filter-search';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Monitoring',
        href: index().url,
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

// Sample data with statuses and thesis stages
const sampleGroups: Groups[] = Array(9)
    .fill(null)
    .map((_, index) => ({
        group_code: `330${index + 1}`,
        title: [
            'Machine Learning Applications in Healthcare',
            'IoT-Based Smart Home System',
            'Blockchain for Supply Chain Management',
            'AI-Powered Student Performance Predictor',
            'Mobile App for Mental Health Support',
            'Web-Based Inventory Management System',
            'Cybersecurity Framework for SMEs',
            'Renewable Energy Monitoring System',
            'E-commerce Platform with Analytics',
        ][index],
        proponents: '4',
        student_name: 'Rona Dela Cruz',
        block: ['BSCPE 3-3', 'BSCPE 4-3'][index % 2],
        thesis_stage: [
            'Title Proposal',
            'Manuscript Submission',
            'DP1 Manuscript Revision',
        ][index % 3],
        status: [0, 1, 2][index % 3], // 0=Pending, 1=Approved, 2=Denied
    }));

const DocuIcon = iconRegistry.docuDefault;
const BackIcon = iconRegistry.backDefault;
const PeopleIcon = iconRegistry.peopleLinear;

export default function Dashboard({ groups = [] }: ProgressProps) {
    const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
    const displayGroups = groups.length > 0 ? groups : sampleGroups;

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([
        'Title Proposal',
        'Manuscript Submission',
        'DP1 Manuscript Revision',
    ]);
    const [statusTags, setStatusTags] = useState<number[]>([0, 1, 2]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter logic
    const filteredGroups = displayGroups.filter((group) => {
        const matchesSearch =
            searchTerm === '' ||
            group.student_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            group.group_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBlock = selectedBlock
            ? group.block === selectedBlock
            : true;

        const matchesTag = selectedTags.length
            ? selectedTags.includes(group.thesis_stage)
            : true;

        const matchesStatus =
            statusTags.length === 0 ? true : statusTags.includes(group.status);

        return matchesSearch && matchesBlock && matchesTag && matchesStatus;
    });

    // Helper to get badge
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

    const handleViewClick = (group: Groups) => setSelectedGroup(group);
    const handleBackToList = () => setSelectedGroup(null);

    // Detail view - COMPLETE VERSION FROM DOCUMENT 3
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

    // List view with search & filters
    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            title="Progress Monitoring"
            description="Track milestone completion and submission history of all advisees"
        >
            <Head title="Progress Monitoring" />

            {/* Search & Filter Controls */}
            <div className="mb-6 flex h-[125.6px] w-full max-w-[1360px] flex-col gap-4 rounded-[10px] border-[0.8px] border-primary/20 bg-card p-[24.8px_24.8px_0.8px_24.8px] font-dm shadow-sm">
                <div className="flex h-6 w-full items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-normal text-primary">
                        Filters & Search
                    </h2>
                </div>

                <div className="flex w-full items-center gap-[10px]">
                    <div className="flex-1">
                        <SearchBar
                            variant="filter-section"
                            placeholder="Search student, group code, or thesis title..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>

                    <div className="flex items-center gap-[10px]">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="negative"
                            className="h-9 min-w-[101px] gap-2 px-4 py-2"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedBlock('');
                                setSelectedTags([
                                    'Title Proposal',
                                    'Manuscript Submission',
                                    'DP1 Manuscript Revision',
                                ]);
                                setStatusTags([0, 1, 2]);
                            }}
                        >
                            Clear Filter
                        </Button>
                    </div>
                </div>
            </div>

            <Badge variant="default" className="mb-4">
                Total Groups ({filteredGroups.length})
            </Badge>

            {/* Groups Table */}
            <div className="w-full overflow-hidden rounded-lg border border-primary bg-primary-foreground shadow">
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
                                    <TableCell className="text-center align-middle">
                                        <div className="flex h-full items-center justify-center">
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
                                            {searchTerm
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

            {/* Filters Modal */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent
                    className="p-0 [&_[data-slot=dialog-overlay]]:bg-foreground/20 [&_[data-slot=dialog-overlay]]:backdrop-blur-sm"
                    style={{
                        maxWidth: '400px',
                        overflow: 'visible',
                    }}
                >
                    <BlockAndTagsFilter
                        block={selectedBlock}
                        onBlockChange={setSelectedBlock}
                        tags={selectedTags}
                        onTagsChange={setSelectedTags}
                        statusTags={statusTags}
                        onStatusTagsChange={setStatusTags}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        onApply={() => setIsFilterOpen(false)}
                        onReset={() => {
                            setSelectedBlock('');
                            setSelectedTags([
                                'Title Proposal',
                                'Manuscript Submission',
                                'DP1 Manuscript Revision',
                            ]);
                            setStatusTags([0, 1, 2]);
                            setSearchTerm('');
                        }}
                    />
                </DialogContent>
            </Dialog>
        </AdviseeManagementLayout>
    );
}
