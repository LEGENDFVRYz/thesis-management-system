import React from 'react';
import { Head } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { ArchiveCard } from '@/components/ui/card';
import { RepositoryFilterBar } from '@/components/repository-filter-bar';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageHeaderProps } from '@/types';
import { Icon } from '@/components/icon-index';
import { index } from '@/routes/guest/repository/index';

// Setup
const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Thesis Repository",
    subtitle: "Browse and explore undergraduate thesis projects",
    icon: (
        // pa correct nalang
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

interface Archive {
    journal_id: number;
    title: string;
    date_archived: string;
    tags: string | null;
    authors: string | null;
    author_user_ids: string | null;
}

interface RepositoryProps {
    search?: string;
    archives?: Archive[];
}

export default function GuestRepository({ search = '', archives = [] }: RepositoryProps) {
    const [filters, setFilters] = React.useState<{
        searchTerm: string;
        selectedYear: Date | undefined;
        selectedSpecialization: string;
        tags: string[];
    }>({
        searchTerm: '',
        selectedYear: undefined,
        selectedSpecialization: '',
        tags: []
    });

    // Transform archives data from backend to match the card format
    const allRepositories = archives.map((archive) => ({
        id: archive.journal_id,
        title: archive.title || 'Untitled',
        members: archive.authors ? archive.authors.split(', ') : [],
        date: archive.date_archived
            ? new Date(archive.date_archived).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Unknown',
        badges: archive.tags ? archive.tags.split(',').map(tag => tag.trim()) : []
    }));

    // Filter repositories based on search query and tags
    const repositories = allRepositories.filter((repo) => {
        // Filter by search query from landing page
        if (search && !repo.title.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Filter by search term from filter bar
        if (filters.searchTerm && !repo.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by year (if selected)
        if (filters.selectedYear) {
            const selectedYear = filters.selectedYear.getFullYear();
            const repoYear = parseInt(repo.date.split(' ')[1]); // Extract year from "Month YYYY"
            if (repoYear !== selectedYear) {
                return false;
            }
        }

        // Filter by tags (if any tags are selected, the repo must have at least one matching badge)
        if (filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag =>
                repo.badges.some(badge => badge.toLowerCase() === tag.toLowerCase())
            );
            if (!hasMatchingTag) {
                return false;
            }
        }

        // Filter by specialization (if selected)
        if (filters.selectedSpecialization) {
            const hasMatchingSpecialization = repo.badges.some(badge =>
                badge.toLowerCase().includes(filters.selectedSpecialization.toLowerCase().replace('-', ' '))
            );
            if (!hasMatchingSpecialization) {
                return false;
            }
        }

        return true;
    });

    return (
        <>
        <AppLayout
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <Head title="Repository" />
            {/* <AppHeader variant="guest" /> */}

                {/* Filter Bar */}
                <div className="mb-8">
                    <RepositoryFilterBar onFilterChange={setFilters} />
                </div>

                {/* Search Results Info */}
                {search && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 font-['DM_Sans']">
                            Found {repositories.length} result{repositories.length !== 1 ? 's' : ''} for "{search}"
                        </p>
                    </div>
                )}

                {/* Repository Cards Grid - 3 per row on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    {repositories.length > 0 ? (
                        repositories.map((repo, index) => (
                            <ArchiveCard
                                key={index}
                                id={repo.id}
                                title={repo.title}
                                members={repo.members}
                                date={repo.date}
                                badges={repo.badges}
                                variant="with-link"
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 font-['DM_Sans']">
                                No thesis projects found matching your search.
                            </p>
                        </div>
                    )}
                </div>

            {/* <NavFooter /> */}
        </AppLayout>
        </>
    );
}
