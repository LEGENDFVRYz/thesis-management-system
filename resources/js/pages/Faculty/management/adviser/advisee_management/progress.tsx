import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { Icon } from '@/components/icon-index';
import { iconRegistry } from '@/components/icons-registry';
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
import { index } from '@/routes/faculty/adviser/group_comp/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdviseeManagementLayout from '.';
import { GroupDetailCard, GroupOverviewCard } from './components/card-progress';
import { ProgressFilterSearch } from './components/progress-filter-search'; // Import the new component

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
    title: 'Progress Monitoring',
    subtitle:
        'Track milestone completion and submission history of all advisees',
    icon: <Icon name="peopleLinear" className="h-8 w-8 text-primary" />,
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
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [statusTags, setStatusTags] = useState<number[]>([]);

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
                    <Button variant="default">Send Message / Feedback</Button>
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

            {/* NEW: Use ProgressFilterSearch component */}
            <ProgressFilterSearch
                searchQuery={searchTerm}
                onSearchChange={setSearchTerm}
                selectedBlock={selectedBlock}
                onBlockChange={setSelectedBlock}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                selectedStatusTags={statusTags}
                onStatusTagsChange={setStatusTags}
                onClearFilters={() => {
                    setSearchTerm('');
                    setSelectedBlock('');
                    setSelectedTags([]);
                    setStatusTags([]);
                }}
            />

            <Badge variant="default" className="mt-4 mb-4">
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
                                            {searchTerm ||
                                            selectedBlock ||
                                            selectedTags.length > 0 ||
                                            statusTags.length > 0
                                                ? 'Try adjusting your filters'
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
