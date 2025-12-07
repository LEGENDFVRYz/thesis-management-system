import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    GraduationCap,
    NotebookPen,
    Users,
    Settings,
    Calendar,
    Book,
    BookCopy,
} from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const quickMenuItems = [
    { icon: Users,    label: 'User Management'   },
    { icon: Settings, label: 'System Management' },
    { icon: Calendar, label: 'Defense'           },
    { icon: Book,     label: 'Repository'        },
    { icon: BookCopy, label: 'Resources'         },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                <div className="min-h-screen bg-white p-8">

                    {/* HEADER SECTION */}
                    <div className="flex items-center justify-between ">
                        <div>
                            <h1 className={`text-[42px] font-bold leading-tight text-primary`}>
                                Welcome back, Engr. Dela Cruz
                            </h1>
                            <p className="mt-1 text-lg text-gray-700">
                                Department of Computer Engineering | Department Head
                            </p>
                        </div>

                        {/* Right Side - Insiights */}
                        <div className="flex gap-x-10">

                            <div className="flex items-start gap-3">
                                <CalendarDays className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        TODAY
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        December 3, 2025
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <GraduationCap className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        SCHOOL YEAR
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        2025-2026
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <NotebookPen className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        CURRENT SEM
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        Second Sem
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* QUICK MENU */}
                    <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-accent py-12 px-4">
                        <div className="flex justify-evenly items-center">

                            {quickMenuItems.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-4">
                                    {/* ICON PART */}
                                    <div
                                        className={`flex h-28 w-28 items-center justify-center rounded-full border-[3px] bg-accent border-ring`}
                                    >
                                        <item.icon 
                                            className={`h-12 w-12 text-accent-foreground`} 
                                            strokeWidth={2} 
                                        />
                                    </div>

                                    {/* LABEL PART */}
                                    <span className={`font-bold text-accent-foreground`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

// Helper for the top right info items (Date, Year, Sem)
function HeaderInfoItem({ icon: Icon, label, valueFirst }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className={`h-8 w-8 text-primary`} strokeWidth={1.5} />
            <div>
                <p className={`text-xs font-bold uppercase tracking-wide text-primary`}>
                    {label}
                </p>
                <p className="font-bold text-gray-800">{valueFirst}</p>
            </div>
        </div>
    );
}