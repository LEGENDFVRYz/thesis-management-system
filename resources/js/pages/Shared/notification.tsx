import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

export default function Notification() {
    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                            <PlaceholderPattern
                                title="Notifications Page"
                                description="This is the notifications page"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
