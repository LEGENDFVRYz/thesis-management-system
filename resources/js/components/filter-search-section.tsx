import * as React from 'react';
import { useState } from 'react';
import { Filter, Trash2, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { cn } from '@/lib/utils';
import { DefenseManagementFilter, GeneralSort, SearchBar, Sort3 } from '@/components/filter-search';
import { RepoFilter } from '@/components/filter-search';
import { Icon } from '@/components/icon-index';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SectionVariant = 'StudentManagement' | 'DefenseManagement' | 'ThesisArchive' | 'Notifications';

interface FilterSearchSectionProps {
    variant?: SectionVariant;
}

export default function FilterSearchSection({ variant = 'DefenseManagement' }: FilterSearchSectionProps) {
    const [query, setQuery] = useState('');
    
    // State to manage the Advanced Filter Modal visibility
    const [isRepoFilterModalOpen, setIsRepoFilterModalOpen] = useState(false);

    const [isDMFilterModalOpen, setIsDMFilterModalOpen] = useState(false);
    
    // State to manage the Sort Modal visibility
    const [isSort3ModalOpen, setIsSort3ModalOpen] = useState(false);

    const [isSortModalOpen, setIsSortModalOpen] = useState(false);

    /**
     * Container Style Mapping
     * Maps the Figma layout specifications to the different page variants.
     */
    const containerVariants = {
        StudentManagement: "h-[134px] p-[24.8px_24.8px_0.8px_24.8px] gap-4 border-primary/20 shadow-sm",
        DefenseManagement: "h-[125.6px] p-[24.8px_24.8px_0.8px_24.8px] gap-4 border-primary/20 shadow-sm",
        ThesisArchive: "h-[120px] p-[25px_19px] gap-[25px] border-border",
        Notifications: "h-[118px] p-6 gap-6 border-border shadow-none"
    };

    // Callback when tags are applied in RepoFilter
    const handleApplyFilters = (tags: string[]) => {
        console.log("Applied Tags:", tags);
        setIsRepoFilterModalOpen(false);
    };

    // Callback when sort options are applied in Sort3
    const handleApplySort = (sortBy: string) => {
        console.log("Applied Sort By:", sortBy);
        setIsSort3ModalOpen(false);
    };

    const handleApplyGeneralSort = (sortBy: string) => {
        console.log("Applied General Sort By:", sortBy);
        setIsSortModalOpen(false);
    }

    function setIsSortOpen(arg0: boolean): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div className={cn(
            "flex flex-col items-start self-stretch w-full max-w-[1360px] bg-card rounded-[10px] flex-none",
            "border-[0.8px] box-border transition-all duration-200",
            "font-dm", 
            containerVariants[variant]
        )}>
            
            {/* --- HEADER SECTION --- */}
            {variant !== 'ThesisArchive' && variant !== 'Notifications' && (
                <div className="flex flex-row items-center gap-2 self-stretch w-full h-6 rounded-none font-dm">
                    <Filter className="w-5 h-5 text-primary" />
                    <h2 className="font-dm font-normal text-base leading-6 text-primary">
                        {variant === 'StudentManagement' ? 'Search, Sort, & Filter' : 'Filters & Search'}
                    </h2>
                </div>
            )}

            {/* --- CONTROLS ROW --- */}
            <div className={cn(
                "flex flex-row items-center gap-[10px] self-stretch w-full font-dm",
                variant === 'Notifications' ? "justify-between" : "justify-center"
            )}>
                
                {/* 1. SEARCH BOX */}
                <div className={cn(
                    "flex flex-col gap-2 font-dm",
                    (variant === 'ThesisArchive' || variant === 'Notifications') ? "w-[320px]" : "flex-1"
                )}>
                    {(variant === 'ThesisArchive' || variant === 'Notifications') && (
                        <label className="text-sm font-medium text-alert-desc font-dm">Search</label>
                    )}
                    <SearchBar 
                        variant="filter-section" 
                        placeholder="Search thesis titles..." 
                        value={query} 
                        onChange={setQuery} 
                    />
                </div>

                {/* 2. VARIANT SPECIFIC CONTROLS */}
                {variant === 'ThesisArchive' && (
                    <>
                        <div className="flex flex-col gap-2 w-[374px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Academic Year</label>
                            <div className="flex items-center justify-between px-3 h-9 bg-breadcrumb rounded-lg border-[0.8px] border-primary/10 cursor-pointer transition-colors hover:bg-white font-dm">
                                <span className="text-primary text-sm font-medium font-dm">2024 - 2025</span>
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-[374.33px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Specialization</label>
                            <div className="flex items-center justify-between px-3 h-9 bg-breadcrumb rounded-lg cursor-pointer transition-colors hover:bg-white font-dm">
                                <span className="text-alert-desc text-[13.33px] font-medium font-dm">Filter by Specialization</span>
                                <ChevronDown className="w-4 h-4 text-alert-desc/50" />
                            </div>
                        </div>
                    </>
                )}

                {variant === 'Notifications' && (
                    <>
                        <div className="flex flex-col gap-2 w-[320px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Notification Type</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Type" />
                                </SelectTrigger>
                                <SelectContent className='w-[var(--radix-select-trigger-width)]'>
                                    <SelectItem value="Defense Management">Defense Management</SelectItem>
                                    <SelectItem value="Panel Assignment">Panel Assignment</SelectItem>
                                    <SelectItem value="Reminder">Reminder</SelectItem>
                                    <SelectItem value="System Update">System Update</SelectItem>
                                    <SelectItem value="Alert">Alert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 w-[320px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Status</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent className='w-[var(--radix-select-trigger-width)]'>
                                    <SelectItem value="Read">Read Only</SelectItem>
                                    <SelectItem value="Unread">Unread Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}

                {/* --- SHARED ACTION BUTTONS --- */}
                <div className={cn(
                    "flex flex-row items-center gap-[10px] font-dm",
                    (variant === 'ThesisArchive' || variant === 'Notifications') ? "mt-auto h-9" : ""
                )}>
                    {(variant === 'StudentManagement' || variant === 'Notifications') && (
                        <Button variant="secondary" size="icon" className="rounded-lg border-none font-dm" onClick={() => setIsSortModalOpen(true)}>
                            <Icon name="sortDefault" size={16} />
                        </Button>
                    )}

                    {variant !== 'Notifications' && (
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsDMFilterModalOpen(true)} // Calls the modal
                        >
                            <Filter className="w-4 h-4" />
                        </Button>
                    )}

                    {variant === 'Notifications' && (
                        <Button variant="ghost" className="h-9 gap-2 px-3 border border-transparent font-dm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[13.33px] font-medium font-dm">Mark Read</span>
                        </Button>
                    )}

                    <Button variant="negative" className="px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px] font-dm">
                        {variant === 'ThesisArchive' || variant === 'Notifications' ? (
                            <Trash2 className="w-4 h-4 text-white" />
                        ) : null}
                        <span className="text-[13.33px] font-medium font-dm">Clear Filter</span>
                    </Button>
                </div>
            </div>

            {/* --- INTEGRATED REPO FILTER MODAL --- */}
            <Dialog open={isRepoFilterModalOpen} onOpenChange={setIsRepoFilterModalOpen}>
                {/* Technical Note: DialogContent has border/bg removed to let the 
                    RepoFilter's internal shadow and bg-white container show through cleanly.
                */}
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none">
                    <RepoFilter 
                        onClose={() => setIsRepoFilterModalOpen(false)} 
                        onApply={handleApplyFilters}
                    />
                </DialogContent>
            </Dialog>

            {/* --- INTEGRATED DEFENSE MANAGEMENT FILTER MODAL --- */}
            <Dialog open={isDMFilterModalOpen} onOpenChange={setIsDMFilterModalOpen}>
                {/* Technical Note: DialogContent has border/bg removed to let the 
                    RepoFilter's internal shadow and bg-white container show through cleanly.
                */}
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none [&>button]:hidden justify-center">
                    <DefenseManagementFilter 
                        onClose={() => setIsDMFilterModalOpen(false)} 
                    />
                </DialogContent>
            </Dialog>

            {/* --- INTEGRATED SORT MODAL --- */}
            <Dialog open={isSort3ModalOpen} onOpenChange={setIsSort3ModalOpen}>
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none">
                    {/* The call to Sort3 */}
                    <Sort3/>
                </DialogContent>
            </Dialog>

            {/* --- INTEGRATED GENERAL SORT MODAL --- */}
            <Dialog open={isSortModalOpen} onOpenChange={setIsSortModalOpen}>
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none [&>button]:hidden justify-center">
                    {/* The call to General Sort */}
                    <GeneralSort 
                        onClose={() => setIsSortOpen(false)} 
                        onApply={handleApplySort} 
                    />
                </DialogContent>
            </Dialog>

        </div>
    );
}