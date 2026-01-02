import DocumentPreview from '@/components/document-preview';
import { iconRegistry } from '@/components/icons-registry';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { endorsement } from '@/routes/faculty/management/adviser';
import { type BreadcrumbItem } from '@/types';
import { Calendar, Users } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Tabs } from './doc_n_eval_tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis Review',
        href: endorsement().url,
    },
];

const BackIcon = iconRegistry.backDefault;

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Documentation');

    const [selectedDoc, setSelectedDoc] = useState({
        title: 'BSCPE_4-3_DP1_Manuscript.pdf',
        url: '/documents/sample.pdf',
    });

    const documents = [
        {
            title: 'BSCPE_4-3_DP1_Manuscript.pdf',
            url: '/documents/sample.pdf',
        },
        {
            title: 'BSCPE_4-3_Title_Proposal.pdf',
            url: '/documents/sample2.pdf',
        },
    ];

    const defenseDetails = {
        id: 'DEF-001',
        status: 'Completed',
        title: 'Machine Learning Applications in Healthcare Diagnostics',
        block: 'BSCPE 3-3',
        venue: 'Room 313, CEA',
        time: '09:00 AM',
        adviser: 'Dr. Maria Santos',
        date: '11/25/2025',
        proponents: ['John Doe', 'Jane Smith', 'Mike Johnson', 'John Doe'],
        panelists: [
            { id: 'P1', name: 'Dr. Robert Chen' },
            { id: 'P2', name: 'Dr. Sofia Smith' },
            { id: 'P3', name: 'Engr. John Johnson' },
        ],
    };

    const tabLabels = ['Documentation', 'Evaluation'];

    const tabContent: Record<string, React.ReactNode> = {
        Documentation: (
            <div className="mt-6">
                {/* Defense Details */}
                <div className="rounded-lg border bg-primary-foreground p-8 shadow-sm">
                    {/* Header */}
                    <div className="mb-8 flex justify-between">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-primary">
                                Defense Details
                            </h2>
                            <p className="text-alert-desc">
                                Complete information about the thesis defense
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-primary">Defense ID</p>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold">
                                    {defenseDetails.id}
                                </span>
                                <span className="rounded bg-green-700 px-3 py-1 text-xs text-white">
                                    {defenseDetails.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-5 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-primary">
                                Block
                            </h3>
                            <p>{defenseDetails.block}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-primary">
                                Venue
                            </h3>
                            <p>{defenseDetails.venue}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-primary">
                                Time
                            </h3>
                            <p>{defenseDetails.time}</p>
                        </div>

                        <div className="col-span-2 row-span-2">
                            <h3 className="mb-2 text-sm font-semibold text-primary">
                                Proponents
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {defenseDetails.proponents.map((name, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 rounded bg-yellow-200 px-3 py-1.5"
                                    >
                                        <Users className="h-4 w-4" />
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-primary">
                                Thesis Adviser
                            </h3>
                            <p>{defenseDetails.adviser}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-primary">
                                Date
                            </h3>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {defenseDetails.date}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document + Side Panels */}
                <div className="mt-6 grid grid-cols-4 gap-6">
                    <div className="col-span-3">
                        <DocumentPreview
                            documentTitle={selectedDoc.title}
                            documentUrl={selectedDoc.url}
                        />
                    </div>

                    <div className="col-span-1 space-y-6">
                        <div className="rounded-lg border p-4">
                            <h3 className="mb-4 text-sm font-semibold text-primary">
                                Recent Submissions
                            </h3>

                            <div className="divide-y rounded-lg border">
                                {documents.map((doc, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`flex cursor-pointer gap-3 border-l-4 p-3 transition ${
                                            selectedDoc.title === doc.title
                                                ? 'border-primary bg-primary/30'
                                                : 'border-transparent hover:border-primary hover:bg-primary/30'
                                        }`}
                                    >
                                        <iconRegistry.docuDefault className="h-5 w-5 text-primary" />
                                        <p className="truncate text-sm font-medium">
                                            {doc.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="text-sm font-semibold text-primary">
                                Comments
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        ),
        Evaluation: <div className="mt-6">Evaluation content here</div>,
    };

    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title="Document Review and Evaluation Form"
            description="Manage and Review All Assigned Theses"
        >
            <div className="mb-6 flex cursor-pointer items-center gap-2">
                <BackIcon className="h-6 w-6 text-primary" />
                <span className="text-primary underline">Return</span>
            </div>

            <Tabs
                tabs={tabLabels}
                defaultTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="mt-6">{tabContent[activeTab]}</div>
        </FacultyManagementLayout>
    );
}
