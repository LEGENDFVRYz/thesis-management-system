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

// Management Data Constants
const adminManagementItems = [
    { 
        id: 'admin-root', 
        title: 'Root', 
        children: [
            { title: 'User Management', href: '#', isHeader: true },
            { title: 'Faculty', href: '/admin/faculty' },
            { title: 'Student', href: '/admin/student' },
            { title: 'System Configuration', href: '#', isHeader: true },
            { title: 'Academic Settings', href: '/admin/academic' },
            { title: 'Deadline', href: '/admin/deadline' },
            { title: 'Department Policies', href: '/admin/policies' },
            { title: 'Defense Management', href: '/admin/defense' },
        ] 
    }
];

const facultyManagementItems = [
    { 
        id: 'adviser', 
        title: 'Adviser', 
        children: [
            { title: 'Advisee Management', href: '#', isHeader: true },
            { title: 'My Advisees', href: '/adviser/my-advisees' },
            { title: 'Group Composition', href: '/adviser/groups' },
            { title: 'Thesis Review', href: '/adviser/review' },
            { title: 'Progress Monitoring', href: '/adviser/monitoring' },
            { title: 'Defense Management', href: '/adviser/defense' },
            { title: 'Panel Endorsement', href: '/adviser/endorsement' },
            { title: 'Evaluation and Grading', href: '#', isHeader: true },
            { title: 'Grade Input', href: '/adviser/grades' },
            { title: 'Rubrics and Guidelines', href: '/adviser/rubrics' }
        ] 
    },
    { id: 'committee', title: 'Committee', children: [{ title: 'Proposal Review', href: '/committee/proposals' }] },
    { id: 'panel', title: 'Panel', children: [
        { title: 'Panel Thesis Review', href: '/panel/review' },
        { title: 'Defense Management', href: '/panel/defense' }
    ]}
];

const coordinatorManagementItems = [
    { 
        id: 'coordinator-root', 
        title: 'Coordinator', 
        children: [
            { title: 'Compliance & Eligibility', href: '#', isHeader: true },
            { title: 'Pre-Defense Compliance', href: '/coordinator/compliance' },
            { title: 'Endorsement Management', href: '/coordinator/endorsement' },
            { title: 'Thesis Monitoring', href: '#', isHeader: true },
            { title: 'Thesis Registry', href: '/coordinator/registry' },
            { title: 'Progress Reports', href: '/coordinator/progress' },
            { title: 'Defense Management', href: '#', isHeader: true },
            { title: 'Defense Schedule', href: '/coordinator/schedule' },
            { title: 'Panel Assignment', href: '/coordinator/panel' },
            { title: 'Matrix Management', href: '/coordinator/matrix' },
            { title: 'Grading Management', href: '/coordinator/grading' }
        ] 
    }
];

const studentManagementItems = [
    { 
        id: 'student-root', 
        title: 'Student',
        children: [
            { title: 'Progress Tracking', href: '/student/progress', isHeader: true },
            { title: 'Overall Progress', href: '/student/progress/overall' },
            { title: 'Consultations', href: '/student/progress/consultations' },
            { title: 'Status Reports', href: '/student/progress/status-reports' },
            { title: 'Thesis Management', href: '/student/thesis' },
            { title: 'Defense Management', href: '/student/defense' },
            { title: 'Compliance & IP', href: '/student/compliance', isHeader: true },
            { title: 'IP & Plagiarism', href: '/student/ip-plagiarism' },
            { title: 'Public Presentation', href: '/student/public-presentation' }
        ] 
    }
];

interface AppHeaderProps {
    breadcrumbs?: any[];
    variant?: 'admin' | 'faculty' | 'coordinator' | 'committee' | 'student';
}

export function AppHeader({ breadcrumbs = [], variant }: AppHeaderProps) {
    const { url, props } = usePage<any>();
    const { auth } = props;

    // Determine the active role: Force by variant prop or detect via URL
    const activeRole = variant || (
        url.startsWith('/admin') ? 'admin' :
        url.startsWith('/faculty') ? 'faculty' :
        url.startsWith('/coordinator') ? 'coordinator' :
        url.startsWith('/committee') ? 'committee' : 'student'
    );

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
                                    <Link href="/admin/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <GlobalNavDropdown label="Management" variant="admin" items={adminManagementItems} />
                                <SharedLinks />
                            </>
                        )}

                        {activeRole === 'faculty' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/faculty/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <GlobalNavDropdown label="Management" variant="faculty" items={facultyManagementItems} />
                                <SharedLinks />
                            </>
                        )}

                        {activeRole === 'coordinator' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/coordinator/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <GlobalNavDropdown label="Management" variant="admin" items={coordinatorManagementItems} />
                                <SharedLinks />
                            </>
                        )}

                        {activeRole === 'committee' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/committee/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/committee/proposals" className='hover:text-primary-foreground-2'>Proposal Review</Link>
                                </Button>
                                <SharedLinks />
                            </>
                        )}

                        {activeRole === 'student' && (
                            <>
                                <Button variant="primary" asChild className="mx-1 border-none shadow-none">
                                    <Link href="/student/dashboard" className='hover:text-primary-foreground-2'>Home</Link>
                                </Button>
                                <GlobalNavDropdown label="Management" variant="student" items={studentManagementItems} />
                                <SharedLinks />
                            </>
                        )}
                    </nav>

                    {/* RIGHT: Action Icons */}
                    <div className="flex items-center gap-4 text-white">
                        
                        {/* Profile Icon */}
                        <Link 
                            href="/profile" // To change pa
                            className="cursor-pointer transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredIcon('profile')}
                            onMouseLeave={() => {
                                setHoveredIcon(null);
                                setClickedIcon(null);
                            }}
                            onMouseDown={() => setClickedIcon('profile')}
                            onMouseUp={() => setClickedIcon(null)}
                        >
                            <Icon name={getIconName('profile')} size={24} />
                        </Link>
                        
                        {/* Notifications Icon */}
                        <Link 
                            href="/notifications" // To change pa
                            className="cursor-pointer transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredIcon('notification')}
                            onMouseLeave={() => {
                                setHoveredIcon(null);
                                setClickedIcon(null);
                            }}
                            onMouseDown={() => setClickedIcon('notification')}
                            onMouseUp={() => setClickedIcon(null)}
                        >
                            <Icon name={getIconName('notification')} size={24} />
                        </Link>
                        
                        {/* FAQ Icon */}
                        <Link 
                            href="/faq" // To change pa
                            className="cursor-pointer transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredIcon('faq')}
                            onMouseLeave={() => {
                                setHoveredIcon(null);
                                setClickedIcon(null);
                            }}
                            onMouseDown={() => setClickedIcon('faq')}
                            onMouseUp={() => setClickedIcon(null)}
                        >
                            <Icon name={getIconName('faq')} size={24} />
                        </Link>

                        {/* Avatar Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="size-9 bg-primary-foreground-2 rounded-full border-2 border-white/10 hover:border-white/30 transition-all cursor-pointer outline-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
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