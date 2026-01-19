import { submissions } from '@/routes/faculty/adviser/thesis_review';
import { AdviseeGroupCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AdviseeManagementLayout from '../index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Icon } from '@/components/icon-index';
import { router } from '@inertiajs/react';
import FilterSearchSection from '@/components/filter-search-section';

// Mock data 
const mockThesisGroups = [
  {
    groupCode: "4308",
    badge: "Pending Review",
    thesisTitle: "Machine Learning for Traffic Prediction",
    section: "BSCPE 4-3",
    numberofMembers: "4 Members",
    numberofSubmissions: "3 Submissions",
    lastSubmissionDate: "November 25, 2025"
  },
  {
    groupCode: "4309",
    badge: "Approved",
    thesisTitle: "Blockchain-Based Supply Chain Management System",
    section: "BSCPE 4-2",
    numberofMembers: "3 Members",
    numberofSubmissions: "5 Submissions",
    lastSubmissionDate: "December 30, 2024"
  },
  {
    groupCode: "4310",
    badge: "Pending Review",
    thesisTitle: "Mobile Application for Real-Time Traffic Monitoring",
    section: "BSCPE 4-1",
    numberofMembers: "4 Members",
    numberofSubmissions: "2 Submissions",
    lastSubmissionDate: "December 15, 2024"
  },
  {
    groupCode: "4311",
    badge: "Approved",
    thesisTitle: "IoT-Based Smart Home Automation with AI Integration",
    section: "BSCPE 4-3",
    numberofMembers: "3 Members",
    numberofSubmissions: "1 Submission",
    lastSubmissionDate: "December 20, 2024"
  },
  {
    groupCode: "4312",
    badge: "Pending Review",
    thesisTitle: "Natural Language Processing for Sentiment Analysis in Social Media",
    section: "BSCPE 4-2",
    numberofMembers: "4 Members",
    numberofSubmissions: "4 Submissions",
    lastSubmissionDate: "January 1, 2025"
  },
  {
    groupCode: "4313",
    badge: "Approved",
    thesisTitle: "Computer Vision System for Automated Quality Control",
    section: "BSCPE 4-1",
    numberofMembers: "3 Members",
    numberofSubmissions: "2 Submissions",
    lastSubmissionDate: "December 18, 2024"
  },
  {
    groupCode: "4314",
    badge: "Approved",
    thesisTitle: "Augmented Reality Application for Educational Purposes",
    section: "BSCPE 4-2",
    numberofMembers: "4 Members",
    numberofSubmissions: "6 Submissions",
    lastSubmissionDate: "December 27, 2024"
  },
  {
    groupCode: "4315",
    badge: "Pending Review",
    thesisTitle: "Cybersecurity Framework for Small and Medium Enterprises",
    section: "BSCPE 4-3",
    numberofMembers: "3 Members",
    numberofSubmissions: "2 Submissions",
    lastSubmissionDate: "December 29, 2024"
  },
  {
    groupCode: "4316",
    badge: "Approved",
    thesisTitle: "Cloud-Based Inventory Management System for Retail",
    section: "BSCPE 4-1",
    numberofMembers: "4 Members",
    numberofSubmissions: "3 Submissions",
    lastSubmissionDate: "December 22, 2024"
  },
  {
    groupCode: "4317",
    badge: "Pending Review",
    thesisTitle: "Recommendation System Using Collaborative Filtering",
    section: "BSCPE 4-2",
    numberofMembers: "3 Members",
    numberofSubmissions: "4 Submissions",
    lastSubmissionDate: "December 19, 2024"
  },
  {
    groupCode: "4318",
    badge: "Pending Review",
    thesisTitle: "Facial Recognition System for Attendance Monitoring",
    section: "BSCPE 4-3",
    numberofMembers: "4 Members",
    numberofSubmissions: "2 Submissions",
    lastSubmissionDate: "December 31, 2024"
  },
  {
    groupCode: "4319",
    badge: "Approved",
    thesisTitle: "E-Learning Platform with Adaptive Learning Technologies",
    section: "BSCPE 4-1",
    numberofMembers: "3 Members",
    numberofSubmissions: "7 Submissions",
    lastSubmissionDate: "December 26, 2024"
  }
];

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Document Review',
        href: '/faculty/adviser/thesis-review',
    },
];

const pageHeader: PageHeaderProps = {
    title: "Thesis Document Review",
    subtitle: "Review, comment on, and approve/request revisions for submitted thesis documents",
    icon: (
        <Icon
            name="docuDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

export default function ThesisReviewIndex() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        adviser: '',
        month: '',
        year: '',
        block: '',
        selectedTags: [] as string[]
    });

    // Apply filters to the groups
    const filteredGroups = mockThesisGroups.filter((group) => {
        // Search query filter
        const matchesSearch = 
            group.groupCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.thesisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.section.toLowerCase().includes(searchQuery.toLowerCase());

        // Block filter
        const matchesBlock = !filterCriteria.block || group.section === filterCriteria.block;

        // Badge/Status filter (based on selected tags)
        const matchesTags = filterCriteria.selectedTags.length === 0 || 
            filterCriteria.selectedTags.some(tag => {
                if (tag.includes('Pending')) return group.badge === 'Pending Review';
                if (tag.includes('Approved')) return group.badge === 'Approved';
                return true;
            });

        return matchesSearch && matchesBlock && matchesTags;
    });

    const handleGroupClick = (groupCode: string) => {
        router.visit(submissions(groupCode).url);
    };

    const hasActiveFilters = 
        searchQuery !== '' || 
        filterCriteria.adviser !== '' || 
        filterCriteria.month !== '' || 
        filterCriteria.year !== '' || 
        filterCriteria.block !== '' || 
        filterCriteria.selectedTags.length > 0;

    return (
        <AdviseeManagementLayout 
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <div className="space-y-6">
                {/* Using FilterSearchSection with StudentManagement variant */}
                <FilterSearchSection variant="StudentManagement" />
                
                

                <div className="space-y-2">
                    <h2 className="text-primary font-semibold text-xs sm:text-sm truncate">
                        My Advisee Groups
                    </h2>
                    <p className="text-[12px] text-gray-600">
                        Select a group to view their thesis submissions
                        {hasActiveFilters && (
                            <span className="ml-2 text-primary">
                                ({filteredGroups.length} of {mockThesisGroups.length} groups)
                            </span>
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map((group, index) => (
                            <div 
                                key={index}
                                onClick={() => handleGroupClick(group.groupCode)}
                                className="cursor-pointer"
                            >
                                <AdviseeGroupCard
                                    groupCode={group.groupCode}
                                    badge={group.badge}
                                    thesisTitle={group.thesisTitle}
                                    section={group.section}
                                    numberofMembers={group.numberofMembers}
                                    numberofSubmissions={group.numberofSubmissions}
                                    lastSubmissionDate={group.lastSubmissionDate}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No groups found matching your filters.</p>
                            <Button 
                                variant="outline" 
                                className="mt-4"
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterCriteria({
                                        adviser: '',
                                        month: '',
                                        year: '',
                                        block: '',
                                        selectedTags: []
                                    });
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AdviseeManagementLayout>
    );
}