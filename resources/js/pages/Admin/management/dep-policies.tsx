import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { depPolicies } from '@/routes/admin/management/index';
import { useState } from 'react';
import { Tabs, TabButton } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import StageSwitchToggle from '@/components/stage-toggle';
import EditIcon from '@/components/Icons/ic_edit-Default.svg';
import DeleteIcon from '@/components/Icons/ic_delete-Default.svg';
import AddIcon from '@/components/Icons/ic_add-Default.svg';
import ManagementIcon from '@/components/Icons/ic_pen-settings-Default.svg';
import { PoliciesHeader, PoliciesRow } from './policies-tables';


const POLICY_TABS = [
    { key: 'system', label: 'System Rules' },
    { key: 'workflow', label: 'Workflow Approval' },
    { key: 'documents', label: 'Document Requirements' },
    { key: 'grading', label: 'Grading Policies' },
    { key: 'guidelines', label: 'Overall Guidelines' },
];


// WORKFLOW DATA MOCKUP
type Stage = 'mor' | 'dp1' | 'dp2';

type WorkflowStepType = {
  id: number;
  title: string;
  role: string;
  days: number;
};

const WORKFLOWS: Record<Stage, WorkflowStepType[]> = {
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


export default function DepartmentPolicy({ grading }: { grading: any[] }) {
    // GRADING CRITERIA FORM
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        category: '',
        weight: 0,
        minimum: 0,
    });

    // SYSTEM RULE FORM
    const systemRuleForm = useForm({
        name: '',
        value: '',
        status: 'Active',
    });

    // WORKFLOW FORM
    const workflowForm = useForm({
        title: '',
        role: '',
        days: 1,
        });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('system');
    const [systemRuleModalOpen, setSystemRuleModalOpen] = useState(false);
    const [editingSystemRuleId, setEditingSystemRuleId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
    const [editingWorkflowId, setEditingWorkflowId] = useState<number | null>(null);
    const [workflows, setWorkflows] = useState<Record<Stage, WorkflowStepType[]>>(WORKFLOWS);
    const [stage, setStage] = useState<'mor' | 'dp1' | 'dp2'>('mor');

    // Tab Label
    const getTabLabel = (tabKey: string) => {
        return POLICY_TABS.find(tab => tab.key === tabKey)?.label || 'Department Policies';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Department Policies',
            href: depPolicies().url,
        },
        {
            title: getTabLabel(activeTab),
            href: depPolicies().url,
        },
    ];

    const openConfirm = (message: string, onConfirm: () => void) => {
        setConfirmDialog({ message, onConfirm });
    };

    // System Rule CRUD Operations (TO BE REVISED)
    const openCreateSystemRule = () => {
    systemRuleForm.reset();
    setEditingSystemRuleId(null);
    setSystemRuleModalOpen(true);
    };

    const openEditSystemRule = (rule: any) => {
        systemRuleForm.setData({
            name: rule.name,
            value: rule.value,
            status: rule.status,
        });
        setEditingSystemRuleId(rule.id);
        setSystemRuleModalOpen(true);
    };

    const submitSystemRule = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingSystemRuleId) {
            systemRuleForm.put(
                `/admin/management/dept-policies/system-rules/${editingSystemRuleId}`,
                {
                    onSuccess: () => {
                        setAlertMessage('System rule updated successfully.');
                        closeSystemRuleModal();
                    },
                }
            );
        } else {
            systemRuleForm.post(
                `/admin/management/dept-policies/system-rules`,
                {
                    onSuccess: () => {
                        setAlertMessage('System rule created successfully.');
                        closeSystemRuleModal();
                    },
                }
            );
        }
    };

    const deleteSystemRule = (id: number) => {
        openConfirm('Do you want to delete this system rule?', () => {
            systemRuleForm.delete(
                `/admin/management/dept-policies/system-rules/${id}`,
                {
                    onSuccess: () => setAlertMessage('System rule deleted.'),
                    onFinish: () => setConfirmDialog(null),
                }
            );
        });
    };

    const closeSystemRuleModal = () => {
        setSystemRuleModalOpen(false);
        setEditingSystemRuleId(null);
        systemRuleForm.reset();
    };

    // Workflow CRUD Operations (TO BE REVISED)
    // Edit Process
    const openEditWorkflow = (step: WorkflowStepType) => {
        workflowForm.setData({
            title: step.title,
            role: step.role,
            days: step.days,
        });
        setEditingWorkflowId(step.id);
        setWorkflowModalOpen(true);
    };

    const deleteWorkflowStep = (id: number) => {
        openConfirm('Are you sure you want to delete this workflow step?', () => {
            setWorkflows(prev => ({
                ...prev,
                [stage]: prev[stage].filter(step => step.id !== id),
            }));
            setAlertMessage('Workflow step deleted.');
        });
    };

    const submitWorkflow = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingWorkflowId) return;

        // Update the workflow in state
        setWorkflows(prev => ({
            ...prev,
            [stage]: prev[stage].map(step =>
                step.id === editingWorkflowId
                    ? {
                          ...step,
                          title: workflowForm.data.title,
                          role: workflowForm.data.role,
                          days: workflowForm.data.days,
                      }
                    : step
            ),
        }));

        setAlertMessage('Workflow step updated successfully.');
        closeWorkflowModal();
    };

    const closeWorkflowModal = () => {
        setWorkflowModalOpen(false);
        setEditingWorkflowId(null);
        workflowForm.reset();
    };


    // Grading Policy CRUD Operations
    // Editing Proccess
    const openEdit = (criteria: any) => {
        clearErrors();
        setEditingId(criteria.id);
        setData({
            category: criteria.category,
            weight: criteria.weight,
            minimum: criteria.minimum,
        });
        setIsModalOpen(true);
    };

    // Delete Process
    const handleDelete = (id: number) => {
        openConfirm('Are you sure you want to delete this criteria? This action cannot be undone.', () => {
            destroy(`/admin/management/dept-policies/grading-criteria/${id}`, {
                preserveScroll: true,
                onFinish: () => setConfirmDialog(null),
            });
        });
    };


    // Create Process
    const openCreate = () => {
        clearErrors();
        setEditingId(null);     // Logic for editing/create process identifier
        reset();                
        setIsModalOpen(true);
    };


    // Form Handling (shared logic for submissions)
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = editingId !== null;

        if (isEditing) {
            // Update mode
            put(`/admin/management/dept-policies/grading-criteria/${editingId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            // Create mode
            post(`/admin/management/dept-policies/grading-criteria`, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    // Workflow Step Component
    const WorkflowStep = ({
    stepNumber,
    title,
    role,
    days,
    onEdit,
    onDelete,
    }: {
    stepNumber: number;
    title: string;
    role: string;
    days: number;
    onEdit: () => void;
    onDelete: () => void;
    }) => {
    return (
        <div
        className="flex items-center justify-between"
        style={{
            height: '85px',
            width: '800px',
            borderRadius: '8px',
            border: '1px solid #730000',
            backgroundColor: '#FDFCF6',
            padding: '25px 31px',
        }}
        >
        {/* LEFT */}
        <div className="flex items-center gap-4">
            {/* NUMBER */}
            <div className="relative w-10 h-10 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#730000] flex items-center justify-center shadow">
                <span className="text-white text-base font-medium">
                {stepNumber}
                </span>
            </div>
            </div>

            {/* TEXT */}
            <div>
            <p className="text-sm font-semibold text-[#730000]">
                {title}
            </p>
            <p className="text-xs text-[#730000]">
                Person in Charge: {role}
            </p>
            </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{days} days</span>

            <img
            src={EditIcon}
            className="w-5 h-5 cursor-pointer"
            onClick={onEdit}
            />
            <img
            src={DeleteIcon}
            className="w-5 h-5 cursor-pointer"
            onClick={onDelete}
            />
        </div>
        </div>
    );
    };


    return (
        <ManagementLayout
            breadcrumbs={breadcrumbs}
            title={
                <div className="flex items-center gap-2 text-[#FFBD00]">
                    <img src={ManagementIcon} className="w-6 h-6" />
                    <span className="font-medium">Department Policies</span>
                </div>
            }
            description="Configure academic year, semester parameters, and system timeline"
        >
            {alertMessage && (
                <div className="mb-4">
                    <Alert>
                        <div className="text-sm text-gray-900">{alertMessage}</div>
                    </Alert>
                </div>
            )}

            {/* TABS + CARD */}
            <div className="bg-white">
                {/* TABS */}
                <div className="flex">
                    {POLICY_TABS.map(tab => (
                        <TabButton
                            key={tab.key}
                            isActive={activeTab === tab.key}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </TabButton>
                    ))}
                </div>

                {/* CONTENT CARD */}
                <div
                    style={{
                        backgroundColor: '#FDFCF6',
                        border: '1px solid #73000042',
                        borderTop: '1px solid #73000042',                
                        borderTopLeftRadius: 0,            
                        borderTopRightRadius: '12px',
                        boxShadow: '0 8px 24px #00000040',
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '12px',
                        padding: '32px',
                    }}
                >
                    {/* SYSTEM RULES */}
                    {activeTab === 'system' && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                                    System Rules
                                </h2>
                                <Button
                                    onClick={openCreateSystemRule}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <img src={AddIcon} className="w-4 h-4" />
                                    Add New Rule
                                </Button>
                            </div>

                            <div className="bg-white rounded-xl border overflow-hidden">
                                <table className="w-full text-sm">
                                    <PoliciesHeader columns={['Rule Name', 'Value', 'Status', 'Action']} />
                                    <tbody>
                                        {[
                                            { name: 'Title Proposal Submission', value: '2 weeks', status: 'Active' },
                                            { name: 'Title Proposal Submission', value: '3 weeks', status: 'Active' },
                                            { name: 'Title Proposal Submission', value: '1 week', status: 'Inactive' },
                                            { name: 'Title Proposal Submission', value: '2 weeks', status: 'Active' },
                                            { name: 'Title Proposal Submission', value: '4 weeks', status: 'Active' },
                                            { name: 'Title Proposal Submission', value: '1 week', status: 'Active' },
                                        ].map((doc, i) => (
                                            <PoliciesRow
                                                key={i}
                                                data={doc}
                                                onEdit={() => openEditSystemRule(doc)}
                                                onDelete={() => deleteSystemRule(doc.id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* WORKFLOW */}
                    {activeTab === 'workflow' && (<>
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                        Workflow Approval
                    </h2>

                    <StageSwitchToggle
                    value={stage}
                    onChange={(val: string) => {
                        const normalized = val.toLowerCase() as Stage;
                        setStage(normalized);
                    }}
                    options={[
                        { label: 'MOR', value: 'mor' },
                        { label: 'DP1', value: 'dp1' },
                        { label: 'DP2', value: 'dp2' },
                    ]}
                    />
                    </div>

                     <div
                        className="flex flex-col items-center gap-4 overflow-y-auto"
                        style={{
                            height: '1010px',
                            width: '1260px',
                            borderRadius: '8px',
                            border: '1px solid #730000',
                            backgroundColor: '#FFFFFF',
                            padding: '25px 230px',
                        }}
                    >
                        {workflows[stage].map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <WorkflowStep
                                    stepNumber={index + 1}
                                    title={step.title}
                                    role={step.role}
                                    days={step.days}
                                    onEdit={() => openEditWorkflow(step)}
                                    onDelete={() => deleteWorkflowStep(step.id)}
                                />

                                {index < workflows[stage].length - 1 && (
                                    <span className="text-[#730000] text-xl">↓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}


                    {/* DOCUMENT REQUIREMENTS */}
                    {activeTab === 'documents' && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                                    Document Requirements
                                </h2>
                                <Button
                                    onClick={openCreate}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <img src={AddIcon} className="w-4 h-4" />
                                    Add Requirement
                                </Button>
                            </div>

                            <div className="bg-white rounded-xl border overflow-hidden">
                                <table className="w-full text-sm">
                                    <PoliciesHeader columns={['Rule Name', 'Format', 'Status', 'Action']} />
                                    <tbody>
                                        {[
                                            { name: 'Proposal Document', format: 'PDF', status: 'Mandatory' },
                                            { name: 'Ethics Clearance', format: 'PDF', status: 'Mandatory' },
                                            { name: 'Adviser Consent Form', format: 'PDF', status: 'Optional' },
                                        ].map((doc, i) => (
                                            <PoliciesRow
                                                key={i}
                                                data={doc}
                                                onEdit={() => {}}
                                                onDelete={() => {}}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* GRADING */}
                    {activeTab === 'grading' && (
                        <div className="relative min-h-[100vh] p-8 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                            <div className="flex items-center justify-between pb-4">
                                <h1 className='font-bold pb-5'>Grade Policies</h1>
                                <button
                                    className="py-2 px-4 bg-primary text-sm text-primary-foreground hover:text-primary-foreground-2 cursor-pointer rounded-sm"
                                    onClick={openCreate}
                                    disabled={processing}
                                >
                                    Create
                                </button>
                            </div>

                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Category</th>
                                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Weight</th>
                                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Minimum Score</th>
                                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {grading && grading.length > 0 ? (
                                        grading.map((criteria) => (
                                            <tr key={criteria.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">
                                                    {criteria.category}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">
                                                    {criteria.weight}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">
                                                    {criteria.minimum}
                                                </td>
                                                <td className="px-6 py-4 flex gap-2 font-medium text-gray-900 dark:text-gray-100 justify-center">
                                                    <button
                                                        className="py-1 px-4 bg-primary text-primary-foreground hover:text-primary-foreground-2 cursor-pointer rounded-sm"
                                                        onClick={() => openEdit(criteria)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="py-1 px-4 bg-primary text-primary-foreground hover:text-primary-foreground-2 cursor-pointer rounded-sm"
                                                        onClick={() => handleDelete(criteria.id)}
                                                        disabled={processing}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                No Grading Criteria has been created yet!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* OVERALL GUIDELINES */}
                    {activeTab === 'guidelines' && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                                    Overall Guidelines
                                </h2>
                                <Button
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <img src={AddIcon} className="w-4 h-4" />
                                    Upload New Policy Guide
                                </Button>
                            </div>

                            <div className="bg-white rounded-xl border p-6">
                                <p className="text-sm text-gray-500 text-center py-20">
                                    No guidelines document uploaded yet. Click "Upload PDF" to add department guidelines.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* SAMPLE TESTING MODAL FOR CRUD OPERATIONS */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/12 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            {editingId ? 'Edit Grading Criteria' : 'Add New Grading Criteria'}
                        </h2>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium">
                                Category
                            </label>
                            <input
                                type="text"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className={`w-full rounded-md border px-3 py-2 text-sm`}
                            />
                            {errors.category && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Weight */}
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium">
                                Weight (percent)
                            </label>
                            <input
                                type="number"
                                value={data.weight}
                                onChange={e => setData('weight', Number(e.target.value))}
                                className='w-full rounded-md border px-3 py-2 text-sm'
                            />
                            {errors.weight && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.weight}
                                </p>
                            )}
                        </div>

                        {/* Minimum Score */}
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium">
                                Minimum
                            </label>
                            <input
                                type="number"
                                value={data.minimum}
                                onChange={e => setData('minimum', Number(e.target.value))}
                                className='w-full rounded-md border px-3 py-2 text-sm'
                            />
                            {errors.minimum && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.minimum}
                                </p>
                            )}
                        </div>


                        {/* CONFIRMATIONS */}
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={closeModal}
                                className="rounded-md px-4 py-2 text-sm bg-gray-400 text-primary-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="rounded-md px-4 py-2 text-sm bg-primary text-primary-foreground"
                            >
                                {editingId ? 'Save' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* System Rule Modal */}
            {systemRuleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                    <h2 className="mb-4 text-lg font-semibold text-[#730000]">
                        {editingSystemRuleId ? 'Edit System Rule' : 'Add System Rule'}
                    </h2>

                    {/* RULE NAME */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Rule Name</label>
                        <input
                            type="text"
                            value={systemRuleForm.data.name}
                            onChange={e => systemRuleForm.setData('name', e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    {/* VALUE */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Value</label>
                        <input
                            type="text"
                            value={systemRuleForm.data.value}
                            onChange={e => systemRuleForm.setData('value', e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    {/* STATUS */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            value={systemRuleForm.data.status}
                            onChange={e => systemRuleForm.setData('status', e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={closeSystemRuleModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={submitSystemRule}
                            disabled={systemRuleForm.processing}
                        >
                            {editingSystemRuleId ? 'Save' : 'Create'}
                        </Button>
                    </div>
                </div>
            </div>
        )}

        {/* Workflow Modal */}
        {workflowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-[#730000]">
                Edit Workflow Step
            </h2>

            {/* TITLE */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Step Title</label>
                <input
                type="text"
                value={workflowForm.data.title}
                onChange={e => workflowForm.setData('title', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                />
            </div>

            {/* ROLE */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Person in Charge</label>
                <input
                type="text"
                value={workflowForm.data.role}
                onChange={e => workflowForm.setData('role', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                />
            </div>

            {/* DAYS */}
            <div className="mb-6">
                <label className="block text-sm font-medium">Duration (days)</label>
                <input
                type="number"
                min={1}
                value={workflowForm.data.days}
                onChange={e => workflowForm.setData('days', Number(e.target.value))}
                className="w-full rounded-md border px-3 py-2 text-sm"
                />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeWorkflowModal}>
                Cancel
                </Button>
                <Button
                variant="primary"
                onClick={submitWorkflow}
                disabled={workflowForm.processing}
                >
                Save
                </Button>
            </div>
            </div>
        </div>
        )}


            {confirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-[#730000] mb-2">Confirm Action</h3>
                        <p className="text-sm text-gray-700 mb-6">{confirmDialog.message}</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setConfirmDialog(null)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => confirmDialog.onConfirm()}>
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </ManagementLayout>
    );
}