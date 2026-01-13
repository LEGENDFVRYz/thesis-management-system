import React from 'react';
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
import { resources } from '@/routes/admin/index';
import { toggle, remove, store } from '@/routes/admin/resources/index';
import { download } from '@/routes/resources/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { BookMarked, Upload, FileText, Download, Check, AlertCircle} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

//SEtup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resources',
        href: resources().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Resources",
    subtitle: "Access official department templates and resources with full administrative controls",
    icon: (
        // pa correct nalang
        <BookMarked className="w-8 h-8 text-primary" />
    ),
};


interface Resource {
    id: number;
    file_name: string;
    file_type: string;
    file_path: string;
    file_size: string;
    uploaded_by: string;
    uploaded_at: string;
    is_active: boolean;
}

interface Props {
    resources: Resource[];
}


export default function Resources({ resources }: Props) {
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

    const totalCount = resources?.length ?? 0;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const uploadForm = useForm<{ file: File | null }>({
        file: null,
    });

    const { patch, delete: destroy, processing, reset, setData, post } = uploadForm;

    // Toggle the view mode status
    const toggleStatus = (resource: Resource) => {
        patch(toggle(resource.id).url, {
            preserveScroll: true,
        });
    };

    // Remove the resorce in the record
    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        destroy(remove(id).url, {
            preserveScroll: true,
        });
    };

    // download the recorded resource
    const handleDownload = (filePath: string) => {
        // window.open(download(filePath).url, '_blank');
        window.location.href = download(filePath).url
    };

    // Upload the file in the resources
    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.data.file) return;

        post(store().url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsUploadModalOpen(false);
            },
        });
    };

    return (
        <AppLayout 
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Resources" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8">

                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    <FilterSearchSection variant="DefenseManagement" />
                    <div className="flex justify-end">
                        <Button 
                            variant="primary" className="gap-2" 
                            onClick={() => setIsUploadModalOpen(true)}
                            disabled={processing}
                        >
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
                                {resources.length > 0 ? (
                                    resources.map((file) => (
                                    <TableRow key={file.id} className="text-center">
                                        <TableCell className="text-left py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary" />
                                                <span className="truncate max-w-[200px]">{file.file_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{file.file_type}</TableCell>
                                        <TableCell>{file.uploaded_by}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{format(new Date(file.uploaded_at), 'MMM d, yyyy')}</span>
                                                <span className="text-xs text-muted-foreground">{format(new Date(file.uploaded_at), 'h:mm a')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                                                file.is_active ? 'bg-[var(--completed-bg)] text-[var(--completed-font-color)] border-[var(--completed-border)]' : 'bg-[var(--pending-bg)] text-[var(--pending-font-color)] border-[var(--pending-border)]'
                                            }`}>
                                                {file.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="tertiary" size="sm" onClick={() => handleViewDetails(file)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No Resources have been uploaded yet!
                                        </TableCell>
                                    </TableRow>
                                )}
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
                                <h2 className="text-[20px] font-bold text-[#800000] m-0">Manage File Restrictions</h2>
                            </div>

                            {/* Content */}
                            <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
                                <p className="text-[#6b7280] mb-4 text-sm">
                                    Configure access permissions for different user roles in the file system.
                                </p>
                                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Access Level", "View", "Update", "Delete"].map((h) => (
                                                    <th key={h} className="bg-[#800000] text-white p-2.5 text-sm">{h}</th>
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

                {/* <div className="w-full mt-[120px]">
                    <NavFooter />
                </div> */}
            </div>

            {/* Upload Testing Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Upload Resource</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={submitUpload}>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={(e) =>
                                        uploadForm.setData('file', e.target.files ? e.target.files[0] : null)
                                    }
                                    className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-violet-50 file:text-violet-700
                                        hover:file:bg-violet-100
                                    "
                                />
                                {uploadForm.errors.file && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        {uploadForm.errors.file}
                                    </p>
                                )}
                                {uploadForm.progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                        <div
                                            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadForm.progress.percentage}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadForm.processing}
                                    className="rounded-lg px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {uploadForm.processing ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}