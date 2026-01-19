// components/thesis-tabs.tsx
import { TabButton } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react'; // Assuming Inertia Link for navigation

interface ThesisTabsProps {
    activeTab:
        | 'documents'
        | 'compare'
        | 'workflow'
        | 'final_submission'
        | 'change_request'
        | 'transfer_request';
    userRole?: 'leader' | 'member';
}

export function ThesisTabs({
    activeTab,
    userRole = 'leader',
}: ThesisTabsProps) {
    const LEADER_TABS = [
        {
            key: 'documents',
            label: 'Documents',
            href: '/management/thesis/documents',
        },
        {
            key: 'compare',
            label: 'Compare',
            href: '/management/thesis/compare',
        },
        {
            key: 'workflow',
            label: 'Workflow',
            href: '/management/thesis/workflow',
        },
        {
            key: 'final_submission',
            label: 'Final Submission',
            href: '/management/thesis/final-submission',
        },
        {
            key: 'change_request',
            label: 'Change Request',
            href: '/management/thesis/change-request',
        },
    ];

    const MEMBER_TABS = [
        {
            key: 'documents',
            label: 'Documents',
            href: '/management/thesis/documents',
        },
        {
            key: 'compare',
            label: 'Compare',
            href: '/management/thesis/compare',
        },
        {
            key: 'workflow',
            label: 'Workflow',
            href: '/management/thesis/workflow',
        },
        {
            key: 'transfer_request',
            label: 'Transfer Request',
            href: '/management/thesis/transfer-request',
        },
    ];

    const TABS = userRole === 'leader' ? LEADER_TABS : MEMBER_TABS;

    return (
        <div className="mt-2 flex">
            {TABS.map((tab) => (
                // Wrapp with Link when you implement routes, for now using span/div behavior
                <Link key={tab.key} href={tab.href} className="no-underline">
                    <TabButton
                        isActive={activeTab === tab.key}
                        onClick={() => {}} // Navigation handled by Link
                    >
                        {tab.label}
                    </TabButton>
                </Link>
            ))}
        </div>
    );
}
