import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleItem {
    id: number;
    label: string;
    dateRange: string;
    labelTop: number;
    inputTop: number;
}

const scheduleItems: ScheduleItem[] = [
    {
        id: 1,
        label: 'Methods of Research Defense Period',
        dateRange: 'January 1 - January 15',
        labelTop: 95,
        inputTop: 120,
    },
    {
        id: 2,
        label: 'Design Project 1 Defense Period',
        dateRange: 'January 1 - January 15',
        labelTop: 190,
        inputTop: 215,
    },
    {
        id: 3,
        label: 'Design Project 2 Defense Period',
        dateRange: 'January 1 - January 15',
        labelTop: 285,
        inputTop: 310,
    },
];

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M17.4167 3.66634H4.58333C3.66286 3.66634 2.91667 4.41253 2.91667 5.33301V18.1663C2.91667 19.0868 3.66286 19.833 4.58333 19.833H17.4167C18.3371 19.833 19.0833 19.0868 19.0833 18.1663V5.33301C19.0833 4.41253 18.3371 3.66634 17.4167 3.66634Z" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5833 2V5.33333" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.41667 2V5.33333" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.91667 8.66699H19.0833" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CalendarIconHeader = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M27.2708 5.83301H7.29167C6.04497 5.83301 5.03125 6.84673 5.03125 8.09342V28.0726C5.03125 29.3193 6.04497 30.333 7.29167 30.333H27.2708C28.5175 30.333 29.5312 29.3193 29.5312 28.0726V8.09342C29.5312 6.84673 28.5175 5.83301 27.2708 5.83301Z" stroke="#730000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24.8698 3.16699V8.49366" stroke="#730000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.69271 3.16699V8.49366" stroke="#730000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.03125 13.8203H29.5312" stroke="#730000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M10.0833 3.66699H3.66667C3.22464 3.66699 2.80072 3.8426 2.48816 4.15516C2.17559 4.46773 2 4.89165 2 5.33366V18.167C2 18.609 2.17559 19.0329 2.48816 19.3455C2.80072 19.6581 3.22464 19.8337 3.66667 19.8337H16.5C16.942 19.8337 17.3659 19.6581 17.6785 19.3455C17.9911 19.0329 18.1667 18.609 18.1667 18.167V11.7503" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.7917 2.29199C17.1213 1.96236 17.5666 1.77832 18.0313 1.77832C18.4959 1.77832 18.9412 1.96236 19.2708 2.29199C19.6005 2.62162 19.7845 3.06696 19.7845 3.53158C19.7845 3.9962 19.6005 4.44154 19.2708 4.77116L10.9167 13.1253L7.33333 14.0003L8.20833 10.417L16.7917 2.29199Z" stroke="#730000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export function DeadlineDefenseSchedule() {
    return (
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
                <CalendarIconHeader />
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
                Defense Schedule Overview
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
    );
}
