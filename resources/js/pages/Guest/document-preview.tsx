import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { NavFooter } from '@/components/nav-footer';
import RepositoryLayout from '@/pages/Shared/repository/index';
import PdfViewer from '@/components/pdf-viewer';
import { BreadcrumbItem, PageHeaderProps } from '@/types';
import { index } from '@/routes/guest/repository/index';
import { stream } from '@/routes/manuscripts/index';
import { Icon } from '@/components/icon-index';
import AppLayout from '@/layouts/app-layout';

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



interface Journal {
    id: number;
    file_path: string | null;
    title: string;
}

interface DocumentPreviewProps {
    journal?: Journal;
}

export default function DocumentPreview({ journal }: DocumentPreviewProps) {
    
    // FORCE TESTING
    // const targetId = 1; 
    // const pdfUrl = `/manuscripts/${targetId}/stream`;
    
    return (
        <>
        <RepositoryLayout
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            
            <Head title="Document Review" />
            {/* <AppHeader variant="guest" /> */}

            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Return Button */}
                    <Link
                        href="/repository"
                        className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-['DM_Sans']"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Return</span>
                    </Link>

                    {/* Document Review Title */}
                    <h1 className="text-2xl font-bold text-primary mb-6 font-['DM_Sans']">
                        Document Review
                    </h1>

                    {/* Document Preview Card */}
                    <div
                        className="p-6"
                        style={{
                            borderRadius: '8px',
                            border: '1px solid rgba(115, 0, 0, 0.26)',
                            background: '#FDFCF6',
                            boxShadow: '0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        {/* Document Preview Header */}
                        <h2 className="text-lg font-bold text-primary mb-4 font-['DM_Sans']">
                            Document Preview
                        </h2>

                        {/* Document Title */}
                        <h3 className="text-base font-medium text-gray-900 mb-6 font-['DM_Sans']">
                            {journal?.title || 'Untitled Document'}
                        </h3>

                        {/* Document Preview Area */}
                        <div
                            className="flex flex-col items-center justify-center"
                            style={{
                                minHeight: '600px',
                                background: '#F5F5F7',
                                borderRadius: '4px'
                            }}
                        >
                            {journal?.file_path ? (
                                <PdfViewer 
                                    fileUrl={stream(journal.id).url} 
                                    className="shadow-lg bg-accent-foreground"
                                />
                            ) : (
                                <>
                                    <FileText className="w-16 h-16 text-gray-400 mb-4" />
                                    <p className="text-gray-600 font-['DM_Sans']">No document available</p>
                                    <p className="text-gray-500">Either Remove or the following file is private currently</p>
                                </>
                            )}

                            {/* <PdfViewer 
                                fileUrl={pdfUrl} 
                                className="shadow-lg bg-accent-foreground"
                            /> */}
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* <NavFooter /> */}
        </RepositoryLayout>
        </>
    );
}
