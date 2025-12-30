import { Menu } from 'lucide-react';
import Logo from '@/components/icons/logo';

export default function FAQNavbar() {
    return (
        <div className="bg-primary">
            {/* Top Bar */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Left: Logo and Title */}
                <div className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Logo className="w-10 h-10" variant="light" />
                    </div>

                    {/* Title and Subtitle */}
                    <div>
                        <h1 className="text-primary-foreground-2 font-bold text-lg sm:text-xl leading-tight">
                            Thesis Management System
                        </h1>
                        <p className="text-white text-xs sm:text-sm">
                            Department of Computer Engineering
                        </p>
                    </div>
                </div>

                {/* Right: Menu Icon */}
                <button
                    type="button"
                    className="text-primary-foreground-2 hover:opacity-80 transition-opacity"
                    aria-label="Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Bottom Bar with Page Title */}
            <div className="bg-breadcrumb px-4 sm:px-6 lg:px-8 py-3">
                <p className="text-primary font-semibold text-sm">
                    Frequently Asked Questions
                </p>
            </div>
        </div>
    );
}
