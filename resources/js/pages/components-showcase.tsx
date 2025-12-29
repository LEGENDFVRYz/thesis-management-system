import { Head } from '@inertiajs/react';
import AlertError from '@/components/alert-error';
import AppLogo from '@/components/app-logo';
import Logo from '@/components/icons/logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import CheckCircle from '@/components/icons/check-circle';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import RoleToggle from '@/components/role-toggle';
import StageSwitchToggle from '@/components/stage-toggle';
import { TextLink } from '@/components/text-link';
import { UserInfo } from '@/components/user-info';
import { Icon } from '@/components/ui/icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import AppearanceToggleTab from '@/components/appearance-tabs';
import DeleteUser from '@/components/delete-user';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import { NavMain } from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { UserMenuContent } from '@/components/user-menu-content';
import { AppShell } from '@/components/app-shell';
import { AppContent } from '@/components/app-content';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { login as studentLogin } from '@/routes/student';
import { login as facultyLogin } from '@/routes/faculty';
import { HomeIcon, SettingsIcon, BellIcon } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from "@/components/calendar";
import { DatePicker } from "@/components/date-picker";
import { MonthPicker } from "@/components/month-picker";
import { YearDropdownPicker } from "@/components/year-dropdown-picker";
import { YearPicker } from "@/components/year-picker";
import { YearRangePicker } from "@/components/acad-year-range-picker";
import { DefenseCalendarWeekly } from "@/components/defense-calendar-weekly";
import { DefenseCalendar } from "@/components/defense-calendar-monthly";
import { ResearchAreaChart } from "@/components/research-area-distribution-pie";
import { SubmissionStatusChart } from "@/components/submission-status-bar";
import { ArchivedJournalsChart } from "@/components/archived-journals-line";
import { PerformanceOverviewChart } from "@/components/performance-overview-ver-bar";
import { SubmissionStatusNonAdminChart } from "@/components/submission-status-bar-nonadmin";
import { Timeline } from '@/components/timeline';
import { Filter1, Filter2, Sort1, Sort2, Sort3, SearchBar, RepoFilter } from '@/components/filter-search';


