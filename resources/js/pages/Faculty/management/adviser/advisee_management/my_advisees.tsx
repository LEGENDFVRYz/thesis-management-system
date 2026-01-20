import { SearchBar, Sort2 } from '@/components/filter-search';
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
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdviseeManagementLayout from '.';
import { BlockAndTagsFilter } from './components/advisee-filter-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'My Advisees',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "My Advisees",
    subtitle: "View and manage all students under supervision with their current thesis stages",
    icon: (
        // pa correct nalang
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};



interface Advisee {
    student_id: string;
    student_name: string;
    pup_webmail: string;
    group_code: string;
    block: string;
    thesis_stage: string;
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
    }));

export default function MyAdvisees({ advisees = [] }: MyAdviseesProps) {
    const displayAdvisees = advisees.length > 0 ? advisees : sampleAdvisees;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedAdvisee, setSelectedAdvisee] = useState<Advisee | null>(
        null,
    );
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- FILTER LOGIC ---
    const filteredAdvisees = useMemo(() => {
        return displayAdvisees.filter((advisee) => {
            const matchesSearch =
                advisee.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                advisee.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                advisee.pup_webmail.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesBlock = !selectedBlock || advisee.block === selectedBlock;

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.includes(advisee.thesis_stage);

            return matchesSearch && matchesBlock && matchesTags;
        });
    }, [displayAdvisees, searchQuery, selectedBlock, selectedTags]);

    // --- PAGINATION LOGIC ---
    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 whenever filters change
    }, [searchQuery, selectedBlock, selectedTags, itemsPerPage]);

    const totalItems = filteredAdvisees.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedAdvisees = useMemo(() => {
        return filteredAdvisees.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAdvisees, startIndex, itemsPerPage]);

    return (
        <AdviseeManagementLayout
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
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
                    <div className="flex flex-row items-center gap-[2px] font-dm">
                        {/* Sort Button */}
                        {/* <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsSortOpen(true)}
                        >
                            <Icon name="sortDefault" size={16} />
                        </Button> */}

                        {/* Filter Button */}
                        {/* <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter className="h-4 w-4" />
                        </Button> */}

                        {/* Clear Filter Button */}
                        <Button
                            variant="negative"
                            className="h-9 min-w-[101px] gap-2 rounded-lg px-4 py-2 font-dm"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedBlock('');
                                setSelectedTags([]);
                            }}
                        >
                            <span className="font-dm text-[13.33px] font-medium">
                                Clear Filter
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border-1 border-[var(--primary)] bg-primary-foreground shadow flex flex-col">
                <div className="min-h-[400px]">
                    <Table className="w-[1360px]">
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary">
                                <TableHead className="text-center text-primary-foreground">Student ID</TableHead>
                                <TableHead className="text-center text-primary-foreground">Student Name</TableHead>
                                <TableHead className="text-center text-primary-foreground">PUP Webmail</TableHead>
                                <TableHead className="text-center text-primary-foreground">Group Code</TableHead>
                                <TableHead className="text-center text-primary-foreground">Block</TableHead>
                                <TableHead className="text-center text-primary-foreground">Thesis Stage</TableHead>
                                <TableHead className="text-center text-primary-foreground">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_tr]:border-b-0">
                            {paginatedAdvisees.length > 0 ? (
                                paginatedAdvisees.map((advisee, index) => (
                                    <TableRow key={index} className="hover:bg-accent/5 transition-colors">
                                        <TableCell className="text-center font-medium">{advisee.student_id}</TableCell>
                                        <TableCell className="text-center">{advisee.student_name}</TableCell>
                                        <TableCell className="text-center">{advisee.pup_webmail}</TableCell>
                                        <TableCell className="text-center">{advisee.group_code}</TableCell>
                                        <TableCell className="text-center">{advisee.block}</TableCell>
                                        <TableCell className="text-center">{advisee.thesis_stage}</TableCell>
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
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-alert-desc">
                                            <Users className="mb-4 h-12 w-12 text-alert-desc" />
                                            <p className="text-lg font-medium">No advisees found</p>
                                            <p className="text-sm">
                                                {searchQuery || selectedBlock || selectedTags.length > 0
                                                    ? 'Try adjusting your search or filters'
                                                    : 'Students will appear here once assigned'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

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

            <Dialog open={isSortOpen} onOpenChange={setIsSortOpen}>
                <DialogContent className="p-0">
                    <Sort2 />
                </DialogContent>
            </Dialog>

            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent
                    className="p-0 [&_[data-slot=dialog-overlay]]:bg-foreground/20 [&_[data-slot=dialog-overlay]]:backdrop-blur-sm"
                    style={{ maxWidth: '350px' }}
                >
                    <BlockAndTagsFilter
                        block={selectedBlock}
                        onBlockChange={setSelectedBlock}
                        tags={selectedTags}
                        onTagsChange={setSelectedTags}
                        onApply={() => setIsFilterOpen(false)}
                        onReset={() => {
                            setSelectedBlock('');
                            setSelectedTags([]);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </AdviseeManagementLayout>
    );
}
