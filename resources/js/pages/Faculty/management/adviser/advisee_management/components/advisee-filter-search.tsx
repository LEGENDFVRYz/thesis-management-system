import { GeneralSort, SearchBar } from '@/components/filter-search';
import { Icon } from '@/components/icon-index';
import { SecondarySort } from '@/components/Icons/secondary-sort';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Filter, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AdviseeFilterSearchProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    selectedBlock?: string;
    onBlockChange?: (block: string) => void;
    selectedTags?: string[];
    onTagsChange?: (tags: string[]) => void;
    onClearFilters?: () => void;
}

export function AdviseeFilterSearch({
    searchQuery = '',
    onSearchChange,
    selectedBlock = '',
    onBlockChange,
    selectedTags = [],
    onTagsChange,
    onClearFilters,
}: AdviseeFilterSearchProps) {
    const [query, setQuery] = useState(searchQuery);
    const [block, setBlock] = useState(selectedBlock);
    const [tags, setTags] = useState<string[]>(selectedTags);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);

    const handleSearchChange = (value: string) => {
        setQuery(value);
        onSearchChange?.(value);
    };

    const handleClearAll = () => {
        setQuery('');
        setBlock('');
        setTags([]);
        onSearchChange?.('');
        onBlockChange?.('');
        onTagsChange?.([]);
        onClearFilters?.();
    };

    return (
        <>
            {/* Filter & Search Section with Container Styling */}
            <div
                className={cn(
                    'flex w-full max-w-[1360px] flex-none flex-col items-start self-stretch rounded-[10px] bg-card',
                    'box-border border-[0.8px] border-primary/20 transition-all duration-200',
                    'h-[125.6px] gap-4 p-[24.8px_24.8px_0.8px_24.8px] shadow-sm',
                    'font-dm',
                )}
            >
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
                            placeholder="Search student name, student ID, or thesis title..."
                            value={query}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center gap-[10px] font-dm">
                        {/* Sort Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsSortModalOpen(true)}
                        >
                            <Icon name="sortDefault" size={16} />
                        </Button>

                        {/* Filter Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsFilterModalOpen(true)}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>

                        {/* Clear Filter Button */}
                        <Button
                            variant="negative"
                            className="h-9 min-w-[101px] gap-2 rounded-lg px-4 py-2 font-dm"
                            onClick={handleClearAll}
                        >
                            <Trash2 className="h-4 w-4 text-white" />
                            <span className="font-dm text-[13.33px] font-medium">
                                Clear Filter
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Advisee Filter Modal */}
            <Dialog
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
            >
                <DialogContent className="max-w-md justify-center border-none bg-transparent p-0 shadow-none outline-none [&>button]:hidden">
                    <AdviseeFilterModal
                        block={block}
                        onBlockChange={(value) => {
                            setBlock(value);
                            onBlockChange?.(value);
                        }}
                        selectedTags={tags}
                        onTagsChange={(value) => {
                            setTags(value);
                            onTagsChange?.(value);
                        }}
                        onClose={() => setIsFilterModalOpen(false)}
                        onOpenSort={() => {
                            setIsFilterModalOpen(false);
                            setIsSortModalOpen(true);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Sort Modal */}
            <Dialog open={isSortModalOpen} onOpenChange={setIsSortModalOpen}>
                <DialogContent className="max-w-md justify-center border-none bg-transparent p-0 shadow-none outline-none [&>button]:hidden">
                    <GeneralSort
                        onClose={() => setIsSortModalOpen(false)}
                        onApply={(sortValue) => {
                            console.log('Sorted by:', sortValue);
                            setIsSortModalOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

/* =======================
   ADVISEE FILTER MODAL 
======================= */
interface AdviseeFilterModalProps {
    block: string;
    onBlockChange: (value: string) => void;
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    onClose: () => void;
    onOpenSort: () => void;
}

function AdviseeFilterModal({
    block,
    onBlockChange,
    selectedTags,
    onTagsChange,
    onClose,
    onOpenSort,
}: AdviseeFilterModalProps) {
    // Thesis stage tags
    const tags = [
        'Title Proposal',
        'MOR Manuscript Submission',
        'DP1 Manuscript Revision',
        'DP2 Manuscript Revision',
        'DP1 Manuscript Submission',
        'DP2 Manuscript Submission',
    ];

    const toggleTag = (tag: string) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        onTagsChange(newTags);
    };

    const handleClearAll = () => {
        onBlockChange('');
        onTagsChange([]);
    };

    const handleApply = () => {
        console.log('Applied:', { block, selectedTags });
        onClose();
    };

    return (
        <div className="relative flex h-auto w-[450px] flex-col rounded-lg border border-border bg-white p-8 font-dm shadow-lg">
            <h2 className="mb-3 text-2xl font-bold text-primary">
                Apply Filter
            </h2>
            <div className="my-4 border-t" />

            {/* Content Area */}
            <div className="flex flex-col gap-4">
                {/* Block Filter */}
                <div className="space-y-2">
                    <label className="text-[13.33px] font-medium text-[#1A1A1A]">
                        Block
                    </label>
                    <Select value={block} onValueChange={onBlockChange}>
                        <SelectTrigger className="h-[37px] w-full border-none bg-[#F3EFD0]">
                            <SelectValue placeholder="Filter by Block" />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                            {['BSCPE 3-3', 'BSCPE 4-3'].map((b) => (
                                <SelectItem key={b} value={b}>
                                    {b}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Type Tags - Thesis Stages */}
                <div className="space-y-2 border-t border-[rgba(115,0,0,0.15)] pt-2">
                    <div className="text-[12px] font-medium text-[#1A1A1A]">
                        Thesis Stage Tags
                    </div>
                    <div className="text-[12px] font-medium text-[#5A5A5A]">
                        Select thesis stages to filter
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <button
                                key={index}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                    'rounded-lg border-[0.8px] px-3 py-1 text-[12px] font-medium transition-all duration-200',
                                    selectedTags.includes(tag)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-primary bg-white text-primary hover:bg-primary/5',
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-[rgba(115,0,0,0.15)] bg-white pt-4">
                <div className="flex w-full flex-row items-center gap-3">
                    {/* Sort Trigger */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-lg border-none bg-[#F3EFD0]"
                        onClick={onOpenSort}
                    >
                        <SecondarySort state="default" />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleClearAll}
                        className="h-9 border border-border px-4 text-[13.33px] text-[#1A1A1A]"
                    >
                        Clear All
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="h-9 bg-[#F3EFD0] px-4 text-[13.33px] text-primary"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleApply}
                        className="h-9 flex-grow bg-primary px-4 text-[13.33px] text-white"
                    >
                        Apply All Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
