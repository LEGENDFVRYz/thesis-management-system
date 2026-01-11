import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import AddIcon from '@/components/Icons/ic_add-Default.svg';
// Adjust import path to where your table components are located
import { PoliciesHeader, PoliciesRow } from '../policies-tables'; 

// --- LOCAL TYPES ---
type SystemRule = {
    id: number;
    name: string;
    value: string;
    status: string;
};

export default function SystemRulesTab() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    
    // Mock Data (Ideally passed via props from Backend)
    const [rules, setRules] = useState<SystemRule[]>([
        { id: 1, name: 'Title Proposal Submission', value: '2 weeks', status: 'Active' },
        { id: 2, name: 'Title Proposal Submission', value: '3 weeks', status: 'Active' },
        { id: 3, name: 'Title Proposal Submission', value: '1 week', status: 'Inactive' },
        { id: 4, name: 'Title Proposal Submission', value: '2 weeks', status: 'Active' },
        { id: 5, name: 'Title Proposal Submission', value: '4 weeks', status: 'Active' },
        { id: 6, name: 'Title Proposal Submission', value: '1 week', status: 'Active' },
    ]);

    const form = useForm({
        name: '',
        value: '',
        status: 'Active',
    });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setModalOpen(true);
    };

    const openEdit = (rule: SystemRule) => {
        form.setData({ name: rule.name, value: rule.value, status: rule.status });
        setEditingId(rule.id);
        setModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would use form.post() or form.put() to your specific API route
        if (editingId) {
             setAlertMessage('System rule updated successfully.');
        } else {
             setAlertMessage('System rule created successfully.');
        }
        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if(confirm('Do you want to delete this system rule?')) {
            // form.delete(...)
            setAlertMessage('System rule deleted.');
        }
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
                    System Rules Configuration
                </h2>
                <Button onClick={openCreate} variant="primary" className="flex items-center gap-2">
                    <img src={AddIcon} className="w-4 h-4" />
                    Add New Rule
                </Button>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                    <PoliciesHeader columns={['Rule Name', 'Value', 'Status', 'Action']} />
                    <tbody>
                        {rules.map((rule, i) => (
                            <PoliciesRow
                                key={i}
                                data={rule}
                                onEdit={() => openEdit(rule)}
                                onDelete={() => handleDelete(rule.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-semibold text-[#730000]">
                            {editingId ? 'Edit System Rule' : 'Add System Rule'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Rule Name</label>
                            <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Value</label>
                            <input type="text" value={form.data.value} onChange={e => form.setData('value', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium">Status</label>
                            <select value={form.data.status} onChange={e => form.setData('status', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={submit} disabled={form.processing}>{editingId ? 'Save' : 'Create'}</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}