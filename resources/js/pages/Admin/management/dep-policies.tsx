import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { depPolicies } from '@/routes/admin/management/index';
import { useState } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deadlines',
        href: depPolicies().url,
    },
];

export default function DeadlinePage({ grading }: { grading: any[] }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        category: '',
        weight: 0,
        minimum: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    
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
        if (confirm('Are you sure you want to delete this criteria? This action cannot be undone.')) {
            destroy(`/admin/management/dept-policies/grading-criteria/${id}`, {
                preserveScroll: true
            });
        }
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



    return (
        <ManagementLayout
            breadcrumbs={breadcrumbs}
            title="Department Policies"
            description="Configure academic year, semester parameters, and system timeline"
        >
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
        </ManagementLayout>
    );
}
