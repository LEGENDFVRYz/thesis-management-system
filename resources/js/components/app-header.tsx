import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLogoIcon from '@/components/Icons/logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserMenuContent } from '@/components/user-menu-content';
import { Icon } from '@/components/icon-index';
import { IconName } from '@/components/icons-registry';
import { GlobalNavDropdown } from '@/components/app-header-management'; 
import NotificationModal from './modal/notification-modal';

// Management Data Constants
const adminManagementItems = [
    { 
        id: 'admin-root', 
        title: 'Root', 
        children: [
            { title: 'User Management', href: '#', isHeader: true },
            { title: 'Faculty', href: '/admin/management/faculty' },
            { title: 'Student', href: '/admin/management/student' },
            { title: 'System Configuration', href: '#', isHeader: true },
            { title: 'Academic Settings', href: '/admin/management/academic-settings' },
            { title: 'Deadline', href: '/admin/management/deadline' },
            { title: 'Department Policies', href: '/admin/management/policies' },
            { title: 'Defense Management', href: '/admin/management/defense-monitoring' },
        ] 
    }
];

const facultyManagementItems = [
    { 
        id: 'Adviser', title: 'Adviser', 
        children: [
            { title: 'Advisee Management', href: '#', isHeader: true },
            { title: 'My Advisees', href: '/faculty/adviser/advisees' },
            { title: 'Group Composition', href: '/faculty/adviser/group-composition' },
            { title: 'Thesis Review', href: '/faculty/adviser/thesis-review' },
            { title: 'Progress Monitoring', href: '/faculty/adviser/progress' },
            { title: 'Defense Management', href: '/faculty/defense-management' },
            { title: 'Panel Endorsement', href: '/faculty/adviser/endorsement' },
            { title: 'Evaluation and Grading', href: '#', isHeader: true },
            { title: 'Grade Input', href: '/faculty/adviser/evaluation' },
            // { title: 'Rubrics and Guidelines', href: '/adviser/rubrics' }    // dunno yet if exist
        ] 
    },
    { 
        id: 'Committee', title: 'Committee', children: [
            { title: 'Proposal Review', href: '/faculty/committee/proposal-review' }
        ] 
    },
    { 
        id: 'Awardee', title: 'Awardee Committee', children: [
            { title: 'Award Evaluation', href: '/faculty/awardee/evaluation' }
        ] 
    },
    { 
        id: 'Panelist', title: 'Panel', children: [
            { title: 'Panel Thesis Review', href: '#' },        // temporary disabled since we considering moving it to shared
            { title: 'Defense Management', href: '/faculty/defense-management' }
        ]
    },
    { 
        id: 'Coordinator', title: 'Coordinator', 
        children: [
            { title: 'Compliance & Eligibility', href: '#', isHeader: true },
            { title: 'Pre-Defense Compliance', href: '/faculty/coordinator/compliance' },
            { title: 'Endorsement Management', href: '/faculty/coordinator/endorsement' },
            { title: 'Thesis Monitoring', href: '#', isHeader: true },
            { title: 'Thesis Registry', href: '/faculty/coordinator/thesis/registry' },
            { title: 'Progress Reports', href: '/faculty/coordinator/thesis/progress' },
            { title: 'Defense Management', href: '#', isHeader: true },
            // { title: 'Defense Schedule', href: '/faculty/coordinator/schedule' },        // dunno yet if exist
            { title: 'Panel Assignment', href: '/faculty/coordinator/defense-management/panel-assign' },
            { title: 'Matrix Management', href: '/faculty/coordinator/defense-management/matrix' },
            { title: 'Grading Management', href: '/faculty/coordinator/grade-management' }
        ] 
    }
];

const studentManagementItems = [
    {
        id: 'student-root',
        title: 'Student',
        children: [
            { title: 'Progress Tracking', href: '/management/progress/overall' },
            { title: 'Thesis Management', href: '/management/thesis/documents' },
            { title: 'Defense Management', href: '/management/defense_matrix' },
            { title: 'Evaluation Grading', href: '/management/evaluation' },
            { title: 'Compliance & IP', href: '/compliance', isHeader: true },
            { title: 'IP & Plagiarism', href: '/management/compliance/ip' },
            { title: 'Public Presentation', href: '/management/compliance/presentation' },
        ]
    }
];

interface AppHeaderProps {
    breadcrumbs?: any[];
    variant?: 'admin' | 'faculty' | 'coordinator' | 'committee' | 'student' | 'guest';
}

