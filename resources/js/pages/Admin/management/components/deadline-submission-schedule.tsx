import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SubmissionPeriodModal from '././deadline-submission-period-modal';

interface ScheduleItem {
    id: number;
    label: string;
    dateRange: string;
    labelTop: number;
    inputTop: number;
    submissionType?: string;
    startDate?: Date;
    endDate?: Date;
    gracePeriod?: number;
}

const INITIAL_SCHEDULE_ITEMS: ScheduleItem[] = [
    {
        id: 1,
        label: 'Methods of Research Submission Period',
        dateRange: 'January 1 - January 15',
        labelTop: 95,
        inputTop: 120,
    },
    {
        id: 2,
        label: 'Design Project 1 Submission Period',
        dateRange: 'January 1 - January 15',
        labelTop: 190,
        inputTop: 215,
    },
    {
        id: 3,
        label: 'Design Project 2 Submission Period',
        dateRange: 'January 1 - January 15',
        labelTop: 285,
        inputTop: 310,
    },
];

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M19.3947 4.59082L31.986 26.3987C32.178 26.7313 32.2791 27.1085 32.2791 27.4925C32.2791 27.8765 32.178 28.2537 31.986 28.5862C31.794 28.9188 31.5179 29.1949 31.1854 29.3869C30.8528 29.5789 30.4756 29.68 30.0916 29.68H4.90912C4.52514 29.68 4.14793 29.5789 3.81539 29.3869C3.48286 29.1949 3.20672 28.9188 3.01474 28.5862C2.82275 28.2537 2.72168 27.8765 2.72168 27.4925C2.72168 27.1085 2.82276 26.7313 3.01475 26.3987L15.606 4.59082C16.4475 3.13249 18.5518 3.13249 19.3947 4.59082ZM17.5004 7.1429L6.17204 26.7633H28.8287L17.5004 7.1429ZM17.5004 21.875C17.8871 21.875 18.2581 22.0286 18.5316 22.3021C18.8051 22.5756 18.9587 22.9465 18.9587 23.3333C18.9587 23.7201 18.8051 24.091 18.5316 24.3645C18.2581 24.638 17.8871 24.7917 17.5004 24.7917C17.1136 24.7917 16.7427 24.638 16.4692 24.3645C16.1957 24.091 16.042 23.7201 16.042 23.3333C16.042 22.9465 16.1957 22.5756 16.4692 22.3021C16.7427 22.0286 17.1136 21.875 17.5004 21.875ZM17.5004 11.6667C17.8871 11.6667 18.2581 11.8203 18.5316 12.0938C18.8051 12.3673 18.9587 12.7382 18.9587 13.125V18.9583C18.9587 19.3451 18.8051 19.716 18.5316 19.9895C18.2581 20.263 17.8871 20.4167 17.5004 20.4167C17.1136 20.4167 16.7427 20.263 16.4692 19.9895C16.1957 19.716 16.042 19.3451 16.042 18.9583V13.125C16.042 12.7382 16.1957 12.3673 16.4692 12.0938C16.7427 11.8203 17.1136 11.6667 17.5004 11.6667Z" fill="#730000"/>
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M17.4167 3.66634H4.58333C3.66286 3.66634 2.91667 4.41253 2.91667 5.33301V18.1663C2.91667 19.0868 3.66286 19.833 4.58333 19.833H17.4167C18.3371 19.833 19.0833 19.0868 19.0833 18.1663V5.33301C19.0833 4.41253 18.3371 3.66634 17.4167 3.66634Z" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5833 2V5.33333" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.41667 2V5.33333" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.91667 8.66699H19.0833" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M10.0833 3.66699H3.66667C3.22464 3.66699 2.80072 3.8426 2.48816 4.15516C2.17559 4.46773 2 4.89165 2 5.33366V18.167C2 18.609 2.17559 19.0329 2.48816 19.3455C2.80072 19.6581 3.22464 19.8337 3.66667 19.8337H16.5C16.942 19.8337 17.3659 19.6581 17.6785 19.3455C17.9911 19.0329 18.1667 18.609 18.1667 18.167V11.7503" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.7917 2.29199C17.1213 1.96236 17.5666 1.77832 18.0313 1.77832C18.4959 1.77832 18.9412 1.96236 19.2708 2.29199C19.6005 2.62162 19.7845 3.06696 19.7845 3.53158C19.7845 3.9962 19.6005 4.44154 19.2708 4.77116L10.9167 13.1253L7.33333 14.0003L8.20833 10.417L16.7917 2.29199Z" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export function DeadlineSubmissionSchedule() {
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(INITIAL_SCHEDULE_ITEMS);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<ScheduleItem | null>(null);

    const handleEditClick = (item: ScheduleItem) => {
        setSelectedPeriod(item);
        setModalOpen(true);
    };

    const formatDateRange = (start?: Date, end?: Date) => {
        if (!start || !end) return 'Not set';
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}`;
    };

    const handleSave = (updatedPeriod: any) => {
        setScheduleItems(prev => prev.map(item =>
            item.id === updatedPeriod.id
                ? {
                    ...item,
                    submissionType: updatedPeriod.submissionType,
                    startDate: updatedPeriod.startDate,
                    endDate: updatedPeriod.endDate,
                    gracePeriod: updatedPeriod.gracePeriod,
                    dateRange: formatDateRange(updatedPeriod.startDate, updatedPeriod.endDate)
                }
                : item
        ));
    };

    return (
        <>
        <div
            className="relative rounded-lg border border-[#730000]/26 bg-[#FDFCF6]"
            style={{
                width: '437px',
                height: '446px',
                boxShadow: '0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)',
            }}
        >
            {/* Icon */}
            <div className="absolute" style={{ left: '24px', top: '24px', width: '35px', height: '35px' }}>
                <AlertTriangleIcon />
            </div>

            {/* Title */}
            <div
                className="absolute text-[#730000] font-['DM_Sans'] text-xl font-bold"
                style={{
                    left: '66px',
                    top: '30px',
                    width: '347px',
                    height: '23px',
                }}
            >
                Submission Schedule Overview
            </div>

            {/* Divider after header */}
            <div
                className="absolute bg-[rgba(115,0,0,0.3)] h-px shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)]"
                style={{
                    left: '25px',
                    top: '76.5px',
                    width: '380px',
                }}
            />

            {/* Schedule Items */}
            {scheduleItems.map((item) => (
                <div key={item.id}>
                    {/* Label */}
                    <div
                        className="absolute text-[#1A1A1A] font-['DM_Sans'] text-base font-medium flex items-center"
                        style={{
                            left: '24px',
                            top: `${item.labelTop}px`,
                            width: '387px',
                            height: '20px',
                        }}
                    >
                        {item.label}
                    </div>

                    {/* Input Container */}
                    <div
                        className="absolute rounded-lg border border-[#730000] bg-white flex items-center"
                        style={{
                            left: '24px',
                            top: `${item.inputTop}px`,
                            width: '387px',
                            height: '35px',
                            padding: '0 20px',
                        }}
                    >
                        {/* Calendar Icon */}
                        <div className="flex items-center justify-center" style={{ width: '22px', height: '22px' }}>
                            <CalendarIcon />
                        </div>

                        {/* Date Text */}
                        <div
                            className="text-[#730000] font-['DM_Sans'] text-base font-medium flex items-center"
                            style={{
                                marginLeft: '10px',
                                flex: 1,
                            }}
                        >
                            {item.dateRange}
                        </div>

                        {/* Edit Icon */}
                        <button
                            className="text-[#730000] hover:text-[#730000]/70 transition-colors flex items-center justify-center"
                            style={{ width: '22px', height: '22px' }}
                            onClick={() => handleEditClick(item)}
                        >
                            <EditIcon />
                        </button>
                    </div>
                </div>
            ))}

            {/* Divider before save button */}
            <div
                className="absolute bg-[rgba(115,0,0,0.3)] h-px shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)]"
                style={{
                    left: '25px',
                    top: '366.5px',
                    width: '380px',
                }}
            />

            {/* Save Button */}
            <div className="absolute" style={{ right: '25px', bottom: '25px' }}>
                <Button
                    variant="negative"
                    className="gap-2 font-['DM_Sans']"
                >
                    <Save className="w-4 h-4" />
                    Save
                </Button>
            </div>
        </div>

        {/* Submission Period Modal */}
        {modalOpen && selectedPeriod && (
            <SubmissionPeriodModal
                period={selectedPeriod}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
        )}
        </>
    );
}
