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
    DialogFooter,
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
import { resources } from '@/routes/index';
import { toggle, remove, store } from '@/routes/admin/resources/index';
import { download } from '@/routes/resources/index';
import { PageHeaderProps, SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { BookMarked, Upload, FileText, Download, Check, AlertCircle, Trash2} from 'lucide-react';
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
    const { user_info } = usePage<SharedData>().props;
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

    const handleViewDetails = (resource: Resource) => {
        setSelectedFile(resource);
        setIsSheetOpen(true);
    };

    const totalCount = resources?.length ?? 0;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const uploadForm = useForm<{ file: File | null }>({
        file: null,
    });

    const { patch, delete: destroy, processing, reset, setData, post } = uploadForm;

    const handleConfirmDelete = () => {
        if (!selectedFile) return;

        destroy(remove(selectedFile.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                // Close both the delete confirmation and the detail sheet
                setIsDeleteModalOpen(false);
                setIsSheetOpen(false);
                setSelectedFile(null);
            },
            onError: () => {
                // Optional: Handle error (keep modal open)
                setIsDeleteModalOpen(false);
            }
        });
    };

    // Toggle the view mode status
    const toggleStatus = (resource: Resource) => {
        if (processing) return; // Prevent double clicks

        patch(toggle(resource.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                // Update the local selectedFile state so the Sheet UI reflects the change immediately
                setSelectedFile(current => 
                    current && current.id === resource.id 
                        ? { ...current, is_active: !current.is_active } 
                        : current
                );
            },
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

                    {/* UPLOAD BUTTON */}
                    {user_info?.is_admin && (
                        <div className="flex justify-end">
                            <Button 
                                variant="primary" className="gap-2" 
                                onClick={() => setIsUploadModalOpen(true)}
                                disabled={processing}
                            >
                                <Upload className="w-4 h-4" /> Upload Document
                            </Button>
                        </div>
                    )}

                    <div className="rounded-lg border overflow-hidden bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-primary text-center">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-primary-foreground text-center">File Name</TableHead>
                                    <TableHead className="text-primary-foreground text-center">File Type</TableHead>
                                    <TableHead className="text-primary-foreground text-center">Uploaded By</TableHead>
                                    <TableHead className="text-primary-foreground text-center">Date Uploaded</TableHead>
                                    {user_info?.is_admin && (
                                        <TableHead className="text-primary-foreground text-center">Status</TableHead>
                                    )}
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
                                        {user_info?.is_admin && (
                                            <TableCell>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(file)}
                                                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer
                                                        ${
                                                            file.is_active
                                                                ? 'bg-[var(--completed-bg)] text-[var(--completed-font-color)] border-[var(--completed-border)]'
                                                                : 'bg-[var(--pending-bg)] text-[var(--pending-font-color)] border-[var(--pending-border)]'
                                                        }`}
                                                    aria-pressed={file.is_active}
                                                >
                                                    {file.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {user_info?.is_admin ? (
                                                <Button variant="tertiary" size="sm" onClick={() => handleViewDetails(file)} className='mr-3'>View Details</Button>
                                            ) : (
                                                <Button variant="tertiary" size="sm" onClick={() => handleDownload(file.file_path)}> Download </Button>
                                            )}
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
                    {/* Only render content if selectedFile is present to prevent null errors */}
                    {selectedFile ? (
                        <>
                            <SheetHeader className="p-6 text-left border-b bg-gray-50/50">
                                <SheetTitle className="font-dm flex items-center gap-2 text-xl break-all">
                                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                    {selectedFile.file_name}
                                </SheetTitle>
                                <SheetDescription>
                                    Uploaded by {selectedFile.uploaded_by} on {format(new Date(selectedFile.uploaded_at), 'MMM d, yyyy')}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-primary mb-3">File Preview</h4>
                                    <div className="h-64 w-full rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center bg-muted/5 gap-2">
                                        <FileText className="w-12 h-12 text-muted-foreground/30" />
                                        <p className="text-sm text-muted-foreground">Preview not available</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-semibold text-primary">File Information</h4>
                                        <div onClick={() => setIsRestrictionsModalOpen(true)} className="cursor-pointer">
                                            <TextLink href="#" variant="restriction" onClick={(e) => e.preventDefault()}>
                                                Manage restrictions
                                            </TextLink>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">File Type</p>
                                            <p className="text-sm font-medium">{selectedFile.file_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Size</p>
                                            <p className="text-sm font-medium">{selectedFile.file_size} MB</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Status</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                selectedFile.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {selectedFile.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">File ID</p>
                                            <p className="text-sm font-mono text-gray-500">#{selectedFile.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-3">
                                <Button className="w-full" variant="secondary" onClick={() => handleDownload(selectedFile.file_path)}>
                                    <Download className="w-4 h-4 mr-2" /> Download File
                                </Button>
                                <Button 
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                                    variant="ghost" 
                                    onClick={() => setIsDeleteModalOpen(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> {processing ? 'Deleting...' : 'Delete Resource'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
                            <p>No file selected</p>
                        </div>
                    )}
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
                

                {/* Upload Modals */}
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="font-dm text-primary">
                                Upload Document
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={submitUpload} className="space-y-6">
                            <FileUpload
                                maxSizeMB={10}
                                multiple={false}
                                isUploading={uploadForm.processing}
                                uploadProgress={uploadForm.progress?.percentage ?? 0}
                                onFileSelect={(files: File[]) => {
                                    uploadForm.setData('file', files[0] ?? null)
                                }}
                                onError={(err) => {
                                    uploadForm.setError('file', err)
                                }}
                            />

                            {/* Error */}
                            {uploadForm.errors.file && (
                                <p className="text-sm text-red-500">
                                {uploadForm.errors.file}
                                </p>
                            )}

                            {/* Confirmation */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={uploadForm.processing}
                                    className="px-4 py-2 text-sm bg-primary text-white rounded disabled:opacity-50"
                                >
                                    {uploadForm.processing ? 'Uploading…' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-primary">
                                    <AlertCircle className="w-6 h-6 text-primary-foreground-2" />
                                </div>
                                <DialogTitle className="text-xl text-red-900">Delete Resource?</DialogTitle>
                            </div>
                        </DialogHeader>

                        <div className="pt-2">
                            Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedFile?.file_name}"</span>? 
                            <br />
                            This action cannot be undone.
                        </div>

                        <DialogFooter className="gap-2 mt-4 sm:justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={processing}
                                className="bg-primary hover:bg-red-700 text-white"
                            >
                                {processing ? 'Deleting...' : 'Delete Resource'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

        </AppLayout>
    );
}