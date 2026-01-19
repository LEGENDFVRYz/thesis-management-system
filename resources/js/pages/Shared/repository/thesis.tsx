import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { ArchiveCard } from '@/components/ui/card';
import { RepositoryFilterBar } from '@/components/repository-filter-bar';
import RepositoryLayout from './index';
import { index, theses } from '@/routes/repository';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Archive } from 'lucide-react';


// Setup
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Thesis Archive', href: theses().url },
];

const pageHeader: PageHeaderProps = {
    title: "Thesis Archive",
    subtitle: "Browse and explore student thesis projects",
    icon: (
        <Archive className="w-8 h-8 text-primary" />
    ),
};


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
            badges: ['Computer Vision', 'Neural Networks'],
            defenseId: 'DEF-001',
            specialization: 'Machine Learning',
            block: 'BSCPE 3-3',
            thesisAdviser: 'Dr. Maria Santos',
            defensePanel: [
                { id: 'P1', name: 'Dr. Robert Chen' },
                { id: 'P2', name: 'Dr. Sofia Smith' },
                { id: 'P3', name: 'Engr. John Johnson' }
            ]
        },
        {
            title: 'IoT-Based Smart Home Automation System',
            members: ['Alice Brown', 'Bob Wilson'],
            date: 'March 2023',
            badges: ['Internet of Things', 'Embedded Systems'],
            defenseId: 'DEF-002',
            specialization: 'Internet of Things',
            block: 'BSCPE 4-1',
            thesisAdviser: 'Engr. David Lee',
            defensePanel: [
                { id: 'P1', name: 'Dr. Emily Wang' },
                { id: 'P2', name: 'Engr. Mark Davis' },
                { id: 'P3', name: 'Dr. Sarah Johnson' }
            ]
        },
        {
            title: 'Web-Based E-Commerce Platform with AI Recommendations',
            members: ['Charlie Davis', 'Diana Evans', 'Frank Green'],
            date: 'October 2024',
            badges: ['Web Development', 'Machine Learning'],
            defenseId: 'DEF-003',
            specialization: 'Web Development',
            block: 'BSIT 3-2',
            thesisAdviser: 'Dr. Rachel Kim',
            defensePanel: [
                { id: 'P1', name: 'Dr. Michael Brown' },
                { id: 'P2', name: 'Engr. Lisa Anderson' },
                { id: 'P3', name: 'Dr. James Wilson' }
            ]
        },
        {
            title: 'Mobile Application for Real-Time Traffic Monitoring',
            members: ['Grace Harris', 'Henry Lee'],
            date: 'June 2022',
            badges: ['Mobile Development', 'Big Data'],
            defenseId: 'DEF-004',
            specialization: 'Mobile Development',
            block: 'BSCS 4-3',
            thesisAdviser: 'Engr. Thomas Garcia',
            defensePanel: [
                { id: 'P1', name: 'Dr. Patricia Martinez' },
                { id: 'P2', name: 'Engr. Robert Taylor' },
                { id: 'P3', name: 'Dr. Jennifer White' }
            ]
        },
        {
            title: 'Blockchain-Based Voting System',
            members: ['Ivy Martinez', 'Jack Nelson'],
            date: 'August 2025',
            badges: ['Blockchain', 'Cybersecurity'],
            defenseId: 'DEF-005',
            specialization: 'Blockchain',
            block: 'BSCS 3-1',
            thesisAdviser: 'Dr. Kevin Thompson',
            defensePanel: [
                { id: 'P1', name: 'Dr. Angela Rodriguez' },
                { id: 'P2', name: 'Engr. Daniel Harris' },
                { id: 'P3', name: 'Dr. Christopher Lee' }
            ]
        },
        {
            title: 'Natural Language Processing for Sentiment Analysis',
            members: ['Kate Robinson', 'Leo Turner'],
            date: 'January 2024',
            badges: ['Deep Learning', 'Machine Learning'],
            defenseId: 'DEF-006',
            specialization: 'Deep Learning',
            block: 'BSCS 4-2',
            thesisAdviser: 'Dr. Nancy Clark',
            defensePanel: [
                { id: 'P1', name: 'Dr. Steven Walker' },
                { id: 'P2', name: 'Engr. Karen Hall' },
                { id: 'P3', name: 'Dr. Brian Allen' }
            ]
        },
        {
            title: 'Augmented Reality Educational Tool',
            members: ['Maya White', 'Noah Young'],
            date: 'November 2023',
            badges: ['AR', 'Computer Vision'],
            defenseId: 'DEF-007',
            specialization: 'Computer Vision',
            block: 'BSCPE 3-4',
            thesisAdviser: 'Engr. Michelle King',
            defensePanel: [
                { id: 'P1', name: 'Dr. George Wright' },
                { id: 'P2', name: 'Engr. Betty Lopez' },
                { id: 'P3', name: 'Dr. Richard Hill' }
            ]
        },
        {
            title: 'Cloud-Based Student Information System',
            members: ['Olivia Anderson', 'Peter Clark'],
            date: 'May 2025',
            badges: ['Cloud Computing', 'System Development'],
            defenseId: 'DEF-008',
            specialization: 'Cloud Computing',
            block: 'BSIT 4-1',
            thesisAdviser: 'Dr. Carol Scott',
            defensePanel: [
                { id: 'P1', name: 'Dr. Paul Green' },
                { id: 'P2', name: 'Engr. Helen Adams' },
                { id: 'P3', name: 'Dr. Timothy Baker' }
            ]
        },
        {
            title: 'Predictive Maintenance System Using Deep Learning',
            members: ['Sarah Johnson', 'Tom Baker'],
            date: 'September 2022',
            badges: ['Deep Learning', 'Internet of Things'],
            defenseId: 'DEF-009',
            specialization: 'Deep Learning',
            block: 'BSCPE 4-2',
            thesisAdviser: 'Engr. Andrew Nelson',
            defensePanel: [
                { id: 'P1', name: 'Dr. Sandra Carter' },
                { id: 'P2', name: 'Engr. Joshua Mitchell' },
                { id: 'P3', name: 'Dr. Amanda Perez' }
            ]
        },
        {
            title: 'Automated Code Review Tool with Neural Networks',
            members: ['Emma Wilson', 'James Miller'],
            date: 'April 2024',
            badges: ['Neural Networks', 'System Development'],
            defenseId: 'DEF-010',
            specialization: 'Neural Networks',
            block: 'BSCS 3-3',
            thesisAdviser: 'Dr. Matthew Roberts',
            defensePanel: [
                { id: 'P1', name: 'Dr. Donna Turner' },
                { id: 'P2', name: 'Engr. Ryan Phillips' },
                { id: 'P3', name: 'Dr. Deborah Campbell' }
            ]
        },
        {
            title: 'Smart Agriculture Monitoring Platform',
            members: ['Lucas Garcia', 'Sophia Martinez'],
            date: 'February 2023',
            badges: ['Internet of Things', 'Big Data'],
            defenseId: 'DEF-011',
            specialization: 'Internet of Things',
            block: 'BSCPE 3-2',
            thesisAdviser: 'Engr. Jeffrey Parker',
            defensePanel: [
                { id: 'P1', name: 'Dr. Dorothy Evans' },
                { id: 'P2', name: 'Engr. Gary Edwards' },
                { id: 'P3', name: 'Dr. Ruth Collins' }
            ]
        },
        {
            title: 'Computer Vision for Autonomous Vehicle Navigation',
            members: ['Oliver Taylor', 'Ava Anderson'],
            date: 'July 2025',
            badges: ['Computer Vision', 'Machine Learning'],
            defenseId: 'DEF-012',
            specialization: 'Computer Vision',
            block: 'BSCS 4-1',
            thesisAdviser: 'Dr. Larry Stewart',
            defensePanel: [
                { id: 'P1', name: 'Dr. Sharon Sanchez' },
                { id: 'P2', name: 'Engr. Dennis Morris' },
                { id: 'P3', name: 'Dr. Cynthia Rogers' }
            ]
        },
        {
            title: 'Distributed Computing Framework for Big Data Processing',
            members: ['Liam Thomas', 'Isabella Jackson'],
            date: 'December 2024',
            badges: ['Big Data', 'Computer Network'],
            defenseId: 'DEF-013',
            specialization: 'Big Data',
            block: 'BSIT 3-4',
            thesisAdviser: 'Engr. Kenneth Reed',
            defensePanel: [
                { id: 'P1', name: 'Dr. Melissa Cook' },
                { id: 'P2', name: 'Engr. Frank Morgan' },
                { id: 'P3', name: 'Dr. Stephanie Bell' }
            ]
        },
        {
            title: 'Real-Time Fraud Detection System',
            members: ['Mason White', 'Mia Harris'],
            date: 'May 2023',
            badges: ['Machine Learning', 'Computer Network'],
            defenseId: 'DEF-014',
            specialization: 'Machine Learning',
            block: 'BSCS 3-2',
            thesisAdviser: 'Dr. Gregory Murphy',
            defensePanel: [
                { id: 'P1', name: 'Dr. Rebecca Bailey' },
                { id: 'P2', name: 'Engr. Terry Rivera' },
                { id: 'P3', name: 'Dr. Kathleen Cooper' }
            ]
        },
        {
            title: 'Smart City Traffic Management with IoT Sensors',
            members: ['Ethan Martin', 'Charlotte Thompson'],
            date: 'October 2022',
            badges: ['Internet of Things', 'System Development'],
            defenseId: 'DEF-015',
            specialization: 'Internet of Things',
            block: 'BSCPE 4-3',
            thesisAdviser: 'Engr. Raymond Richardson',
            defensePanel: [
                { id: 'P1', name: 'Dr. Virginia Cox' },
                { id: 'P2', name: 'Engr. Jerry Howard' },
                { id: 'P3', name: 'Dr. Pamela Ward' }
            ]
        },
        {
            title: 'Medical Image Analysis Using Deep Neural Networks',
            members: ['Alexander Garcia', 'Amelia Rodriguez'],
            date: 'March 2025',
            badges: ['Deep Learning', 'Computer Vision'],
            defenseId: 'DEF-016',
            specialization: 'Deep Learning',
            block: 'BSCS 3-1',
            thesisAdviser: 'Dr. Albert Torres',
            defensePanel: [
                { id: 'P1', name: 'Dr. Carolyn Peterson' },
                { id: 'P2', name: 'Engr. Joe Gray' },
                { id: 'P3', name: 'Dr. Frances Ramirez' }
            ]
        },
        {
            title: 'Recommendation Engine for Online Learning Platforms',
            members: ['Benjamin Lee', 'Harper Walker'],
            date: 'August 2023',
            badges: ['Machine Learning', 'Big Data'],
            defenseId: 'DEF-017',
            specialization: 'Machine Learning',
            block: 'BSIT 4-2',
            thesisAdviser: 'Engr. Harold James',
            defensePanel: [
                { id: 'P1', name: 'Dr. Evelyn Watson' },
                { id: 'P2', name: 'Engr. Willie Brooks' },
                { id: 'P3', name: 'Dr. Jean Kelly' }
            ]
        },
        {
            title: 'Network Security Monitoring System',
            members: ['Daniel Hall', 'Evelyn Allen'],
            date: 'June 2024',
            badges: ['Computer Network', 'Cybersecurity'],
            defenseId: 'DEF-018',
            specialization: 'Computer Network',
            block: 'BSCS 4-4',
            thesisAdviser: 'Dr. Henry Sanders',
            defensePanel: [
                { id: 'P1', name: 'Dr. Cheryl Price' },
                { id: 'P2', name: 'Engr. Jesse Bennett' },
                { id: 'P3', name: 'Dr. Marie Wood' }
            ]
        }
    ];

    // Filter repositories based on search query and tags
    const repositories = allRepositories.filter((repo) => {
        if (search && !repo.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.searchTerm && !repo.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
        if (filters.selectedYear) {
            const selectedYear = filters.selectedYear.getFullYear();
            const repoYear = parseInt(repo.date.split(' ')[1]);
            if (repoYear !== selectedYear) return false;
        }

        // Filter by tags (if any tags are selected, the repo must have at least one matching badge)
        if (filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag =>
                repo.badges.some(badge => badge.toLowerCase() === tag.toLowerCase())
            );
            if (!hasMatchingTag) return false;
        }

        // Filter by specialization (if selected)
        if (filters.selectedSpecialization) {
            const hasMatchingSpecialization = repo.badges.some(badge =>
                badge.toLowerCase().includes(filters.selectedSpecialization.toLowerCase().replace('-', ' '))
            );
            if (!hasMatchingSpecialization) return false;
        }

        return true;
    });

    const handleThesisClick = (repo: typeof allRepositories[0]) => {
        // Store in sessionStorage as a temporary solution
        sessionStorage.setItem('selectedThesis', JSON.stringify(repo));
        window.location.href = '/test-thesis-preview';
    };

    return (
        <>

            <RepositoryLayout 
                breadcrumbs={breadcrumbs}
                pageHeader={pageHeader}
            >
                <Head title="Thesis Archive" />

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

                    {/* Repository Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                        {repositories.length > 0 ? (
                            repositories.map((repo, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleThesisClick(repo)}
                                    className="cursor-pointer"
                                >
                                    <ArchiveCard
                                        title={repo.title}
                                        members={repo.members}
                                        date={repo.date}
                                        badges={repo.badges}
                                        variant="with-link"
                                        href="/test-thesis-preview"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 font-['DM_Sans']">
                                    No thesis projects found matching your search.
                                </p>
                            </div>
                        )}
                    </div>

            </RepositoryLayout>

            {/* <NavFooter /> */}
        </>
    );
}