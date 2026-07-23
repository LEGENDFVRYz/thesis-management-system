import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Users,
    MapPin,
    Clock,
    ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ---------------- TYPES ----------------

interface DefenseRequest {
    defense_matrix_id: number;
    title: string;
    adviser: string;
    authors: string;
    section: string;
    defense_schedule: string;
    venue: string;
}

interface DefenseManagementProps {
    pendingRequests: DefenseRequest[];
    acceptedRequests: DefenseRequest[];
}

// ---------------- COMPONENT ----------------

export default function DefenseManagement({ pendingRequests, acceptedRequests }: DefenseManagementProps) {
    const { flash } = usePage().props as any;

    const respond = (defenseMatrixId: number, isConfirmed: boolean): void => {
        // Use router instead of Inertia for consistency with your reference
        router.patch(`/faculty/management/defense_management/${defenseMatrixId}`, {
            is_confirmed: isConfirmed,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Flash messages handled by provider
            }
        });
    };

    const RequestCard = ({ request, isPending }: { request: DefenseRequest; isPending: boolean }) => (
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                    <div>
                        <h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-2">
                            {request.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {request.authors}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <User className="w-4 h-4 text-primary" />
                            <span><span className="font-medium text-zinc-900 dark:text-zinc-200">Adviser:</span> {request.adviser}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{request.defense_schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{request.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <ClipboardCheck className="w-4 h-4 text-primary" />
                            <span>Section: {request.section}</span>
                        </div>
                    </div>
                </div>

                {isPending && (
                    <div className="flex flex-row md:flex-col gap-2 min-w-[120px]">
                        <Button 
                            onClick={() => respond(request.defense_matrix_id, true)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Accept
                        </Button>
                        <Button 
                            onClick={() => respond(request.defense_matrix_id, false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                            Reject
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Defense Management" />

            <div className="p-6 max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Defense Management</h1>
                            <p className="text-muted-foreground text-sm">Review and respond to panel invitations</p>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> {flash.success}
                    </div>
                )}

                {/* Pending Requests Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        <h2 className="text-lg font-semibold uppercase tracking-wider text-zinc-500">Pending Invitations</h2>
                    </div>
                    
                    {pendingRequests.length === 0 ? (
                        <div className="border-2 border-dashed rounded-xl p-12 text-center text-zinc-500">
                            No pending requests at the moment.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingRequests.map(req => (
                                <RequestCard key={req.defense_matrix_id} request={req} isPending={true} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Accepted Requests Section */}
                <section className="space-y-4 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <h2 className="text-lg font-semibold uppercase tracking-wider text-zinc-500">Scheduled Defenses</h2>
                    </div>

                    {acceptedRequests.length === 0 ? (
                        <div className="border rounded-xl p-8 text-center text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50">
                            No confirmed schedules.
                        </div>
                    ) : (
                        <div className="grid gap-4 opacity-90">
                            {acceptedRequests.map(req => (
                                <RequestCard key={req.defense_matrix_id} request={req} isPending={false} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}