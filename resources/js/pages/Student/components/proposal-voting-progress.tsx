{/* React & Core Imports */}
import React from 'react';

import { CheckCircle2 } from 'lucide-react';

{/* TYPE DEFINITIONS */}

{/* Props for the main component */}
interface ProposalVotingProgressProps {
    approved: number;
    rejected: number;
    pending: number;
    totalCommittees: number;
    majorityReached?: boolean;
}

{/* Props for status card */}
interface StatusCardProps {
    count: number;
    label: string;
    colorVar: string;
}

{/* Status Card Component */}
function StatusCard({ count, label, colorVar }: StatusCardProps) {
    return (
        <div className="bg-white relative rounded-[5px] w-[150px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-center justify-center px-[14px] py-[20px]">
                <p 
                    className="text-[24px] font-bold mb-1"
                    style={{ color: `var(${colorVar})` }}
                >
                    {count}
                </p>
                <p 
                    className="text-[16px] font-medium"
                    style={{ color: `var(${colorVar})` }}
                >
                    {label}
                </p>
            </div>
            <div 
                className="absolute inset-0 pointer-events-none rounded-[5px]"
                style={{ 
                    border: `1px solid var(${colorVar})`,
                    borderTop: `8px solid var(${colorVar})`
                }}
            />
        </div>
    );
}

{/* Progress Bar Component */}
function ProgressBar({ approved, rejected, pending, totalCommittees }: { approved: number; rejected: number; pending: number; totalCommittees: number }) {
    const majority = Math.ceil(totalCommittees / 2);
    const approvedPercentage = (approved / totalCommittees) * 100;
    const rejectedPercentage = (rejected / totalCommittees) * 100;
    const pendingPercentage = (pending / totalCommittees) * 100;

    return (
        <div className="relative w-full">
            <p className="text-[15px] font-medium mb-2" style={{ color: 'var(--db-red)' }}>
                Progress to Majority ({majority} Approving Committees)
            </p>
            <div className="relative h-[30px] rounded-[10px] overflow-hidden flex" style={{ backgroundColor: 'var(--db-light-gray)' }}>
                {/* Green portion (approved) */}
                <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                        width: `${approvedPercentage}%`,
                        backgroundColor: 'var(--db-green)'
                    }}
                />
                {/* Red portion (rejected) */}
                <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                        width: `${rejectedPercentage}%`,
                        backgroundColor: 'var(--db-red)'
                    }}
                />
                {/* Gray portion (pending) - background already shows this */}
            </div>
        </div>
    );
}

{/* Success Message Component */}
function SuccessMessage() {
    return (
        <div 
            className="border rounded-[8px] p-4" 
            style={{ 
                backgroundColor: 'var(--db-light-green)', 
                borderColor: 'var(--db-green)' 
            }}
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <CheckCircle2 
                        className="w-[40px] h-[40px]" 
                        style={{ color: 'var(--db-green)' }}
                        strokeWidth={1.5}
                    />
                </div>
                <p className="text-[15px] font-medium" style={{ color: 'var(--db-green)' }}>
                    Majority achieved! Your proposal has been approved by the committee.
                </p>
            </div>
        </div>
    );
}

{/* Main Component */}
export function ProposalVotingProgress({ 
    approved, 
    rejected, 
    pending, 
    totalCommittees,
    majorityReached = false 
}: ProposalVotingProgressProps) {
    const majority = Math.ceil(totalCommittees / 2);
    const isMajorityReached = approved >= majority || majorityReached;

    return (
        <div 
            className="bg-[#fdfcf6] rounded-[8px] shadow-[0px_0.5px_1.75px_0px_rgba(0,0,0,0.04),0px_1.85px_6.25px_0px_rgba(0,0,0,0.25)] p-6 space-y-6"
            style={{ width: "617px", maxWidth: "100%" }}>
            {/* Title */}
            <h2 className="text-[22.687px] font-bold" style={{ color: 'var(--db-red)' }}>
                Proposal Voting Progress
            </h2>

            {/* Status Cards */}
            <div className="flex gap-[30px] items-center justify-center">
                <StatusCard count={approved} label="Approved" colorVar="--db-green" />
                <StatusCard count={rejected} label="Rejected" colorVar="--db-red" />
                <StatusCard count={pending} label="Pending" colorVar="--db-gray" />
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
                <ProgressBar 
                    approved={approved} 
                    rejected={rejected}
                    pending={pending}
                    totalCommittees={totalCommittees} 
                />
            </div>
            {/* Success Message */}
            {isMajorityReached && (
                <div className="mt-4">
                    <SuccessMessage />
                </div>
            )}
        </div>
    );
}