import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';

// ICONS
import CloseIcon from '@/components/Icons/ic_close-Default.svg';

interface EditDeadlineModalProps {
    onClose: () => void;
    onSave?: (deadline: {
        id: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        description: string;
    }) => void;
    deadline: {
        id: string;
        title: string;
        dateRange: string;
        description: string;
    };
}

export default function EditDeadlineModal({ onClose, onSave, deadline }: EditDeadlineModalProps) {
    const [title, setTitle] = useState<string>(deadline.title);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [description, setDescription] = useState<string>(deadline.description);

    // Parse dateRange to extract start and end dates
    useEffect(() => {
        if (deadline.dateRange) {
            const parts = deadline.dateRange.split(' - ');
            if (parts.length === 2) {
                // Has both start and end date
                const startParsed = new Date(parts[0] + ', ' + new Date().getFullYear());
                const endParsed = new Date(parts[1] + ', ' + new Date().getFullYear());
                if (!isNaN(startParsed.getTime())) setStartDate(startParsed);
                if (!isNaN(endParsed.getTime())) setEndDate(endParsed);
            } else {
                // Single date
                const dateParsed = new Date(deadline.dateRange + ', ' + new Date().getFullYear());
                if (!isNaN(dateParsed.getTime())) {
                    setStartDate(dateParsed);
                    setEndDate(dateParsed);
                }
            }
        }
    }, [deadline.dateRange]);

    const handleSave = () => {
        const updatedDeadline = {
            id: deadline.id,
            title,
            startDate,
            endDate,
            description,
        };

        if (onSave) {
            onSave(updatedDeadline);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
                {/* HEADER */}
                <div className="bg-[#730000] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-xl font-medium">Edit Deadline</h2>
                    <img
                        src={CloseIcon}
                        className="w-5 h-5 cursor-pointer filter brightness-0 invert"
                        onClick={onClose}
                    />
                </div>

                {/* CONTENT */}
                <div className="p-8 space-y-6">
                    {/* Deadline Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Deadline Title</label>
                        <div className="w-full rounded-[8px] border border-gray-200 bg-gray-100 px-[12px] py-[8px] text-[13.33px] font-medium text-gray-500">
                            {title}
                        </div>
                    </div>

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Select Start Date"
                                displayFormat="full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Select End Date"
                                displayFormat="full"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deadline Description"
                            className="w-full min-h-[120px] rounded-[8px] border border-transparent bg-breadcrumb px-[12px] py-[8px] text-[13.33px] font-medium text-[#1a1a1a] outline-none transition-all shadow-xs placeholder:text-[#1a1a1a] placeholder:font-medium hover:border-primary-foreground-2 hover:placeholder:text-primary-foreground-2 focus-visible:border-primary focus-visible:placeholder:text-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                        />
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-200"></div>

                {/* FOOTER */}
                <div className="px-6 py-4 flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="bg-[#730000] text-white hover:bg-[#5a0000] flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
