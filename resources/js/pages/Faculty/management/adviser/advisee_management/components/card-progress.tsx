import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { iconRegistry } from '@/components/icons-registry';
import { Badge } from '@/components/ui/badge';
import { TimelineState } from '@/components/ui/wizard-timeline';
import React from 'react';

const DocuIcon = iconRegistry.docuDefault;
const BackIcon = iconRegistry.backDefault;
const PeopleIcon = iconRegistry.peopleLinear;

/* =======================
   Types
======================= */

interface GroupDetailCardProps {
    title: string;
    groupCode: string;
}

interface Member {
    name: string;
    student_id: string;
    email: string;
    isLeader: boolean;
}

interface Milestone {
    title: string;
    due: string;
    submitted: string | null;
    statusBadge: BadgeName;
}

interface RecentSubmission {
    filename: string;
}

interface GroupOverviewCardProps {
    members: Member[];
    progressPercentage: number;
    milestones: Milestone[];
    recentSubmissions: RecentSubmission[];
}

/* =======================
   Group Detail Card
======================= */

const GroupDetailCard: React.FC<GroupDetailCardProps> = ({
    title,
    groupCode,
}) => {
    return (
        <div className="mt-8 mb-8 flex flex-col gap-4 rounded-lg bg-primary p-8 shadow">
            <p className="text-title-3 font-semibold text-primary-foreground">
                Group Details
            </p>

            <div className="flex flex-col gap-1">
                <p className="text-body-1 text-primary-foreground-2">{title}</p>
                <p className="text-title-3 text-primary-foreground">
                    {groupCode}
                </p>
            </div>
        </div>
    );
};

/* =======================
   Unified Overview Card
======================= */

const GroupOverviewCard: React.FC<GroupOverviewCardProps> = ({
    members,
    progressPercentage,
    milestones,
    recentSubmissions,
}) => {
    return (
        <div className="rounded-lg border border-primary bg-white p-8 shadow">
            <GroupMembersSection members={members} />

            <Divider />

            <MilestoneProgressSection
                progressPercentage={progressPercentage}
                milestones={milestones}
            />

            <Divider />

            <RecentSubmissionsSection submissions={recentSubmissions} />
        </div>
    );
};

/* =======================
   Group Members Section
======================= */

const GroupMembersSection: React.FC<{ members: Member[] }> = ({ members }) => {
    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 3);

    return (
        <section>
            <h2 className="mb-4 font-dm text-xl font-bold text-primary">
                Group Members
            </h2>

            <div className="space-y-3">
                {members.map((member, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-breadcrumb p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                                {getInitials(member.name)}
                            </div>

                            <div>
                                <p className="font-medium text-primary">
                                    {member.name}
                                </p>
                                <p className="text-sm text-alert-default">
                                    {member.student_id}
                                </p>
                                <p className="text-xs text-alert-default">
                                    {member.email}
                                </p>
                            </div>
                        </div>

                        {member.isLeader && <Badge>Leader</Badge>}
                    </div>
                ))}
            </div>
        </section>
    );
};

/* =======================
   Milestone Progress Section
======================= */

const MilestoneProgressSection: React.FC<{
    progressPercentage: number;
    milestones: Milestone[];
}> = ({ progressPercentage, milestones }) => {
    return (
        <section>
            <h2 className="mb-6 font-dm text-xl font-bold text-primary">
                Milestone Progress
            </h2>

            <div className="rounded-lg bg-breadcrumb p-6">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="mb-2 flex justify-between">
                        <p className="font-bold text-primary">Progress</p>
                        <p className="text-sm font-semibold text-primary">
                            {progressPercentage}% Complete
                        </p>
                    </div>

                    <div className="h-3 w-full rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                    {milestones.map((milestone, index, array) => {
                        const BadgeComponent =
                            badgesRegistry[milestone.statusBadge];

                        return (
                            <div key={index} className="flex gap-4">
                                <TimelineState
                                    state="current"
                                    className={
                                        index === array.length - 1
                                            ? '[&_svg]:hidden'
                                            : ''
                                    }
                                />

                                <div className="flex-1 rounded-lg bg-white p-4 shadow-sm">
                                    <div className="flex justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-primary">
                                                {milestone.title}
                                            </p>
                                            <p className="text-sm">
                                                Due: {milestone.due}
                                            </p>
                                            {milestone.submitted && (
                                                <p className="text-sm text-alert-selected">
                                                    Submitted:{' '}
                                                    {milestone.submitted}
                                                </p>
                                            )}
                                        </div>

                                        <BadgeComponent />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

/* =======================
   Recent Submissions 
======================= */

const RecentSubmissionsSection: React.FC<{
    submissions: { filename: string }[];
}> = ({ submissions }) => {
    const DocuIcon = iconRegistry.docuDefault;

    return (
        <section>
            <h2 className="mb-6 font-dm text-xl font-bold text-primary">
                Recent Submissions
            </h2>

            <div className="divide-y divide-border overflow-hidden rounded-lg border border-primary/20">
                {submissions.map((file, index) => (
                    <div
                        key={index}
                        className="group flex cursor-pointer items-center gap-3 border-l-4 border-transparent bg-gray-50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/30"
                    >
                        <DocuIcon className="h-6 w-6 shrink-0 text-primary" />
                        <p className="truncate font-dm font-medium text-primary">
                            {file.filename}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

/* =======================
   Divider
======================= */

const Divider = () => <div className="my-8 h-px w-full bg-primary/20" />;

/* =======================
   Exports
======================= */

export { GroupDetailCard, GroupOverviewCard };
