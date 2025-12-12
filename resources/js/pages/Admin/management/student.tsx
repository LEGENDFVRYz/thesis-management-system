import ManagementLayout from '@/pages/Admin/management/index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { student } from '@/routes/admin/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student',
        href: student().url,
    },
];

export default function DeadlinePage({ students }: { students: any[] }) {
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Student Management" 
            description="View and Manage Student Accounts and Thesis Group Assignments"
        >
            
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Student No.</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Group Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Block</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Specialization</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Adviser</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students && students.length > 0 ? (
                                students.map((stud, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {stud.student_number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {stud.student_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {stud.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {stud.group_code ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {stud.group_code}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">No Group</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            BSCPE 3 - {stud.block}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {stud.specialization || <span className="text-gray-400 italic">N/A</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {stud.thesis_adviser || <span className="text-gray-400 italic">Unassigned</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No students found.
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