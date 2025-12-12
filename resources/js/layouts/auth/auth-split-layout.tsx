import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { login as facultyLogin } from '@/routes/faculty';
import { login as studentLogin } from '@/routes/student';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { isSameUrl } from '@/lib/utils';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    const { url } = usePage(); // current URL

    return (
        <div className="relative h-dvh flex flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:flex-row">

            {/* LEFT PANEL */}
            <div className="relative hidden h-full flex-none flex-col justify-between bg-primary p-8 text-primary-foreground lg:flex dark:border-r max-w-xs w-full">
                {/* Top PART */}
                <div className="space-y-5">
                    <div className="flex h-12 w-12">
                        <AppLogoIcon
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
            <div className="w-full max-h-240 gap-5 flex-1 lg:p-8 flex flex-col justify-between">
                {/* HEADER SECTION */}
                <div className="flex flex-col items-center justify-center pb-15">
                    <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <AppLogoIcon
                                className="h-14 w-14"
                                variant="dark"
                            />
                        </div>
                    </Link>
                    <div className="mt-4 text-center">
                        <h1 className="text-xl font-bold text-primary">Computer Engineering Thesis Portal</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Good day! Please pick your role destination below.
                        </p>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6">
                    
                    {/* Role Selection */}
                    <div className="w-full max-w-sm flex justify-around md:flex-col gap-4">
                        <Link 
                            href={studentLogin()}
                            className={`
                                flex flex-col items-start gap-4 rounded-xl border p-4 text-left hover:border-primary hover:bg-muted/50 transition-colors
                                ${isSameUrl(url, studentLogin()) ? 'border-primary' : '' }
                            `}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-5 2.5"/><path d="M7 13.5V22l5 2 5-2v-8.5"/></svg>
                            </div>
                            <div className="hidden md:block">
                                <div className="font-semibold">For Students</div>
                                <div className="text-xs text-muted-foreground">Submit and track your thesis progress</div>
                            </div>
                        </Link>
                        
                        <Link 
                            href={facultyLogin()}
                            className={`
                                flex flex-col items-start gap-4 rounded-xl border p-4 text-left hover:border-primary hover:bg-muted/50 transition-colors
                                ${isSameUrl(url, facultyLogin()) ? 'border-primary' : '' }
                            `}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <div className="hidden md:block">
                                <div className="font-semibold">For Faculty</div>
                                <div className="text-xs text-muted-foreground">Manage and track thesis progress</div>
                            </div>
                        </Link>

                        {/* <button className="flex flex-col items-start gap-4 rounded-xl border p-4 text-left hover:border-primary hover:bg-muted/50 transition-colors">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                            </div>
                            <div className="hidden md:block">
                                <div className="font-semibold">For Admin</div>
                                <div className="text-xs text-muted-foreground">Manage faculties, students, and thesis</div>
                            </div>
                        </button> */}
                    </div>

                    {/* Form Render */}
                    <div className="w-full max-w-sm">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                            <div className="flex flex-col items-start gap-2 text-left">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>

                {/* FOOTER SECTION */}
                <div className="py-6 px-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        By using this service, you understood and agree to the PUP Online Services <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Use</a> and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Statement</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
