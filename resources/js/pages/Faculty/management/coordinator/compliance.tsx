import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FacultyManagementLayout from '@/pages/Faculty/management/index'; 
import { Eye, CheckCircle, X, AlertCircle, Send, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import DocumentPreview from '@/components/document-preview';
import { Icon } from '@/components/icon-index';
import FilterSearchSection from '@/components/filter-search-section';
import StageSwitchToggle from "@/components/stage-toggle"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ----------------------------------------------------------------------
// 1. TYPES & INTERFACES
// ----------------------------------------------------------------------

interface BackendEndorsement {
    endorsement_id: number;
    thesis_title: string;
    manuscript_filepath: string | null;
    course: string;
    group_code: string;
    year_level: number;
    is_adviser_approved: number; 
    endorsement_updated_at: string;
    block: string;
    adviser_name: string;
    student_names: string; 
}

interface PanelMember {
    id: string;
    name: string;
    role: 'P1' | 'P2' | 'P3';
}

interface Proposal {
    id: string;
    title: string;
    groupCode: string;
    proponents: string[];
    block: string;
    year_level: string;
    adviser: string;
    approvalDate: string;
    panelMembers: PanelMember[];
    status: 'Endorsed' | 'Pending';
    manuscriptUrl?: string;
}

// ----------------------------------------------------------------------
// 2. MOCK DATA
// ----------------------------------------------------------------------

const MOCK_ENDORSEMENTS: BackendEndorsement[] = [
    {
        endorsement_id: 1,
        thesis_title: "AI-Based Facial Emotion Recognition for Library Feedback",
        manuscript_filepath: "manuscripts/sample-1.pdf",
        course: "BSCPE",
        group_code: "G1-2024",
        year_level: 4,
        is_adviser_approved: 0,
        endorsement_updated_at: "2026-01-15T10:00:00Z",
        block: "1",
        adviser_name: "Engr. John Doe",
        student_names: "Alice Johnson, Bob Smith, Charlie Brown"
    },
    {
        endorsement_id: 2,
        thesis_title: "Smart Campus Navigation System using Augmented Reality",
        manuscript_filepath: null,
        course: "BSCPE",
        group_code: "G5-2024",
        year_level: 4,
        is_adviser_approved: 1,
        endorsement_updated_at: "2026-01-18T08:30:00Z",
        block: "2",
        adviser_name: "Dr. Maria Garcia",
        student_names: "Diana Prince, Steve Rogers"
    }
];

// ----------------------------------------------------------------------
// 3. SUB-COMPONENTS
// ----------------------------------------------------------------------

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, subtitle }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string; subtitle?: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-lg py-6 px-8 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-150 font-dm">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-xl font-semibold">!</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-0.5">{title || 'Confirm Action'}</p>
                <p className="text-xs text-muted-foreground mb-5">{subtitle || 'This action cannot be undone.'}</p>
                <div className="flex gap-3 w-full">
                    <button onClick={onClose} className="flex-1 py-2 px-4 rounded-full border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-2 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const EndorsementCard = ({ data }: { data: Proposal }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showEndorseModal, setShowEndorseModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { put, processing } = useForm({});

    const handleConfirmEndorse = () => {
        put(`/faculty/management/coordinator/endorsement/${data.id}`, {
            onSuccess: () => {
                setShowEndorseModal(false);
                setShowConfirmModal(false);
                setSuccessMsg('Endorsement submitted successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            },
            onError: (err) => {
                setShowConfirmModal(false);
                console.error(err);
            }
        });
    };

    return (
        <>
            {successMsg && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-in fade-in duration-200">
                    {successMsg}
                </div>
            )}

            <div className="bg-card dark:bg-card rounded-[var(--radius-lg)] shadow-sm border border-border p-5 flex flex-col h-full hover:shadow-md transition-shadow font-dm">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h3 className="font-bold text-foreground text-sm leading-tight mb-1">{data.title}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Group {data.groupCode}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        data.status === 'Endorsed' 
                            ? 'bg-[var(--endorsed-bg)] text-[var(--endorsed-font-color)] border-[var(--endorsed-border)]' 
                            : 'bg-[var(--breadcrumb)] text-muted-foreground border-border'
                    }`}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {data.status}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Proponents</p>
                    <p className="text-sm font-medium text-foreground">{data.proponents.join(', ')}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                        <p className="text-[10px] text-muted-foreground">Block</p>
                        <p className="text-xs font-semibold text-foreground">BSCPE {data.year_level}-{data.block}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground">Adviser</p>
                        <p className="text-xs font-semibold text-foreground">{data.adviser}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground">Approval Date</p>
                        <p className="text-xs font-semibold text-foreground">{data.approvalDate}</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                    <button onClick={() => setShowPreview(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-transparent border border-border rounded-[var(--radius-sm)] hover:bg-[var(--breadcrumb)] transition-colors">
                        <Eye size={14} /> View Manuscript
                    </button>
                    {data.status !== 'Endorsed' ? (
                        <button onClick={() => setShowEndorseModal(true)} disabled={processing} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-transparent border border-border rounded-[var(--radius-sm)] hover:bg-[var(--breadcrumb)] transition-colors disabled:opacity-50">
                            <CheckCircle size={14} /> Endorse
                        </button>
                    ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[var(--evaluated-font-color)] bg-[var(--evaluated-bg)] border border-[var(--evaluated-border)] rounded-[var(--radius-sm)] cursor-not-allowed">
                            <CheckCircle size={14} /> Endorsed
                        </button>
                    )}
                </div>
            </div>

            {/* View Manuscript Modal */}
            {showPreview && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-[var(--radius-lg)] max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">{data.title}</h2>
                            <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <div className="p-4">
                            <DocumentPreview documentTitle={data.title} documentUrl={data.manuscriptUrl} showDownloadButton={true} />
                        </div>
                    </div>
                </div>
            )}

            {/* Endorse Modal - MATCHES PANEL ENDORSEMENT DESIGN */}
            {showEndorseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-dm">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border/50">
                        {/* Header */}
                        <div className="bg-primary text-primary-foreground px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                                    <Icon name="endorsementButtonModal" size={22} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold tracking-wide">Endorse Proposal</h2>
                                    <p className="text-xs text-primary-foreground/70">Submit for Defense Review</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEndorseModal(false)} className="p-1.5 rounded-md text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Thesis Title Card */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-5 border border-border/50">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Thesis Title</p>
                                <h3 className="text-sm font-semibold text-foreground leading-relaxed">{data.title}</h3>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Students</p>
                                        <div className="text-xs font-medium text-foreground space-y-0.5">
                                            {data.proponents.map((name, idx) => <p key={idx}>{name}</p>)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Block</p>
                                        <p className="text-xs font-medium text-foreground">BSCPE {data.year_level}-{data.block}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Adviser</p>
                                        <p className="text-xs font-medium text-foreground">{data.adviser}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Approval Date</p>
                                        <p className="text-xs font-medium text-foreground">{data.approvalDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Confirmation Box */}
                            <div className="bg-[var(--revision-bg)] border border-[var(--revision-border)] rounded-lg p-4 flex gap-3">
                                <div className="p-1.5 bg-[var(--revision-border)]/30 rounded-full h-fit">
                                    <AlertCircle className="w-4 h-4 text-[var(--revision-font-color)]" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[var(--revision-font-color)] mb-2">Endorsement Confirmation</h4>
                                    <p className="text-[11px] text-[var(--revision-font-color)]/80 mb-2">By endorsing, you confirm that:</p>
                                    <ul className="space-y-1.5">
                                        {['All panel members have been assigned', 'The proposal meets defense requirements', 'The panel is ready for scheduling'].map((item, idx) => (
                                            <li key={idx} className="text-[11px] text-[var(--revision-font-color)] flex items-center gap-2 font-medium">
                                                <CheckCircle className="w-3 h-3 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end gap-3">
                            <button onClick={() => setShowEndorseModal(false)} className="px-4 py-2 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all">Cancel</button>
                            <button onClick={() => setShowConfirmModal(true)} disabled={processing} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50">
                                {processing ? 'Submitting...' : 'Submit Endorsement'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmEndorse}
                title="Are you sure you want to submit this endorsement?"
                subtitle="This action cannot be undone."
            />
        </>
    );
};

// ----------------------------------------------------------------------
// 4. MAIN DASHBOARD COMPONENT (Updated to match Code A width)
// ----------------------------------------------------------------------

export default function EndorsementManagement({ endorsements = MOCK_ENDORSEMENTS }: { endorsements?: BackendEndorsement[] }) {
    const [activeTab, setActiveTab] = useState<'mor' | 'dp1' | 'dp2'>('mor');

    const mappedProposals: Proposal[] = (endorsements && endorsements.length > 0) 
        ? endorsements.map(item => ({
            id: item.endorsement_id.toString(),
            title: item.thesis_title,
            groupCode: item.group_code,
            proponents: item.student_names ? item.student_names.split(', ') : [],
            block: item.block,
            year_level: item.year_level.toString(),
            adviser: item.adviser_name,
            approvalDate: new Date(item.endorsement_updated_at).toLocaleDateString(),
            status: item.is_adviser_approved ? 'Endorsed' : 'Pending',
            manuscriptUrl: item.manuscript_filepath ? `/storage/${item.manuscript_filepath}` : undefined,
            panelMembers: [] 
        })) 
        : [];

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Endorsements', href: '#' }];

    const pageHeader: PageHeaderProps = {
        title: "Endorsement Management",
        subtitle: "Issue a digital signature for the Coordinator Endorsement Sheet",
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    };

    return (
        <FacultyManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
            <Head title="Endorsement Management" />
            
            {/* The outer container remains the same */}
            <div className="flex flex-col min-h-full -mt-4 -mx-4 -mb-4 bg-primary-foreground font-dm">
                <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full">
                    
                    {/* REMOVED: xl:max-w-[1248px] and mx-auto 
                        This now matches Code A's behavior of spanning the full width
                    */}
                    <div className="w-full">
                        {/* Tabs */}
                        <div className="flex justify-end mt-4">
                            <StageSwitchToggle value={activeTab} onChange={setActiveTab} />
                        </div>

                        {/* Metric Cards */}
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            <Card variant="metric" className="border-none shadow-sm rounded-xl overflow-hidden w-full max-w-[400px]">
                                <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                    <CheckCircle2 className="size-5" />
                                    <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">COMPLIANT GROUPS</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center p-6 bg-white dark:bg-card">
                                    <span className="text-4xl font-bold text-green-600">{mappedProposals.filter(p => p.status === 'Endorsed').length}</span>
                                    <span className="text-sm font-medium text-green-600">Ready for Defense</span>
                                </CardContent>
                            </Card>

                            <Card variant="metric" className="border-none shadow-sm rounded-xl overflow-hidden w-full max-w-[400px]">
                                <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                    <Clock className="size-5" />
                                    <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">PENDING REVIEW</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center p-6 bg-white dark:bg-card">
                                    <span className="text-4xl font-bold text-amber-500">{mappedProposals.filter(p => p.status === 'Pending').length}</span>
                                    <span className="text-sm font-medium text-amber-500">Awaiting Assessment</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filter Bar */}
                        <div className="mt-6">
                             <FilterSearchSection variant="DefenseManagement" />
                        </div>
                    </div>

                    {/* REMOVED: xl:max-w-[1248px] and mx-auto
                        Using mx-auto w-full to match Code A's grid container
                    */}
                    <div className="mx-auto w-full pb-10">
                        {mappedProposals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {mappedProposals.map((proposal) => (
                                    <EndorsementCard key={proposal.id} data={proposal} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground bg-white dark:bg-card rounded-xl border border-dashed">
                                <p>No records found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FacultyManagementLayout>
    );
}