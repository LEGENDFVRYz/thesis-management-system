import { submissions } from '@/routes/faculty/adviser/thesis_review';
import { AdviseeGroupCard } from '@/components/ui/card';
import { SearchBar } from '@/components/filter-search';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AdviseeManagementLayout from '../index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Icon } from '@/components/icon-index';
import { router } from '@inertiajs/react';

// Mock data (in real app, this would come from props/backend)
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

    const filteredGroups = mockThesisGroups.filter(
        (group) =>
            group.groupCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.thesisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.section.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGroupClick = (groupCode: string) => {
    router.visit(submissions(groupCode).url);
    };

    return (
        <AdviseeManagementLayout 
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <div className="space-y-6">
                <div className="mb-6 box-border flex h-[125.6px] w-full max-w-[1360px] flex-col items-start gap-4 self-stretch rounded-[10px] border-[0.8px] border-primary/20 bg-card p-[24.8px_24.8px_0.8px_24.8px] font-dm shadow-sm transition-all duration-200">
                    <div className="flex h-6 w-full flex-row items-center gap-2 self-stretch rounded-none font-dm">
                        <Filter className="h-5 w-5 text-primary" />
                        <h2 className="font-dm text-base leading-6 font-normal text-primary">
                            Filters & Search
                        </h2>
                    </div>

                    <div className="flex w-full flex-row items-center justify-center gap-[10px] self-stretch font-dm">
                        <div className="flex-1 font-dm">
                            <SearchBar
                                variant="filter-section"
                                placeholder="Search group code, thesis title, or section..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </div>

                        <div className="flex flex-row items-center gap-[10px] font-dm">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-lg border-none font-dm"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="negative"
                                className="h-9 min-w-[101px] gap-2 rounded-lg px-4 py-2 font-dm"
                                onClick={() => setSearchQuery('')}
                            >
                                <span className="font-dm text-[13.33px] font-medium">
                                    Clear Filter
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-primary font-semibold text-xs sm:text-sm truncate">
                        My Advisee Groups
                    </h2>
                    <p className="text-[12px] text-gray-600">
                        Select a group to view their thesis submissions
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map((group, index) => (
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
                    ))}
                </div>
            </div>
        </AdviseeManagementLayout>
    );
}