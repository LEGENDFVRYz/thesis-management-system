import { HeaderCard } from '@/components/ui/card';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { NavFooter } from '@/components/nav-footer';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookMarked, Upload, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resources',
        href: dashboard().url,
    },
];

// sample data
const resources = [
    { id: 1, name: "Thesis_Guidelines_2024.pdf", type: "PDF Document", uploadedBy: "Admin Sarah", date: "November 28, 2025", time: "09:00 AM", status: "Active" },
    { id: 2, name: "Defense_Template.pptx", type: "Powerpoint", uploadedBy: "John Doe", date: "December 05, 2025", time: "02:30 PM", status: "Active" },
    { id: 3, name: "Archived_Manual_v1.docx", type: "Word Document", uploadedBy: "Jane Smith", date: "January 02, 2026", time: "11:15 AM", status: "Archived" },
];

export default function Resources() {
    const totalCount = resources.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8">
                
                {/* 1. Header */}
                <HeaderCard 
                    title="Resources" 
                    description="Access official department templates and resources with full administrative controls"
                    icon={<BookMarked className="w-8 h-8 text-primary" />}
                    className="w-full lg:w-full rounded-none border-t-0 border-x-0" 
                />

                {/* 2. Main Content */}
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    <div className="w-full [&>*]:max-w-full">
                        <FilterSearchSection variant="DefenseManagement" />
                    </div>

                    {/* Action Row */}
                    <div className="flex justify-end w-full">
                        <Button 
                            variant="primary" 
                            className="flex items-center gap-2 px-4 py-2 font-dm tracking-wider"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Document
                        </Button>
                    </div>

                    {/* Table Section */}
                    <div className="rounded-lg border border-sidebar-border/70 overflow-hidden bg-card shadow-sm w-full">
                        <Table>
                            <TableHeader className="bg-primary">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">File Name</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">File Type</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Uploaded By</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Date Uploaded</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Status</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.map((file) => (
                                    <TableRow key={file.id} className="text-center">
                                        <TableCell className="text-left py-4">
                                            <div className="flex items-center gap-2 justify-start px-2">
                                                <FileText className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate max-w-[200px]">{file.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{file.type}</TableCell>
                                        <TableCell>{file.uploadedBy}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-medium text-foreground">{file.date}</span>
                                                <span className="font-medium text-foreground">{file.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span 
                                                className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold border"
                                                style={file.status === 'Active' ? {
                                                    backgroundColor: 'var(--completed-bg)', 
                                                    borderColor: 'var(--completed-border)', 
                                                    color: 'var(--completed-font-color)' 
                                                } : {
                                                    backgroundColor: 'var(--pending-bg)', 
                                                    borderColor: 'var(--pending-border)', 
                                                    color: 'var(--pending-font-color)' 
                                                }}
                                            >
                                                {file.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="tertiary" size="sm" className="h-8 px-4 font-bold">
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption className="border-t py-4">
                                {totalCount} of {totalCount} Templates and Resources
                            </TableCaption>
                        </Table>
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>
        </AppLayout>
    );
}