import * as React from 'react';
import { useState } from 'react';
import { Filter, Trash2, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { cn } from '@/lib/utils';
import { SearchBar } from '@/components/filter-search';
import { RepoFilter } from '@/components/filter-search';
import { Icon } from '@/components/icon-index';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

type SectionVariant = 'StudentManagement' | 'DefenseManagement' | 'ThesisArchive' | 'Notifications';

interface FilterSearchSectionProps {
    variant?: SectionVariant;
}

export default function FilterSearchSection({ variant = 'DefenseManagement' }: FilterSearchSectionProps) {
    const [query, setQuery] = useState('');
    
    // State to manage the Advanced Filter Modal visibility
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        setIsFilterModalOpen(false);
    };

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
                            <div className="flex items-center justify-between px-3 h-9 bg-breadcrumb rounded-lg cursor-pointer font-dm">
                                <span className="text-alert-desc text-[13.33px] font-medium font-dm">Filter by Type</span>
                                <ChevronDown className="w-4 h-4 text-alert-desc/50" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-[320px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Status</label>
                            <div className="flex items-center justify-between px-3 h-9 bg-breadcrumb rounded-lg cursor-pointer font-dm">
                                <span className="text-alert-desc text-[13.33px] font-medium font-dm">Filter by Status</span>
                                <ChevronDown className="w-4 h-4 text-alert-desc/50" />
                            </div>
                        </div>
                    </>
                )}

                {/* --- SHARED ACTION BUTTONS --- */}
                <div className={cn(
                    "flex flex-row items-center gap-[10px] font-dm",
                    (variant === 'ThesisArchive' || variant === 'Notifications') ? "mt-auto h-9" : ""
                )}>
                    {(variant === 'StudentManagement' || variant === 'Notifications') && (
                        <Button variant="secondary" size="icon" className="rounded-lg border-none font-dm">
                            <Icon name="sortDefault" size={16} />
                        </Button>
                    )}

                    {variant !== 'Notifications' && (
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsFilterModalOpen(true)} // Calls the modal
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
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                {/* Technical Note: DialogContent has border/bg removed to let the 
                    RepoFilter's internal shadow and bg-white container show through cleanly.
                */}
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none">
                    <RepoFilter 
                        onClose={() => setIsFilterModalOpen(false)} 
                        onApply={handleApplyFilters}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}