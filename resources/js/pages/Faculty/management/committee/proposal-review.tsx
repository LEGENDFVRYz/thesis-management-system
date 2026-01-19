import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { AppContent } from '@/components/app-content';
import { FileText, Search, Edit3, ArrowRight, CheckCircle2, MessageSquare, XCircle, Eye, Trash } from 'lucide-react';
import { index, store } from '@/routes/faculty/committee/proposal_review/index';
import { NavFooter } from '@/components/nav-footer';
import { Icon } from '@/components/icon-index';
import { CommitteeCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import { MethodologyHeader } from '@/components/ui/headers';
import { MethodologyRow } from '@/components/ui/rows';
import { Badge } from '@/components/badges-index';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FilePreview from '@/components/document-preview';
import FacultyManagementLayout from '..';

// SET UP
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Proposal Review', href: index().url },
];

const pageHeader: PageHeaderProps = {
  title: "Proposal Review",
  subtitle: "Review and evaluate thesis proposals submitted for committee approval",
  icon: (
    <Icon name="calendarDefault" className="w-8 h-8 text-primary" />
  ),
};

export interface Proposal {
  proposal_id: number;
  proposal_title: string;
  proposal_filepath: string;
  submitted_date: string;
  advisor_name: string;
  block: string;
  my_status: string | null;
  my_comment: string | null;
  proponents: string;
}

interface ProposalReviewProps {
  proposals: {
    pending: Proposal[];
    evaluated: Proposal[];
  };
}

const EndorsedProposalsSection = ({
  pending,
  evaluated,
  selectedItem,
  setSelectedItem,
  renderProposalSection
}: any) => (
  <div className="flex-1 space-y-8 font-dm">
    {renderProposalSection("Pending Evaluations", "bg-primary", pending.length, pending)}
    {renderProposalSection("Under Evaluation", "bg-primary-foreground-2", evaluated.length, evaluated)}
    {renderProposalSection("Evaluated", "bg-completed-border", 0, [])}
  </div>
);

