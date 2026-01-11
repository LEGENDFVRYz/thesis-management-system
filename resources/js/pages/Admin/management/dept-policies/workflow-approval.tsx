import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import StageSwitchToggle from '@/components/stage-toggle';
import EditIcon from '@/components/Icons/ic_edit-Default.svg';
import DeleteIcon from '@/components/Icons/ic_delete-Default.svg';


export type Stage = 'mor' | 'dp1' | 'dp2';

export type WorkflowStepType = {
    id: number;
    title: string;
    role: string;
    days: number;
};

export const WORKFLOWS: Record<Stage, WorkflowStepType[]> = {
    mor: [
        { id: 1, title: 'Approve MOR Proposal Draft', role: 'Adviser', days: 3 },
        { id: 2, title: 'Review & Proposal Endorsement', role: 'Adviser', days: 3 },
        { id: 3, title: 'Evaluation of Proposal', role: 'Committee', days: 3 },
        { id: 4, title: 'Submit Final MOR Manuscript & Documentation', role: 'Student', days: 3 },
        { id: 5, title: 'MOR Defense Scheduling (Matrix)', role: 'Coordinator', days: 3 },
        { id: 6, title: 'MOR Defense', role: 'Panel Member', days: 3 },
        { id: 7, title: 'Approve Revisions (If Required)', role: 'Adviser & Panel', days: 3 },
    ],
    dp1: [
        { id: 8, title: 'Validate DP1 Manuscript', role: 'Adviser', days: 3 },
        { id: 9, title: 'Endorsement for DP1 Defense', role: 'Adviser', days: 3 },
        { id: 10, title: 'Verify Endorsement', role: 'Coordinator', days: 3 },
        { id: 11, title: 'Submit Revised DP1 Manuscript & Documentation', role: 'Student', days: 3 },
        { id: 12, title: 'DP1 Defense Scheduling (Matrix)', role: 'Coordinator', days: 3 },
        { id: 13, title: 'DP1 Defense', role: 'Panel Member', days: 3 },
        { id: 14, title: 'Approve Required Revisions', role: 'Adviser & Panel', days: 3 },
        { id: 15, title: 'Feasibility Validation', role: 'Adviser & Panel', days: 3 },
    ],
    dp2: [
        { id: 16, title: 'Validate DP2 Manuscript', role: 'Adviser', days: 3 },
        { id: 17, title: 'Endorsement for DP2 Defense', role: 'Adviser', days: 3 },
        { id: 18, title: 'Verify Endorsement', role: 'Coordinator', days: 3 },
        { id: 19, title: 'Submit Final DP2 Manuscript & Documentation', role: 'Student', days: 3 },
        { id: 20, title: 'DP2 Defense Scheduling (Matrix)', role: 'Coordinator', days: 3 },
        { id: 21, title: 'DP2 Final Defense', role: 'Panel Member', days: 3 },
        { id: 22, title: 'Approve Post-Defense Revisions', role: 'Adviser & Panel', days: 3 },
        { id: 23, title: 'Validate Output Submission', role: 'Panel Member', days: 3 },
        { id: 24, title: 'Completion & Clearance', role: 'Coordinator', days: 3 },
    ],
};

export const WORKFLOW_TITLES: Record<Stage, string> = {
    mor: 'Methods of Research Workflow',
    dp1: 'Design Project 1 Workflow',
    dp2: 'Design Project 2 Workflow',
};

// Sub Component for individual steps
const WorkflowStep = ({ stepNumber, title, role, days, onEdit, onDelete }: any) => {
    return (
        <div className="flex items-center justify-between" style={{ height: '85px', width: '800px', borderRadius: '8px', border: '1px solid #730000', backgroundColor: '#FDFCF6', padding: '25px 31px' }}>
            <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#730000] flex items-center justify-center shadow">
                        <span className="text-white text-base font-medium">{stepNumber}</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-[#730000]">{title}</p>
                    <p className="text-xs text-[#730000]">Person in Charge: {role}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{days} days</span>
                <img src={EditIcon} className="w-5 h-5 cursor-pointer" onClick={onEdit} alt="Edit" />
                <img src={DeleteIcon} className="w-5 h-5 cursor-pointer" onClick={onDelete} alt="Delete" />
            </div>
        </div>
    );
};

export default function WorkflowApprovalTab() {
    const [workflows, setWorkflows] = useState<Record<Stage, WorkflowStepType[]>>(WORKFLOWS);
    const [stage, setStage] = useState<Stage>('mor');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const form = useForm({ title: '', role: '', days: 1 });

    const openEdit = (step: WorkflowStepType) => {
        form.setData({ title: step.title, role: step.role, days: step.days });
        setEditingId(step.id);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if(confirm('Delete this workflow step?')) {
            setWorkflows(prev => ({ ...prev, [stage]: prev[stage].filter(s => s.id !== id) }));
            setAlertMessage('Workflow step deleted.');
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setWorkflows(prev => ({
                ...prev,
                [stage]: prev[stage].map(step => step.id === editingId ? { ...step, ...form.data } : step)
            }));
            setAlertMessage('Workflow step updated.');
        }
        setModalOpen(false);
        setEditingId(null);
    };

    return (
        <>
            {alertMessage && (
                <div className="mb-4">
                    <Alert><div className="text-sm text-gray-900">{alertMessage}</div></Alert>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                    {WORKFLOW_TITLES[stage]}
                </h2>
                <StageSwitchToggle
                    value={stage}
                    onChange={(val: string) => setStage(val.toLowerCase() as Stage)}
                    options={[
                        { label: 'MOR', value: 'mor' },
                        { label: 'DP1', value: 'dp1' },
                        { label: 'DP2', value: 'dp2' },
                    ]}
                />
            </div>

            <div className="flex flex-col items-center gap-4 overflow-y-auto" style={{ height: '1010px', width: '1260px', borderRadius: '8px', border: '1px solid #730000', backgroundColor: '#FFFFFF', padding: '25px 230px' }}>
                {workflows[stage].map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                        <WorkflowStep
                            stepNumber={index + 1}
                            title={step.title}
                            role={step.role}
                            days={step.days}
                            onEdit={() => openEdit(step)}
                            onDelete={() => handleDelete(step.id)}
                        />
                        {index < workflows[stage].length - 1 && <span className="text-[#730000] text-xl">↓</span>}
                    </div>
                ))}
            </div>

             {/* MODAL */}
             {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-semibold text-[#730000]">Edit Workflow Step</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Step Title</label>
                            <input type="text" value={form.data.title} onChange={e => form.setData('title', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Person in Charge</label>
                            <input type="text" value={form.data.role} onChange={e => form.setData('role', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium">Duration (days)</label>
                            <input type="number" min={1} value={form.data.days} onChange={e => form.setData('days', Number(e.target.value))} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={submit} disabled={form.processing}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}