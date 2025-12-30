import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxWithLabel } from '@/components/ui/checkbox-with-label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RadioGroupItemWithLabel } from '@/components/ui/radio-group-with-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner, SpinnerCard, StatusBadge } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardIcon, CardBadge, HeaderCard, MetricCard, ArchiveCard, GroupCard, CommitteeCard, EndorsementCard, AdviseeGroupCard} from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { WizardStepper, WizardSteps, WizardStep, InteractiveWizard, WizardProgress } from '@/components/ui/wizard-stepper';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { DefaultHeader, RowColumn1Header, MethodologyHeader, ScheduledHeader, RevisionHeader, GradedHeader } from '@/components/ui/headers';
import { DefaultRows, RowColumn1, MethodologyRow, ScheduledRow, RevisionRow, GradedRow } from '@/components/ui/rows';
import { HomeIcon, SettingsIcon, UsersIcon, Moon, Sun, Plus, Trash2, ArrowRight, Loader2, Settings, ChevronDown, ChevronRight , CheckCircleIcon, FileText, TrendingUp, Users, Calendar1Icon, BookAIcon, BookIcon, BookOpen, Eye, ClockIcon, PinIcon} from 'lucide-react';   
import { SwitchButton } from '@/components/ui/switch-button';
import { cn } from '@/lib/utils';
import { Tabs, TabButton } from '@/components/ui/tabs';
import { DatePicker } from '@/components/date-picker';
import { SubmissionStatusChart } from '@/components/submission-status-bar';
import { PerformanceOverviewChart } from '@/components/performance-overview-ver-bar';
import { ResearchAreaChart } from '@/components/research-area-distribution-pie';
import { ArchivedJournalsChart } from '@/components/archived-journals-line';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Toaster } from '@/components/ui/sonner';
import { TimelineStepper, TimelineConnector, TimelineState } from '@/components/ui/wizard-timeline';
import NotificationModal from '@/components/modal/notification-modal';
import { NotificationList, NotificationListItem } from '@/components/ui/notification-list';
import StageSwitchToggle from '@/components/stage-toggle';
import { FileUpload } from '@/components/file-upload';
import FilePreview from '@/components/document-preview';
import { Timeline } from '@/components/timeline';
import { toast } from 'sonner';
import { AppHeader } from '@/components/app-header';
import { GlobalNavDropdown } from '@/components/app-header-management';

