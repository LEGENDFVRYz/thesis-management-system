import Logo from '@/components/icons/logo';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="w-full lg:flex lg:min-h-svh">
            {/* LEFT PANEL */}
            <div className="hidden flex-col justify-between bg-primary p-8 text-primary-foreground lg:flex dark:border-r max-w-xs w-full lg:flex-none">
                {/* Top PART */}
                <div className="space-y-5">
                    <div className="flex h-12 w-12">
                        <Logo
                            className="h-12 w-12"
                            variant="light"
                        />
                    </div>
                    
                    <h2 className="text-lg font-dm">Thesis Management System</h2>
                    <p className="text-primary-foreground">
                        Your complete solution for managing computer engineering thesis projects
                    </p>
                </div>

                {/* Bot PART */}
                <div className="space-y-4 text-sm font-dm">
                    <div className="flex items-center gap-3">
                        {/* change to correct icon */}
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-foreground-2 text-primary-foreground-2 font-bold">✓</div>
                        <span>Secure & Reliable</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* change to correct icon */}
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-foreground-2 text-primary-foreground-2 font-bold">✓</div>
                        <span>24/7 Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* change to correct icon */}
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-foreground-2 text-primary-foreground-2 font-bold">✓</div>
                        <span>Real-time Updates</span>
                    </div>
                </div>
            </div>


            {/* RIGHT PANEL */}
            <div className="w-full lg:flex-1 flex flex-col min-h-svh bg-background">



            </div>
        </div>
    );
}

