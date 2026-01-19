{/* React & Core Imports */}
import React from 'react';

{/* Icons Imports */}
import { AlertCircle } from 'lucide-react';

{/* TYPE DEFINITIONS */}

{/* Props for individual action item */}
interface ActionItem {
    id: number;
    title: string;
    dueDate: string;
    details: string;
}

{/* Props for the main component */}
interface NextActionRequiredProps {
    actions: ActionItem[];
}

{/* Props for action item card */}
interface ActionItemCardProps {
    item: ActionItem;
}

{/* Action Item Card Component */}
function ActionItemCard({ item }: ActionItemCardProps) {
    return (
        <div className="bg-white w-full relative shadow-[0px_0.5px_1.75px_0px_rgba(0,0,0,0.04),0px_1.85px_6.25px_0px_rgba(0,0,0,0.25)] rounded-[5px]">
            <div className="flex items-center gap-[7px] px-[27px] py-[19px]">
                {/* Alert Icon Container */}
                <div className="bg-[#ffe2e2] flex items-center justify-center rounded-[10px] shrink-0 size-[35px]">
                    <AlertCircle 
                        className="w-[16px] h-[16px]"
                        style={{ color:  'var(--db-red)' }}
                        strokeWidth={2}
                    />
                </div>
                
                {/* Text Content */}
                <div className="font-medium flex-1">
                    <p className="text-[16px] mb-1" style={{ color: 'var(--db-red)' }}>
                        {item.title}
                    </p>
                    <p className="text-[15px]" style={{ color: 'var(--db-gray)' }}>
                        Due: {item.dueDate} • {item.details}
                    </p>
                </div>
            </div>
            
            {/* Left Border Accent */}
            <div 
                className="absolute border-l-[5px] border-solid inset-0 pointer-events-none rounded-[inherit]"
                style={{ borderColor:  'var(--db-red)' }}
            />
        </div>
    );
}

{/* Main Component */}
export function NextActionRequired({ actions }: NextActionRequiredProps) {
    return (
        <div className="bg-[#fdfcf6] rounded-[8px] shadow-[0px_0.5px_1.75px_0px_rgba(0,0,0,0.04),0px_1.85px_6.25px_0px_rgba(0,0,0,0.25)]">
            {/* Header */}
            <div className="px-[27px] pt-[25px] pb-[15px]">
                <h2 className="text-[22.687px] font-bold" style={{ color: 'var(--db-red)' }}>
                    Next Action Required
                </h2>
            </div>

            {/* Action Items List */}
            <div className="px-[27px] pb-[15px] space-y-[15px] max-h-[400px] overflow-y-auto">
                {actions.map((item) => (
                    <ActionItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}