export default function UIShowcase() {
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
    const [switchView, setSwitchView] = useState<"By Semester" | "By Year">("By Semester");
    const [theme, setTheme] = useState("dark");

    // States for interactive logic
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [contentProgress, setContentProgress] = useState(0);
    const [evalValue, setEvalValue] = useState(0);

    // Auto-animate Content Loading and Eval Progress on mount
    useEffect(() => {
        const timer = setInterval(() => {
            setContentProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
            setEvalValue(prev => (prev >= 6 ? 0 : prev + 1));
        }, 5000); // Eval updates every 2 seconds
        return () => clearInterval(timer);
    }, []);

    // Manual Upload Logic
    const startUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 200);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Color Helpers based on theme
    const bgClass = theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
    const sectionClass = theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200";
    const subTextClass = theme === "dark" ? "text-gray-400" : "text-gray-500";
    
    // Faculty Management Dropdown Items (href to corresponding pages later)
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
        { 
            id: 'committee', 
            title: 'Committee', 
            children: [
                { title: 'Proposal Review', href: '/committee/proposals' }
            ] 
        },
        { 
            id: 'panel', 
            title: 'Panel', 
            children: [
                { title: 'Panel Thesis Review', href: '/panel/review' },
                { title: 'Defense Management', href: '/panel/defense' }
            ] 
        }
    ];

    const adminManagementItems = [
        { 
            id: 'admin-root', 
            title: 'Root', // This label won't show in Admin mode
            children: [
                { title: 'User Management', href: '#', isHeader: true },
                { title: 'Faculty', href: '/admin/faculty' },
                { title: 'Student', href: '/admin/student' },
                { title: 'System Configuration', href: '#', isHeader: true },
                { title: 'Academic Settings', href: '/admin/academic' },
                { title: 'Deadline', href: '/admin/deadline' },
                { title: 'Department Policies', href: '/admin/policies' },
                { title: 'Defense Management', href: '/admin/defense' }, // No header needed, it's a main item
            ] 
        }
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
                // Progress Tracking Section
                { title: 'Progress Tracking', href: '/student/progress', isHeader: true },
                { title: 'Overall Progress', href: '/student/progress/overall' },
                { title: 'Consultations', href: '/student/progress/consultations' },
                { title: 'Status Reports', href: '/student/progress/status-reports' },
                
                // Thesis Management Section
                { title: 'Thesis Management', href: '/student/thesis' },
                
                // Defense Management
                { title: 'Defense Management', href: '/student/defense' },
                
                // Compliance & IP Section
                { title: 'Compliance & IP', href: '/student/compliance', isHeader: true },
                { title: 'IP & Plagiarism', href: '/student/ip-plagiarism' },
                { title: 'Public Presentation', href: '/student/public-presentation' }
            ] 
        }
    ];
    
    return (
        <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
            <Head title="UI Components Showcase" />
            <div className="min-h-screen bg-gray-800 p-8">
                <div className="max-w-6xl mx-auto space-y-12">
                    
                    {/* Header */}
                    <header className="flex justify-between items-end border-b border-gray-700 pb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-white">UI Components Showcase</h1>
                            <p className="text-gray-300">Preview of all available UI components (40+ UI primitives + 4 charts + 12 table variants)</p>
                        </div>
                        <Button variant="tertiary" size="icon" onClick={toggleTheme} className="rounded-full shadow-inner border-2">
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </Button>
                    </header>

                    {/* Buttons */}
                    <div className="space-y-12 text-white">
                        <h2 className="text-2xl font-bold">Button Variants</h2>
                        
                        <VariantRow 
                            title="Primary" 
                            description="Main call-to-action buttons." 
                            variant="primary" 
                            theme={theme}
                        />
                        <VariantRow 
                            title="Secondary" 
                            description="Alternative actions with less weight." 
                            variant="secondary" 
                            theme={theme}
                        />
                        <VariantRow 
                            title="Tertiary" 
                            description="Danger actions like deletion." 
                            variant="tertiary" 
                            icon={<Trash2 className="size-4" />}
                            theme={theme}
                        />
                        <VariantRow 
                            title="Negative" 
                            description="Danger actions like deletion or cancellation."
                            variant="negative"
                            icon={<Trash2 className="size-4" />}
                            theme={theme}
                        />
                        <VariantRow 
                            title="Negative-Light" 
                            description="Danger actions like deletion or cancellation."
                            variant="negativelight"
                            icon={<Trash2 className="size-4" />}
                            theme={theme}
                        />
                        <VariantRow 
                            title="Ghost" 
                            description="Subtle style for toolbars." 
                            variant="ghost" 
                            icon={<Settings className="size-4" />}
                            theme={theme}
                        />
                        <VariantRow 
                            title="Link" 
                            description="Textual links styled as buttons for navigation."
                            variant="link"
                            icon={<Settings className="size-4" />}
                            theme={theme}
                        />
                    </div>

                    {/* Inputs */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Inputs</h2>
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email</Label>
                                <Input id="email" type="email" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">Password</Label>
                                <Input id="password" type="password" placeholder="Enter password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabled" className="text-white">Disabled Input</Label>
                                <Input id="disabled" disabled placeholder="Disabled" />
                            </div>
                        </div>
                    </section>

                    {/* Radio Group */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Radio Group</h2>
                        <div className="max-w-md">
                            <Label className="text-white">Choose your role</Label>
                            <RadioGroup defaultValue="student" className="mt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="student" id="radio-student" />
                                    <Label htmlFor="radio-student" className="font-normal cursor-pointer text-white">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="faculty" id="radio-faculty" />
                                    <Label htmlFor="radio-faculty" className="font-normal cursor-pointer text-white">Faculty</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="admin" id="radio-admin" />
                                    <Label htmlFor="radio-admin" className="font-normal cursor-pointer text-white">Admin</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </section>

                    {/* Radio Group With Label */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Radio Group With Label (Integrated)</h2>
                        <p className="text-sm text-gray-400">Radio items with labels that change weight and color on selection</p>
                        <div className="max-w-md bg-white p-6 rounded-lg">
                            <Label className="text-black mb-3 block">Select your preferred contact method</Label>
                            <RadioGroup defaultValue="email" className="space-y-3">
                                <RadioGroupItemWithLabel value="email" id="contact-email" label="Email" />
                                <RadioGroupItemWithLabel value="phone" id="contact-phone" label="Phone" />
                                <RadioGroupItemWithLabel value="sms" id="contact-sms" label="SMS" />
                            </RadioGroup>
                        </div>
                    </section>

                    {/* Checkboxes */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Checkboxes</h2>
                        <div className="space-y-3 max-w-md">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms" className="font-normal cursor-pointer text-white">
                                    Accept terms and conditions
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="marketing" defaultChecked />
                                <Label htmlFor="marketing" className="font-normal cursor-pointer text-white">
                                    Receive marketing emails (checked by default)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="disabled-check" disabled />
                                <Label htmlFor="disabled-check" className="font-normal text-white">
                                    Disabled checkbox
                                </Label>
                            </div>
                        </div>
                    </section>

                    {/* Checkbox With Label */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Checkbox With Label (Integrated)</h2>
                        <p className="text-sm text-gray-400">Checkbox with label that changes state on hover and checked</p>
                        <div className="space-y-3 max-w-md bg-white p-6 rounded-lg">
                            <CheckboxWithLabel id="option1" label="Enable notifications" />
                            <CheckboxWithLabel id="option2" label="Subscribe to newsletter" defaultChecked />
                            <CheckboxWithLabel id="option3" label="Remember my preferences" />
                        </div>
                    </section>

                    {/* Select */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Select Dropdown</h2>
                        <div className="max-w-md space-y-2">
                            <Label className="text-white">Choose a fruit</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                    <SelectItem value="mango">Mango</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </section>

                    {/* Alert */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Alert</h2>
                        <div className="max-w-md space-y-4">
                            <Alert>
                                <div className="text-white">
                                    <div className="font-semibold">Note</div>
                                    <div className="text-sm">This is an informational alert message.</div>
                                </div>
                            </Alert>
                        </div>
                    </section>

                    {/* Avatar */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Avatar</h2>
                        <div className="flex gap-4 items-center">
                            <Avatar>
                                <div className="w-10 h-10 rounded-full bg-[#730000] flex items-center justify-center text-white font-semibold">
                                    JD
                                </div>
                            </Avatar>
                            <Avatar>
                                <div className="w-10 h-10 rounded-full bg-[#FFBD00] flex items-center justify-center text-gray-900 font-semibold">
                                    AB
                                </div>
                            </Avatar>
                        </div>
                    </section>

                    {/* Badge */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Badge</h2>
                        <div className="flex flex-wrap gap-3">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="outline">Outline</Badge>
                        </div>
                    </section>

                    {/* Breadcrumb */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Breadcrumb</h2>
                        <Breadcrumb items={["Home", "Components", "Dashboard"]} />
                    </section>

                    {/* ===== Cards ===== */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white border-l-4 border-[#FFBD00] pl-4"> Cards </h2>
                        <div className="max-w-md">

                            {/* ===== Header Card (per page) ===== */}
                            <h2 className="text-lg font-semibold text-white mb-4"> -- Header Card </h2>

                           {/* Without icon yet */}
                           {/* icon={} -> for adding an icon */} 
                            <HeaderCard
                            title="Card Title Here"
                            description="Card Description"
                            />

                            {/* Metric Cards */}
                            <h2 className="text-lg font-semibold text-white py-4 mb-4"> Metric Cards </h2>
                        
                            {/* Metric Card */}
                            {/* icon={} -> for adding an icon */} 
                            <h2 className='px-4'> Metric Card </h2>
                            <MetricCard
                            icon={<TrendingUp className="text-primary-foreground-2" />} 
                            title="Card Title Here"
                            >
                            <div className='flex items-center justify-center h-full'>
                                <p> Content Here </p>
                            </div>
                            </MetricCard>

                            {/* Progress Card - Metric Card variant*/}
                            <h2 className='px-4'> Progress Card  </h2>
                            <MetricCard 
                                variant="progress"
                                groupCode="Group Code"
                                thesisTitle="Thesis Title"
                                currentStage="Stage Here"
                                progress={80}
                                statusBadge= "Badge Here"
                            />

                            {/* ===== Committee Card - Proposal Review ===== */}
                            <h2 className="py-4 text-lg font-semibold text-white"> Committee Card</h2>
                            <CommitteeCard
                                thesisTitle="Thesis Title"
                                adviserName="Adviser Name"
                                blockSection="Block/Section"
                                progress={10}
                                currentStage={3}
                                totalStages={6}
                            />

                            {/* ===== Archive Card ===== */}
                            <div>
                            <h2 className="text-lg font-semibold text-white mb-4"> Archive Card</h2>
                            
                            <ArchiveCard
                                title="Thesis Title "
                                members={["Member 1", "Member 2", "Member 3", "Member 4"]}
                                date="Sample Date"
                                badges={["Sample Badge 1", "Sample Badge 2", "Sample Badge 3"]}
                            />
                            </div>

                            {/* ===== Group Card ===== */}
                            <h2 className="text-lg font-semibold text-white"> Group Card </h2>
                            <p className="text-sm text-gray-400"> Used in Student Management </p>
                            <GroupCard
                                groupCode="Group Code"
                                groupDescription="Group Description"
                                thesisTitle="Thesis Title"
                                thesisStage="Thesis Stage"
                                members={["Member 1", "Member 2", "Member 3", "Member 4"]}
                                adviserName="Adviser Name"
                                />

                            {/* ===== Advisee Group Card (Thesis Adviser/Panel) ===== */}
                            <h2 className="text-lg font-semibold text-white"> Advisee Group Card </h2>
                            <AdviseeGroupCard
                                groupCode="Group Code"
                                badge="Badge Here"
                                thesisTitle="Thesis Title Here"
                                section="Section"
                                numberofMembers='Number of Members Here'
                                numberofSubmissions="5"
                                lastSubmissionDate="Date Here"
                            />

                            {/* ===== Panel Endorsement Card ===== */}
                            <h2 className="text-lg font-semibold text-white"> Panel Endorsement Card </h2>

                            <EndorsementCard
                                thesisTitle="Thesis Title Here"
                                groupCode="Group Code"
                                badge="Badge Here"
                                proponents={["Proponent 1", "Proponent 2", "Proponent 3", "Proponent 4"]}
                                block="BSCPE 3-3"
                                adviserName="Adviser Name"
                                approvalDate={new Date('2025-12-05')}
                            />
                        </div>
                    </section>
                                    
                    {/* Collapsible */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Collapsible</h2>
                        <div className="max-w-5xl space-y-4">
                            {/* FAQ ITEM 1 */}
                            <Collapsible>
                                <CollapsibleTrigger>
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn("transition-colors duration-200 uppercase text-[10px] font-bold tracking-tight",
                                            "group-data-[state=open]:bg-primary-foreground-2 group-data-[state=open]:text-primary" )}>
                                            General
                                        </Badge>
                                        <span className="font-medium text-left">
                                            How do I view defense schedules for my block?
                                        </span>
                                    </div>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                    Use the 'Filter by Block' dropdown at the top of the page to select your specific block. 
                                    The table will automatically update to show only defenses for your selected block.
                                </CollapsibleContent>
                            </Collapsible>

                            {/* FAQ ITEM 2 */}
                            <Collapsible>
                                <CollapsibleTrigger>
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn("transition-colors duration-200 uppercase text-[10px] font-bold tracking-tight",
                                            "group-data-[state=open]:bg-primary-foreground-2 group-data-[state=open]:text-primary" )}>
                                            General
                                        </Badge>
                                        <span className="font-medium text-left">
                                            Can I request a change in my defense schedule?
                                        </span>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    Defense schedule changes must be coordinated through your section adviser 
                                    and approved by the department head.
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </section>

                    {/* Dialog */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Dialog (Modal)</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Open Dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-white">Dialog Title</DialogTitle>
                                    <DialogDescription>
                                        This is a dialog description. You can put any content here.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-gray-900 text-sm">Dialog content goes here.</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </section>

                    {/* Dropdown Menu */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Dropdown Menu</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>Open Menu</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>

                    {/* Wizard Progress */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Wizard Progress</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white">Individual States</h3>
                                <div className="space-y-4">
                                    <div className="bg-transparent rounded-xl p-6">
                                        <p className="text-sm text-gray-400 mb-4 font-dm">After State (Completed)</p>
                                        <WizardProgress
                                            stepNumber={1}
                                            stepLabel="Step 1"
                                            state="after"
                                        />
                                    </div>
                                    
                                    <div className="bg-transparent rounded-xl p-6">
                                        <p className="text-sm text-gray-400 mb-4 font-dm">Current State (In Progress)</p>
                                        <WizardProgress
                                            stepNumber={2}
                                            stepLabel="Step 2"
                                            state="current"
                                            progress={50}
                                        />
                                    </div>
                                    
                                    <div className="bg-transparent rounded-xl p-6">
                                        <p className="text-sm text-gray-400 mb-4 font-dm">Before State (Incomplete)</p>
                                        <WizardProgress
                                            stepNumber={3}
                                            stepLabel="Step 3"
                                            state="before"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white">States Example</h3>
                                <div className="bg-transparent rounded-xl p-8">
                                    <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-6 items-center">
                                        <WizardProgress
                                            stepNumber={1}
                                            stepLabel="Personal Information"
                                            state="after"
                                            className="contents"
                                        />
                                        <WizardProgress
                                            stepNumber={2}
                                            stepLabel="Academic Background"
                                            state="after"
                                            className="contents"
                                        />
                                        <WizardProgress
                                            stepNumber={3}
                                            stepLabel="Document Upload"
                                            state="current"
                                            progress={75}
                                            className="contents"
                                        />
                                        <WizardProgress
                                            stepNumber={4}
                                            stepLabel="Review and Submit"
                                            state="before"
                                            className="contents"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>    

                    {/* Wizard Stepper */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Wizard Stepper</h2>
                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white">4 Steps</h3>
                                <InteractiveWizard stepCount={4} />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white">3 Steps</h3>
                                <InteractiveWizard stepCount={3} />
                            </div>
                        </div>
                    </section>              

                    {/* Input OTP */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Input OTP</h2>
                        <div className="max-w-md space-y-2">
                            <Label className="text-white">Enter verification code</Label>
                            <InputOTP maxLength={6}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </section>

                    {/* Separator */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Separator</h2>
                        <div className="max-w-md">
                            <div className="space-y-4">
                                <p className="text-white">Content above separator</p>
                                <Separator />
                                <p className="text-white">Content below separator</p>
                            </div>
                        </div>
                    </section>

                    {/* Sheet */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Sheet (Side Panel)</h2>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button>Open Sheet</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle className="text-white">Sheet Title</SheetTitle>
                                    <SheetDescription>
                                        This is a sheet (side panel) component.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="py-4">
                                    <p className="text-gray-900 text-sm">Sheet content goes here.</p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </section>

                    {/* Skeleton */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Skeleton</h2>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl border transition-colors duration-300 ${sectionClass}`}>
                            
                            {/* 1. Scanning Loading */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>1. Default Loading</h3>
                                <Skeleton variant="default" />
                            </div>

                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>2. Scan Loading</h3>
                                <Skeleton variant="scanning" />
                            </div>

                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>3. Upload Loading</h3>
                                <Skeleton variant="progress" progress={uploadProgress} />
                                <Button 
                                    variant="primary" 
                                    onClick={startUpload} 
                                    disabled={isUploading}
                                    className="w-full"
                                >
                                    {isUploading ? `Uploading ${Math.round(uploadProgress)}%` : "Start Upload"}
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>4. Eval Progress (Step Based)</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <Skeleton variant="eval" progress={evalValue} />
                                    <Skeleton variant="eval" progress={6} />
                                </div>
                            </div>

                            {/* 4. Loading with Contents and Progress */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>5. Loading Contents</h3>
                                <Skeleton variant="contents" progress={contentProgress} statusText="Fetching Thesis Data..." />
                                <Skeleton variant="contents" progress={contentProgress * 0.7} statusText="Syncing Repository..." />
                            </div>

                            {/* 5. Added: Minimal Indeterminate */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>5. System Processing</h3>
                                <div className="p-4 rounded-lg border border-dashed border-muted-foreground/20">
                                    <p className="text-[10px] text-muted-foreground mb-2">Initializing System...</p>
                                    <Skeleton variant="indeterminate" />
                                </div>
                            </div>

                            {/* 6. Added: Centered Percentage */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>6. Metric Loading</h3>
                                <div className="flex items-center justify-center h-24 rounded-lg bg-muted/5 border">
                                    <Skeleton variant="centered-pct" progress={contentProgress} className="w-full" />
                                </div>
                            </div>

                            {/* 7. Added: Embedded Status (Compact) */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>7. Embedded Task Status</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Skeleton 
                                        variant="embedded" 
                                        progress={uploadProgress} 
                                        statusText="Database Migration" 
                                    />
                                    <Skeleton 
                                        variant="embedded" 
                                        progress={contentProgress} 
                                        statusText="Asset Compression" 
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Spinner */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Spinners</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            
                            {/* NOTE: Di ko sure if need pa itong component na ito or placeholder lang... uncomment nyo nalang if ever salamats */}
                            {/* <Spinner />
                            <span className="text-sm text-gray-400">Loading...</span> */}

                            <SpinnerCard type="ring" label="Standard Circular" />
                            <SpinnerCard type="spokes" label="Spokes Spinner" />
                            <SpinnerCard type="dots" label="Bouncing Dots Spinner" />
                            <SpinnerCard type="pulse" label="Refresh Spinner" />

                            <SpinnerCard 
                                type="bars-pulse" 
                                size="md" 
                                label="Pulsing Bars" 
                            />
                            
                            <SpinnerCard 
                                type="bars-scale" 
                                size="md" 
                                label="Scaling Bars" 
                            />

                            <SpinnerCard 
                                type="ring" 
                                variant="red" 
                                label="Critical Load" 
                            />
                            
                            <div className="flex flex-col gap-3 justify-center">
                                <p className="text-[10px] font-bold uppercase opacity-40 text-white">Status Badges</p>
                                <StatusBadge label="Pending Task" variant="orange" />
                                <StatusBadge label="Syncing Data" variant="yellow" />
                                <StatusBadge label="System Error" variant="red" />
                            </div>
                        </div>
                    </section>

                    {/* Toggle */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Toggle</h2>
                        <p className="text-sm text-gray-400">Single toggle buttons with normal, pressed, and disabled states</p>
                        <div className="flex gap-3">
                            <Toggle>Normal</Toggle>
                            <Toggle defaultPressed>Pressed</Toggle>
                            <Toggle disabled>Disabled</Toggle>
                        </div>
                    </section>

                    {/* Toggle Group */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Toggle Group</h2>
                        <p className="text-sm text-gray-400">Group of connected toggle buttons for mutually exclusive options</p>
                        <ToggleGroup type="single" defaultValue="left">
                            <ToggleGroupItem value="left">Left</ToggleGroupItem>
                            <ToggleGroupItem value="center">Center</ToggleGroupItem>
                            <ToggleGroupItem value="right">Right</ToggleGroupItem>
                        </ToggleGroup>
                    </section>

                    {/* Tooltip */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Tooltip</h2>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="tertiary">Hover me</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-white">This is a tooltip</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </section>

                    {/* Tabs */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Tabs (Custom Figma Design)</h2>
                        <p className="text-sm text-gray-400">Custom styled tab buttons with maroon colors and inset shadow</p>
                        <div className="max-w-2xl space-y-4">
                            <Tabs tabs={['Overview', 'Details', 'Settings']} defaultTab="Overview" />
                            <div className="bg-white p-6 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    These are custom-styled tabs matching the Figma design with maroon background (#730000),
                                    gold text (#FFBD00), rounded tops, and inset shadows. Active tabs use a lighter maroon (#9b000a).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Switch Button */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Switch Button</h2>
                        <div className="max-w-md space-y-2">
                            <SwitchButton
                                option1="By Semester"
                                option2="By Year"
                                value={switchView}
                                onChange={(v) => setSwitchView(v as "By Semester" | "By Year")} />
                        </div>
                    </section>

                    {/* Icon */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Icon Wrapper</h2>
                        <p className="text-sm text-gray-400">Wrapper component for Lucide icons</p>
                        <div className="flex gap-4 items-center">
                            <Icon iconNode={HomeIcon} className="w-6 h-6 text-gray-900" />
                            <Icon iconNode={SettingsIcon} className="w-6 h-6 text-gray-900" />
                            <Icon iconNode={UsersIcon} className="w-6 h-6 text-gray-900" />
                        </div>
                    </section>

                    {/* Navigation Menu*/}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Navigation Menu</h2>
                        <p className="text-sm text-gray-400">Main application header with branding, top navigation, and utility actions.</p>

                        <AppHeader breadcrumbs={[{ title: 'Home', href: '#' }, { title: 'Showcase', href: '#' }]} />
                    </section>

                    {/* Faculty List Dropdown Variants Section */}
                    <section className="space-y-4" onMouseLeave={() => {/* Option to close menu when leaving section */}}>
                        <h2 className="text-2xl font-semibold text-white">Faculty Management Dropdown</h2>
                        <p className="text-sm text-muted-foreground">
                            Hover over the tabs to see the specific management variants (Adviser, Committee, or Panel).
                        </p>

                        <div className="p-5 bg-background rounded-xl border border-border flex justify-start gap-10 items-start min-h-[50px]">
                            <GlobalNavDropdown 
                            label="Management" 
                            variant="admin" 
                            items={adminManagementItems} 
                            />

                            <GlobalNavDropdown 
                            label="Management" 
                            variant="faculty" 
                            items={facultyManagementItems} 
                            />

                            <GlobalNavDropdown 
                            label="Management" 
                            variant="coordinator" 
                            items={coordinatorManagementItems} 
                            />
                        </div>
                    </section>

                    {/* Student List Dropdown Variants Section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Student Management Dropdown</h2>
                        <p className="text-sm text-gray-400">Hover over the tabs to see management routes for students</p>
                        
                        <div className="p-5 bg-background rounded-xl border border-border flex justify-start gap-10 items-start min-h-[50px]">
                            <GlobalNavDropdown 
                                label="Management" 
                                variant="student" 
                                items={studentManagementItems} 
                            />
                        </div>
                    </section>


                    {/* Placeholder Pattern */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Placeholder Pattern</h2>
                        <p className="text-sm text-gray-400">Decorative pattern for empty states</p>
                        <div className="w-full h-32 bg-white border rounded-lg overflow-hidden relative">
                            <PlaceholderPattern className="absolute inset-0 stroke-gray-300" />
                        </div>
                    </section>

                    {/* Sidebar Primitive */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Sidebar Primitive</h2>
                        <p className="text-sm text-gray-400">Base sidebar component (used in app-sidebar)</p>
                        <div className="h-64 border rounded-lg overflow-hidden">
                            <SidebarProvider>
                                <Sidebar>
                                    <SidebarHeader className="border-b p-4">
                                        <p className="text-sm font-semibold text-white">Sidebar Header</p>
                                    </SidebarHeader>
                                    <SidebarContent>
                                        <SidebarGroup>
                                            <SidebarGroupLabel className="text-white">Navigation</SidebarGroupLabel>
                                            <SidebarGroupContent>
                                                <SidebarMenu>
                                                    <SidebarMenuItem>
                                                        <SidebarMenuButton>
                                                            <HomeIcon className="w-4 h-4" />
                                                            <span>Home</span>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                    <SidebarMenuItem>
                                                        <SidebarMenuButton>
                                                            <SettingsIcon className="w-4 h-4" />
                                                            <span>Settings</span>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                </SidebarMenu>
                                            </SidebarGroupContent>
                                        </SidebarGroup>
                                    </SidebarContent>
                                    <SidebarFooter className="border-t p-4">
                                        <p className="text-xs text-gray-400">Sidebar Footer</p>
                                    </SidebarFooter>
                                </Sidebar>
                            </SidebarProvider>
                        </div>
                    </section>

                    {/* Date Picker */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Date Picker & Calendar</h2>
                        <div className="max-w-md space-y-4">
                            <div className="space-y-2">
                                <Label className="text-white">Short Format (Month Year)</Label>
                                <DatePicker displayFormat="short" placeholder="Select date" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Full Format (MM-DD-YY)</Label>
                                <DatePicker displayFormat="full" placeholder="Select date" />
                            </div>
                        </div>
                    </section>

                    {/* Graphs Section */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold text-white border-l-4 border-[#FFBD00] pl-4">Graphs & Charts</h2>

                        {/* Submission Status Bar Chart */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">1. Submission Status (Horizontal Bar)</h3>
                            <SubmissionStatusChart />
                        </div>

                        {/* Performance Overview Vertical Bar Chart */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">2. Performance Overview (Vertical Stacked Bar)</h3>
                            <PerformanceOverviewChart />
                        </div>

                        {/* Research Area Pie Chart */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">3. Research Area Distribution (Donut Chart)</h3>
                            <ResearchAreaChart />
                        </div>

                        {/* Archived Journals Line Chart */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">4. Archived Journals Trend (Line Chart)</h3>
                            <ArchivedJournalsChart />
                        </div>
                    </section>

                    {/* Toast */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Toast Notifications</h2>
                        <p className="text-sm text-gray-400">Alert notifications with different variants and dismissible functionality</p>
                        <div className="space-y-4 max-w-2xl">
                            <Toast variant="info" size="medium">
                                <ToastTitle>Information</ToastTitle>
                                <ToastDescription>This is an informational toast message.</ToastDescription>
                            </Toast>
                            <Toast variant="success" size="medium">
                                <ToastTitle>Success</ToastTitle>
                                <ToastDescription>Your action was completed successfully.</ToastDescription>
                            </Toast>
                            <Toast variant="warning" size="medium">
                                <ToastTitle>Warning</ToastTitle>
                                <ToastDescription>Please be cautious with this action.</ToastDescription>
                            </Toast>
                            <Toast variant="error" size="medium">
                                <ToastTitle>Error</ToastTitle>
                                <ToastDescription>Something went wrong. Please try again.</ToastDescription>
                            </Toast>
                        </div>
                    </section>

                    {/* Sonner Toast Library */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Sonner (Toast Library)</h2>
                        <p className="text-sm text-gray-400">Modern toast notifications with animations</p>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={() => toast.success('Operation completed successfully!')}>
                                Show Success Toast
                            </Button>
                            <Button onClick={() => toast.error('An error occurred')}>
                                Show Error Toast
                            </Button>
                            <Button onClick={() => toast.info('This is an info message')}>
                                Show Info Toast
                            </Button>
                            <Button onClick={() => toast.warning('Warning: Please review')}>
                                Show Warning Toast
                            </Button>
                            <Button onClick={() => toast.loading('Loading...')}>
                                Show Loading Toast
                            </Button>
                        </div>
                        <Toaster />
                    </section>

                    {/* Table */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Table</h2>
                        <p className="text-sm text-gray-400">Data table component with header, body, and footer</p>
                        <div className="bg-white p-4 rounded-lg">
                            <Table>
                                <TableCaption>A list of recent thesis submissions</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Thesis Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">John Doe</TableCell>
                                        <TableCell>Machine Learning in Healthcare</TableCell>
                                        <TableCell>Approved</TableCell>
                                        <TableCell className="text-right">95</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Jane Smith</TableCell>
                                        <TableCell>Blockchain Applications</TableCell>
                                        <TableCell>Pending</TableCell>
                                        <TableCell className="text-right">-</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Bob Johnson</TableCell>
                                        <TableCell>IoT Smart Systems</TableCell>
                                        <TableCell>Approved</TableCell>
                                        <TableCell className="text-right">92</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </section>

                    {/* Custom Table Headers & Rows */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold text-white">Custom Table Headers & Rows</h2>
                        <p className="text-sm text-gray-400">Specialized table header and row components with different variants</p>

                        <div className="space-y-6">
                            {/* Default */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Default</h3>
                                <div className="overflow-hidden rounded-lg">
                                    <DefaultHeader />
                                    <DefaultRows />
                                </div>
                            </div>

                            {/* Row Column 1 */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Extended Row (9 Columns)</h3>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[1200px]">
                                        <RowColumn1Header />
                                        <RowColumn1 />
                                    </div>
                                </div>
                            </div>

                            {/* Methodology */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Methodology Change</h3>
                                <div className="overflow-hidden rounded-lg">
                                    <MethodologyHeader />
                                    <MethodologyRow />
                                </div>
                            </div>

                            {/* Scheduled */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Scheduled Defenses</h3>
                                <div className="overflow-hidden rounded-lg">
                                    <ScheduledHeader />
                                    <ScheduledRow />
                                </div>
                            </div>

                            {/* Revision */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">For Revision</h3>
                                <div className="overflow-hidden rounded-lg">
                                    <RevisionHeader />
                                    <RevisionRow />
                                </div>
                            </div>

                            {/* Graded */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Graded Submissions</h3>
                                <div className="overflow-hidden rounded-lg">
                                    <GradedHeader />
                                    <GradedRow />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Popover */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Popover</h2>
                        <p className="text-sm text-gray-400">Floating content container triggered by a button</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button>Open Popover</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-white">Thesis Guidelines</h4>
                                    <p className="text-sm text-gray-600">
                                        Please ensure your thesis follows the formatting guidelines and includes all required sections.
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </section>

                    {/* Wizard Timeline */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Wizard Timeline</h2>
                        <p className="text-sm text-gray-400">Vertical timeline stepper with state indicators</p>
                        <div className="flex gap-8 items-start max-w-2xl">
                            <TimelineState state="past" label="Completed" />
                            <TimelineState state="current" label="In Progress" />
                            <TimelineState state="upcoming" label="Upcoming" />
                        </div>
                    </section>

                    {/* Notification Modal */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Notification Modal</h2>
                        <p className="text-sm text-gray-400">Full-featured notification panel with different notification types</p>
                        <div className="max-w-md">
                            <NotificationModal isOpen={true} />
                        </div>
                    </section>

                    {/* Notification List Items */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Notification List Items</h2>
                        <p className="text-sm text-gray-400">Individual notification items with variants for different types and states</p>
                        <div className="max-w-2xl space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Notification Types</h3>
                                <div className="bg-white rounded-lg overflow-hidden">
                                    <NotificationList maxHeight="auto">
                                        <NotificationListItem
                                            type="schedule"
                                            title="Defense Schedule Updated"
                                            description="Defense for 'Machine Learning Applications in Healthcare Diagnostics' has been updated."
                                            timestamp="2d ago"
                                            isUnread={true}
                                        />
                                        <NotificationListItem
                                            type="assignment"
                                            title="New Panel Assignment"
                                            description="You have been assigned as a panel member for the defense of 'Blockchain-Based Voting System'."
                                            timestamp="2d ago"
                                            isUnread={true}
                                        />
                                        <NotificationListItem
                                            type="reminder"
                                            title="Upcoming Defense Reminder"
                                            description="Reminder: Defense for 'IoT-Enabled Smart Home Energy Management System' is tomorrow."
                                            timestamp="3d ago"
                                            isUnread={false}
                                        />
                                        <NotificationListItem
                                            type="system"
                                            title="System Maintenance Scheduled"
                                            description="The Defense Management System will undergo scheduled maintenance on December 5, 2025."
                                            timestamp="3d ago"
                                            isUnread={false}
                                        />
                                    </NotificationList>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">Read vs Unread States</h3>
                                <div className="bg-white rounded-lg overflow-hidden">
                                    <NotificationList maxHeight="auto">
                                        <NotificationListItem
                                            type="reminder"
                                            title="Unread Notification"
                                            description="This notification has not been read yet. Notice the blue background and red dot indicator."
                                            timestamp="1h ago"
                                            isUnread={true}
                                        />
                                        <NotificationListItem
                                            type="reminder"
                                            title="Read Notification"
                                            description="This notification has been read. It has a white background with no indicator dot."
                                            timestamp="2h ago"
                                            isUnread={false}
                                        />
                                    </NotificationList>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stage Switching */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Stage Switching Toggle</h2>
                        <p className="text-sm text-gray-400">Three-option toggle for MOR, DP1, and DP2 stages</p>
                        <StageSwitchToggle />
                    </section>

                    {/* File Upload */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">File Upload</h2>
                        <p className="text-sm text-gray-400">Drag and drop or click to upload files with progress tracking</p>
                        <div className="max-w-2xl">
                            <FileUpload />
                        </div>
                    </section>

                    {/* Document Preview */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Document Preview</h2>
                        <p className="text-sm text-gray-400">Preview uploaded documents with action buttons</p>
                        <div className="max-w-2xl">
                            <FilePreview
                                fileUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                                fileName="Sample_Thesis_Document.pdf"
                                fileType="pdf"
                                fileSize="2.4 MB"
                                onDownload={() => console.log('Download clicked')}
                                onEdit={() => console.log('Edit clicked')}
                                onDelete={() => console.log('Delete clicked')}
                            />
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Timeline View</h2>
                        <p className="text-sm text-gray-400">Academic timeline with events and milestones</p>
                        <div className="max-w-4xl">
                            <Timeline />
                        </div>
                    </section>

                    {/* Color Palette */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Theme Colors</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[#730000]" />
                                <p className="text-sm font-medium text-white">Maroon</p>
                                <p className="text-xs text-gray-400">#730000</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[#FFBD00]" />
                                <p className="text-sm font-medium text-white">Yellow</p>
                                <p className="text-xs text-gray-400">#FFBD00</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-white border-2 border-gray-200" />
                                <p className="text-sm font-medium text-white">Background</p>
                                <p className="text-xs text-gray-400">White</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-black" />
                                <p className="text-sm font-medium text-white">Foreground</p>
                                <p className="text-xs text-gray-400">Black</p>
                            </div>
                        </div>
                    </section>

                    
                </div>
            </div>
        </div>
    );
}

/**
 * Helper component for the Button Grid
 */
function VariantRow({ title, description, variant, theme, icon = <Plus className="size-4" /> }: any) {
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-200";

    return (
        <section className="space-y-4">
            <div className="flex flex-col">
                <h3 className="text-lg font-bold">{title} Variant</h3>
                <p className="text-sm opacity-60">{description}</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-xl border ${cardBg}`}>
                {/* Column 1: Sizes */}
                <div className="space-y-3">
                    <p className="text-foreground text-[10px] font-bold uppercase opacity-40">Sizes</p>
                    <div className="flex flex-col gap-2 items-start">
                        <Button variant={variant} size="sm">Small</Button>
                        <Button variant={variant} size="default">Default</Button>
                        <Button variant={variant} size="lg">Large</Button>
                    </div>
                </div>

                {/* Column 2: Icons */}
                <div className="space-y-3">
                    <p className="text-foreground text-[10px] font-bold uppercase opacity-40">Layouts</p>
                    <div className="flex flex-col gap-2 items-start">
                        <Button variant={variant}>{icon} Left Icon</Button>
                        <Button variant={variant}>Right Icon <ArrowRight className="size-4" /></Button>
                    </div>
                </div>

                {/* Column 3: Icon Only */}
                <div className="space-y-3">
                    <p className="text-foreground text-[10px] font-bold uppercase opacity-40">Square / Icon Only</p>
                    <div className="flex items-center gap-2">
                        <Button variant={variant} size="icon" className="size-8">{icon}</Button>
                        <Button variant={variant} size="icon" className="size-10">{icon}</Button>
                        <Button variant={variant} size="icon" className="size-12">{icon}</Button>
                    </div>
                </div>

                {/* Column 4: Misc */}
                <div className="space-y-3">
                    <p className="text-foreground text-[10px] font-bold uppercase opacity-40">Misc</p>
                    <Button variant={variant} className="w-full justify-between">
                        Dropdown <ChevronDown className="size-4" />
                    </Button>
                    <Button variant={variant} size="sm" className="rounded-full px-6">Pill Button</Button>
                </div>
            </div>
        </section>
    );
}