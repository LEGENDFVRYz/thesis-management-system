import Logo from '@/components/icons/logo';
import CheckCircle from '@/components/icons/check-circle';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    canResetPassword?: boolean; 
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    canResetPassword = true,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    const { url } = usePage(); // current URL

    return (
        <div className="relative min-h-dvh flex flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:flex-row lg:items-stretch bg-gradient-to-b from-breadcrumb via-white via-50% to-breadcrumb">

            {/* LEFT PANEL */}
            <div className="relative hidden min-h-screen flex-none flex-col items-start justify-between bg-gradient-to-b from-[#730000] via-[#9b000a] via-50% to-[#730000] pb-8 pl-8 pr-0 pt-8 lg:flex lg:w-80 text-white">
                {/* Top PART */}
                <div className="space-y-5">
                    <div className="flex h-[77px] w-[50px]">
                        <Logo
                            className="h-[77px] w-[50px]"
                            variant="light"
                        />
                    </div>
                    
                    <div className="h-[30px] relative shrink-0 w-[256px]">
                        <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[normal] text-[19.2px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
                            Thesis Management System
                        </p>
                    </div>

                    <div className="h-[72px] relative shrink-0 w-full">
                        <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[normal] text-[16px] text-white w-[256px]" style={{ fontVariationSettings: "'opsz' 14" }}>
                            Your complete solution for managing computer engineering thesis projects
                        </p>
                    </div>
                </div>

                {/* Bot PART */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="shrink-0" />
                        <span className="font-['DM_Sans:Medium',sans-serif] font-medium text-[16px] text-white" style={{ fontVariationSettings: "'opsz' 14" }}>Secure & Reliable</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="shrink-0" />
                        <span className="font-['DM_Sans:Medium',sans-serif] font-medium text-[16px] text-white" style={{ fontVariationSettings: "'opsz' 14" }}>24/7 Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="shrink-0" />
                        <span className="font-['DM_Sans:Medium',sans-serif] font-medium text-[16px] text-white" style={{ fontVariationSettings: "'opsz' 14" }}>Real-time Updates</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-12 lg:py-16 gap-8 md:gap-12 lg:gap-16 px-4">
                {/* HEADER SECTION */}
                <div className="flex flex-col items-center justify-center px-4">
                    <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                        <div className="mb-1 flex h-[60px] w-[60px] md:h-[70px] md:w-[70px] lg:h-[80px] lg:w-[80px] items-center justify-center rounded-full bg-primary/10">
                            <Logo
                                className="h-[60px] w-[60px] md:h-[70px] md:w-[70px] lg:h-[80px] lg:w-[80px]"
                                variant="dark"
                            />
                        </div>
                    </Link>
                    <div className="mt-4 text-center max-w-md px-4">
                        <h1 className="font-['DM_Sans:Medium',sans-serif] text-lg md:text-xl lg:text-[22.62px] font-medium text-[#1a1a1a]">
                            Computer Engineering Thesis Portal
                        </h1>
                        <p className="font-['DM_Sans:Medium',sans-serif] text-base md:text-lg lg:text-[19.2px] text-[#5a5a5a] mt-2">
                            Good day! Please pick your role destination below.
                        </p>
                    </div>
                </div>


                {/* CONTENT SECTION */}
                <div className="flex items-center justify-center w-full px-4 sm:px-6">
                    {/* Form Render */}
                    <div className="w-full max-w-[448px]">
                        <div className="flex flex-col items-start gap-[24px] bg-white rounded-[14px] border-[0.8px] border-[rgba(115,0,0,0.15)] shadow-sm p-[0.8px]">
                            {/* Card Header */}
                            <div className="pt-[24px] px-4 sm:px-[24px] pb-0 w-full">
                                <div className="flex flex-col gap-[10px] items-center text-center">
                                    <h1 className="font-['DM_Sans:Medium',sans-serif] text-xl sm:text-[22.62px] font-medium text-[#1a1a1a]">{title}</h1>
                                    <p className="font-['DM_Sans:Medium',sans-serif] text-sm sm:text-[16px] text-[#5a5a5a]">{description}</p>
                                </div>
                            </div>

                            {/* Card Content - the form */}
                            <div className="px-4 sm:px-[24px] w-full">
                                {children}
                            </div>

                            {/* Card Footer - Forgot Password Link */}
                            {canResetPassword && (
                                <div className="flex flex-col justify-center items-center min-h-[44px] px-4 sm:px-8 md:px-16 lg:px-[104px] pb-[24px] pt-0 gap-[10px] self-stretch w-full">
                                    <Link
                                        href="/password/request"
                                        className="text-[#730000] text-[13.33px] font-['DM_Sans'] font-medium hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER SECTION */}
                <div className="w-full flex justify-center px-4 sm:px-6 mt-12 md:mt-16 lg:mt-20">
                    <p className="text-sm sm:text-[16px] text-[#5a5a5a] text-center font-['DM_Sans:Medium',sans-serif] font-medium px-4 sm:px-6 md:px-8" style={{ fontVariationSettings: "'opsz' 14" }}>
                        By using this service, you understood and agree to the PUP Online Services <a href="https://www.pup.edu.ph/terms/" target="_blank" rel="noopener noreferrer" className="text-[#730000] underline hover:text-[#730000]/80">Terms of Use</a> and <a href="https://www.pup.edu.ph/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#730000] underline hover:text-[#730000]/80">Privacy Statement</a>.
                    </p>
                </div>
            </div>

        </div>
    );
}