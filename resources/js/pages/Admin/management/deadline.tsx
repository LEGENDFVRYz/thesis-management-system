import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { deadline } from '@/routes/admin/management/index';
import { DeadlineTimelineView } from './deadline-timeline-view';
import { DeadlineSubmissionSchedule } from './deadline-submission-schedule';
import { DeadlineDefenseSchedule } from './deadline-defense-schedule';
import { DeadlineNotificationRules } from './deadline-notification-rules';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deadlines',
        href: deadline().url,
    },
];

export default function DeadlinePage() {
    return (
        <ManagementLayout
            breadcrumbs={breadcrumbs}
            title="Deadline Management"
            description="Set submission windows, defense periods, and grading deadlines"
        >
            <div className="space-y-6">
                {/* Timeline View - Full Width */}
                <DeadlineTimelineView />

                {/* Three Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DeadlineSubmissionSchedule />
                    <DeadlineDefenseSchedule />
                    <DeadlineNotificationRules />
                </div>
            </div>
        </ManagementLayout>
    );
}
