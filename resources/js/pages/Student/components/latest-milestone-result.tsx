{/* React & Core Imports */}
import React from 'react';

{/* UI Components Imports */}
import { badgesRegistry, BadgeName } from '@/components/badges-registry';

{/* TYPE DEFINITIONS */}

{/* Props for the main component */}
interface LatestMilestoneResultProps {
    milestoneType: string; 
    approvalDate: string; 
    status: 'defended' | 'rejected' | 'for_revision';
    message: string; // 
}

{/* Map status to badge name only */}
const statusBadgeMap: Record<string, BadgeName> = {
    defended: 'verdictBadgesApproved',
    rejected: 'verdictBadgesRejected',
    for_revision: 'verdictBadgesForRevision',
};

{/* Main Component */}
export function LatestMilestoneResult({ 
    milestoneType,
    approvalDate,
    status,
    message
}: LatestMilestoneResultProps) {
    const badgeName = statusBadgeMap[status];
    const BadgeComponent = badgesRegistry[badgeName];

    return (
        <div className="bg-[#fdfcf6] rounded-[8px] shadow-[0px_0.5px_1.75px_0px_rgba(0,0,0,0.04),0px_1.85px_6.25px_0px_rgba(0,0,0,0.25)] p-6 space-y-6">
            {/* Header */}
            <h2 className="text-[22.687px] font-bold" style={{ color: 'var(--db-red)' }}>
                Latest Milestone Result
            </h2>

            {/* Main Card */}
            <div 
                className="rounded-[10px] shadow-[0px_0.5px_1.75px_0px_rgba(0,0,0,0.04),0px_1.85px_6.25px_0px_rgba(0,0,0,0.25)] p-4 relative overflow-hidden"
                style={{ backgroundColor: "var(--sidebar-gradient-mid", minHeight: '180px' }}
            >
                {/* Header with Title and Badge */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[22px] font-medium text-white">
                        {milestoneType}
                    </h3>
                    <div className="w-[90px] h-auto">
                        <BadgeComponent />
                    </div>
                </div>

                {/* Approval Date */}
                <p className="text-[16px] font-medium text-white mb-4 ml-3">
                    Approval Date: {approvalDate}
                </p>

                {/* Success Message Container */}
                <div className="bg-[rgba(255,255,255,0.45)] rounded-[10px] px-6 py-3">
                    <p className="text-[16px] font-medium text-white text-center">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}