import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { ArchiveCard } from '@/components/ui/card';
import { RepositoryFilterBar } from '@/components/repository-filter-bar';

interface ThesisProps {
    search?: string;
}

export default function Thesis({ search = '' }: ThesisProps) {
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

    // Sample repository data
    const allRepositories = [
        {
            title: 'Machine Learning Applications in Healthcare Diagnostics',
            members: ['John Doe', 'Jane Smith', 'Mike Johnson', 'John Doe'],
            date: 'December 2025',
            badges: ['Computer Vision', 'Neural Networks']
        },
        {
            title: 'IoT-Based Smart Home Automation System',
            members: ['Alice Brown', 'Bob Wilson'],
            date: 'March 2023',
            badges: ['Internet of Things', 'Embedded Systems']
        },
        {
            title: 'Web-Based E-Commerce Platform with AI Recommendations',
            members: ['Charlie Davis', 'Diana Evans', 'Frank Green'],
            date: 'October 2024',
            badges: ['Web Development', 'Machine Learning']
        },
        {
            title: 'Mobile Application for Real-Time Traffic Monitoring',
            members: ['Grace Harris', 'Henry Lee'],
            date: 'June 2022',
            badges: ['Mobile Development', 'Big Data']
        },
        {
            title: 'Blockchain-Based Voting System',
            members: ['Ivy Martinez', 'Jack Nelson'],
            date: 'August 2025',
            badges: ['Blockchain', 'Cybersecurity']
        },
        {
            title: 'Natural Language Processing for Sentiment Analysis',
            members: ['Kate Robinson', 'Leo Turner'],
            date: 'January 2024',
            badges: ['Deep Learning', 'Machine Learning']
        },
        {
            title: 'Augmented Reality Educational Tool',
            members: ['Maya White', 'Noah Young'],
            date: 'November 2023',
            badges: ['AR', 'Computer Vision']
        },
        {
            title: 'Cloud-Based Student Information System',
            members: ['Olivia Anderson', 'Peter Clark'],
            date: 'May 2025',
            badges: ['Cloud Computing', 'System Development']
        },
        {
            title: 'Predictive Maintenance System Using Deep Learning',
            members: ['Sarah Johnson', 'Tom Baker'],
            date: 'September 2022',
            badges: ['Deep Learning', 'Internet of Things']
        },
        {
            title: 'Automated Code Review Tool with Neural Networks',
            members: ['Emma Wilson', 'James Miller'],
            date: 'April 2024',
            badges: ['Neural Networks', 'System Development']
        },
        {
            title: 'Smart Agriculture Monitoring Platform',
            members: ['Lucas Garcia', 'Sophia Martinez'],
            date: 'February 2023',
            badges: ['Internet of Things', 'Big Data']
        },
        {
            title: 'Computer Vision for Autonomous Vehicle Navigation',
            members: ['Oliver Taylor', 'Ava Anderson'],
            date: 'July 2025',
            badges: ['Computer Vision', 'Machine Learning']
        },
        {
            title: 'Distributed Computing Framework for Big Data Processing',
            members: ['Liam Thomas', 'Isabella Jackson'],
            date: 'December 2024',
            badges: ['Big Data', 'Computer Network']
        },
        {
            title: 'Real-Time Fraud Detection System',
            members: ['Mason White', 'Mia Harris'],
            date: 'May 2023',
            badges: ['Machine Learning', 'Computer Network']
        },
        {
            title: 'Smart City Traffic Management with IoT Sensors',
            members: ['Ethan Martin', 'Charlotte Thompson'],
            date: 'October 2022',
            badges: ['Internet of Things', 'System Development']
        },
        {
            title: 'Medical Image Analysis Using Deep Neural Networks',
            members: ['Alexander Garcia', 'Amelia Rodriguez'],
            date: 'March 2025',
            badges: ['Deep Learning', 'Computer Vision']
        },
        {
            title: 'Recommendation Engine for Online Learning Platforms',
            members: ['Benjamin Lee', 'Harper Walker'],
            date: 'August 2023',
            badges: ['Machine Learning', 'Big Data']
        },
        {
            title: 'Network Security Monitoring System',
            members: ['Daniel Hall', 'Evelyn Allen'],
            date: 'June 2024',
            badges: ['Computer Network', 'Cybersecurity']
        }
    ];

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
            <Head title="Repository" />
            <AppHeader />

            <AppContent
                title="Thesis Repository"
                subtitle="Browse and explore student thesis projects"
            >
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
                            <Link key={index} href="/test-thesis-preview">
                                <ArchiveCard
                                    title={repo.title}
                                    members={repo.members}
                                    date={repo.date}
                                    badges={repo.badges}
                                    variant="with-link"
                                    href="/test-thesis-preview"
                                />
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 font-['DM_Sans']">
                                No thesis projects found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </AppContent>

            <NavFooter />
        </>
    );
}