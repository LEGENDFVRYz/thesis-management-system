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
import { GlobalNavDropdown } from './app-header-management';

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

    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [clickedIcon, setClickedIcon] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const getIconName = (iconType: string) => {
        if (clickedIcon === iconType) return `${iconType}Clicked`;
        if (hoveredIcon === iconType) return `${iconType}Hover`;
        return `${iconType}Default`;
    };

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

    // Inside AppHeader component
    const userRole = url.startsWith('/admin') ? 'admin' : url.startsWith('/faculty') ? 'faculty' : 'student';

    return (
        <header className="w-full flex flex-col">
            {/* TOP NAVBAR*/}
            <div className="bg-primary h-20 flex items-center shadow-md">
                <div className="flex w-full items-center justify-between px-6">
                    
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
                            {/* Profile Icon */}
                            <div 
                                className="flex items-center justify-center cursor-pointer transition-transform hover:scale-110" 
                                title="Profile"
                                onMouseEnter={() => setHoveredIcon('profile')}
                                onMouseLeave={() => setHoveredIcon(null)}
                                onClick={() => setClickedIcon(clickedIcon === 'profile' ? null : 'profile')}
                            >
                                <Icon 
                                    name={getIconName('profile') as any} 
                                    size={20} 
                                />
                            </div>
                            
                            {/* Notifications Icon*/}
                            <div 
                                className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110" 
                                title="Notifications"
                                onMouseEnter={() => setHoveredIcon('notification')}
                                onMouseLeave={() => setHoveredIcon(null)}
                                onClick={() => setClickedIcon(clickedIcon === 'notification' ? null : 'notification')}
                            >
                                <Icon 
                                    name={getIconName('notification') as any} 
                                    size={20} 
                                />
                            </div>
                            
                            {/* FAQ Icon */}
                            <div 
                                className="flex items-center justify-center cursor-pointer transition-transform hover:scale-110" 
                                title="FAQs"
                                onMouseEnter={() => setHoveredIcon('faq')}
                                onMouseLeave={() => setHoveredIcon(null)}
                                onClick={() => setClickedIcon(clickedIcon === 'faq' ? null : 'faq')}
                            >
                                <Icon 
                                    name={getIconName('faq') as any} 
                                    size={20} 
                                />
                            </div>
                            {/* Avatar with Logout Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="size-9 bg-[#FFBD00] rounded-full border-2 border-white/10 hover:border-white/30 transition-all cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>

            {/* BREADCRUMB BAR*/}
            {breadcrumbs.length > 0 && (
                <div className="bg-breadcrumb h-10 border-b border-foreground/5 flex items-center">
                    <div className="flex w-full items-center px-10">
                        {/* Pass the breadcrumbs array directly to your component */}
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </header>
    );
}
