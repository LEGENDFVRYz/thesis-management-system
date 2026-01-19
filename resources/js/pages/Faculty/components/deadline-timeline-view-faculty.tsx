import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Timeline from '@/components/timeline';
import { useState } from 'react';

export function DeadlineTimelineView() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleSave = (deadline: {
        title: string;
        startDate?: Date;
        endDate?: Date;
        description: string;
    }) => {
        console.log('New deadline created:', deadline);
    };

    return (
        <>
        <div className="bg-[#FDFCF6] rounded-lg border border-[#730000]/20 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#730000]" />
                    <h2 className="text-xl font-bold text-[#730000] font-['DM_Sans']">
                        Deadline Timeline View
                    </h2>
                </div>
            </div>

            {/* Use existing Timeline component */}
            <Timeline />
        </div>
        </>
    );
}
