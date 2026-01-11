import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import AddIcon from '@/components/Icons/ic_add-Default.svg';
import { PoliciesHeader, PoliciesRow } from './components/policies-tables';

// type
export type DocumentRequirement = {
    id: number;
    name: string;
    format: string;
    status: string;
};


export default function DocumentRequirementsTab() {
    const [docs, setDocs] = useState<DocumentRequirement[]>([
        { id: 1, name: 'Proposal Document', format: 'PDF', status: 'Mandatory' },
        { id: 2, name: 'Ethics Clearance', format: 'PDF', status: 'Mandatory' },
        { id: 3, name: 'Adviser Consent Form', format: 'PDF', status: 'Optional' },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const form = useForm({ name: '', format: 'PDF', status: 'Mandatory' });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setModalOpen(true);
    };

    const openEdit = (doc: DocumentRequirement) => {
        form.setData({ name: doc.name, format: doc.format, status: doc.status });
        setEditingId(doc.id);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this document requirement?')) {
            setDocs(prev => prev.filter(d => d.id !== id));
            setAlertMessage('Document requirement deleted.');
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setDocs(prev => prev.map(d => d.id === editingId ? { ...d, ...form.data } : d));
            setAlertMessage('Document requirement updated.');
        } else {
            const newId = docs.length ? Math.max(...docs.map(d => d.id)) + 1 : 1;
            setDocs(prev => [...prev, { id: newId, ...form.data }]);
            setAlertMessage('Document requirement added.');
        }
        setModalOpen(false);
        form.reset();
    };

    return (
        <>
            {alertMessage && (
                <div className="mb-4">
                    <Alert><div className="text-sm text-gray-900">{alertMessage}</div></Alert>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>Document Requirements</h2>
                <Button onClick={openCreate} variant="primary" className="flex items-center gap-2">
                    <img src={AddIcon} className="w-4 h-4" />
                    Add Requirement
                </Button>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                    <PoliciesHeader columns={['Rule Name', 'Format', 'Status', 'Action']} />
                    <tbody>
                        {docs.map((doc, i) => (
                            <PoliciesRow
                                key={i}
                                data={doc}
                                onEdit={() => openEdit(doc)}
                                onDelete={() => handleDelete(doc.id)}
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
                            {editingId ? 'Edit Requirement' : 'Add Requirement'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Format</label>
                            <input type="text" value={form.data.format} onChange={e => form.setData('format', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium">Status</label>
                            <select value={form.data.status} onChange={e => form.setData('status', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                <option value="Mandatory">Mandatory</option>
                                <option value="Optional">Optional</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={submit}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}