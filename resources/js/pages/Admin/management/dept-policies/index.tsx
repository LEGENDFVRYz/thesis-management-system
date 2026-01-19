import { Link } from '@inertiajs/react';
import ManagementLayout from '@/pages/Admin/management/index';
import { system } from '@/routes/admin/management/policies/index';
import { TabButton } from '@/components/ui/tabs';
import { BreadcrumbItem, PageHeaderProps } from '@/types';

import GradingPoliciesTab from './grading-policies';
import OverallGuidelinesTab from './overall-guidelines';
import { Icon } from '@/components/icon-index';


// Page Header
const pageHeader: PageHeaderProps = {
    title: "Department Policies",
    subtitle: "Loremm Ipsumm... paedit nalang",
    icon: (
        // paki corretc nalang
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

// Define the tabs for navigation
const POLICY_TABS = [
    { key: 'grading', label: 'Grading Policies', url: '/admin/management/policies/grading' },
    { key: 'guidelines', label: 'Overall Guidelines', url: '/admin/management/policies/guidelines' },
];

type Props = {
    currentTab: 'grading' | 'guidelines';
    [key: string]: any;
};

export default function DepartmentPolicy({ currentTab = 'grading', ...props }: Props) {

    // Helper to get current label
    const getTabLabel = (tabKey: string) => {
        return POLICY_TABS.find(tab => tab.key === tabKey)?.label || 'Grading Policies';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Department Policies', href: system().url },
        { title: getTabLabel(currentTab), href: '#' },
    ];

    return (
        <ManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <div className="bg-white">
                <div className="flex">
                    {POLICY_TABS.map(tab => (
                        <Link 
                            key={tab.key} 
                            href={tab.url}
                            preserveState 
                            preserveScroll
                        >
                            <TabButton
                                isActive={currentTab === tab.key}
                                onClick={() => {}} 
                            >
                                {tab.label}
                            </TabButton>
                        </Link>
                    ))}
                </div>

                {/* CONTENT CONTAINER */}
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
                    {/* CONDITIONAL RENDERING BASED ON PROP */}
                    {currentTab === 'grading' && <GradingPoliciesTab {...props} />}
                    {currentTab === 'guidelines' && <OverallGuidelinesTab {...props} />}
                </div>
            </div>
        </ManagementLayout>
    );
}