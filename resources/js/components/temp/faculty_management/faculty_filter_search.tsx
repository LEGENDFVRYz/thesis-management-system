//Filter & Search section for Faculty Management (self-made component)
import { useRef } from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon-index';
import { SearchBar, Sort1, Filter1 } from '@/components/filter-search';
import { Dropdown } from '@/components/temp/faculty_management/faculty_dropdown';

interface FacultyFilterSearchProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    sortOpen: boolean;
    filterOpen: boolean;
    onSortToggle: () => void;
    onFilterToggle: () => void;
    onSortClose: () => void;
    onFilterClose: () => void;
}

export function FacultyFilterSearch({
    searchQuery,
    onSearchChange,
    onClearSearch,
    sortOpen,
    filterOpen,
    onSortToggle,
    onFilterToggle,
    onSortClose,
    onFilterClose,
}: FacultyFilterSearchProps) {
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <div className="mb-4">
            <div className="flex flex-col items-start self-stretch w-full max-w-[1360px] bg-card rounded-[10px] border-[0.8px] border-primary/20 shadow-sm h-[134px] p-[24.8px] gap-4 font-dm">
                {/* Header */}
                <div className="flex flex-row items-center gap-2 self-stretch w-full h-6">
                    <FilterIcon className="w-5 h-5 text-primary" />
                    <h2 className="font-dm font-normal text-base leading-6 text-primary">
                        Search, Sort, & Filter
                    </h2>
                </div>

                {/* Controls Row */}
                <div className="flex flex-row items-center gap-[10px] self-stretch w-full">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <SearchBar 
                            variant="filter-section" 
                            placeholder="Search by name, email, or ID..." 
                            value={searchQuery} 
                            onChange={onSearchChange} 
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center gap-[10px]">
                        {/* Sort Button with Dropdown */}
                        <div className="relative">
                            <Button 
                                ref={sortButtonRef}
                                variant="secondary" 
                                size="icon" 
                                className="rounded-lg border-none"
                                onClick={onSortToggle}
                            >
                                <Icon name="sortDefault" size={16} />
                            </Button>
                            <Dropdown 
                                isOpen={sortOpen} 
                                onClose={onSortClose}
                                triggerRef={sortButtonRef}
                            >
                                <Sort1 />
                            </Dropdown>
                        </div>

                        {/* Filter Button with Dropdown */}
                        <div className="relative">
                            <Button 
                                ref={filterButtonRef}
                                variant="secondary" 
                                size="icon" 
                                className="rounded-lg border-none"
                                onClick={onFilterToggle}
                            >
                                <FilterIcon className="w-4 h-4" />
                            </Button>
                            <Dropdown 
                                isOpen={filterOpen} 
                                onClose={onFilterClose}
                                triggerRef={filterButtonRef}
                            >
                                <Filter1 />
                            </Dropdown>
                        </div>

                        {/* Clear Search Button */}
                        <Button 
                            variant="negative" 
                            className="px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px]"
                            onClick={onClearSearch}
                        >
                            <span className="text-[13.33px] font-medium">Clear Search</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
