import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { SearchBar } from '@/components/filter-search';
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
import { TimelineState } from '@/components/ui/wizard-timeline';
import { index } from '@/routes/faculty/adviser/group_comp/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Filter, Users } from 'lucide-react';
import { useState } from 'react';
import AdviseeManagementLayout from '.';
import { Icon } from '@/components/icon-index';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Monitoring',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Progress Monitoring",
    subtitle: "Track milestone completion and submission history of all advisees",
    icon: (
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

interface Groups {
    group_code: string;
    proposal_title: string;
    proponents_count: number;
    block: string;
    thesis_stage: string;
    calculated_status: string;
}

interface ProgressProps {
    groups: Groups[];
}

const DocuIcon = iconRegistry.docuDefault;
const BackIcon = iconRegistry.backDefault;
const PeopleIcon = iconRegistry.peopleLinear;

export default function Dashboard({ groups = [] }: ProgressProps) {
    const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);

    const displayGroups =
        groups.length > 0
            ? groups.map((g: any) => ({
                  group_code: g.group_code,
                  title: g.proposal_title,
                  proponents: g.proponents_count,
                  block: g.block,
                  thesis_stage: g.thesis_stage,
                  status: g.calculated_status === "Active" ? 1 : 0,
              }))
            : [];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');

    const [selectedTags, setSelectedTags] = useState<string[]>([
        'No Proposal',
        'Proposal Pending',
        'Proposal Approved',
        'Thesis Draft',
        'Thesis Manuscript',
    ]);

    const [statusTags, setStatusTags] = useState<number[]>([0, 1]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredGroups = displayGroups.filter((group) => {
        const matchesSearch =
            searchTerm === '' ||
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

    const getStatusBadgeComponent = (status: number) => {
        const statusMap: Record<number, BadgeName> = {
            0: 'statusBadgePendingReview',
            1: 'statusBadgeApproved',
        };
        const badgeName = statusMap[status] || 'statusBadgePendingReview';
        const BadgeComponent = badgesRegistry[badgeName];
        return <BadgeComponent />;
    };

    const handleViewClick = (group: any) => setSelectedGroup(group);
    const handleBackToList = () => setSelectedGroup(null);

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

                <div className="flex flex-col gap-4 rounded-lg bg-primary p-8 shadow">
                    <div>
                        <p className="text-body-1 font-semibold text-primary-foreground">
                            Group Details
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-primary-foreground-2">
                            {selectedGroup.title}
                        </p>
                        <p className="text-body-1 text-primary-foreground">
                            {selectedGroup.group_code}
                        </p>
                    </div>
                </div>

            </AdviseeManagementLayout>
        );
    }

    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <Head title="Progress Monitoring" />

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
                                    'No Proposal',
                                    'Proposal Pending',
                                    'Proposal Approved',
                                    'Thesis Draft',
                                    'Thesis Manuscript',
                                ]);
                                setStatusTags([0, 1]);
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
                                            {getStatusBadgeComponent(group.status)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="tertiary"
                                            size="sm"
                                            onClick={() => handleViewClick(group)}
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
        </AdviseeManagementLayout>
    );
}
