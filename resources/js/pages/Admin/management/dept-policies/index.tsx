import { Link } from '@inertiajs/react';
import ManagementLayout from '@/pages/Admin/management/index';
import { system } from '@/routes/admin/management/policies/index';
import { TabButton } from '@/components/ui/tabs';
import ManagementIcon from '@/components/Icons/ic_pen-settings-Default.svg';
import { BreadcrumbItem, PageHeaderProps } from '@/types';

import SystemRulesTab from './system-rules';
import WorkflowApprovalTab from './workflow-approval';
import DocumentRequirementsTab from './document-requirements';
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
    { key: 'system', label: 'System Rules', url: '/admin/management/policies/system' },
    { key: 'workflow', label: 'Workflow Approval', url: '/admin/management/policies/workflow' },
    { key: 'documents', label: 'Document Requirements', url: '/admin/management/policies/documents' },
    { key: 'grading', label: 'Grading Policies', url: '/admin/management/policies/grading' },
    { key: 'guidelines', label: 'Overall Guidelines', url: '/admin/management/policies/guidelines' },
];

type Props = {
    currentTab: 'system' | 'workflow' | 'documents' | 'grading' | 'guidelines';
    [key: string]: any; 
};

export default function DepartmentPolicy({ currentTab = 'system', ...props }: Props) {
    
    // Helper to get current label
    const getTabLabel = (tabKey: string) => {
        return POLICY_TABS.find(tab => tab.key === tabKey)?.label || 'System Rules';
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
                    {currentTab === 'system' && <SystemRulesTab {...props} />}
                    {currentTab === 'workflow' && <WorkflowApprovalTab {...props} />}
                    {currentTab === 'documents' && <DocumentRequirementsTab {...props} />}
                    {currentTab === 'grading' && <GradingPoliciesTab {...props} />}
                    {currentTab === 'guidelines' && <OverallGuidelinesTab {...props} />}
                </div>
            </div>
        </ManagementLayout>
    );
}