import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/date-picker';

// ICONS
import CloseIcon from '@/components/Icons/ic_close-Default.svg';

interface SubmissionPeriodModalProps {
    period: {
        id: number;
        label: string;
        dateRange: string;
    };
    onClose: () => void;
    onSave?: (updatedPeriod: any) => void;
}

const SUBMISSION_TYPES = [
    'Proposal',
    'Draft Chapter 1',
    'Draft Chapter 2',
    'Draft Chapter 3',
    'Final Manuscript',
    'Revisions',
];

export default function SubmissionPeriodModal({ period, onClose, onSave }: SubmissionPeriodModalProps) {
    const [submissionType, setSubmissionType] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [gracePeriod, setGracePeriod] = useState<string>('');

    const handleSave = () => {
        const updatedPeriod = {
            ...period,
            submissionType,
            startDate,
            endDate,
            gracePeriod: parseInt(gracePeriod) || 0,
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
                    <h2 className="text-xl font-medium">Submission Period</h2>
                    <img
                        src={CloseIcon}
                        className="w-5 h-5 cursor-pointer filter brightness-0 invert"
                        onClick={onClose}
                    />
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-6">
                    {/* Submission Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Submission Type</label>
                        <Select value={submissionType} onValueChange={setSubmissionType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Submission Type" />
                            </SelectTrigger>
                            <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                {SUBMISSION_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Start Date</label>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Edit Date"
                                displayFormat="full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">End Date</label>
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Edit Date"
                                displayFormat="full"
                            />
                        </div>
                    </div>

                    {/* Grace Period */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Grace Period (hours)</label>
                        <Input
                            type="text"
                            value={gracePeriod}
                            onChange={(e) => setGracePeriod(e.target.value)}
                            placeholder="Enter Grace Period Hours"
                            className="w-full"
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
