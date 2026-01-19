import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { SearchBar } from '@/components/filter-search';
import { Icon } from '@/components/icon-index';
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
import { index } from '@/routes/faculty/adviser/group_comp/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Filter, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useState, useMemo, useEffect } from 'react';
import AdviseeManagementLayout from '.';
import { GroupDetailCard, GroupOverviewCard } from './components/card-progress';
import { BlockAndTagsFilter } from './components/progress-filter-search';
import ProgressTrackingIcon from '@/components/Icons/progress_tracking.svg';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Setup
const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Monitoring',
        href: index().url,
    },
];

const DocuIcon = iconRegistry.docuDefault;
const BackIcon = iconRegistry.backDefault;
const PeopleIcon = iconRegistry.peopleLinear;

const pageHeader: PageHeaderProps = {
    title: "Progress Monitoring",
    subtitle: "Track milestone completion and submission history of all advisees",
    icon: (
        <img src={ProgressTrackingIcon} alt="Progress Monitoring" className="w-8 h-8" />
    ),
};

interface Groups {
    group_code: string;
    title: string;
    proponents: string;
    student_name: string;
    student_id: string;
    student_email: string;
    block: string;
    thesis_stage: string;
    status: number;
    thesis_stage_due: string;
    thesis_stage_submitted: string;
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
        student_id: '2022-12345-MN-0',
        student_email: 'ronadelacruz@iskolarngbayan.pup.edu.ph',
        block: ['BSCPE 3-3', 'BSCPE 4-3'][index % 2],
        thesis_stage: [
            'Title Proposal',
            'Manuscript Submission',
            'DP1 Manuscript Revision',
        ][index % 3],
        thesis_stage_due: 'October 5, 2025',
        thesis_stage_submitted: 'October 1, 2025',
        status: [0, 1, 2][index % 3], // 0=Pending, 1=Approved, 2=Denied
    }));