export default function ComponentsShowcase() {
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
        email_verified_at: null,
        created_at: '',
        updated_at: ''
    };


    // Sample events
    const sampleEvents = [
        {
            id: "1",
            title: "BSCPE 4-1 (D1)",
            date: new Date(2025, 10, 24),
            section: "4-1",
        },
        {
            id: "2",
            title: "BSCPE 4-1 (D2)",
            date: new Date(2025, 10, 25),
            section: "4-1",
        },
        {
            id: "3",
            title: "BSCPE 4-5 (D1)",
            date: new Date(2025, 10, 26),
            section: "4-5",
        },
        {
            id: "4",
            title: "BSCPE 4-5 (D2)",
            date: new Date(2025, 10, 27),
            section: "4-5",
        },
        {
            id: "5",
            title: "BSCPE 4-3 (D1)",
            date: new Date(2025, 10, 28),
            section: "4-3",
        },
    ];

    const weeklyEvents = [
        {
            id: "1",
            title: "BSCPE 4-1 (D1)",
            date: new Date(2025, 10, 24),
            time: "9:00 AM",
            section: "4-1",
        },
        {
            id: "2",
            title: "BSCPE 4-1 (D2)",
            date: new Date(2025, 10, 25),
            time: "9:00 AM",
            section: "4-1",
        },
        {
            id: "3",
            title: "BSCPE 4-5 (D1)",
            date: new Date(2025, 10, 26),
            time: "9:00 AM",
            section: "4-5",
        },
    ];

    return (
        <>
            <Head title="Components Showcase" />
            <div className="min-h-screen bg-gray-800 p-8">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-white">Application Components Showcase</h1>
                        <p className="text-gray-300">Preview of custom application components (48 total + 6 filters/sorts)</p>
                    </div>

                    {/* App Logo */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">App Logo</h2>
                        <div className="flex gap-8 items-center">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Full Logo</p>
                                <AppLogo />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Icon Only</p>
                                <Logo className="w-12 h-12" />
                            </div>
                        </div>
                    </section>

                    {/* Icons */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Custom Icons</h2>
                        <div className="flex gap-8 items-center">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Check Circle</p>
                                <CheckCircle className="w-8 h-8" />
                            </div>
                        </div>
                    </section>

                    {/* Headings */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Headings</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Large Heading</p>
                                <Heading title="This is a Large Heading" description="With an optional description" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Small Heading</p>
                                <HeadingSmall title="This is a Small Heading" />
                            </div>
                        </div>
                    </section>

                    {/* Text Link Section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Text Link Variants</h2>
                        
                        <div className="flex flex-col gap-8 p-6 bg-white/5 rounded-lg border border-white/10">
                            
                            {/* Sample Template */}
                            <div className="flex flex-col gap-2 items-start text-left">
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Sample Template</span>
                                <TextLink href="#" variant="template">
                                    Download Sample Template
                                </TextLink>
                            </div>

                            {/* Archive Restrictions */}
                            <div className="flex flex-col gap-2 items-start text-left">
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Archive Restrictions</span>
                                <TextLink href="#" variant="restriction">
                                    Manage archive restrictions
                                </TextLink>
                            </div>

                            {/* View Group */}
                            <div className="flex flex-col gap-2 items-start text-left">
                                <span className="text-xs text-slate-400 uppercase tracking-wider">View Group</span>
                                <TextLink href="#" variant="group">
                                    View Group
                                </TextLink>
                            </div>
                        </div>
                    </section>

                    {/* Role Toggle */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Role Toggle</h2>
                        <p className="text-sm text-gray-400">Used on login pages to switch between Student and Faculty</p>
                        <div className="max-w-md">
                            <RoleToggle
                                currentRole="student"
                                studentRoute={studentLogin}
                                facultyRoute={facultyLogin}
                            />
                        </div>
                    </section>

                    {/* Stage Switch Toggle */}
                    <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">
                        Stage Switch Toggle
                    </h2>

                    <p className="text-sm text-gray-400">
                        Used to switch between MOR, DP1, and DP2 stages
                    </p>

                    <StageSwitchToggle />
                    </section>


                    {/* Input Error */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Input Error</h2>
                        <div className="max-w-md space-y-3">
                            <InputError message="This field is required" />
                            <InputError message="Invalid email format" />
                            <InputError message="Password must be at least 8 characters" />
                        </div>
                    </section>

                    {/* Alert Error */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Alert Error</h2>
                        <div className="max-w-md space-y-3">
                            <AlertError errors={['An unexpected error occurred. Please try again.']} />
                            <AlertError errors={['Your session has expired. Please log in again.']} />
                            <AlertError
                                errors={[
                                    'Password must be at least 8 characters',
                                    'Password must contain at least one number'
                                ]}
                                title="Validation Errors"
                            />
                        </div>
                    </section>

                    {/* Breadcrumbs */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white">Breadcrumbs</h2>

                        {[
                            { title: 'Home', href: '/' },
                            { title: 'Components', href: '/components' },
                            { title: 'Dashboard', href: '/dashboard' },
                            { title: 'Settings', href: '/settings' },
                            { title: 'Profile', href: '/profile' },
                            { title: 'Delete Account', href: '' },
                        ]
                            // limit to max 6 items (5 ">")
                            .slice(0, 6)
                            // render variants incrementally
                            .map((_, index, all) => {
                                const items = all.slice(0, index + 2);

                                return (
                                    items.length >= 2 && (
                                        <Breadcrumbs
                                            key={index}
                                            breadcrumbs={items}
                                        />
                                    )
                                );
                            })}
                    </section>

                    {/* User Info */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">User Info</h2>
                        <p className="text-sm text-gray-400">Displays user information in sidebar/header</p>
                        <div className="max-w-md border border-gray-600 rounded-lg p-4 flex items-center gap-3 bg-gray-700">
                            <UserInfo
                                user={{
                                    id: 1,
                                    name: 'John Doe',
                                    email: 'john.doe@example.com',
                                    avatar: '',
                                    email_verified_at: null,
                                    created_at: '',
                                    updated_at: ''
                                }}
                                showEmail={true}
                            />
                        </div>
                    </section>

                    {/* Icon Component */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Icon Component</h2>
                        <p className="text-sm text-gray-400">Generic wrapper for Lucide icons with conditional rendering</p>
                        <div className="flex gap-6 items-center">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">With Icon</p>
                                <Icon iconNode={HomeIcon} className="w-8 h-8 text-[#730000]" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Different Icon</p>
                                <Icon iconNode={SettingsIcon} className="w-8 h-8 text-[#FFBD00]" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Another Icon</p>
                                <Icon iconNode={BellIcon} className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Null Icon (renders nothing)</p>
                                <Icon iconNode={null} className="w-8 h-8" />
                            </div>
                        </div>
                    </section>

                    {/* Appearance Dropdown */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Appearance Dropdown</h2>
                        <p className="text-sm text-gray-400">Theme switcher dropdown menu (Light/Dark/System)</p>
                        <div className="flex items-center gap-4">
                            <AppearanceToggleDropdown />
                            <p className="text-sm text-gray-400">Click the icon to toggle between themes</p>
                        </div>
                    </section>

                    {/* Appearance Tabs */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Appearance Tabs</h2>
                        <p className="text-sm text-gray-400">Theme switcher tab group (Light/Dark/System)</p>
                        <div className="flex items-center gap-4">
                            <AppearanceToggleTab />
                            <p className="text-sm text-gray-400">Click tabs to switch between themes</p>
                        </div>
                    </section>

                    {/* Nav Main */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Navigation Main</h2>
                        <p className="text-sm text-gray-400">Primary navigation menu for sidebar</p>
                        <div className="max-w-md border border-gray-600 rounded-lg p-4 bg-gray-700">
                            <SidebarProvider>
                                <NavMain
                                    items={[
                                        { title: 'Dashboard', href: '/' },
                                        { title: 'Users', href: '/users' },
                                        { title: 'Documents', href: '/documents' },
                                        { title: 'Settings', href: '/settings' },
                                    ]}
                                />
                            </SidebarProvider>
                        </div>
                    </section>

                    {/* Nav Footer */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Navigation Footer</h2>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                            <NavFooter />
                        </div>
                    </section>

                    {/* Delete User */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Delete User</h2>
                        <p className="text-sm text-gray-400">Account deletion component with confirmation dialog</p>
                        <div className="max-w-2xl">
                            <DeleteUser />
                        </div>
                    </section>

                    {/* Two-Factor Recovery Codes */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Two-Factor Recovery Codes</h2>
                        <p className="text-sm text-gray-400">Display and manage 2FA recovery codes</p>
                        <div className="max-w-2xl">
                            <TwoFactorRecoveryCodes
                                recoveryCodesList={[
                                    'abc123-def456',
                                    'ghi789-jkl012',
                                    'mno345-pqr678',
                                    'stu901-vwx234',
                                    'yza567-bcd890',
                                    'efg123-hij456',
                                    'klm789-nop012',
                                    'qrs345-tuv678',
                                ]}
                                fetchRecoveryCodes={async () => {}}
                                errors={[]}
                            />
                        </div>
                    </section>

                    {/* App Shell */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">App Shell</h2>
                        <p className="text-sm text-gray-400">Main application wrapper component with header and sidebar variants</p>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Header Variant</p>
                                <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                                    <AppShell variant="header">
                                        <div className="p-4 bg-gray-600 rounded text-white text-center">
                                            Content goes here (with header variant)
                                        </div>
                                    </AppShell>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Sidebar Variant (with SidebarProvider)</p>
                                <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                                    <AppShell variant="sidebar">
                                        <div className="p-4 bg-gray-600 rounded text-white text-center">
                                            Content goes here (with sidebar variant)
                                        </div>
                                    </AppShell>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* App Content */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">App Content</h2>
                        <p className="text-sm text-gray-400">Main content container with max-width and centering</p>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Header Variant (max-width: 1440px, centered)</p>
                                <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                                    <AppContent variant="header">
                                        <div className="p-4 bg-gray-600 rounded text-white">
                                            <p>This content is wrapped in AppContent with header variant.</p>
                                            <p className="text-sm mt-2">It has a max-width of 1440px and is centered.</p>
                                        </div>
                                    </AppContent>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Sidebar Variant (uses SidebarInset)</p>
                                <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                                    <AppContent variant="sidebar">
                                        <div className="p-4 bg-gray-600 rounded text-white">
                                            <p>This content is wrapped in AppContent with sidebar variant.</p>
                                            <p className="text-sm mt-2">It uses SidebarInset for sidebar layouts.</p>
                                        </div>
                                    </AppContent>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Menu Content */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">User Menu Content</h2>
                        <p className="text-sm text-gray-400">Dropdown menu content with user info, settings, and logout</p>
                        <div className="border border-gray-600 rounded-lg p-4 bg-gray-700 max-w-sm">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="tertiary">Open User Menu</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <UserMenuContent user={mockUser} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-sm text-gray-400">This is the content displayed inside user dropdown menus in both header and sidebar.</p>
                    </section>

                    {/* Two-Factor Setup Modal */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Two-Factor Setup Modal</h2>
                        <p className="text-sm text-gray-400">Modal dialog for setting up two-factor authentication</p>
                        <div className="flex gap-4 items-center">
                            <Button onClick={() => setIs2FAModalOpen(true)}>
                                Open 2FA Setup Modal
                            </Button>
                            <p className="text-sm text-gray-400">Click to see the 2FA setup process with QR code</p>
                        </div>
                        <TwoFactorSetupModal
                            isOpen={is2FAModalOpen}
                            onClose={() => setIs2FAModalOpen(false)}
                            requiresConfirmation={true}
                            twoFactorEnabled={false}
                            qrCodeSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#fff" width="100" height="100"/><path fill="#000" d="M10 10h5v5h-5zM20 10h5v5h-5zM25 10h5v5h-5zM35 10h5v5h-5zM45 10h5v5h-5z"/></svg>'
                            manualSetupKey="ABCD-EFGH-IJKL-MNOP"
                            clearSetupData={() => {}}
                            fetchSetupData={async () => {}}
                            errors={[]}
                        />
                    </section>

                    {/* Layout Components Info */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Layout Components</h2>
                        <p className="text-gray-400 mb-4">
                            These components are used in page layouts and are not shown individually:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">App Shell</CardTitle>
                                    <CardDescription>Main application container with sidebar and header</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Components: app-shell.tsx, app-content.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">Header</CardTitle>
                                    <CardDescription>Top navigation bar with user menu</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Component: app-header.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">Sidebar</CardTitle>
                                    <CardDescription>Collapsible navigation sidebar</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Components: app-sidebar.tsx, app-sidebar-header.tsx, nav-main.tsx, nav-footer.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">User Menu</CardTitle>
                                    <CardDescription>User profile dropdown menu</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Components: nav-user.tsx, user-menu-content.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">Appearance</CardTitle>
                                    <CardDescription>Theme and appearance settings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Components: appearance-dropdown.tsx, appearance-tabs.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">User Management</CardTitle>
                                    <CardDescription>User account operations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Component: delete-user.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">Two-Factor Auth</CardTitle>
                                    <CardDescription>2FA setup and recovery codes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Components: two-factor-setup-modal.tsx, two-factor-recovery-codes.tsx
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 text-lg">Modals</CardTitle>
                                    <CardDescription>Custom modal components folder</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        Folder: components/modal/
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Component Architecture</h2>
                        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#730000]"></div>
                                <p className="text-white font-medium">Application Components (33+)</p>
                            </div>
                            <p className="text-gray-300 text-sm ml-5">
                                Custom, reusable components specific to your application logic and design
                            </p>

                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-3 h-3 rounded-full bg-[#FFBD00]"></div>
                                <p className="text-white font-medium">UI Primitives (26)</p>
                            </div>
                            <p className="text-gray-300 text-sm ml-5">
                                Base components from shadcn/ui built on Radix UI
                            </p>

                            <div className="mt-6 pt-4 border-t border-gray-600">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white">Dependency Flow:</strong> Pages → Components → UI → Radix UI
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Calendar Components */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Calendar Components</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Basic Calendar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Calendar value={selectedDate} onChange={setSelectedDate} />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Date Picker</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        className="w-full max-w-[240px]"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Month & Year Pickers */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Date Selection Components</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Year Dropdown Picker</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                <YearDropdownPicker placeholder='Year' />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Academic Year</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <YearRangePicker placeholder='Academic Year' />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Month Picker</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <MonthPicker value={new Date(2026, 0, 1)} />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Year Picker</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <YearPicker value={new Date(2026, 0, 1)} />
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Defense Calendars */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Defense Calendars</h2>
                        <div className="space-y-6">
                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Defense Calendar - Monthly</CardTitle>
                                    <CardDescription className="text-gray-400">Shows defense events for the entire month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DefenseCalendar
                                        events={sampleEvents}
                                        value={new Date(2025, 10, 24)}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Defense Calendar - Weekly</CardTitle>
                                    <CardDescription className="text-gray-400">Shows defense schedule for the week</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DefenseCalendarWeekly
                                        events={weeklyEvents}
                                        value={new Date(2025, 10, 24)}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Charts */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Data Visualization Charts</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-transparent border-gray-600">
                                    <CardHeader>
                                        <CardTitle className="text-white">Research Area Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResearchAreaChart />
                                    </CardContent>
                                </Card>

                                <Card className="bg-transparent border-gray-600">
                                    <CardHeader>
                                        <CardTitle className="text-white">Performance Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <PerformanceOverviewChart />
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Archived Journals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ArchivedJournalsChart />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Submission Status (Admin)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SubmissionStatusChart />
                                </CardContent>
                            </Card>

                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                    <CardTitle className="text-white">Submission Status (Non-Admin)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SubmissionStatusNonAdminChart />
                                </CardContent>
                            </Card>



                            {/* Timeline */}
                            <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-white">Timeline</h2>
                            <Card className="bg-transparent border-gray-600">
                                <CardHeader>
                                <CardTitle className="text-white">Thesis Events Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <div className="max-w-[820px]">
                                    <Timeline />
                                </div>
                                </CardContent>
                            </Card>
                            </section>
                        </div>
                    </section>

                    {/* Search Bar */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Search Bar</h2>
                        <p className="text-sm text-gray-400">Search input with integrated search button</p>
                        <div className="max-w-2xl">
                            <SearchBar />
                        </div>
                    </section>

                    {/* Filter Components */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white">Filter Components</h2>
                        <p className="text-sm text-gray-400">Filter panels for different data types with checkboxes, radio groups, and dropdowns</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Filter 1 - Faculty Roles & Type</h3>
                                <Filter1 />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Filter 2 - Adviser, Block, Specialization</h3>
                                <Filter2 />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Repo Filter - Guest Repository</h3>
                                <RepoFilter />
                            </div>
                        </div>
                    </section>

                    {/* Sort Components */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white">Sort Components</h2>
                        <p className="text-sm text-gray-400">Sort panels with radio groups for different sorting criteria</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Sort 1 - Faculty</h3>
                                <Sort1 />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Sort 2 - Students</h3>
                                <Sort2 />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Sort 3 - Thesis</h3>
                                <Sort3 />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
