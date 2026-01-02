import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';

// ICONS
import CloseIcon from '@/components/Icons/ic_close-Default.svg';

interface DefensePeriodModalProps {
    period: {
        id: number;
        label: string;
        dateRange: string;
    };
    onClose: () => void;
    onSave?: (updatedPeriod: any) => void;
}

export default function DefensePeriodModal({ period, onClose, onSave }: DefensePeriodModalProps) {
    const [periodStart, setPeriodStart] = useState<Date | undefined>(undefined);
    const [periodEnd, setPeriodEnd] = useState<Date | undefined>(undefined);
    const [panelDeadline, setPanelDeadline] = useState<Date | undefined>(undefined);
    const [resultDeadline, setResultDeadline] = useState<Date | undefined>(undefined);

    const handleSave = () => {
        const updatedPeriod = {
            ...period,
            periodStart,
            periodEnd,
            panelDeadline,
            resultDeadline,
        };

        if (onSave) {
            onSave(updatedPeriod);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
                {/* HEADER */}
                <div className="bg-[#730000] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-xl font-medium">Defense Period</h2>
                    <img
                        src={CloseIcon}
                        className="w-5 h-5 cursor-pointer filter brightness-0 invert"
                        onClick={onClose}
                    />
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-6">
                    {/* Period Start and End */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Period Start</label>
                            <DatePicker
                                value={periodStart}
                                onChange={setPeriodStart}
                                placeholder="Edit Date"
                                displayFormat="full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Period End</label>
                            <DatePicker
                                value={periodEnd}
                                onChange={setPeriodEnd}
                                placeholder="Edit Date"
                                displayFormat="full"
                            />
                        </div>
                    </div>

                    {/* Panel Assignment Deadline */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Panel Assignment Deadline</label>
                        <DatePicker
                            value={panelDeadline}
                            onChange={setPanelDeadline}
                            placeholder="Edit Date"
                            displayFormat="full"
                        />
                    </div>

                    {/* Result Submission Deadline */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Result Submission Deadline</label>
                        <DatePicker
                            value={resultDeadline}
                            onChange={setResultDeadline}
                            placeholder="Edit Date"
                            displayFormat="full"
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
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
