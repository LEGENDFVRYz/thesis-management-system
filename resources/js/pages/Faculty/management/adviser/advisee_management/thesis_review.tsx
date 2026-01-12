import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/adviser/thesis_review';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AdviseeManagementLayout from '.';
import { AdviseeGroupCard } from '@/components/ui/card';
import { SearchBar } from '@/components/filter-search';
import { FileText, Calendar, ArrowLeft, Download, Eye, MessageSquare, User, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { badgesRegistry } from '@/components/badges-registry';
import { Icon } from '@/components/icon-index';

// Setup
const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Document Review',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Thesis Document Review",
    subtitle: "Review, comment on, and approve/request revisions for submitted thesis documents",
    icon: (
                // pa correct nalang
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};


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

// Badge
interface StatusBadgeProps {
    status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const isApproved = status === "Approved";
    
    return (
        <div 
            className={`
                flex flex-row justify-center items-center
                px-2.5 py-0
                h-5 rounded-[15px] border-[0.8px]
                ${isApproved 
                    ? 'bg-[#DBFEEB] border-[#94FF8E]' 
                    : 'bg-[#FEF9C2] border-[#FEEC71]'
                }
            `}
        >
            <span 
                className={`
                    font-['Arimo'] font-normal text-[12px] leading-5
                    ${isApproved ? 'text-[#39D863]' : 'text-[#C7891E]'}
                `}
            >
                {status}
            </span>
        </div>
    );
}

// Mock submission data
const getSubmissionsForGroup = (groupCode: string) => {
    return [
        {
            id: 1,
            title: "Methods of Research",
            submittedBy: "Juan Dela Cruz",
            submittedDate: "November 01, 2025",
            status: "Approved",
            badgeKey: "committeeBadgev2Approved" as keyof typeof badgesRegistry
        },
        {
            id: 2,
            title: "Design Project 1",
            submittedBy: "Juan Dela Cruz",
            submittedDate: "November 01, 2025",
            status: "Approved",
            badgeKey: "committeeBadgev2Approved" as keyof typeof badgesRegistry
        },
        {
            id: 3,
            title: "Design Project 2",
            submittedBy: "Juan Dela Cruz",
            submittedDate: "November 01, 2025",
            status: "Pending Review",
            badgeKey: "committeeBadgev2Submitted" as keyof typeof badgesRegistry
        }
    ];
};

// Mock comments data
const mockComments = [
    {
        id: 1,
        author: "Engr. April DC",
        date: "Nov 2, 2025",
        text: "Please revise the methodology section. Need more details on the implementation part.",
        avatar: "AD"
    },
    {
        id: 2,
        author: "Dr. ABC",
        date: "Nov 1, 2025",
        text: "Interesting the results of the conducted survey.",
        avatar: "DA"
    },
    {
        id: 3,
        author: "Engr. April DC",
        date: "Nov 1, 2025",
        text: "Please revise the methodology section. Need more details on the implementation part.",
        avatar: "AD"
    },
    {
        id: 4,
        author: "Engr. XYZYYY",
        date: "Nov 1, 2025",
        text: "Please revise the methodology section. Need more details on the implementation part.",
        avatar: "EX"
    }
];

// Submission Card Component
interface SubmissionCardProps {
    title: string;
    submittedBy: string;
    submittedDate: string;
    status: string;
    badgeKey?: keyof typeof badgesRegistry;
    onClick?: () => void;
}

function SubmissionCard({
    title,
    submittedBy,
    submittedDate,
    status,
    badgeKey,
    onClick
}: SubmissionCardProps) {
    return (
        <div 
            className="relative bg-white border border-[#7A7A8A] rounded-[10px] p-[18px_17px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            {/* Container - Group Code and Title */}
            <div className="flex flex-col gap-[3px] mb-3">
                {/* Group Code / Document Title */}
                <h3 className="font-semibold text-base leading-[21px] text-primary">
                    {title}
                </h3>
                
                {/* Pin icon + Thesis Title */}
                <div className="flex items-center gap-[6px]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" fill="#730000"/>
                    </svg>
                    <span className="text-[13.33px] leading-[17px] font-medium text-primary">
                        Machine Learning for Traffic Prediction
                    </span>
                </div>
            </div>

            {/* Members Info */}
            <div className="absolute left-[20.5px] bottom-[18px] flex items-center gap-[6px]">
                <User className="w-[10px] h-[10px] text-[#8B8B98]" />
                <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                    {submittedBy}
                </span>
            </div>

            {/* Badge */}
            <div className="absolute right-[17px] top-[18px]">
                <StatusBadge status={status} />
            </div>
        </div>
    );
}

// Comment Component
interface CommentItemProps {
    author: string;
    date: string;
    text: string;
    avatar: string;
}

function CommentItem({ author, date, text, avatar }: CommentItemProps) {
    return (
        <div className="flex gap-3 p-3 bg-white rounded border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{author}</h4>
                    <span className="text-xs text-gray-500">{date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{text}</p>
            </div>
        </div>
    );
}

export default function ThesisReview() {
    const [selectedGroup, setSelectedGroup] = useState<typeof mockThesisGroups[0] | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const [commentText, setCommentText] = useState('');
    const [pageNumber, setPageNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter groups based on search query
    const filteredGroups = mockThesisGroups.filter(
        (group) =>
            group.groupCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.thesisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.section.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGroupClick = (group: typeof mockThesisGroups[0]) => {
        setSelectedGroup(group);
        setSelectedSubmission(null);
    };

    const handleBackToGroups = () => {
        setSelectedGroup(null);
        setSelectedSubmission(null);
    };

    const handleSubmissionClick = (submission: any) => {
        setSelectedSubmission(submission);
    };

    const handleBackToSubmissions = () => {
        setSelectedSubmission(null);
    };

    const handleAddComment = () => {
        console.log('Adding comment:', commentText, 'Page:', pageNumber);
        setCommentText('');
        setPageNumber('');
    };

    const handlePreview = () => {
        console.log('Preview document');
    };

    const handleDownload = () => {
        console.log('Download document');
    };

    // Document Review View
    if (selectedSubmission && selectedGroup) {
        return (
            <AdviseeManagementLayout 
                breadcrumbs={breadcrumb}
                pageHeader={pageHeader}
            >
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToSubmissions}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Documents
                    </Button>

                    <div className="bg-primary text-white rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-2">{selectedSubmission.title}</h1>
                        <p className="text-sm text-white/90 mb-1">{selectedGroup.thesisTitle}</p>
                        <div className="flex items-center gap-4 text-sm">
                            <span>{selectedGroup.groupCode}</span>
                            <span>•</span>
                            <span>Submitted by {selectedSubmission.submittedBy}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold text-gray-900">Document Preview</h2>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col min-h-[600px]">
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                        <FileText className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">PDF Document Preview</p>
                                    <p className="text-xs text-gray-500">{selectedSubmission.title}</p>
                                </div>
                                
                                <div className="flex gap-3 justify-center pt-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={handlePreview}
                                        className="px-6 py-2 border-[#730000] text-[#730000] hover:bg-red-50"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </Button>
                                    <Button 
                                        variant="negative" 
                                        onClick={handleDownload}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="relative bg-[#F3EFD0] border border-[#730000] rounded-[15px] p-[18px_21px] mt-6 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[13px] leading-[17px] font-bold text-[#8E948D]">
                                        Defense ID:
                                    </p>
                                    <p className="text-[13px] leading-[17px] font-medium text-[rgba(10,10,10,0.8)]">
                                        4305
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-[13px] leading-[17px] font-bold text-[#8E948D]">
                                        Submitted by:
                                    </p>
                                    <p className="text-[12px] leading-[16px] font-medium text-[rgba(10,10,10,0.8)]">
                                        Juan Dela Cruz
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-[13px] leading-[17px] font-bold text-[#8E948D]">
                                        Submitted Date:
                                    </p>
                                    <p className="text-[11px] leading-[14px] font-medium text-[rgba(10,10,10,0.8)]">
                                        November 18, 2025
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-center gap-4 pt-4 border-t mt-4">
                                <Button variant="outline" className="w-70 px-6 py-2 border-[#730000] text-[#730000] hover:bg-red-50" >
                
                                    Request Revisions
                                </Button>
                                <Button variant="negative"className="w-70">
                                    Approve Document
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold text-gray-900">Comments & Feedback</h2>
                            </div>

                            <div className="bg-[#F3EFD0] border-[0.8px] border-[#730000] rounded-[15px] p-[18px] mb-6">
                                <textarea
                                    placeholder="Enter your comment or feedback..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="w-full mb-3 bg-[#F3EFD0] border-[0.8px] border-[#7A7A8A] rounded-[8px] p-[23px_25px] text-[11px] leading-[14px] font-medium text-[rgba(10,10,10,0.8)] placeholder:text-[rgba(10,10,10,0.8)] focus:outline-none focus:ring-1 focus:ring-[#730000] focus:border-[#730000] resize-none"
                                    rows={4}
                                />
                                <div className="flex gap-3">
                                    <input
                                        placeholder="Page number (optional)"
                                        value={pageNumber}
                                        onChange={(e) => setPageNumber(e.target.value)}
                                        className="flex-1 bg-[#F3EFD0] border-[0.8px] border-[#7A7A8A] rounded-[8px] px-[14px] py-[8px] text-[11px] leading-[14px] font-medium text-[rgba(10,10,10,0.8)] placeholder:text-[rgba(10,10,10,0.8)] focus:outline-none focus:ring-1 focus:ring-[#730000] focus:border-[#730000]"
                                    />
                                    <button 
                                        onClick={handleAddComment}
                                        disabled={!commentText.trim()}
                                        className="flex items-center justify-center px-4 py-2 bg-[#9B000A] text-white text-[13.33px] leading-[17px] font-medium rounded-[8px] hover:bg-[#7A0008] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm text-gray-900 mb-3">Comment/s</h3>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                    {mockComments.map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            author={comment.author}
                                            date={comment.date}
                                            text={comment.text}
                                            avatar={comment.avatar}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdviseeManagementLayout>
        );
    }

    // Submissions List View
    if (selectedGroup) {
        const submissions = getSubmissionsForGroup(selectedGroup.groupCode);

        return (
            <AdviseeManagementLayout 
                breadcrumbs={breadcrumb}
                pageHeader={pageHeader}
            >
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToGroups}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Groups
                    </Button>

                    <div className="relative bg-white border border-[#7A7A8A] rounded-[10px] p-[18px_17px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center justify-between mb-[3px]">
                            <h2 className="text-base leading-[21px] font-semibold text-primary">
                                {selectedGroup.groupCode}
                            </h2>
                            {selectedGroup.badge && (
                                <StatusBadge status={selectedGroup.badge} />
                            )}
                        </div>
                        
                        <div className="flex items-center gap-[6px] mb-[3px]">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                                <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" fill="#730000"/>
                            </svg>
                            <span className="text-[13.33px] leading-[17px] font-medium text-primary">
                                {selectedGroup.thesisTitle}
                            </span>
                        </div>

                        <Badge variant="outline" className="text-[8px] h-auto px-2 py-0.5 mb-[3px]">
                            {selectedGroup.section}
                        </Badge>

                        <div className="flex items-center gap-[6px] mt-[3px] pt-[3px] border-t border-gray-200">
                            <User className="w-[10px] h-[10px] text-[#8B8B98]" />
                            <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                                {selectedGroup.numberofMembers}
                            </span>
                            <span className="text-[#7A7A8A] mx-0.5">•</span>
                            <FileText className="w-[10px] h-[10px] text-[#8B8B98]" />
                            <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                                {selectedGroup.numberofSubmissions}
                            </span>
                            <span className="text-[#7A7A8A] mx-0.5">•</span>
                            <Calendar className="w-[10px] h-[10px] text-[#8B8B98]" />
                            <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                                Last submission: {selectedGroup.lastSubmissionDate}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Submission/s</h2>
                        <div className="space-y-3">
                            {submissions.map((submission) => (
                                <SubmissionCard
                                    key={submission.id}
                                    title={submission.title}
                                    submittedBy={submission.submittedBy}
                                    submittedDate={submission.submittedDate}
                                    status={submission.status}
                                    badgeKey={submission.badgeKey}
                                    onClick={() => handleSubmissionClick(submission)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </AdviseeManagementLayout>
        );
    }

    // Groups List View 
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
                            onClick={() => handleGroupClick(group)}
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