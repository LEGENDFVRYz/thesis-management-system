import { submissions } from '@/routes/faculty/adviser/thesis_review';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Eye, Download, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import AdviseeManagementLayout from '../index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Icon } from '@/components/icon-index';
import { router } from '@inertiajs/react';
import { CommentItem } from './components';

interface ReviewPageProps {
    groupCode: string;
    submissionId: string;
}

// Mock data
const mockSubmission = {
    id: "3",
    title: "Design Project 2",
    submittedBy: "Juan Dela Cruz",
    submittedDate: "November 18, 2025",
    status: "Pending Review"
};

const mockGroup = {
    groupCode: "4308",
    thesisTitle: "Machine Learning for Traffic Prediction"
};

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

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Document Review',
        href: '/faculty/adviser/thesis-review',
    },
    {
        title: 'Submissions',
        href: `/faculty/adviser/thesis-review/${mockGroup.groupCode}`,
    },
    {
        title: 'Review',
        href: '#',
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

export default function ThesisReview({ groupCode, submissionId }: ReviewPageProps) {
    const [commentText, setCommentText] = useState('');
    const [pageNumber, setPageNumber] = useState('');

    const handleBackToSubmissions = () => {
    router.visit(submissions(groupCode).url);
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
                    <h1 className="text-2xl font-bold mb-2">{mockSubmission.title}</h1>
                    <p className="text-sm text-white/90 mb-1">{mockGroup.thesisTitle}</p>
                    <div className="flex items-center gap-4 text-sm">
                        <span>{mockGroup.groupCode}</span>
                        <span>•</span>
                        <span>Submitted by {mockSubmission.submittedBy}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Document Preview Section */}
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
                                <p className="text-xs text-gray-500">{mockSubmission.title}</p>
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
                                    {mockSubmission.submittedBy}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-[13px] leading-[17px] font-bold text-[#8E948D]">
                                    Submitted Date:
                                </p>
                                <p className="text-[11px] leading-[14px] font-medium text-[rgba(10,10,10,0.8)]">
                                    {mockSubmission.submittedDate}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-center gap-4 pt-4 border-t mt-4">
                            <Button variant="outline" className="w-70 px-6 py-2 border-[#730000] text-[#730000] hover:bg-red-50">
                                Request Revisions
                            </Button>
                            <Button variant="negative" className="w-70">
                                Approve Document
                            </Button>
                        </div>
                    </div>

                    {/* Comments Section */}
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