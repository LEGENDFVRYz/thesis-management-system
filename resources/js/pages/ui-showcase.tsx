import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxWithLabel } from '@/components/ui/checkbox-with-label';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItemWithLabel } from '@/components/ui/radio-group-with-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { WizardStepper, WizardSteps, WizardStep, InteractiveWizard } from '@/components/ui/wizard-stepper';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { HomeIcon, SettingsIcon, UsersIcon, Moon, Sun, Plus, Trash2, ArrowRight, Loader2, Settings, ChevronDown} from 'lucide-react';
import { SwitchButton } from '@/components/ui/switch-button';
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
import StageSwitchToggle from '@/components/stage-switching';
import { toast } from 'sonner';

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
        
    return (
        <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
            <Head title="UI Components Showcase" />
            <div className="min-h-screen bg-gray-800 p-8">
                <div className="max-w-6xl mx-auto space-y-12">
                    
                    {/* Header */}
                    <header className="flex justify-between items-end border-b border-gray-700 pb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-white">UI Components Showcase</h1>
                            <p className="text-gray-300">Preview of all available UI components (37 total + 4 charts)</p>
                        </div>
                        <Button variant="tertiary" size="icon" onClick={toggleTheme} className="rounded-full shadow-inner border-2">
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </Button>
                    </header>

                    {/* Buttons */}
                    <div className="space-y-12 text-white">
                        <h2 className="text-2xl font-bold border-l-4 border-[#FFBD00] pl-4">Button Variants</h2>
                        
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
                        <div className="bg-white p-6 rounded-lg max-w-md">
                            <Label className="text-gray-900 mb-3 block">Choose your role</Label>
                            <RadioGroup defaultValue="student" className="gap-4">
                                <RadioGroupItemWithLabel value="student" id="radio-student" label="Student" />
                                <RadioGroupItemWithLabel value="faculty" id="radio-faculty" label="Faculty" />
                                <RadioGroupItemWithLabel value="admin" id="radio-admin" label="Admin" />
                            </RadioGroup>
                        </div>
                    </section>

                    {/* Checkboxes */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Checkboxes</h2>
                        <div className="bg-white p-6 rounded-lg max-w-md">
                            <div className="space-y-3">
                                <CheckboxWithLabel id="terms" label="Accept terms and conditions" />
                                <CheckboxWithLabel id="marketing" label="Receive marketing emails" defaultChecked />
                                <CheckboxWithLabel id="newsletter" label="Subscribe to newsletter" />
                            </div>
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
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="text-white">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/components" className="text-white">Components</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white">Breadcrumb</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </section>

                    {/* Card */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Card</h2>
                        <div className="max-w-md">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-white">Card Title</CardTitle>
                                    <CardDescription>Card description goes here</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white">This is the card content area.</p>
                                </CardContent>
                                <CardFooter>
                                    <Button>Action</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </section>

                    {/* Collapsible */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Collapsible</h2>
                        <div className="max-w-md">
                            <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="tertiary" className="w-full justify-between">
                                        <span>Can I use this in my project?</span>
                                        <span>{isCollapsibleOpen ? '−' : '+'}</span>
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 p-4 border rounded-md">
                                    <p className="text-gray-900 text-sm">
                                        Yes! You can use all these components in your project. They are built with Radix UI and styled with Tailwind CSS.
                                    </p>
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
                        <h2 className="text-2xl font-semibold">Skeleton</h2>
                        {/* Replaced bg-[#1e1e1e] with sectionClass */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl border transition-colors duration-300 ${sectionClass}`}>
                            
                            {/* 1. Default Loading */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>1. Default Loading (Scanning)</h3>
                                <Skeleton variant="default" />
                                <Skeleton variant="default" className="w-3/4" />
                            </div>

                            {/* 2. Upload Loading */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>2. Upload Loading</h3>
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

                            {/* 3. Eval Progress */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>3. Eval Progress (Step Based)</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <Skeleton variant="eval" progress={evalValue} />
                                    <Skeleton variant="eval" progress={6} />
                                </div>
                            </div>

                            {/* 4. Loading Contents */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>4. Loading Contents</h3>
                                <Skeleton variant="contents" progress={contentProgress} statusText="Fetching Thesis Data..." />
                                <Skeleton variant="contents" progress={contentProgress * 0.7} statusText="Syncing Repository..." />
                            </div>
                        </div>
                    </section>

                    {/* Spinner */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Spinner</h2>
                        <div className="flex gap-4 items-center">
                            <Spinner />
                            <span className="text-sm text-gray-400">Loading...</span>
                        </div>
                    </section>

                    {/* Toggle */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Toggle</h2>
                        <div className="flex gap-3">
                            <Toggle>Normal</Toggle>
                            <Toggle defaultPressed>Pressed</Toggle>
                            <Toggle disabled>Disabled</Toggle>
                        </div>
                    </section>

                    {/* Toggle Group */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Toggle Group</h2>
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

                    {/* Navigation Menu */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Navigation Menu</h2>
                        <p className="text-sm text-gray-400">Horizontal navigation with dropdown menus</p>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-white">Getting Started</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="p-4 w-[400px]">
                                            <NavigationMenuLink className="text-white">
                                                Introduction
                                            </NavigationMenuLink>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink className="text-white">
                                        Documentation
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
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