const ChangeRequestsSection = ({ changeRequests, selectedItem, setSelectedItem }: any) => {
  const getTypeBadgeName = (type: string) => {
    switch (type) {
      case 'Methodology': return 'changesBadgesMethodologyChange';
      case 'Scope': return 'changesBadgesScopeChange';
      case 'Title': return 'changesBadgesTitleChange';
      default: return 'changesBadgesMethodologyChange';
    }
  };

  const getStatusBadgeName = (status: string) => {
    switch (status) {
      case 'Approved': return 'statusBadgeApproved';
      case 'Denied': return 'statusBadgeDenied';
      case 'Pending Review': return 'statusBadgePendingReview';
      default: return 'statusBadgePendingReview';
    }
  };

  return (
    <div className="flex flex-col space-y-4 text-left flex-1 font-dm">
      <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm h-[620px] flex flex-col">

        <div className="bg-primary pr-[10px]">
          <MethodologyHeader
            variant='dynamic'
            columns={[
              { label: 'Title', className: 'w-[45%] text-center' },
              { label: 'Type of Changes', className: 'w-[20%] text-center' },
              { label: 'Submitted', className: 'w-[20%] text-center' },
              { label: 'Status', className: 'w-[15%] text-center' }
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-muted/5">
          {changeRequests.map((req: any) => (
            <div
              key={req.id}
              onClick={() => setSelectedItem(req)}
              className={cn(
                "cursor-pointer transition-colors border-b border-border/50",
                selectedItem?.id === req.id ? "bg-primary/5" : "hover:bg-muted/30"
              )}
            >
              <MethodologyRow
                variant="dynamic"
                data={[
                  {
                    value: <span className="text-foreground text-[13px] font-semibold leading-tight">{req.title}</span>,
                    className: 'w-[45%] pl-5'
                  },
                  {
                    value: (
                      <div className="flex justify-center items-center m-0 p-0 h-fit">
                        <Badge name={getTypeBadgeName(req.type)} size={74} className='m-0 p-0 h-fit leading-none' />
                      </div>
                    ),
                    className: 'w-[20%] text-center'
                  },
                  {
                    value: <span className="text-foreground text-[13px] font-medium">{req.date}</span>,
                    className: 'w-[20%] text-center'
                  },
                  {
                    value: (
                      <div className="flex justify-center items-center m-0 p-0 h-fit">
                        <Badge name={getStatusBadgeName(req.status)} size={70} className='m-0 p-0 h-fit leading-none' />
                      </div>
                    ),
                    className: 'w-[15%] text-center'
                  }
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RightActionPane = ({
  selectedItem,
  activeTab,
  evaluations,
  onToggleEval,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  actionState,
  onViewProposal
}: any) => {
  const [commentText, setCommentText] = useState("");
  const [clarificationText, setClarificationText] = useState("");
  const [isClarifying, setIsClarifying] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  React.useEffect(() => {
    setCommentText("");
    setClarificationText("");
    setIsClarifying(false);
    setEditingCommentId(null);
  }, [selectedItem?.id]);

  const handleUploadComment = (status: 'approved' | 'rejected' | 'clarifying', text: string) => {
    if (!text.trim()) return;
    onAddComment(selectedItem.id, text, status);
    setCommentText("");
    setClarificationText("");
    setIsClarifying(false);
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editValue.trim()) return;
    onUpdateComment(selectedItem.id, commentId, editValue);
    setEditingCommentId(null);
    setEditValue("");
  };

  if (!selectedItem) {
    return (
      <div className={cn(
        "bg-background border border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 text-alert-desc shadow-sm font-dm",
        activeTab === 'endorsed' ? "h-[1460px]" : "h-[620px]"
      )}>
        <Icon name={activeTab === 'endorsed' ? "docuDefault" : "editDefault"} size={48} className="opacity-20 mb-4" />
        <p className="text-sm font-bold text-alert-desc uppercase tracking-tight mt-5">
          {activeTab === 'endorsed' ? 'Select a proposal to review' : 'Click a request to view details'}
        </p>
      </div>
    );
  }

  if (activeTab === 'endorsed') {
    const currentEvals = evaluations[selectedItem.id] || [];

    return (
      <div className="flex flex-col gap-4 h-[1460px] font-dm">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-md font-bold text-primary mb-4 border-b border-border pb-2">Proposal Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-alert-desc">Title:</p>
              <p className="text-sm font-bold text-foreground leading-tight">{selectedItem.proposal_title}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><p className="text-[10px] uppercase font-bold text-alert-desc">Adviser:</p><p className="text-[11px] text-foreground font-medium truncate">{selectedItem.advisor_name}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-alert-desc">Block:</p><p className="text-[11px] text-foreground font-medium">{selectedItem.block}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-alert-desc">Submitted:</p><p className="text-[11px] text-foreground font-medium">{selectedItem.submitted_date}</p></div>
            </div>
            <Button variant="outline" className="tertiary-btn w-full mt-2 h-9 text-xs font-bold gap-2" onClick={onViewProposal}>
              <Eye className="w-4 h-4" /> View Proposal
            </Button>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-md font-bold text-primary mb-4">Evaluation Progress</h3>
          <Skeleton variant="eval" progress={currentEvals.length} />
          <p className="text-xs text-muted-foreground uppercase mb-2 mt-3">Pending evaluation:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {['Dr. Maria Santos', 'Dr. Juan Cruz', 'Dr. Lisa Fernandez', 'Dr. Robert Chen', 'Dr. Anna Reyes', 'Dr. Carlos Gomez'].map(name => (
              <div key={name} className="flex items-center gap-2">
                <Checkbox
                  id={name} className='h-4 w-4'
                  checked={currentEvals.includes(name)}
                  onCheckedChange={() => onToggleEval(selectedItem.id, name)}
                />
                <Label htmlFor={name} className="font-normal cursor-pointer text-foreground text-[11px]">{name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col">
          <h3 className="text-md font-bold text-primary mb-4 border-b border-border pb-2">Comments & Feedback</h3>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 min-h-[400px]">
            {comments.length > 0 ? comments.map((comment: any) => (
              <div key={comment.id} className={cn("p-4 rounded-xl border text-xs transition-colors",
                comment.status === 'approved' && "border-alert-success bg-alert-success/5",
                comment.status === 'clarifying' && "border-primary-foreground-2 bg-primary-foreground-2/5",
                comment.status === 'rejected' && "border-alert-warning bg-alert-warning/5")}>
                {editingCommentId === comment.id ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-foreground text-[13px]">{comment.author}</p>
                      <div className="flex items-center gap-1 opacity-40">
                        <span className="text-[10px] font-medium">Edit</span>
                        <Edit3 className="w-3 h-3" />
                      </div>
                    </div>

                    <Input
                      className="h-[100px] w-full bg-white pt-2 pb-16 align-top text-xs border-border leading-tight"
                      value={editValue}
                      inputSize="full"
                      onChange={(e) => setEditValue(e.target.value)}
                    />

                    <div className="flex gap-2">
                      <Button
                        disabled={!editValue.trim()}
                        onClick={() => handleSaveEdit(comment.id)}
                        className="bg-[#600000] text-white h-8 px-4 text-xs hover:bg-[#4a0000]"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingCommentId(null)}
                        variant="outline"
                        className="bg-[#fcf8e3] text-[#600000] border-none h-8 px-4 text-xs flex items-center gap-2 hover:bg-[#f9f2d0] transition-colors"
                      >
                        Cancel <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={cn("font-bold text-[13px]",
                          comment.status === 'approved' && "text-alert-success",
                          comment.status === 'clarifying' && "text-alert-yellow-selected",
                          comment.status === 'rejected' && "text-alert-warning")}>{comment.author}</p>
                        <p className="text-[10px] text-alert-desc">{comment.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Edit3
                          className="w-4 h-4 cursor-pointer text-foreground/40 hover:text-foreground transition-colors"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditValue(comment.text);
                          }}
                        />
                        <Trash
                          className="w-4 h-4 cursor-pointer text-primary/40 hover:text-primary transition-colors"
                          onClick={() => onDeleteComment(selectedItem.id, comment.id)}
                        />
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed text-[13px]">{comment.text}</p>
                  </>
                )}
              </div>
            )) : <div className="h-full flex items-center justify-center text-alert-desc text-xs">No comments yet</div>}
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-3">
            {actionState === 'idle' ? (
              <>
                <p className="text-[11px] font-medium text-alert-desc">Provide your feedback and submit your decision</p>
                <Input className="h-[120px] pt-2 align-top text-xs" inputSize="full" placeholder="Text field input..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => handleUploadComment('approved', commentText)} variant={'tertiary'} className="bg-alert-success/10 text-alert-success border-alert-success/50 h-10 text-xs"><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</Button>
                  <Button onClick={() => handleUploadComment('rejected', commentText)} variant={'tertiary'} className="bg-alert-warning/10 text-alert-warning border-alert-warning/50 h-10 text-xs"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                </div>
                <Button onClick={() => handleUploadComment('clarifying', commentText)} variant="outline" className="w-full h-10 font-bold text-xs"><Edit3 className="w-4 h-4 mr-2" /> Request Revision</Button>
              </>
            ) : (
              <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col items-center text-center space-y-3">
                <div className="flex items-center gap-3 text-left w-full">
                  <CheckCircle2 className="w-6 h-6 text-alert-info" />
                  <div><p className="text-sm font-bold text-foreground">Your Evaluation Submitted</p><p className="text-[11px] text-alert-desc leading-none">Waiting for other members</p></div>
                </div>
                <div className="pt-3 border-t border-border w-full flex justify-center">
                  <div className={cn("text-[10px] font-bold px-4 py-1 rounded-full border",
                    actionState === 'approved' && "bg-evaluated-bg text-evaluated-font-color border-evaluated-border",
                    actionState === 'rejected' && "bg-alert-warning/10 text-alert-warning border-alert-warning/30",
                    actionState === 'clarifying' && "bg-primary-foreground-2/10 text-alert-yellow-selected border-primary-foreground-2/30")}>
                    {actionState === 'approved' ? 'Approved' : actionState === 'rejected' ? 'Rejected' : 'For Revision'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 border border-border rounded-xl p-5 shadow-sm h-[620px] overflow-hidden custom-scrollbar flex flex-col gap-4 font-dm">
      <div>
        <h3 className="text-md font-bold text-primary">Request Details</h3>
        <p className="text-[13px] text-foreground font-medium mt-1 leading-tight">{selectedItem.title}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 bg-background border border-border rounded-xl p-4 shadow-sm text-xs text-foreground">
        <div><p className="uppercase font-bold text-alert-desc">Adviser</p><p className="font-bold">{selectedItem.adviser || 'Dr. Maria Santos'}</p></div>
        <div><p className="uppercase font-bold text-alert-desc">Section</p><p className="font-bold">{selectedItem.block || 'BSCPE 4-2'}</p></div>
      </div>
      <div className='rounded-sm pr-0.5 gap-4 flex-1 space-y-4 overflow-y-auto custom-scrollbar'>
        <div className="space-y-3">
          <div className="bg-muted border border-border rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="w-3.5 h-3.5 text-alert-desc" />
              <span className="font-bold text-alert-desc uppercase text-[10px]">Current Version (DP1)</span>
            </div>
            <p className="leading-relaxed">
              {selectedItem.current_version || "No current version data available."}
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-primary uppercase text-[10px]">Proposed Change (DP2)</span>
            </div>
            <p className="leading-relaxed">
              {selectedItem.proposed_change || "No proposed change data available."}
            </p>
          </div>
        </div>

        <div className="bg-under-eval-bg border border-under-eval-border rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-3.5 h-3.5 text-under-eval-font-color" />
            <span className="font-bold text-under-eval-font-color uppercase text-[10px]">Justification</span>
          </div>
          <p className="leading-relaxed text-[12px] text-foreground">
            {selectedItem.justification || "No justification provided."}
          </p>
        </div>

        <div className="bg-evaluated-bg border border-evaluated-border rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-3.5 h-3.5 text-evaluated-font-color" />
            <span className="font-bold text-evaluated-font-color uppercase text-[10px]">Adviser Recommendation</span>
          </div>
          <p className="leading-relaxed text-[12px] text-foreground">
            {selectedItem.recommendation || "No recommendation provided."}
          </p>
        </div>

        {comments.filter((c: any) => c.status === 'clarifying').map((comment: any) => (
          <div key={comment.id} className="bg-primary-foreground-2/10 border border-primary-foreground-2/30 rounded-xl p-3 text-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-alert-yellow-selected" />
                <span className="font-bold text-alert-yellow-selected uppercase text-[10px]">Clarification</span>
              </div>
              <Trash className="w-3.5 h-3.5 cursor-pointer text-primary/40" onClick={() => onDeleteComment(selectedItem.id, comment.id)} />
            </div>
            <p className="leading-relaxed text-foreground">{comment.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-0 space-y-3">
        {actionState === 'idle' && !isClarifying && (
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => handleUploadComment('approved', "Request approved.")} variant={'tertiary'} className="bg-alert-success/10 text-alert-success border-alert-success/50 hover:bg-alert-success hover:text-white text-[11px] font-bold h-10 shadow-none"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve</Button>
            <Button onClick={() => setIsClarifying(true)} variant="outline" className="bg-background text-alert-desc text-[11px] font-bold h-10 border-border"><MessageSquare className="w-3.5 h-3.5 mr-1" /> Clarify</Button>
            <Button onClick={() => handleUploadComment('rejected', "Request rejected.")} variant={'tertiary'} className="bg-alert-warning/10 text-alert-warning border-alert-warning/50 hover:bg-alert-warning hover:text-white text-[11px] font-bold h-10 shadow-none"><XCircle className="w-3.5 h-3.5 mr-1" /> Reject</Button>
          </div>
        )}
        {isClarifying && actionState === 'idle' && (
          <div className="bg-muted-foreground/5 border border-primary-foreground-2/20 rounded-xl p-4 space-y-3 w-full">
            <p className="text-[11px] font-bold text-primary-foreground-2 uppercase">Clarify...</p>
            <Input className="h-[100px] w-full bg-white pt-2 align-top text-xs" inputSize="full" placeholder="Provide details..." value={clarificationText} onChange={(e) => setClarificationText(e.target.value)} />
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setIsClarifying(false)} className="text-[11px] h-8 text-alert-desc p-0">Cancel</Button>
              <div className="flex items-center gap-2">
                <Button
                  disabled={!clarificationText.trim()}
                  onClick={() => handleUploadComment('clarifying', clarificationText)}
                  className="h-8 px-3 text-[11px] bg-primary text-white"
                >
                  <MessageSquare className="w-3 h-3 mr-1.5" /> Comment
                </Button>
              </div>
            </div>
          </div>
        )}
        {actionState !== 'idle' && (
          <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-3 text-left w-full">
              <CheckCircle2 className={cn("w-6 h-6", actionState === 'clarifying' ? "text-alert-yellow-selected" : actionState === 'approved' ? "text-alert-info" : "text-alert-warning")} />
              <div><p className="text-sm font-bold text-foreground">Submitted</p><p className="text-[11px] text-alert-desc leading-none">You have responded to this request.</p></div>
            </div>
            <div className="pt-2 border-t border-border w-full flex justify-center">
              <div className={cn("text-[10px] font-bold px-4 py-1 rounded-full border",
                actionState === 'approved' && "bg-alert-success/10 text-alert-success border-alert-success/30",
                actionState === 'rejected' && "bg-alert-warning/10 text-alert-warning border-alert-warning/30",
                actionState === 'clarifying' && "bg-primary-foreground-2/10 text-alert-yellow-selected border-primary-foreground-2/30")}>
                {actionState === 'approved' ? 'Approved' : actionState === 'rejected' ? 'Rejected' : 'For Revision'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProposalReview({ proposals }: ProposalReviewProps) {
  const [activeTab, setActiveTab] = useState<'endorsed' | 'changes'>('endorsed');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<Record<number, string[]>>({});
  const [allComments, setAllComments] = useState<Record<number, any[]>>({});
  const [actionStates, setActionStates] = useState<Record<number, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleToggleEval = (id: number, name: string) => {
    setEvaluations(prev => {
      const current = prev[id] || [];
      return { ...prev, [id]: current.includes(name) ? current.filter(n => n !== name) : [...current, name] };
    });
  };

  const handleAddComment = (id: number, text: string, status: string) => {
    if (!text.trim()) return;
    const newComment = { id: Date.now(), author: 'Dr. Juan Cruz', date: new Date().toLocaleString(), text, status };
    setAllComments(prev => ({ ...prev, [id]: [...(prev[id] || []), newComment] }));
    setActionStates(prev => ({ ...prev, [id]: status }));
  };

  const handleUpdateComment = (proposalId: number, commentId: number, newText: string) => {
    setAllComments(prev => {
      const proposalComments = prev[proposalId] || [];
      return {
        ...prev,
        [proposalId]: proposalComments.map(comment =>
          comment.id === commentId
            ? { ...comment, text: newText, date: `${new Date().toLocaleString()} (Edited)` }
            : comment
        )
      };
    });
  };

  const handleDeleteComment = (proposalId: number, commentId: number) => {
    setAllComments(prev => ({
      ...prev,
      [proposalId]: (prev[proposalId] || []).filter(comment => comment.id !== commentId)
    }));
  };

  const changeRequests = [
    // ... your change requests
  ];

  const renderProposalSection = (title: string, headerColor: string, count: number, data: Proposal[]) => {
    const isRed = headerColor === "bg-primary";
    const isGold = headerColor === "bg-primary-foreground-2";
    const isGreen = headerColor === "bg-completed-border";

    return (
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className={cn("p-3 flex justify-between items-center px-5 shrink-0", headerColor)}>
          <span className={cn("font-bold text-sm", isGold ? "text-white" : "text-white")}>
            {title}
          </span>

          <div className="bg-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
            <span className={cn("font-bold",
              isRed && "text-primary",
              isGold && "text-primary-foreground-2",
              isGreen && "text-completed-border",
              !isRed && !isGold && !isGreen && "text-gray"
            )}>
              {count}
            </span>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[420px] bg-slate-50/10 custom-scrollbar">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {data.map((item) => (
                <CommitteeCard
                  key={item.proposal_id}
                  thesisTitle={item.proposal_title}
                  adviserName={item.advisor_name}
                  blockSection={item.block}
                  currentStage={0}
                  totalStages={6}
                  progress={3}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="bg-slate-100 p-4 rounded-full mb-3">
                <Icon name="docuDefault" size={32} className="opacity-40" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No proposals found</p>
              <p className="text-xs">There are currently no items in the {title.toLowerCase()} category.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <FacultyManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
      <Head title="Proposal Review" />

      <div className="px-6 max-w-[1440px] mx-auto w-full space-y-6">

        {/* 1. TABS */}
        <div className="flex border-b border-slate-200 w-full">
          <Button variant="ghost" onClick={() => setActiveTab('endorsed')} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all", "rounded-b-none", activeTab === 'endorsed' ? "border-b-2 border-[#800000] text-[#800000]" : "text-slate-500 hover:bg-slate-50")}>
            <Icon name={activeTab === 'endorsed' ? "docuClicked" : "docuDefault"} size={16} />
            Endorsed Proposal
          </Button>
          <Button variant="ghost" onClick={() => setActiveTab('changes')} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all", "rounded-b-none", activeTab === 'changes' ? "border-b-2 border-[#800000] text-[#800000]" : "text-slate-500 hover:bg-slate-50")}>
            <Icon name={activeTab === 'changes' ? "editClicked" : "editDefault"} size={16} />
            Change Requests
          </Button>
        </div>

        {/* 2. FILTER & SEARCH */}
        <FilterSearchSection variant='Committee' />

        {/* 3. MAIN CONTENT CONTAINER */}
        <div className="flex flex-col items-stretch gap-[30px] mb-10 w-full max-w-[1360px] mx-auto self-stretch grow-0 z-0">
          <div className="flex flex-row items-start gap-[30px] w-full max-w-[1360px] mx-auto">
            {activeTab === 'endorsed' ? (
              <EndorsedProposalsSection
                pending={proposals.pending}
                evaluated={proposals.evaluated}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                renderProposalSection={renderProposalSection}
              />
            ) : (
              <ChangeRequestsSection
                changeRequests={changeRequests}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}

            <div className="w-[400px] shrink-0 sticky top-6">
              <RightActionPane
                selectedItem={selectedItem}
                activeTab={activeTab}
                evaluations={evaluations}
                onToggleEval={handleToggleEval}
                comments={allComments[selectedItem?.id] || []}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                actionState={actionStates[selectedItem?.id] || 'idle'}
                onViewProposal={() => setIsPreviewOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative w-full max-w-6xl h-[90vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <FilePreview
              documentTitle={selectedItem?.proposal_title || "Proposal Document"}
              documentUrl={selectedItem?.proposal_filepath || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
            />
          </div>
        </div>
      )}
    </FacultyManagementLayout>
  );
}
