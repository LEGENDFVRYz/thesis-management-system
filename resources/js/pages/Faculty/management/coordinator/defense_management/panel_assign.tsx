import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { index as matrix } from '@/routes/faculty/coordinator/defense_management/matrix';
import { index as panel_assign } from '@/routes/faculty/coordinator/defense_management/panel_assign';
import { BreadcrumbItem, PageHeaderProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    Users,
    Plus,
    X,
    UserCheck,
    Save,
    Check
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DocumentPreview from '@/components/document-preview';
import DefenseManagementLayout from '.';

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const CONFLICT_REQUESTS = Array(6).fill({
    id: 1,
    adviser: 'Dr. Maria Santos',
    title: 'AI-Powered Student...',
    date: '11/29/2025',
    reason: 'Boracay',
    document: 'Letter of Request'
}).map((item, index) => ({ ...item, id: index }));

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

interface Panelist {
    id: number;
    name: string;
}

interface Section {
    section: string;
}

interface Thesis {
    endorsement_id: number;
    defense_matrix_id: number;
    thesis_id: number;
    title: string;
    authors: string;
    adviser: string;
    section: string;
    date: string;
    panels: Panelist[];
    panel_count: number;
    is_complete: boolean;
}

interface DashboardProps {
    sections: Section[];
    available_panel: Panelist[];
    endorsed_thesis: Thesis[];
}

// ----------------------------------------------------------------------
// CUSTOM TABS COMPONENT
// ----------------------------------------------------------------------

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
    ({ className, isActive = false, children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'h-12 px-[20px] flex flex-col justify-center items-center gap-2.5',
                'rounded-t-[10px] transition-colors',
                isActive
                    ? 'bg-[#9b000a] text-white'
                    : 'bg-[#800000] text-white/70 hover:bg-[#9b000a] hover:text-white',
                className
            )}
            {...props}
        >
            <div className="flex justify-center items-center gap-2.5">
                <span className="font-medium text-[16px] leading-normal whitespace-nowrap font-dm">
                    {children}
                </span>
            </div>
        </button>
    )
);
TabButton.displayName = 'TabButton';

// ----------------------------------------------------------------------
// MAIN DASHBOARD
// ----------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Assignment',
        href: panel_assign().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Panel Assignment",
    subtitle: "Assign and manage panel members",
    icon: (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-[#800000] text-white">
            <Users className="h-5 w-5" />
        </div>
    ),
};


