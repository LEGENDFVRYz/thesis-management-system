import { index, review } from '@/routes/faculty/adviser/thesis_review';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdviseeManagementLayout from '../index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Icon } from '@/components/icon-index';
import { router } from '@inertiajs/react';
import { SubmissionCard, GroupInfoCard } from './components';

interface SubmissionsPageProps {
    groupCode: string;
    // In real app, you'd receive group data and submissions from backend
}

// Mock data - in real app from props
const mockGroup = {
    groupCode: "4308",
    badge: "Pending Review",
    thesisTitle: "Machine Learning for Traffic Prediction",
    section: "BSCPE 4-3",
    numberofMembers: "4 Members",
    numberofSubmissions: "3 Submissions",
    lastSubmissionDate: "November 25, 2025"
};

const mockSubmissions = [
    {
        id: "1",
        title: "Methods of Research",
        submittedBy: "Juan Dela Cruz",
        submittedDate: "November 01, 2025",
        status: "Approved"
    },
    {
        id: "2",
        title: "Design Project 1",
        submittedBy: "Juan Dela Cruz",
        submittedDate: "November 01, 2025",
        status: "Approved"
    },
    {
        id: "3",
        title: "Design Project 2",
        submittedBy: "Juan Dela Cruz",
        submittedDate: "November 01, 2025",
        status: "Pending Review"
    }
];

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Document Review',
        href: '/faculty/adviser/thesis-review',
    },
    {
        title: 'Submissions',
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

export default function ThesisSubmissions({ groupCode }: SubmissionsPageProps) {
    const handleBackToGroups = () => {
    router.visit(index().url);
    };

    const handleSubmissionClick = (submissionId: string) => {
        router.visit(review({ groupCode, submissionId }).url);
    };

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

                <GroupInfoCard {...mockGroup} />

                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Submission/s</h2>
                    <div className="space-y-3">
                        {mockSubmissions.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                title={submission.title}
                                submittedBy={submission.submittedBy}
                                submittedDate={submission.submittedDate}
                                status={submission.status}
                                thesisTitle={mockGroup.thesisTitle}
                                onClick={() => handleSubmissionClick(submission.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AdviseeManagementLayout>
    );
}