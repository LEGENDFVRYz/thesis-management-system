import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Archive } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { NavFooter } from '@/components/nav-footer';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import RepositoryLayout from '.';
import { BreadcrumbItem, PageHeaderProps } from '@/types';
import { theses } from '@/routes/repository';


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

interface ThesisData {
    title: string;
    members: string[];
    date: string;
    badges: string[];
    defenseId?: string;
    specialization?: string;
    block?: string;
    thesisAdviser?: string;
    defensePanel?: { id: string; name: string }[];
}

interface DocumentPreviewProps {
    thesis?: ThesisData;
}

export default function DocumentPreview({ thesis }: DocumentPreviewProps) {
    const [thesisData, setThesisData] = React.useState<ThesisData | null>(null);

    React.useEffect(() => {
        if (thesis) {
            setThesisData(thesis);
        } else {
            const stored = sessionStorage.getItem('selectedThesis');
            if (stored) {
                setThesisData(JSON.parse(stored));
                sessionStorage.removeItem('selectedThesis'); // Clean up
            }
        }
    }, [thesis]);

    const defaultThesis: ThesisData = {
        title: "Machine Learning Applications in Healthcare Diagnostics",
        members: ["John Doe", "Jane Smith", "Mike Johnson", "John Doe"],
        date: "December 2025",
        badges: ["Computer Vision", "Neural Networks"],
        defenseId: "DEF-001",
        specialization: "Machine Learning",
        block: "BSCPE 3-3",
        thesisAdviser: "Dr. Maria Santos",
        defensePanel: [
            { id: "P1", name: "Dr. Robert Chen" },
            { id: "P2", name: "Dr. Sofia Smith" },
            { id: "P3", name: "Engr. John Johnson" }
        ]
    };

    const displayThesis = thesisData || defaultThesis;

    // Format date to MM/DD/YYYY
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            // If date parsing fails, try to extract year and month
            const parts = dateStr.split(' ');
            if (parts.length === 2) {
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                const monthIndex = monthNames.indexOf(parts[0]);
                if (monthIndex !== -1) {
                    const month = (monthIndex + 1).toString().padStart(2, '0');
                    return `${month}/01/${parts[1]}`;
                }
            }
            return dateStr;
        }
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    return (
        <>
        <RepositoryLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
        
            <Head title="Thesis Archive" />

            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Return Button */}
                    <Link
                        href="/test-thesis"
                        className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-dm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Return</span>
                    </Link>

                    {/* Document Review Title */}
                    <h1 className="text-2xl font-bold text-primary mb-6 font-dm">
                        Document Review
                    </h1>

                    {/* Main Container with Details and Preview */}
                    <div className="p-6 rounded-lg border border-border bg-accent shadow-md">
                        {/* Defense Details Card */}
                        <div>
                            {/* Header */}
                            <div className="flex justify-between items-start pb-4 border-b border-border mb-5">
                                <div>
                                    <h2 className="text-primary font-dm text-xl font-bold leading-tight">
                                        Defense Details
                                    </h2>
                                    <p className="text-muted-foreground font-dm text-sm font-medium leading-tight mt-0.5">
                                        Complete information about the thesis defense
                                    </p>
                                </div>
                                
                                <div className="text-right">
                                    <p className="text-primary font-dm text-sm font-medium leading-tight">
                                        Defense ID
                                    </p>
                                    <p className="text-foreground font-dm text-sm font-bold leading-tight">
                                        {displayThesis.defenseId || 'DEF-001'}
                                    </p>
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-12 gap-6">
                                {/* Left Column - Main Details */}
                                <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
                                    {/* Thesis Title */}
                                    <div>
                                        <p className="text-primary font-dm text-sm font-bold mb-1">
                                            Thesis Title
                                        </p>
                                        <p className="text-foreground font-dm text-sm font-medium">
                                            {displayThesis.title}
                                        </p>
                                    </div>

                                    {/* Specialization */}
                                    <div>
                                        <p className="text-primary font-dm text-sm font-bold mb-2">
                                            Specialization
                                        </p>
                                        <div className="flex items-center gap-1 px-2.5 py-1 w-fit rounded-lg border-[0.8px] border-primary">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.71 5.46093C10.7995 5.42145 10.8755 5.35657 10.9285 5.27434C10.9815 5.1921 11.0092 5.09613 11.0082 4.9983C11.0071 4.90048 10.9775 4.8051 10.9228 4.72398C10.8681 4.64286 10.7908 4.57956 10.7005 4.54193L6.41499 2.58993C6.28471 2.53051 6.14318 2.49976 5.99999 2.49976C5.8568 2.49976 5.71527 2.53051 5.58499 2.58993L1.29999 4.53993C1.21097 4.57892 1.13525 4.643 1.08207 4.72434C1.0289 4.80568 1.00058 4.90076 1.00058 4.99793C1.00058 5.09511 1.0289 5.19019 1.08207 5.27153C1.13525 5.35287 1.21097 5.41695 1.29999 5.45593L5.58499 7.40993C5.71527 7.46936 5.8568 7.50011 5.99999 7.50011C6.14318 7.50011 6.28471 7.46936 6.41499 7.40993L10.71 5.46093Z" className="stroke-primary" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M11 5V8" className="stroke-primary" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M3 6.25V8C3 8.39782 3.31607 8.77936 3.87868 9.06066C4.44129 9.34196 5.20435 9.5 6 9.5C6.79565 9.5 7.55871 9.34196 8.12132 9.06066C8.68393 8.77936 9 8.39782 9 8V6.25" className="stroke-primary" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span className="text-primary font-dm text-xs font-medium">
                                                {displayThesis.specialization || 'Machine Learning'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <p className="text-primary font-dm text-sm font-bold mb-2">
                                            Tag
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {displayThesis.badges.map((tag, index) => (
                                                <div 
                                                    key={index} 
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border-[0.8px] border-primary"
                                                >
                                                    <span className="text-primary font-dm text-xs font-medium">
                                                        {tag}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Thesis Adviser */}
                                    <div>
                                        <p className="text-primary font-dm text-sm font-bold mb-1">
                                            Thesis Adviser
                                        </p>
                                        <p className="text-foreground font-dm text-sm font-medium">
                                            {displayThesis.thesisAdviser || 'Dr. Maria Santos'}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column - Block, Date, Proponents, and Defense Panel */}
                                <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
                                    {/* Block */}
                                    <div>
                                        <p className="text-primary font-dm text-sm font-bold mb-1">
                                            Block
                                        </p>
                                        <p className="text-foreground font-dm text-sm font-medium">
                                            {displayThesis.block || 'BSCPE 3-3'}
                                        </p>
                                    </div>

                                    {/* Date of Publication */}
                                    <div>
                                        <p className="text-primary font-dm text-sm font-bold mb-2">
                                            Date of Publication
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.1687 1.29199V3.87631" className="stroke-muted-foreground" strokeWidth="1.29216" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10.337 1.29199V3.87631" className="stroke-muted-foreground" strokeWidth="1.29216" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12.2754 2.58423H3.23033C2.51669 2.58423 1.93817 3.16275 1.93817 3.87639V12.9215C1.93817 13.6351 2.51669 14.2136 3.23033 14.2136H12.2754C12.9891 14.2136 13.5676 13.6351 13.5676 12.9215V3.87639C13.5676 3.16275 12.9891 2.58423 12.2754 2.58423Z" className="stroke-muted-foreground" strokeWidth="1.29216" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M1.93817 6.46069H13.5676" className="stroke-muted-foreground" strokeWidth="1.29216" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <p className="text-foreground font-dm text-sm font-medium">
                                                {formatDate(displayThesis.date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Proponents and Defense Panel Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Proponents */}
                                        <div>
                                            <p className="text-primary font-dm text-sm font-bold mb-2">
                                                Proponents
                                            </p>
                                            <div className="flex flex-col gap-1.5">
                                                {displayThesis.members.map((proponent, index) => (
                                                    <div 
                                                        key={index}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-secondary-foreground-2/50 px-[8.8px] py-[2.6px] w-fit"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7.75276 10.1759V9.20679C7.75276 8.69274 7.54855 8.19974 7.18506 7.83625C6.82157 7.47276 6.32857 7.26855 5.81452 7.26855H2.90717C2.39312 7.26855 1.90012 7.47276 1.53663 7.83625C1.17314 8.19974 0.968933 8.69274 0.968933 9.20679V10.1759" className="stroke-foreground" strokeWidth="0.969118" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M7.75281 1.51587C8.16844 1.62362 8.53653 1.86633 8.7993 2.20591C9.06207 2.54549 9.20464 2.96271 9.20464 3.39208C9.20464 3.82145 9.06207 4.23867 8.7993 4.57825C8.53653 4.91783 8.16844 5.16054 7.75281 5.26829" className="stroke-foreground" strokeWidth="0.969118" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M10.6601 10.1757V9.20654C10.6598 8.77709 10.5168 8.35991 10.2537 8.02049C9.99062 7.68108 9.62224 7.43866 9.20642 7.3313" className="stroke-foreground" strokeWidth="0.969118" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M4.36078 5.33008C5.43124 5.33008 6.29902 4.46231 6.29902 3.39185C6.29902 2.32139 5.43124 1.45361 4.36078 1.45361C3.29032 1.45361 2.42255 2.32139 2.42255 3.39185C2.42255 4.46231 3.29032 5.33008 4.36078 5.33008Z" className="stroke-foreground" strokeWidth="0.969118" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        <span className="text-foreground font-dm text-[12px] font-medium leading-[16px]">
                                                            {proponent}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Defense Panel */}
                                        <div>
                                            <p className="text-primary font-dm text-sm font-bold mb-2">
                                                Defense Panel
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {(displayThesis.defensePanel || defaultThesis.defensePanel || []).map((panelist, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/50 flex-shrink-0">
                                                            <span className="text-primary font-dm text-xs font-medium text-center leading-none">
                                                                {panelist.id}
                                                            </span>
                                                        </div>
                                                        <p className="text-foreground font-dm text-sm font-medium">
                                                            {panelist.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <Separator className="my-8" />

                        {/* Document Preview Card */}
                        <div>
                            {/* Document Preview Header */}
                            <h2 className="text-lg font-bold text-primary mb-4 font-dm">
                                Document Preview
                            </h2>

                            {/* Document Title */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-base font-medium text-foreground font-dm">
                                    {displayThesis.title}
                                </h3>
                                <Button variant="secondary">
                                    Download Document
                                </Button>
                            </div>

                            {/* Document Preview Area */}
                            <div className="flex flex-col items-center justify-center min-h-[600px] bg-muted rounded">
                                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground font-dm">Document Preview Area</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <NavFooter /> */}

        </RepositoryLayout>
        </>
    );
}