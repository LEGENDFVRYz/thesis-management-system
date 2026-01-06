import { type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import FacultyManagementLayout from '@/pages/Faculty/management/index';

interface EvalGradingLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    advisoryId: number; // We need this to build the links dynamically
    title: string;
    description: string;
}

export default function EvalGradingLayout({ children, breadcrumbs, advisoryId, title, description }: EvalGradingLayoutProps) {
    
    const { url } = usePage();

    // 1. Define Tabs dynamically using the advisoryId
    const tabs = [
        { 
            title: 'Document Review',      
            href: `/faculty/management/adviser/eval_n_grading/document_review/${advisoryId}` 
        },
        { 
            title: 'Evaluation', 
            href: `/faculty/management/adviser/eval_n_grading/evaluation/${advisoryId}` 
        },
    ];

    return (
        <FacultyManagementLayout 
            breadcrumbs={breadcrumbs}
            title={title} 
            description={description}
        >
            {/* PAGE TABS */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {tabs.map((tab) => {
                        // Check if current URL starts with the tab's href
                        const isActive = url.startsWith(tab.href);
                        
                        return (
                            <li key={tab.title} className="me-2">
                                <Link
                                    href={tab.href}
                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                        isActive
                                            ? 'text-primary border-primary active'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                    }`}
                                >
                                    {tab.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            {/* CONTENT */}
            {children}

        </FacultyManagementLayout>
    );
}