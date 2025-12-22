import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '.';
import { defenses } from '@/routes/admin/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Defense',
        href: defenses().url,
    },
];

export default function Dashboard({ defenses }: { defenses: any[] }) {
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Defense Management" 
            description="Monitor all defense schedules and panel assignments"
        >
            
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Group Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Thesis Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Proponents</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Adviser</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Block</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Schedule</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Type</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {defenses && defenses.length > 0 ? (
                                defenses.map((def, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        
                                        {/* Group Code Badge */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {def.group_code}
                                            </span>
                                        </td>

                                        {/* Title: Allowed to wrap if long, limited width */}
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 max-w-xs whitespace-normal truncate">
                                            <div className="line-clamp-2" title={def.thesis_title}>
                                                {def.thesis_title}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            {def.proponents}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {def.adviser_name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            BSCPE {def.year_level}-{def.block}  
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {def.defense_date_time}
                                        </td>

                                        {/* Defense Type Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${def.defense_type.includes('MOR') 
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                }`}>
                                                {def.defense_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No defense schedules found.
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
