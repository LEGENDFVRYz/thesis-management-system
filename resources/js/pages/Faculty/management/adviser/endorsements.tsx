import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/adviser/endorsement/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head, useForm} from '@inertiajs/react';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { Eye, CheckCircle, Layers, X, AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';
import DocumentPreview from '@/components/document-preview';
import PanelEndorsementIcon from '@/components/Icons/panel_endorsement.svg';
import FilterSearchSection from '@/components/filter-search-section';

// Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Endorsements',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Panel Endorsement" ,
    subtitle: "Endorse approved proposals/theses of your advisory class for formal review",
    icon: (
        <img src={PanelEndorsementIcon} alt="Panel Endorsement" className="w-8 h-8" />
    ),
};

// This matches the structure of the object returned by your Laravel Controller
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

interface Proposal {
    id: string;
    title: string;
    groupCode: string;
    proponents: string[];
    block: string;
    year_level: string;
    adviser: string;
    approvalDate: string;
    isEndorsed: boolean;
    manuscriptUrl?: string;
}



const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, subtitle }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string; subtitle?: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-lg py-6 px-8 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-150 font-dm">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-xl font-semibold">!</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-0.5">
                    {title || 'Are you sure you want to submit this endorsement?'}
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                    {subtitle || 'This action cannot be undone.'}
                </p>
                <div className="flex gap-3 w-full">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-2 px-4 rounded-full border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="flex-1 py-2 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const EndorsementCard = ({ data }: { data: Proposal }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showEndorseModal, setShowEndorseModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [remarks, setRemarks] = useState('');

    const { put, processing } = useForm({});

    const handleEndorseSubmit = () => {
        setShowConfirmModal(true);
    };

    const [successMsg, setSuccessMsg] = useState('');
    const handleConfirmEndorse = () => {
        put(`/faculty/adviser/endorsement/${data.id}`, {
            onSuccess: () => {
                setShowEndorseModal(false);
                setShowConfirmModal(false);
                setRemarks('');
                setSuccessMsg('Endorsement submitted successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            },
            onError: (err:any) => {
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
            <div className="bg-card dark:bg-card rounded-[var(--radius-lg)] shadow-sm border border-border p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h3 className="font-bold text-foreground text-sm leading-tight mb-1">
                            {data.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">
                            Group {data.groupCode}
                        </p>
                    </div>

                    {/* Status Badge using 'isEndorsed' variables */}
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            data.isEndorsed
                                ? 'bg-[var(--endorsed-bg)] text-[var(--endorsed-font-color)] border border-[var(--endorsed-border)]'
                                : 'bg-[var(--pending-bg)] text-[var(--pending-font-color)] border border-[var(--pending-border)]'
                        }`}
                    >
                        {data.isEndorsed ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                            <Layers className="w-3 h-3 mr-1" />
                        )}
                        {data.isEndorsed ? 'Endorsed' : 'Pending'}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Proponents</p>
                    <p className="text-sm font-medium text-foreground">
                        {data.proponents.join(', ')}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                        <p className="text-[10px] text-muted-foreground">Block</p>
                        <p className="text-xs font-semibold text-foreground">
                            BSCPE {data.year_level}-{data.block}
                        </p>
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
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-transparent border border-border rounded-[var(--radius-sm)] hover:bg-[var(--breadcrumb)] transition-colors"
                    >
                        <Eye size={14} />
                        View Manuscript
                    </button>
                    {!data.isEndorsed ? (
                        <button
                            onClick={() => setShowEndorseModal(true)}
                            disabled={processing}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-transparent border border-border rounded-[var(--radius-sm)] hover:bg-[var(--breadcrumb)] transition-colors disabled:opacity-50"
                        >
                            <CheckCircle size={14} />
                            {processing ? 'Processing...' : 'Endorse'}
                        </button>
                    ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[var(--evaluated-font-color)] bg-[var(--evaluated-bg)] border border-[var(--evaluated-border)] rounded-[var(--radius-sm)] cursor-not-allowed">
                            <CheckCircle size={14} />
                            Endorsed
                        </button>
                    )}
                </div>
            </div>

            {showPreview && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="bg-background rounded-[var(--radius-lg)] max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">{data.title}</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X />
                            </button>
                        </div>
                        <div className="p-4">
                            <DocumentPreview
                                documentTitle={data.title}
                                documentUrl={data.manuscriptUrl}
                                showDownloadButton={true}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showEndorseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-dm">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border/50">
                        {/* Primary Color Header */}
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
                            <button
                                onClick={() => setShowEndorseModal(false)}
                                className="p-1.5 rounded-md text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Thesis Title Card */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-5 border border-border/50">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Thesis Title</p>
                                <h3 className="text-sm font-semibold text-foreground leading-relaxed">
                                    {data.title}
                                </h3>
                            </div>
                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Students</p>
                                        <div className="text-xs font-medium text-foreground space-y-0.5">
                                            {data.proponents.map((name, idx) => (
                                                <p key={idx}>{name}</p>
                                            ))}
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

                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium text-foreground mb-1"
                                    htmlFor={`remarks-${data.id}`}
                                >
                                    Remarks / Justification
                                </label>
                                <textarea
                                    id={`remarks-${data.id}`}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Text field input..."
                                    className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-foreground focus:border-ring focus:ring-1 focus:ring-ring text-sm resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setShowEndorseModal(false)}
                                className="px-4 py-2 text-xs font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndorseSubmit}
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                            >
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

export default function Endorsement({ endorsements }: { endorsements: BackendEndorsement[] }) {
    const mappedProposals: Proposal[] = endorsements
        ? endorsements.map((item) => ({
              id: item.endorsement_id.toString(),
              title: item.thesis_title,
              groupCode: item.group_code,
              proponents: item.student_names ? item.student_names.split(', ') : [],
              block: item.block,
              year_level: item.year_level.toString(),
              adviser: item.adviser_name,
              approvalDate: new Date(item.endorsement_updated_at).toLocaleDateString(),
              isEndorsed: !!item.is_adviser_approved, // Convert 0 or 1 to boolean
              manuscriptUrl: item.manuscript_filepath
                  ? `/storage/${item.manuscript_filepath}`
                  : undefined,
          }))
        : [];

    return (
        <FacultyManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
            <Head title="Endorsements" />
            {/* Filter/Search Section */}
            <div className="mb-6">
                <div className="w-full xl:max-w-[1248px] mx-auto px-4 xl:px-0">
                    <FilterSearchSection variant="DefenseManagement" />
                </div>
            </div>
            
            <div className="font-dm w-full xl:max-w-[1248px] mx-auto px-4 xl:px-0">
                {mappedProposals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mappedProposals.map((proposal) => (
                            <EndorsementCard key={proposal.id} data={proposal} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No endorsements found for your section.</p>
                    </div>
                )}
            </div>
        </FacultyManagementLayout>
    );
}