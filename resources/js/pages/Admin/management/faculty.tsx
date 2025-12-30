import ManagementLayout from '@/pages/Admin/management/index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { faculty } from '@/routes/admin/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Faculty',
        href: faculty().url,
    },
];

export default function DeadlinePage({ faculties }: { faculties: any[] }) {
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Faculty" 
            description="Manage Faculty Accounts and Assign Roles"
        >

            {/*
            * =============================================================================
            * NOTICE: TEMPORARY UI / PLACEHOLDER DESIGN
            * =============================================================================
            * The layout and styles in this file are temporary placeholders intended solely
            * to demonstrate backend logics, data rendering, and verify CRUD functionality.
            * =============================================================================
            */}
            
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Faculty ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Roles</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Date Added</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {faculties && faculties.length > 0 ? (
                                faculties.map((fac, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {fac.faculty_id}
                                        </td>
                                        
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{fac.faculty_name}</div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {fac.email}
                                        </td>
                                        
                                        {/* Roles Column: Parsing the comma-separated string into badges */}
                                        <td className="px-6 py-4">
                                            {fac.roles ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {fac.roles.split(', ').map((role: string, idx: number) => (
                                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No Roles</span>
                                            )}
                                        </td>
                                        
                                        {/* Type Column: Conditional styling for Full-time vs Part-time */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${fac.faculty_type === 'Full-time' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                }`}>
                                                {fac.faculty_type}
                                            </span>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {fac.date_added}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No faculty members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </ManagementLayout>
    );
}