export default function Dashboard({ sections, available_panel, endorsed_thesis }: DashboardProps) {
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'assignments' | 'conflicts'>('assignments');
    
    // --- STATE MANAGEMENT ---
    // Using local state to allow immediate UI updates (Optimistic UI)
    const [localTheses, setLocalTheses] = useState<Thesis[]>(endorsed_thesis); 
    const [openThesisId, setOpenThesisId] = useState<number | null>(null);
    const [thesisAssignments, setThesisAssignments] = useState<Record<number, Panelist[]>>({});
    const [processingId, setProcessingId] = useState<number | null>(null);
    
    // --- MODAL STATES ---
    const [isNotifySuccessOpen, setIsNotifySuccessOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    
    const [selectedDocument, setSelectedDocument] = useState<{title: string, type: string} | null>(null);

    // Sync props with local state if the server data changes
    useEffect(() => {
        setLocalTheses(endorsed_thesis);
    }, [endorsed_thesis]);

    // Initialize assignments map
    useEffect(() => {
        const initialMap: Record<number, Panelist[]> = {};
        endorsed_thesis.forEach(thesis => {
            initialMap[thesis.thesis_id] = thesis.panels || [];
        });
        setThesisAssignments(initialMap);
    }, [endorsed_thesis]);

    const handleToggleThesis = (id: number) => {
        setOpenThesisId(prevId => (prevId === id ? null : id));
    };

    const handleAssignPanelist = (thesisId: number, panelist: Panelist) => {
        setThesisAssignments((prev) => {
            const current = prev[thesisId] || [];
            if (current.find((p) => p.id === panelist.id)) return prev;
            if (current.length >= 3) return prev; 
            return { ...prev, [thesisId]: [...current, panelist] };
        });
    };

    const handleRemovePanelist = (thesisId: number, panelistId: number) => {
        setThesisAssignments((prev) => {
            const current = prev[thesisId] || [];
            return { ...prev, [thesisId]: current.filter((p) => p.id !== panelistId) };
        });
    };

    // --- SAVE LOGIC WITH POPUP AND BADGE UPDATE ---
    const handleSaveChanges = (thesis: Thesis) => {
        const currentAssignments = thesisAssignments[thesis.thesis_id] || [];
        
        // Strict check for exactly 3 panelists
        if (currentAssignments.length !== 3) {
            setNotificationMessage("Exactly 3 panelists are required.");
            setIsNotifySuccessOpen(true);
            return;
        }
    
        setProcessingId(thesis.thesis_id);
    
        const payload = {
            defense_matrix_id: thesis.defense_matrix_id,
            panel_ids: currentAssignments.map(p => p.id),
        };
    
        const onSuccess = () => {
            setLocalTheses(prevTheses => 
                prevTheses.map(t => 
                    t.thesis_id === thesis.thesis_id 
                        ? { ...t, is_complete: true, panels: currentAssignments } 
                        : t
                )
            );

            setProcessingId(null);
            setNotificationMessage("Panel assignments saved successfully.");
            setIsNotifySuccessOpen(true);
            setOpenThesisId(null);
        };
    
        const onError = (errors: any) => {
            setProcessingId(null);
            setNotificationMessage("Failed to save: " + Object.values(errors).join(', '));
            setIsNotifySuccessOpen(true);
        };
    
        const hasExistingPanels = thesis.panels && thesis.panels.length > 0;
    
        // UPDATED URLS BELOW:
        // Removed "/management" and changed "defense_management" to "defense-management"
        if (hasExistingPanels) {
            router.put(
                `/faculty/coordinator/defense-management/panel-assign/${thesis.defense_matrix_id}`,
                payload,
                { onSuccess, onError }
            );
        } else {
            router.post(
                '/faculty/coordinator/defense-management/panel-assign',
                payload,
                { onSuccess, onError }
            );
        }
    };

    const handleConflictAction = (action: 'approve' | 'reject', id: number) => {
        if (action === 'approve') {
            setNotificationMessage("The conflict request has been approved.");
        } else {
            setNotificationMessage("The conflict request has been rejected.");
        }
        setIsNotifySuccessOpen(true);
    };

    const handleViewDocument = (req: any) => {
        setSelectedDocument({
            title: req.title,
            type: req.document
        });
    };

    const visibleTheses = localTheses.filter((thesis) => thesis.section === selectedSection);

    return (
        <DefenseManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Panel Assignment" />

            <div className="flex flex-col min-h-screen bg-primary-foreground -mt-4 -mx-4 -mb-4 ">
                
                <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full">

                    {/* 1. Page Tabs */}
                    <div className="flex items-end gap-1 mb-0 border-b border-[#800000]/10 pb-0">
                        <TabButton isActive={true}>
                            Panel Assignment
                        </TabButton>
                        <TabButton
                            isActive={false}
                            onClick={() => router.get(matrix().url)}
                        >
                            Matrix Management
                        </TabButton>
                    </div>

                    {/* 2. Controls & Filters */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center pt-2">

                        {/* Sub-Tabs */}
                        <ToggleGroup
                            type="single"
                            value={activeTab}
                            onValueChange={(value) => { if (value) setActiveTab(value as 'assignments' | 'conflicts') }}
                            className="bg-[#F3E5CA] rounded-lg p-1 gap-1 inline-flex"
                        >
                            <ToggleGroupItem
                                value="assignments"
                                className="whitespace-nowrap w-auto data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] hover:bg-[#800000]/10 hover:text-[#800000] h-8 px-4 text-xs font-bold"
                            >
                                Panel Assignments
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="conflicts"
                                className="whitespace-nowrap w-auto data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] hover:bg-[#800000]/10 hover:text-[#800000] h-8 px-4 text-xs font-bold"
                            >
                                Conflict Approvals
                            </ToggleGroupItem>
                        </ToggleGroup>

                        {/* Section Selector */}
                        {activeTab === 'assignments' && (
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="primary">
                                            <span className={selectedSection ? "text-foreground" : ""}>
                                                {selectedSection || "Select Section"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[200px]">
                                        <DropdownMenuRadioGroup value={selectedSection} onValueChange={setSelectedSection}>
                                            {sections.map((sec, index) => (
                                                <DropdownMenuRadioItem key={index} value={sec.section}>
                                                    {sec.section}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* 3. Content Views */}
                    <div className="min-h-[600px]">
                        {activeTab === 'assignments' ? (
                            /* ================= PANEL ASSIGNMENTS VIEW ================= */
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                                {/* Faculty Roster */}
                                <div className="col-span-1 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm h-fit">
                                    <div className="flex items-center gap-3 border-b pb-4">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
                                            <Users className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Faculty Roster</h3>
                                            <p className="text-xs text-muted-foreground">{available_panel.length} available</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ maxHeight: '600px' }}>
                                        {available_panel.map((panelist) => (
                                            <div key={panelist.id} className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-sm">
                                                <div className="h-2 w-2 rounded-full bg-[#800000]" />
                                                <span className="text-sm font-medium text-foreground/80">{panelist.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Area */}
                                <div className="col-span-1 lg:col-span-3">
                                    {!selectedSection ? (
                                        <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20">
                                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                                            <div className="z-10 text-center">
                                                <BookOpen className="mx-auto mb-2 size-10 text-muted-foreground/50" />
                                                <h3 className="text-lg font-medium">Select a Section</h3>
                                                <p className="text-sm text-muted-foreground">Please select a section to view thesis titles.</p>
                                            </div>
                                        </div>
                                    ) : visibleTheses.length === 0 ? (
                                        <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20">
                                            <div className="z-10 text-center">
                                                <BookOpen className="mx-auto mb-2 size-10 text-muted-foreground/50" />
                                                <h3 className="text-lg font-medium">No Theses Found</h3>
                                                <p className="text-sm text-muted-foreground">No theses found for section {selectedSection}.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {visibleTheses.map((thesis) => {
                                                const isOpen = openThesisId === thesis.thesis_id;
                                                const currentAssignments = thesisAssignments[thesis.thesis_id] || [];
                                                const isReadyToSave = currentAssignments.length === 3;
                                                const isProcessing = processingId === thesis.thesis_id;

                                                return (
                                                    <div key={thesis.thesis_id} className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
                                                        <div onClick={() => handleToggleThesis(thesis.thesis_id)} className="cursor-pointer bg-white p-6 hover:bg-neutral-50/50">
                                                            <div className="flex items-start justify-between">
                                                                <div className="space-y-1">
                                                                    <h2 className="text-xl font-bold text-foreground">{thesis.title}</h2>
                                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                                                        <div className="flex items-center gap-1.5"><Users size={14} /><span>{thesis.authors}</span></div>
                                                                        <div className="flex items-center gap-1.5"><UserCheck size={14} /><span className="font-medium text-foreground">Adviser: {thesis.adviser}</span></div>
                                                                        <div className="flex items-center gap-1.5"><BookOpen size={14} /><span>{thesis.section}</span></div>
                                                                        <div className="flex items-center gap-1.5"><Calendar size={14} /><span>{thesis.date}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    {/* BADGE CHANGING LOGIC: Checks length dynamically */}
                                                                    {thesis.panels.length === 3 ? (
                                                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                            Assigned
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                    <button className="text-muted-foreground transition-transform duration-200">
                                                                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {isOpen && (
                                                            <div className="border-t bg-neutral-50/30 p-6">
                                                                <div className="flex flex-col gap-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className="text-sm font-semibold text-[#800000] uppercase tracking-wider">
                                                                            Assigned Panel Members
                                                                        </h3>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="outline" size="sm" disabled={currentAssignments.length >= 3} className="gap-2 text-[#800000] hover:text-[#800000] hover:bg-red-50">
                                                                                    <Plus size={16} /> Add Panelist
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                                                <DropdownMenuLabel>Available Faculty</DropdownMenuLabel>
                                                                                <DropdownMenuSeparator />
                                                                                {available_panel.map((panelist) => {
                                                                                    const isAssigned = currentAssignments.some(p => p.id === panelist.id);
                                                                                    return (
                                                                                        <DropdownMenuItem 
                                                                                            key={panelist.id}
                                                                                            disabled={isAssigned}
                                                                                            onClick={() => handleAssignPanelist(thesis.thesis_id, panelist)}
                                                                                            className="cursor-pointer"
                                                                                        >
                                                                                            <span className={isAssigned ? "text-muted-foreground line-through" : ""}>
                                                                                                {panelist.name}
                                                                                            </span>
                                                                                        </DropdownMenuItem>
                                                                                    );
                                                                                })}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>

                                                                    {currentAssignments.length === 0 ? (
                                                                        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center bg-white/50">
                                                                            <p className="text-sm text-muted-foreground">
                                                                                No panelists assigned yet. Click "Add Panelist" to begin.
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                                                            {currentAssignments.map((panelist) => (
                                                                                <div key={panelist.id} className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="flex size-8 items-center justify-center rounded-full bg-red-100 text-[#800000]">
                                                                                            <span className="text-xs font-bold">{panelist.name.charAt(0)}</span>
                                                                                        </div>
                                                                                        <span className="text-sm font-medium">{panelist.name}</span>
                                                                                    </div>
                                                                                    <button 
                                                                                        onClick={() => handleRemovePanelist(thesis.thesis_id, panelist.id)}
                                                                                        className="text-muted-foreground hover:text-red-600 transition-colors"
                                                                                    >
                                                                                        <X size={16} />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    <div className="flex justify-end pt-4 border-t mt-2">
                                                                        <Button 
                                                                            onClick={() => handleSaveChanges(thesis)}
                                                                            disabled={!isReadyToSave || isProcessing}
                                                                            className={cn("bg-[#800000] hover:bg-[#9b000a] text-white", !isReadyToSave && "opacity-50 cursor-not-allowed")}
                                                                        >
                                                                            {isProcessing ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Assignments</>}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* ================= CONFLICT APPROVALS VIEW ================= */
                            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#800000] text-white">
                                            <tr>
                                                <th className="px-6 py-4 font-medium text-center">Thesis Adviser</th>
                                                <th className="px-6 py-4 font-medium text-center">Thesis Title</th>
                                                <th className="px-6 py-4 font-medium text-center">Defense Date</th>
                                                <th className="px-6 py-4 font-medium text-center">Conflict Reason</th>
                                                <th className="px-6 py-4 font-medium text-center">Documents</th>
                                                <th className="px-6 py-4 font-medium text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {CONFLICT_REQUESTS.map((req) => (
                                                <tr key={req.id} className="hover:bg-neutral-50">
                                                    <td className="px-6 py-4 font-medium text-neutral-900 text-center">{req.adviser}</td>
                                                    <td className="max-w-[250px] truncate px-6 py-4 text-neutral-600" title={req.title}>
                                                        {req.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-600 text-center">{req.date}</td>
                                                    <td className="px-6 py-4 text-neutral-600 text-center">{req.reason}</td>
                                                    <td className="px-6 py-4 justify-items-center">
                                                        <button 
                                                            onClick={() => handleViewDocument(req)}
                                                            className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
                                                        >
                                                            <FileText size={14} />
                                                            {req.document}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 justify-items-center">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => handleConflictAction('approve', req.id)}
                                                                className="rounded-md bg-[#800000] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#991b1b]"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => handleConflictAction('reject', req.id)}
                                                                className="rounded-md bg-[#fef3c7] px-4 py-1.5 text-xs font-semibold text-[#800000] shadow-sm hover:bg-[#fde68a]"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= SUCCESS NOTIFICATION MODAL ================= */}
            <Dialog open={isNotifySuccessOpen} onOpenChange={setIsNotifySuccessOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-white">
                    <div className="w-16 h-16 bg-alert-success rounded-full flex items-center justify-center mb-6 shadow-lg bg-green-100 text-green-600">
                        <Check className="w-10 h-10" />
                    </div>
                    <p className="text-[16px] text-center text-foreground font-bold font-dm">
                        {notificationMessage}
                    </p>
                </DialogContent>
            </Dialog>

            {/* ================= DOCUMENT PREVIEW MODAL ================= */}
            <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
                <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none overflow-hidden outline-none">
                    <div className="relative w-full h-full">
                        <DocumentPreview 
                            documentTitle={`${selectedDocument?.type} - ${selectedDocument?.title}`}
                            documentUrl="#" 
                        />
                        {/* Invisible overlay for the close button position in DocumentPreview */}
                        <button 
                            onClick={() => setSelectedDocument(null)}
                            className="absolute top-6 right-6 w-6 h-6 opacity-0 cursor-pointer z-50"
                            aria-label="Close Preview"
                        />
                    </div>
                </DialogContent>
            </Dialog>

        </DefenseManagementLayout>
    );
}