import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeadlineTimeline, { DeadlineEvent } from './deadline-timeline';
import { useState } from 'react';
import NewDeadlineModal from './deadline-new-modal';
import EditDeadlineModal from './deadline-edit-modal';

export function DeadlineTimelineView() {
    const [newModalOpen, setNewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedDeadline, setSelectedDeadline] = useState<DeadlineEvent | null>(null);

    const handleSave = (deadline: {
        title: string;
        startDate?: Date;
        endDate?: Date;
        description: string;
    }) => {
        console.log('New deadline created:', deadline);
        // TODO: Add deadline to timeline/state management
    };

    const handleEdit = (event: DeadlineEvent) => {
        setSelectedDeadline(event);
        setEditModalOpen(true);
    };

    const handleEditSave = (deadline: {
        id: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        description: string;
    }) => {
        console.log('Deadline updated:', deadline);
        // TODO: Update deadline in backend/state management
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
                <Button
                    variant="negative"
                    size="sm"
                    className="gap-2 font-['DM_Sans']"
                    onClick={() => setNewModalOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    New Deadline
                </Button>
            </div>

            {/* Deadline Timeline with Edit support */}
            <DeadlineTimeline onEdit={handleEdit} />
        </div>

        {/* New Deadline Modal */}
        {newModalOpen && (
            <NewDeadlineModal
                onClose={() => setNewModalOpen(false)}
                onSave={handleSave}
            />
        )}

        {/* Edit Deadline Modal */}
        {editModalOpen && selectedDeadline && (
            <EditDeadlineModal
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedDeadline(null);
                }}
                onSave={handleEditSave}
                deadline={{
                    id: selectedDeadline.id,
                    title: selectedDeadline.title,
                    dateRange: selectedDeadline.dateRange,
                    description: selectedDeadline.description,
                }}
            />
        )}
        </>
    );
}
