import React, { useState } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from '@/components/ui/sheet';
import { FileUpload } from '@/components/file-upload';
import { NavFooter } from '@/components/nav-footer';
import { TextLink } from '@/components/text-link';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookMarked, Upload, FileText, Download, Check, AlertCircle} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Resources', href: dashboard().url }];

const resources = [
    { id: 1, name: "Thesis_Guidelines_2024.pdf", type: "PDF Document", uploadedBy: "Admin Sarah", date: "November 28, 2025", time: "09:00 AM", status: "Active", size: "275 KB", owner: "owner@gmail.com" },
    { id: 2, name: "Defense_Template.pptx", type: "Powerpoint", uploadedBy: "John Doe", date: "December 05, 2025", time: "02:30 PM", status: "Active", size: "1.2 MB", owner: "owner@gmail.com" },
    { id: 3, name: "Archived_Manual_v1.docx", type: "Word Document", uploadedBy: "Jane Smith", date: "January 02, 2026", time: "11:15 AM", status: "Archived", size: "450 KB", owner: "owner@gmail.com" },
];

export default function Resources() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDownloadSuccessOpen, setIsDownloadSuccessOpen] = useState(false);
    const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<typeof resources[0] | null>(null);

    // Restrictions Modal State
    const [isRestrictionsModalOpen, setIsRestrictionsModalOpen] = useState(false);
    const [accessLevels, setAccessLevels] = useState([
        { role: "Admin", view: true, update: true, delete: true, viewDisabled: true, updateDisabled: true, deleteDisabled: true },
        { role: "Thesis Adviser", view: true, update: true, delete: false },
        { role: "Coordinator", view: false, update: false, delete: false },
        { role: "Panel Member", view: false, update: false, delete: false },
        { role: "Committee", view: true, update: false, delete: false },
        { role: "Student", view: false, update: false, delete: false },
    ]);

    const handleCheckboxChange = (index: number, field: "view" | "update" | "delete") => {
        const newAccessLevels = [...accessLevels];
        newAccessLevels[index][field] = !newAccessLevels[index][field];
        setAccessLevels(newAccessLevels);
    };

    const handleViewDetails = (file: typeof resources[0]) => {
        setSelectedFile(file);
        setIsSheetOpen(true);
    };

    const handleDownload = () => {
        setIsDownloadSuccessOpen(true);
        setTimeout(() => setIsDownloadSuccessOpen(false), 3000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8">
                <HeaderCard 
                    title="Resources" 
                    description="Access official department templates and resources with full administrative controls"
                    icon={<BookMarked className="w-8 h-8 text-primary" />}
                    className="w-full rounded-none border-t-0 border-x-0" 
                />

                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    <FilterSearchSection variant="DefenseManagement" />
                    <div className="flex justify-end">
                        <Button variant="primary" className="gap-2" onClick={() => setIsUploadModalOpen(true)}>
                            <Upload className="w-4 h-4" /> Upload Document
                        </Button>
                    </div>

                    <div className="rounded-lg border overflow-hidden bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-primary text-center">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-primary-foreground text-center">File Name</TableHead>
                                    <TableHead className="text-primary-foreground text-center">File Type</TableHead>
                                    <TableHead className="text-primary-foreground text-center">Uploaded By</TableHead>
                                    <TableHead className="text-primary-foreground text-center">Date Uploaded</TableHead>
                                    <TableHead className="text-primary-foreground text-center">Status</TableHead>
                                    <TableHead className="text-primary-foreground text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.map((file) => (
                                    <TableRow key={file.id} className="text-center">
                                        <TableCell className="text-left py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary" />
                                                <span className="truncate max-w-[200px]">{file.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{file.type}</TableCell>
                                        <TableCell>{file.uploadedBy}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{file.date}</span>
                                                <span className="text-xs text-muted-foreground">{file.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                                                file.status === 'Active' ? 'bg-[var(--completed-bg)] text-[var(--completed-font-color)] border-[var(--completed-border)]' : 'bg-[var(--pending-bg)] text-[var(--pending-font-color)] border-[var(--pending-border)]'
                                            }`}>
                                                {file.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="tertiary" size="sm" onClick={() => handleViewDetails(file)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption className="border-t py-4">
                                {resources.length} of {resources.length} Resources
                            </TableCaption>
                        </Table>
                    </div>
                </div>
                
                {/* Side Sheet Panel */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="sm:max-w-[450px] flex flex-col p-0">
                        <SheetHeader className="p-6 text-left border-b">
                            <SheetTitle className="font-dm flex items-center gap-2 text-xl">File Details</SheetTitle>
                            <SheetDescription>Additional information about the template</SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">File Preview</h4>
                                <div className="h-96 w-full rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center bg-muted/5">
                                    <FileText className="w-16 h-16 text-muted-foreground/20" />
                                </div>
                            </div>

                            <div onClick={() => setIsRestrictionsModalOpen(true)} className="cursor-pointer inline-block">
                                <TextLink href="#" variant="restriction" onClick={(e) => e.preventDefault()}>
                                    Manage file restrictions
                                </TextLink>
                            </div>

                            <div className="space-y-4">
                                {['Size', 'Storage used', 'Owner'].map((label) => (
                                    <div key={label}>
                                        <p className="text-xs font-bold text-primary uppercase">{label}</p>
                                        <p className="text-sm">{label === 'Owner' ? selectedFile?.owner : selectedFile?.size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t bg-muted/5 flex justify-end gap-3">
                            <Button variant="secondary" onClick={handleDownload}>
                                <Download className="w-4 h-4" /> Download
                            </Button>
                            {selectedFile?.status === 'Active' && (
                                <Button variant="negative" onClick={() => setIsArchiveConfirmOpen(true)}> Archive </Button>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* File Restriction Modal */}
                <Dialog open={isRestrictionsModalOpen} onOpenChange={setIsRestrictionsModalOpen}>
                    <DialogContent 
                        className="max-w-[700px] p-0 border-none overflow-hidden"
                        onPointerDownOutside={(e) => e.preventDefault()}
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Header */}
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#800000", margin: 0 }}>Manage File Restrictions</h2>
                            </div>

                            {/* Content */}
                            <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
                                <p style={{ color: "#6b7280", marginBottom: "16px", fontSize: "14px" }}>
                                    Configure access permissions for different user roles in the file system.
                                </p>
                                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Access Level", "View", "Update", "Delete"].map((h) => (
                                                    <th key={h} style={{ backgroundColor: "#800000", color: "white", padding: "10px", fontSize: "14px" }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accessLevels.map((level, index) => (
                                                <tr key={level.role} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                                    <td style={{ textAlign: "center", padding: "10px", fontSize: "14px", fontWeight: 500 }}>{level.role}</td>
                                                    <td style={{ textAlign: "center", padding: "10px" }}>
                                                        <div className="flex justify-center">
                                                            <Checkbox checked={level.view} disabled={level.viewDisabled} onCheckedChange={() => handleCheckboxChange(index, "view")} />
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: "center", padding: "10px" }}>
                                                        <div className="flex justify-center">
                                                            <Checkbox checked={level.update} disabled={level.updateDisabled} onCheckedChange={() => handleCheckboxChange(index, "update")} />
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: "center", padding: "10px" }}>
                                                        <div className="flex justify-center">
                                                            <Checkbox checked={level.delete} disabled={level.deleteDisabled} onCheckedChange={() => handleCheckboxChange(index, "delete")} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                                <Button variant="secondary" onClick={() => setIsRestrictionsModalOpen(false)} >Cancel</Button>
                                <Button variant="primary" onClick={() => setIsRestrictionsModalOpen(false)} >Save</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Other Modals */}
                <Dialog open={isDownloadSuccessOpen} onOpenChange={setIsDownloadSuccessOpen}>
                    <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-primary-foreground">
                        <div className="w-16 h-16 bg-alert-success rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <Check className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <p className="text-[16px] text-center text-foreground font-dm font-bold">Item downloaded successfully.</p>
                    </DialogContent>
                </Dialog>

                <Dialog open={isArchiveConfirmOpen} onOpenChange={setIsArchiveConfirmOpen}>
                    <DialogContent className="max-w-[400px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-primary-foreground">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <AlertCircle className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <div className="text-center space-y-2 mb-8">
                            <h3 className="text-lg font-bold font-dm">Are you sure you want to archive the file?</h3>
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="outline" className="flex-1 rounded-full border-foreground font-bold" onClick={() => setIsArchiveConfirmOpen(false)}>Cancel</Button>
                            <Button variant="negative" className="flex-1 rounded-full font-bold" onClick={() => setIsArchiveConfirmOpen(false)}>Confirm</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader><DialogTitle className="font-dm text-primary">Upload Document</DialogTitle></DialogHeader>
                        <div className="py-4">
                            <FileUpload {...({ onChange: (files: File[]) => console.log(files) } as any)} />
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>
        </AppLayout>
    );
}