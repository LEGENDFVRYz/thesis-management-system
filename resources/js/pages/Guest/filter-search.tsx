import { Head } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import FilterIcon from '@/components/icons/filter-icon';
import { Button } from '@/components/ui/button';
import { RepoFilter } from '@/components/filter-search';
import { useState } from 'react';

export default function GuestFilterSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleClearFilter = () => {
        setSearchQuery('');
        console.log('Filter cleared');
    };

    return (
        <>
            <Head title="Search & Filter" />
            <AppHeader />

            <AppContent
                title="Search & Filter"
                subtitle="Find thesis projects by title, keywords, or topics"
            >
                {/* Outer Container Card */}
                <div
                    className="w-full max-w-4xl mx-auto p-4"
                    style={{
                        borderRadius: '10px',
                        border: '0.8px solid rgba(115, 0, 0, 0.20)',
                        background: '#FDFCF6',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)'
                    }}
                >
                    {/* Inner Search Bar Container */}
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search thesis titles..."
                            className="flex-1 h-[52px] px-4 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary font-['DM_Sans']"
                            style={{
                                borderRadius: '10px',
                                border: '0.8px solid rgba(115, 0, 0, 0.20)',
                                background: '#FDFCF6',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)'
                            }}
                        />

                        {/* Filter Icon Button */}
                        <button
                            className="flex-shrink-0"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <FilterIcon className="w-[52px] h-[52px]" />
                        </button>

                        {/* Clear Filter Button */}
                        <Button
                            variant="negative"
                            onClick={handleClearFilter}
                            className="h-[52px] px-6 font-['DM_Sans']"
                        >
                            Clear Filter
                        </Button>
                    </div>
                </div>

                {/* Results Section (placeholder) */}
                <div className="mt-12">
                    <p className="text-center text-gray-500 font-['DM_Sans']">
                        {searchQuery
                            ? `Searching for: "${searchQuery}"...`
                            : 'Enter a search term to find thesis projects'}
                    </p>
                </div>
            </AppContent>

            <NavFooter />

            {/* Filter Modal */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsFilterOpen(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <RepoFilter onClose={() => setIsFilterOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
