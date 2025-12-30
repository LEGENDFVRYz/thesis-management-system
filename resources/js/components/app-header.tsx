import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon-index';
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

const guestNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/guest',
    },
    {
        title: 'Repository',
        href: '/guest/repository',
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    variant?: 'default' | 'guest';
}


export function AppHeader({ breadcrumbs = [], variant = 'default' }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    
    const url = page.url;

    const navItems = useMemo<NavItem[]>(() => {
        if (variant === 'guest') {
            return guestNavItems;
        }
        if (url.startsWith('/admin')) {
            return adminMainNav;
        } else if (url.startsWith('/faculty')) {
            return facultyMainNav();
        } else if (url === '/' || url.startsWith('/')) {
            return studentMainNav;
        } else {
            return [];
        }
    }, [url, variant]);

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

                    {/* 2. CENTER: Navigation Links */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            variant === 'guest' ? (
                                <Link
                                    key={index}
                                    href={item.href || '#'}
                                    className={cn(
                                        "px-4 py-2 text-white text-sm font-medium hover:text-[#FFBD00] cursor-pointer transition-colors font-['DM_Sans']",
                                        isSameUrl(url, item.href) && "text-[#FFBD00]"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ) : (
                                <div key={index} className="px-4 py-2 text-white text-sm font-medium hover:text-[#FFBD00] cursor-pointer transition-colors">
                                    {item.title}
                                    {item.children && <ChevronDown className="inline ml-1 size-3 opacity-50" />}
                                </div>
                            )
                        ))}
                    </nav>

                    {/* 3. RIGHT: Action Icons & Profile */}
                    {variant === 'guest' ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="flex items-center justify-center size-9 rounded-full hover:bg-white/20 transition-colors"
                                title="Login"
                            >
                                <Icon name="profileDefault" size={36} />
                            </Link>
                            <button
                                className="flex items-center justify-center size-9 rounded-full hover:bg-white/20 transition-colors"
                                title="Help"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" stroke="white" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="white" />
                                    <circle cx="12" cy="17" r="0.5" fill="white" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-3 border-r border-white/20 pr-4">
                                <div className="size-5 bg-white/10 rounded-full" title="Profile" />
                                <div className="relative size-5 bg-white/10 rounded-full" title="Notifications">
                                    {/* Yellow Dot Indicator */}
                                    <div className="absolute -top-0.5 -right-0.5 size-2 bg-[#FFBD00] rounded-full border border-[#730000]" />
                                </div>
                                <div className="size-5 bg-white/10 rounded-full" title="Help" />
                                <div className="size-5 bg-white/10 rounded-full" title="Settings" />
                            </div>
                            {/* Avatar Placeholder */}
                            <div className="size-9 bg-[#FFBD00] rounded-full border-2 border-white/10" />
                        </div>
                    )}
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