export default function Dashboard({ groups = [] }: ProgressProps) {
    const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
    const displayGroups = groups.length > 0 ? groups : sampleGroups;

    // sample variable that maps what's in the backend data
    const normalizedGroups: Groups[] = displayGroups.map((group: any) => ({
        group_code: String(group.group_number ?? group.group_code),
        title: group.proposal_title ?? group.title,
        proponents: '4', // temp / mock
        student_name: 'Rona Dela Cruz', // temp / mock
        student_id: '2022-12345-MN-0',
        student_email: 'ronadelacruz@iskolarngbayan.pup.edu.ph',
        block: String(group.block),
        thesis_stage: 'Title Proposal', // temp until backend sends this
        thesis_stage_due: 'October 5, 2025',
        thesis_stage_submitted: 'October 1, 2025',
        status: 0, // temp until backend sends this
    }));

    // console.log('groups from backend:', groups);
    // console.log('displayGroups:', displayGroups);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const groupCode = urlParams.get('group');

        if (groupCode) {
            const group = normalizedGroups.find(
                (g) => g.group_code === groupCode,
            );
            if (group) {
                setSelectedGroup(group);
            }
        }
    }, []);

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

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter logic
    const filteredGroups = normalizedGroups.filter((group) => {
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

        const matchesTag =
            selectedTags.length === 0 ||
            selectedTags.includes(group.thesis_stage);

        const matchesStatus =
            statusTags.length === 0 || statusTags.includes(group.status);

        return matchesSearch && matchesBlock && matchesTag && matchesStatus;
    });

    // --- PAGINATION LOGIC ---
    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 whenever filters change
    }, [searchTerm, selectedBlock, selectedTags, statusTags, itemsPerPage]);

    const totalItems = filteredGroups.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedGroups = useMemo(() => {
        return filteredGroups.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredGroups, startIndex, itemsPerPage]);

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

    const getStatusBadgeName = (status: number): BadgeName => {
        const statusMap: Record<number, BadgeName> = {
            0: 'statusBadgePendingReview',
            1: 'statusBadgeApproved',
            2: 'statusBadgeDenied',
        };
        return statusMap[status] || 'statusBadgePendingReview';
    };

    const handleViewClick = (group: Groups) => setSelectedGroup(group);
    const handleBackToList = () => setSelectedGroup(null);

    // Detail view
    if (selectedGroup) {
        return (
            <AdviseeManagementLayout
                breadcrumbs={breadcrumb}
                pageHeader={pageHeader}
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
                <GroupDetailCard
                    title={selectedGroup.title}
                    groupCode={selectedGroup.group_code}
                />

                <GroupOverviewCard
                    members={[
                        {
                            name: selectedGroup.student_name,
                            student_id: selectedGroup.student_id,
                            email: selectedGroup.student_email,
                            isLeader: true,
                        },
                        {
                            name: selectedGroup.student_name,
                            student_id: selectedGroup.student_id,
                            email: selectedGroup.student_email,
                            isLeader: false,
                        },
                        {
                            name: selectedGroup.student_name,
                            student_id: selectedGroup.student_id,
                            email: selectedGroup.student_email,
                            isLeader: false,
                        },
                        {
                            name: selectedGroup.student_name,
                            student_id: selectedGroup.student_id,
                            email: selectedGroup.student_email,
                            isLeader: false,
                        },
                    ]}
                    progressPercentage={60}
                    milestones={[
                        {
                            title: selectedGroup.thesis_stage,
                            due: selectedGroup.thesis_stage_due,
                            submitted: selectedGroup.thesis_stage_submitted,
                            statusBadge: getStatusBadgeName(
                                selectedGroup.status,
                            ),
                        },
                        {
                            title: selectedGroup.thesis_stage,
                            due: selectedGroup.thesis_stage_due,
                            submitted: selectedGroup.thesis_stage_submitted,
                            statusBadge: getStatusBadgeName(
                                selectedGroup.status,
                            ),
                        },
                        {
                            title: selectedGroup.thesis_stage,
                            due: selectedGroup.thesis_stage_due,
                            submitted: null,
                            statusBadge: getStatusBadgeName(
                                selectedGroup.status,
                            ),
                        },
                    ]}
                    recentSubmissions={[
                        { filename: 'BSCPE_4-3_DP1_Manuscript.pdf' },
                        { filename: 'BSCPE_4-3_Title Proposal.pdf' },
                    ]}
                />

                {/* Action Buttons */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={handleBackToList}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        // onClick={() => {
                        //     router.visit(
                        //         `/faculty/adviser/thesis-review`, (new page from thesis-review for sending message/feedback)
                        //     );
                        // }}
                    >
                        Send Message / Feedback
                    </Button>
                </div>
            </AdviseeManagementLayout>
        );
    }

    // List view with search & filters
    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
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
                        {paginatedGroups.length > 0 ? (
                            paginatedGroups.map((group, index) => (
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

                {/* PAGINATION FOOTER */}
                {totalItems > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            
                            {/* Left Side: Info & Limit Selector */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="whitespace-nowrap">
                                    Showing <strong>{startIndex + 1}</strong> - <strong>{endIndex}</strong> of <strong>{totalItems}</strong>
                                </span>
                                
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="text-xs">Rows per page</span>
                                    <Select
                                        value={itemsPerPage.toString()} 
                                        onValueChange={(val) => setItemsPerPage(Number(val))}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue placeholder={itemsPerPage} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[5, 10, 20, 50].map((size) => (
                                                <SelectItem key={size} value={size.toString()}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Right Side: Navigation Buttons */}
                            <div className="flex items-center gap-1">
                                <Button
                                    size="icon"
                                    className="h-8 w-8 hidden sm:flex"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    title="First Page"
                                >
                                    <ChevronsLeft className="h-4 w-4"/>
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    title="Previous Page"
                                >
                                    <ChevronLeft className="h-4 w-4"/>
                                </Button>
                                
                                <div className="flex items-center justify-center min-w-[3rem] px-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    Page {currentPage} of {totalPages}
                                </div>

                                <Button
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    title="Next Page"
                                >
                                    <ChevronRight className="h-4 w-4"/>
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-8 w-8 hidden sm:flex"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    title="Last Page"
                                >
                                    <ChevronsRight className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
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
