import { Head, router } from '@inertiajs/react';
import { NavFooter } from '@/components/nav-footer';
import { AppHeader } from '@/components/app-header';
import { useState, useEffect } from 'react';
import { ResearchAreaChart } from '@/components/research-area-distribution-pie';
import FilterIcon from '@/components/icons/filter-icon';
import { Button } from '@/components/ui/button';
import { RepoFilter } from '@/components/filter-search';
import RecentDP from './Guest/components/recent-dp';
import { MetricCard } from '@/components/ui/card';
import UndergraduateThesis from './Guest/undergraduate-thesis';
import QuickLinks from './Guest/components/quick-links';

export default function Welcome() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.visit('/repository', {
                data: { search: searchQuery.trim() },
                preserveState: true,
            });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isFilterOpen) {
                setIsFilterOpen(false);
            }
        };

        if (isFilterOpen) {
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isFilterOpen]);

    // Placeholder thesis data
    const recentProjects = [
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            authors: 'X. Yu, K. Kim, M. Uehinaga, A. Ning, Y.',
            tags: 'App Development, Machine Learning/AI',
            date: 'June 2025'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            authors: 'X. Yu, K. Kim, M. Uehinaga, A. Ning, Y.',
            tags: 'App Development, Machine Learning/AI',
            date: 'June 2025'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            authors: 'X. Yu, K. Kim, M. Uehinaga, A. Ning, Y.',
            tags: 'App Development, Machine Learning/AI',
            date: 'June 2025'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            authors: 'X. Yu, K. Kim, M. Uehinaga, A. Ning, Y.',
            tags: 'App Development, Machine Learning/AI',
            date: 'June 2025'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            authors: 'X. Yu, K. Kim, M. Uehinaga, A. Ning, Y.',
            tags: 'App Development, Machine Learning/AI',
            date: 'June 2025'
        }
    ];

    return (
        <>
            <Head title="Thesis Management System" />
            <AppHeader variant="guest" />

            {/* Main Content */}
            <div className="min-h-screen bg-white">
                {/* Header with Search */}
                <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-primary text-center mb-8 font-['DM_Sans']">
                            THESIS MANAGEMENT SYSTEM
                        </h1>

                        {/* Search Bar - Outer Container */}
                        <div
                            className="max-w-3xl mx-auto p-4"
                            style={{
                                borderRadius: '10px',
                                border: '0.8px solid rgba(115, 0, 0, 0.20)',
                                background: '#FDFCF6',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Search thesis titles..."
                                    className="flex-1 h-[52px] px-4 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary font-['DM_Sans']"
                                    style={{
                                        borderRadius: '10px',
                                        border: '0.8px solid rgba(115, 0, 0, 0.20)',
                                        background: '#FDFCF6',
                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)'
                                    }}
                                />
                                <button
                                    className="flex-shrink-0"
                                    onClick={() => setIsFilterOpen(true)}
                                >
                                    <FilterIcon className="w-[52px] h-[52px]" />
                                </button>
                                <Button
                                    variant="negative"
                                    onClick={() => setSearchQuery('')}
                                    className="h-[52px] px-6 font-['DM_Sans']"
                                >
                                    Clear Filter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section with Background Image */}
                <div className="relative w-full overflow-hidden">
                    <img
                        src="/images/guest-bg.svg"
                        alt="PUP Campus"
                        className="w-full h-auto object-contain"
                    />
                    {/* PUP Logo - Top Left */}
                    <img
                        src="/images/pup-logo.svg"
                        alt="PUP Logo"
                        className="absolute top-6 left-6 w-40 h-40 object-contain"
                    />
                    {/* CPE Logo - Top Right */}
                    <img
                        src="/images/cpe-logo.svg"
                        alt="CPE Logo"
                        className="absolute top-6 right-6 w-40 h-40 object-contain"
                    />
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Design Projects - Left Column */}
                        <div className="lg:col-span-2">
                            <RecentDP projects={recentProjects} />

                            {/* Undergraduate Thesis Available */}
                            <div className="mt-8">
                                <UndergraduateThesis />
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Login and Repository Buttons */}
                            <QuickLinks />

                            {/* About Section */}
                            <MetricCard
                                variant="about"
                                title="ABOUT"
                            >
                                <p className="font-['DM_Sans']" style={{ fontSize: '16px', fontWeight: 500, lineHeight: '1.4' }}>
                                    The <span style={{ fontWeight: 700 }}>Thesis Management and Tracking System</span> is designed to streamline, standardize, and monitor the complete life cycle of undergraduate thesis development within the Polytechnic University of the Philippines – College of Engineering, Department of Computer Engineering.
                                </p>
                            </MetricCard>

                            {/* Research Area Distribution */}
                            <ResearchAreaChart totalGroups={8167} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 z-50"
                    onClick={() => setIsFilterOpen(false)}
                >
                    <div
                        className="absolute"
                        style={{
                            top: '280px', // Approximate position 20px below filter icon
                            right: 'calc(50% - 380px)', // Align with filter icon's right edge
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <RepoFilter onClose={() => setIsFilterOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
