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
    navigationMenuTriggerStyle,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
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
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Search } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
    {
        title: 'Management',
        href: dashboard(),
        children: [
            { title: 'Faculty',     href: '#' },
            { title: 'Student',     href: '#' },
            { title: 'Deadline',    href: '#' },
            { title: 'Defense',     href: '#' },
        ]
    },
    {
        title: 'System',
        href: dashboard(),
    },
    {
        title: 'Repository',
        href: dashboard(),
        children: [
            { title: 'Thesis',     href: '#' },
            { title: 'System',     href: '#' },
        ]
    },
    {
        title: 'Resources',
        href: dashboard(),
    },
];

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

const activeItemStyles =
    'text-[#FFBD00]';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}


export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="border-b border-sidebar-border/80 bg-[#730000]">
                <div className="mx-auto flex h-25 items-center justify-between px-4 md:max-w-[1440px]">

                    {/* NAV LOGO */}
                    <div>
                        <Link
                            href={dashboard()}
                            prefetch
                            className="flex items-center gap-3 font-dm-sans hover:opacity-90 transition-opacity"
                        >
                            {/* please change it to finalized logo */}
                            <img
                                src="https://placehold.co/48/FFBD00/730000/png?text=Logo" 
                                alt="Thesis Management System Logo"
                                className="h-12 w-12 object-contain rounded-full"
                            />
                            
                            {/* Text Content */}
                            <div className="sm:flex flex-col justify-center hidden">
                                <h1 className="text-[#FFC107] text-xl font-bold leading-tight">
                                    Thesis Management System
                                </h1>
                                <p className="text-white text-sm font-medium">
                                    Department of Computer Engineering
                                </p>
                            </div>
                        </Link>
                    </div>


                    {/* NAV - Main tabs */}
                    <div className=" hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        {item.children ? (

                                            // Navtabs with children
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            'hover:bg-[#9B000A] rounded-sm',
                                                            'bg-[#730000] text-[#fff] h-9 cursor-pointer px-3 gap-2.5 flex items-center',
                                                            isSameUrl(page.url, item.href) && 'text-[#FFBD00] underline underline-offset-4 bg-[]',
                                                        )}
                                                    >
                                                        {item.title}
                                                        <ChevronDown className="h-4 w-4 stroke-[3]" />
                                                    </Link>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent 
                                                    align="center" 
                                                    sideOffset={40} 
                                                    className="w-[200px] rounded-md border shadow-md bg-[#730000]"
                                                >
                                                    {item.children.map((child, childIndex) => (
                                                    <Link
                                                        key={childIndex}
                                                        href={child.href}
                                                        className="block px-3 py-2 text-sm hover:bg-[#9B000A] dark:hover:bg-gray-800 text-center text-[#fff]"
                                                    >
                                                        {child.title}
                                                    </Link>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        ) : (

                                            // Simple link without children
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'hover:bg-[#9B000A] rounded-sm',
                                                    'bg-[#730000] text-[#fff] h-9 cursor-pointer px-3 gap-2.5 flex items-center',
                                                    isSameUrl(page.url, item.href) && 'text-[#FFBD00] underline underline-offset-4 bg-[]',
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    

                    {/* NAV - Secondary tabs */}
                    <div className=" flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                className="group h-9 w-9 cursor-pointer"
                            >
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button> */}
                            <div className="hidden lg:flex">
                                {rightNavItems.map((item) => (
                                    <TooltipProvider
                                        key={item.title}
                                        delayDuration={0}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    href={resolveUrl(item.href)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-[#fff] ring-offset-background transition-colors hover:bg-[#9B000A] hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    <span className="sr-only">
                                                        {item.title}
                                                    </span>
                                                    <Icon
                                                        iconNode={Search}
                                                        className="size-5 opacity-80 group-hover:opacity-100"
                                                    />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
