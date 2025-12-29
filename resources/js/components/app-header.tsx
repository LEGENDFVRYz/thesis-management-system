import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn, isSameUrl, isSectionUrl, resolveUrl } from '@/lib/utils';

import ProfileIcon from '@/components/icons/ic_profile-Default.svg';
import NotificationIcon from '@/components/icons/ic_notification-Default-ic_notification2-notification.svg';
import FAQsIcon from '@/components/icons/ic_faq-Default.svg';

import { dashboard as studentDB } from '@/routes';
import { dashboard as facultyDB } from '@/routes/faculty';
import { dashboard as adminDB } from '@/routes/admin';

import { type BreadcrumbItem, type NavItem, type SharedData} from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import useUserRole from '@/hooks/use-user-role';

import { adminMainNav } from '@/pages/Admin/_navigation';
import { facultyMainNav } from '@/pages/Faculty/_navigation';
import { studentMainNav } from '@/pages/Student/_navigation';
import { useMemo, useState } from 'react';
import AppLogoIcon from '@/components/Icons/logo';

const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}


export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    
    const url = page.url;

    const navItems = useMemo<NavItem[]>(() => {
        if (url.startsWith('/admin')) {
            return adminMainNav; 
        } else if (url.startsWith('/faculty')) {
            return facultyMainNav(); 
        } else if (url === '/' || url.startsWith('/')) {
            return studentMainNav; 
        } else {
            return [];
        }
    }, [url]);

    const home = () => {
        if (url.startsWith('/admin')) {
            return adminDB.url();
        } else if (url.startsWith('/faculty')) {
            return facultyDB.url();
        } else {
            return studentDB.url();
        }
    };

    const [activeTab, setActiveTab] = useState(0);

    return (
        <header className="w-full flex flex-col">
            {/* TOP NAVBAR*/}
            <div className="bg-primary h-20 flex items-center shadow-md">
                <div className="mx-auto flex w-full items-center justify-between px-6 md:max-w-[1440px]">
                    
                    {/* 1. LEFT: Fully Static Logo and Branding */}
                    <div className="flex items-center gap-4 cursor-default select-none">
                        
                        {/* STATIC LOGO */}
                        <AppLogoIcon 
                            variant={isDarkMode ? "light" : "dark"} 
                            className="h-13 w-13 drop-shadow-md" 
                        />
                        
                        {/* STATIC TEXT SECTION */}
                        <div className="flex flex-col">
                            <h1 className="text-primary-foreground-2 text-xl font-bold leading-none tracking-tight">
                                Thesis Management System
                            </h1>
                            {/* Visual Separator Line */}
                            <div className="h-[1.2px] bg-background/30 w-full my-1.5" />
                            <p className="text-background text-xs font-medium uppercase tracking-widest opacity-90 font-dm">
                                Department of Computer Engineering
                            </p>
                        </div>
                    </div>

                    {/* 2. CENTER: Navigation Links (Placeholder) */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <div key={index} className="px-4 py-2 text-white text-sm font-medium hover:text-[#FFBD00] cursor-pointer transition-colors">
                                {item.title}
                                {item.children && <ChevronDown className="inline ml-1 size-3 opacity-50" />}
                            </div>
                        ))}
                    </nav>

                    {/* 3. RIGHT: Action Icons & Profile (Placeholders) */}
                    <div className="flex items-center gap-4 text-white">
                            {/* Profile Icon */}
                            <img
                                src={ProfileIcon}
                                alt="Profile"
                                className="size-5 cursor-pointer hover:opacity-80 transition-opacity" />

                            {/* Notification Icon */}
                            <img
                                src={NotificationIcon}
                                alt="Notifications"
                                className="size-5 cursor-pointer hover:opacity-80 transition-opacity" />

                            {/* FAQs Icon */}
                            <img
                                src={FAQsIcon}
                                alt="FAQs"
                                className="size-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        </div>
                    </div>
                </div>

            {/* BREADCRUMB BAR*/}
            {breadcrumbs.length > 0 && (
                <div className="bg-breadcrumb h-10 border-b border-foreground/5 flex items-center">
                    <div className="mx-auto flex w-full items-center px-6 md:max-w-[1440px]">
                        <div className="flex items-center gap-2 text-xs font-medium text-primary/70">
                             {/* Breadcrumb Placeholder */}
                            <span>Home</span>
                            <ChevronRight className="size-3" />
                            <span className="font-bold text-primary">Current Page</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