export function AppHeader({ breadcrumbs = [], variant }: AppHeaderProps) {
    const { url, props } = usePage<any>();
    const { auth, user_info } = props;

    // Determine the active role: Force by variant prop or detect via URL
    const activeRole =
        variant ||
        (url.startsWith('/admin') && 'admin') ||
        (url.startsWith('/faculty') && 'faculty') ||
        (user_info?.is_admin && 'admin') ||
        (
            // fallback: if url-scope is non-existing, utilize the roles to verify the variant
            user_info?.user_role === 'faculty'
                ? 'faculty'
                : user_info?.user_role === 'student'
                    ? 'student'
                    : 'guest'
        );
    
    // Determine the faculty subroles in the backend props
    const facultyRoles = user_info?.faculty_roles ?? [];

    const filteredFacultyManagementItems = React.useMemo(() => {
        if (!user_info || facultyRoles.length === 0) {
            return [];      // If there is no user, return
        }

        // filter: only include if the faculty has the valid role
        return facultyManagementItems.filter(item =>
            facultyRoles.includes(item.id)
        );
    }, [facultyRoles, user_info]);

    
    const SharedLinks = () => (
        <>
            <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                <Link href="/repository" className='hover:text-primary-foreground-2'>Repository</Link>
            </Button>
            <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                <Link href="/resources" className='hover:text-primary-foreground-2'>Resources</Link>
            </Button>
        </>
    );

    // Inside AppHeader component
    const [hoveredIcon, setHoveredIcon] = React.useState<string | null>(null);
    const [clickedIcon, setClickedIcon] = React.useState<string | null>(null);

    /**
     * Maps the icon type to the design system's registry names
     * Example: getIconName('profile') -> 'profileDefault' | 'profileHover' | 'profileClicked'
     */
    const getIconName = (iconBase: string): IconName => {
        if (clickedIcon === iconBase) return `${iconBase}Clicked` as IconName;
        if (hoveredIcon === iconBase) return `${iconBase}Hover` as IconName;
        return `${iconBase}Default` as IconName;
    };
    
    return (
        <header className="w-full flex flex-col">
            <div className="bg-primary h-20 flex items-center shadow-md">
                <div className="flex w-full items-center justify-between px-6">
                    
                    {/* LEFT: Branding */}
                    <div className="flex items-center gap-4 cursor-default select-none">
                        <AppLogoIcon variant="light" className="h-13 w-13 drop-shadow-md" />
                        <div className="flex flex-col text-white">
                            <h1 className="text-xl font-bold leading-none tracking-tight">Thesis Management System</h1>
                            <div className="h-[1.2px] bg-white/30 w-full my-1.5" />
                            <p className="text-xs font-medium uppercase tracking-widest opacity-90">Department of Computer Engineering</p>
                        </div>
                    </div>

                    {/* CENTER: Navigation Variants */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {activeRole === 'admin' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/admin" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <GlobalNavDropdown label="Management" variant="admin" items={adminManagementItems} />
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/admin/repository/system-repository" className='hover:text-primary-foreground-2'>Repository</Link>
                                </Button>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/resources" className='hover:text-primary-foreground-2'>Resources</Link>
                                </Button>
                            </>
                        )}

                        {activeRole === 'faculty' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/faculty/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                
                                {/* Note: Dynamically render valid routes dependent on the faculty subroles */}
                                {filteredFacultyManagementItems.length > 0 && (
                                    <GlobalNavDropdown
                                        label="Management"
                                        variant="faculty"
                                        items={filteredFacultyManagementItems}
                                    />
                                )}

                                <SharedLinks />
                            </>
                        )}

                        {activeRole === 'student' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <GlobalNavDropdown label="Management" variant="student" items={studentManagementItems} />
                                <SharedLinks />
                            </>
                        )}

                        {activeRole === 'guest' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/repository" className='hover:text-primary-foreground-2'>Repository</Link>
                                </Button>
                            </>
                        )}
                    </nav>

                    {/* RIGHT: Action Icons */}
                    <div className="flex items-center gap-4 text-white">

                        {/* Profile Icon */}
                        {activeRole === 'guest' && (
                            <a
                                href="/login"
                                className="cursor-pointer transition-transform hover:scale-110 block group"
                            >
                                <div className="group-hover:hidden">
                                    <Icon name="logoutDefault" size={24} />
                                </div>
                                <div className="hidden group-hover:block">
                                    <Icon name="logoutHover" size={24} />
                                </div>
                            </a>
                        )}

                        {['admin', 'faculty', 'student'].includes(activeRole) && (
                            <a
                                href={'/profilemanagement'}
                                className="cursor-pointer transition-transform hover:scale-110 block group"
                            >
                                <div className="group-hover:hidden">
                                    <Icon name="profileDefault" size={24} />
                                </div>
                                <div className="hidden group-hover:block">
                                    <Icon name="profileHover" size={24} />
                                </div>
                            </a>
                        )}

                        {/* Notifications Icon - Hidden for guest variant */}
                        {activeRole !== 'guest' && (
                            <a
                                href="/notifications"
                                className="cursor-pointer transition-transform hover:scale-110 block group"
                            >
                                <div className="group-hover:hidden">
                                    <Icon name="notificationDefault" size={24} />
                                </div>
                                <div className="hidden group-hover:block">
                                    <Icon name="notificationHover" size={24} />
                                </div>
                            </a>
                        )}

                        {/* FAQ Icon */}
                        <a
                            href="/faq"
                            className="cursor-pointer transition-transform hover:scale-110 block group"
                        >
                            <div className="group-hover:hidden">
                                <Icon name="faqDefault" size={24} />
                            </div>
                            <div className="hidden group-hover:block">
                                <Icon name="faqHover" size={24} />
                            </div>
                        </a>

                        {/* Avatar Dropdown - Hidden for guest variant */}
                        {activeRole !== 'guest' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="size-9 bg-primary-foreground-2 rounded-full border-2 border-white/10 hover:border-white/30 transition-all cursor-pointer outline-white" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>

            {/* BREADCRUMB BAR */}
            {breadcrumbs.length > 0 && (
                <div className="bg-breadcrumb h-10 border-b border-foreground/5 flex items-center px-10">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
        </header>
    );
}