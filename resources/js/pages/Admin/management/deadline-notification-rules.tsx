import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface NotificationRule {
    id: number;
    label: string;
    notificationNumber: number;
    labelTop: number;
    inputTop: number;
}

const notificationRules: NotificationRule[] = [
    {
        id: 1,
        label: 'Reminder Schedule 1',
        notificationNumber: 1,
        labelTop: 95,
        inputTop: 120,
    },
    {
        id: 2,
        label: 'Reminder Schedule 2',
        notificationNumber: 1,
        labelTop: 190,
        inputTop: 215,
    },
    {
        id: 3,
        label: 'Reminder Schedule 3',
        notificationNumber: 1,
        labelTop: 285,
        inputTop: 310,
    },
];

const intervalOptions = [
    { value: 'days', label: 'days before' },
    { value: 'hours', label: 'hours before' },
    { value: 'minutes', label: 'minutes before' },
];

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M26.25 12.0833C26.25 9.65054 25.2835 7.31734 23.5644 5.59823C21.8453 3.87911 19.5121 2.91252 17.0833 2.91252C14.6546 2.91252 12.3214 3.87911 10.6023 5.59823C8.88318 7.31734 7.91659 9.65054 7.91659 12.0833C7.91659 22.5416 3.64575 25.375 3.64575 25.375H30.5208C30.5208 25.375 26.25 22.5416 26.25 12.0833Z" stroke="#730000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.5283 31.0833C19.2848 31.5015 18.9333 31.8465 18.5099 32.0835C18.0865 32.3206 17.6062 32.4417 17.1178 32.4344C16.6294 32.4271 16.153 32.2916 15.7367 32.0421C15.3204 31.7926 14.9788 31.4378 14.7466 31.0125" stroke="#730000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export function DeadlineNotificationRules() {
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
                <BellIcon />
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
                Notification Rules
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

            {/* Notification Rules */}
            {notificationRules.map((rule) => (
                <div key={rule.id}>
                    {/* Label */}
                    <div
                        className="absolute text-[#1A1A1A] font-['DM_Sans'] text-base font-medium flex items-center"
                        style={{
                            left: '24px',
                            top: `${rule.labelTop}px`,
                            width: '387px',
                            height: '20px',
                        }}
                    >
                        {rule.label}
                    </div>

                    {/* Input Container */}
                    <div
                        className="absolute flex items-center gap-3"
                        style={{
                            left: '24px',
                            top: `${rule.inputTop}px`,
                            width: '387px',
                            height: '40px',
                        }}
                    >
                        {/* Set Reminder Input */}
                        <input
                            type="text"
                            placeholder={`Set Notif Reminder #${rule.notificationNumber}`}
                            className="rounded-md border-2 border-[#730000] bg-[#F5DD93] font-['DM_Sans'] text-[#730000] placeholder:text-[#730000]"
                            style={{
                                width: '188px',
                                height: '40px',
                                padding: '4px 12px',
                            }}
                        />

                        {/* Choose Interval Dropdown */}
                        <Select>
                            <SelectTrigger
                                className="w-[170px] border-2 border-[#730000] bg-[#F5DD93] hover:bg-[#F5DD93]/80 font-['DM_Sans'] text-[#730000]"
                                style={{
                                    height: '40px',
                                    padding: '5px 10px',
                                }}
                            >
                                <SelectValue placeholder="Choose interval" />
                            </SelectTrigger>
                            <SelectContent className="w-[170px]">
                                {intervalOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
