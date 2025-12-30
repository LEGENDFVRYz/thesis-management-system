import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { NavFooter } from '@/components/nav-footer';

export default function DocumentPreview() {
    return (
        <>
            <Head title="Document Review" />
            <AppHeader variant="guest" />

            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Return Button */}
                    <Link
                        href="/guest/repository"
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
                            Machine Learning Applications in Healthcare Diagnostics
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
                            <FileText className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-gray-600 font-['DM_Sans']">Document Preview Area</p>
                        </div>
                    </div>
                </div>
            </div>

            <NavFooter />
        </>
    );
}
