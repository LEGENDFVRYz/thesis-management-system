import { useState } from 'react';
import * as React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { compliance } from '@/routes/faculty/management/coordinator';
import { type BreadcrumbItem } from '@/types';
import { SidebarInset } from '@/components/ui/sidebar';
import DocumentPreview from '@/components/document-preview';
import { cn } from "@/lib/utils";

// Icons
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    ShieldCheck,
    Eye,
    CheckCircle,
    X,
    Send,
    Search,
    Filter,
    SlidersHorizontal,
    Trash2,
    Calendar,
    ChevronDown,
    Plus
} from 'lucide-react';

// UI Components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Using a mock for YearRangePicker since it's an external dependency
const YearRangePicker = ({ value, onChange, placeholder }: any) => (
    <div className="border rounded p-2 text-sm text-gray-500 flex justify-between items-center cursor-not-allowed opacity-70">
        {placeholder || "Year Range"} <Calendar className="w-4 h-4"/>
    </div>
);

// ----------------------------------------------------------------------
// 1. HELPER COMPONENTS (Dependencies for FilterSearchSection)
// ----------------------------------------------------------------------

/* --- Mock Icon Component --- */
const Icon = ({ name, size }: { name: string; size?: number }) => {
    if (name === 'sortDefault') return <SlidersHorizontal size={size || 16} />;
    return <div />;
};

/* --- Search Bar --- */
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  variant?: 'default' | 'filter-section';
}

export function SearchBar({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  variant = 'default' 
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const query = value !== undefined ? value : internalQuery;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onChange) onChange(val);
    else setInternalQuery(val);
  };

  if (variant === 'filter-section') {
    return (
      <div 
        className={cn(
          "flex flex-row items-center",
          "h-9 w-full", 
          "bg-[#F3EFD0] border-[0.8px] border-primary/30 rounded-lg", 
          "hover:bg-[#F3EFD0]/80 focus-within:border-primary", 
          "pl-5 pr-3 py-1", 
          "transition-colors duration-200"
        )}
      >
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "h-7 w-full bg-transparent border-none outline-none focus:ring-0",
            "text-[13.33px] font-medium leading-[17px] text-[#800000] placeholder:text-[#800000]/50",
            "font-dm"
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center w-full relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "flex-grow h-[44px] bg-white rounded-l-md border border-input px-3 text-foreground text-base font-medium focus:outline-none",
          "font-dm"
        )}
      />
      <div className="flex items-center justify-center h-[44px] w-[46px] bg-primary rounded-r-md cursor-pointer hover:bg-primary/90 transition-colors">
        <Search className="w-6 h-6 text-primary-foreground" />
      </div>
    </div>
  );
}

/* --- RepoFilter (Advanced Filter) --- */
export function RepoFilter({ onClose, onApply }: { onClose?: () => void; onApply?: (tags: string[]) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(new Date(2024, 0, 1));
  const [removableTags, setRemovableTags] = useState(["Computer Vision", "Deep Learning"]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const specializationOptions = ["Big Data", "Computer Network", "Machine Learning", "System Development"];

  const handleRemoveTag = (tagToRemove: string) => {
    setRemovableTags(removableTags.filter(tag => tag !== tagToRemove));
  };

  const handleToggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== spec));
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md font-dm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">Apply Filter</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="border-t mb-6" />

      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">Search Term</label>
        <Input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Keywords, Titles..." />
      </div>

      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">Year</label>
        <YearRangePicker value={selectedYear} onChange={setSelectedYear} placeholder="Academic Year" />
      </div>

      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">Removable Tags</label>
        <div className="flex flex-wrap gap-2">
          {removableTags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-primary text-primary rounded-full text-xs font-medium">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="hover:bg-primary/10 rounded-full p-0.5"><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-dashed border-gray-400 text-gray-600 rounded-full text-xs font-medium hover:border-primary hover:text-primary">
            <Plus className="w-3 h-3" /> Add Tag
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">Specialization</label>
        <div className="flex flex-wrap gap-2">
          {specializationOptions.map((spec) => (
            <button
              key={spec}
              onClick={() => handleToggleSpecialization(spec)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedSpecializations.includes(spec) ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>Reset</Button>
        <Button variant="negative" onClick={() => { onApply?.(removableTags); onClose?.(); }}>Apply All Filters</Button>
      </div>
    </div>
  );
}

/* --- Sort 3 --- */
export function Sort3() {
  const [selectedSort, setSelectedSort] = useState("");
  const handleReset = () => setSelectedSort("");

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-72 font-dm">
      <h2 className="text-xl font-bold mb-3 text-[#800000]">Sort By</h2>
      <div className="border-t my-3" />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Group Code</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-2">
          <RadioGroupItemWithLabel id="gc-asc" value="gc-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="gc-desc" value="gc-desc" label="Descending" />
        </RadioGroup>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Thesis Title</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-2">
          <RadioGroupItemWithLabel id="title-az" value="title-az" label="A-Z" />
          <RadioGroupItemWithLabel id="title-za" value="title-za" label="Z-A" />
        </RadioGroup>
      </div>
      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
        <Button size="sm" className="bg-[#800000] hover:bg-[#800000]/90 text-white">Apply</Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. THE FILTER SEARCH SECTION COMPONENT (Your Code)
// ----------------------------------------------------------------------

type SectionVariant = 'StudentManagement' | 'DefenseManagement' | 'ThesisArchive' | 'Notifications';

interface FilterSearchSectionProps {
    variant?: SectionVariant;
}

export function FilterSearchSection({ variant = 'DefenseManagement' }: FilterSearchSectionProps) {
    const [query, setQuery] = useState('');
    
    // State to manage the Advanced Filter Modal visibility
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    
    // State to manage the Sort Modal visibility
    const [isSort3ModalOpen, setIsSort3ModalOpen] = useState(false);

    const containerVariants = {
        StudentManagement: "h-[134px] p-[24.8px_24.8px_0.8px_24.8px] gap-4 border-primary/20 shadow-sm",
        DefenseManagement: "h-[125.6px] p-[24.8px_24.8px_0.8px_24.8px] gap-4 border-primary/20 shadow-sm",
        ThesisArchive: "h-[120px] p-[25px_19px] gap-[25px] border-border",
        Notifications: "h-[118px] p-6 gap-6 border-border shadow-none"
    };

    const handleApplyFilters = (tags: string[]) => {
        console.log("Applied Tags:", tags);
        setIsFilterModalOpen(false);
    };

    return (
        <div className={cn(
            "flex flex-col items-start self-stretch w-full bg-card rounded-[10px] flex-none",
            "border-[0.8px] box-border transition-all duration-200",
            "font-dm", 
            containerVariants[variant]
        )}>
            
            {/* --- HEADER SECTION --- */}
            {variant !== 'ThesisArchive' && variant !== 'Notifications' && (
                <div className="flex flex-row items-center gap-2 self-stretch w-full h-6 rounded-none font-dm">
                    <Filter className="w-5 h-5 text-primary" />
                    <h2 className="font-dm font-normal text-base leading-6 text-primary">
                        {variant === 'StudentManagement' ? 'Search, Sort, & Filter' : 'Filters & Search'}
                    </h2>
                </div>
            )}

            {/* --- CONTROLS ROW --- */}
            <div className={cn(
                "flex flex-row items-center gap-[10px] self-stretch w-full font-dm",
                variant === 'Notifications' ? "justify-between" : "justify-center"
            )}>
                
                {/* 1. SEARCH BOX */}
                <div className={cn(
                    "flex flex-col gap-2 font-dm",
                    (variant === 'ThesisArchive' || variant === 'Notifications') ? "w-[320px]" : "flex-1"
                )}>
                    {(variant === 'ThesisArchive' || variant === 'Notifications') && (
                        <label className="text-sm font-medium text-alert-desc font-dm">Search</label>
                    )}
                    <SearchBar 
                        variant="filter-section" 
                        placeholder="Search thesis titles..." 
                        value={query} 
                        onChange={setQuery} 
                    />
                </div>

                {/* 2. VARIANT SPECIFIC CONTROLS */}
                {variant === 'ThesisArchive' && (
                    <>
                        <div className="flex flex-col gap-2 w-[374px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Academic Year</label>
                            <div className="flex items-center justify-between px-3 h-9 bg-breadcrumb rounded-lg border-[0.8px] border-primary/10 cursor-pointer transition-colors hover:bg-white font-dm">
                                <span className="text-primary text-sm font-medium font-dm">2024 - 2025</span>
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-[374.33px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Specialization</label>
                            <div className="flex items-center justify-between px-3 h-9 bg-breadcrumb rounded-lg cursor-pointer transition-colors hover:bg-white font-dm">
                                <span className="text-alert-desc text-[13.33px] font-medium font-dm">Filter by Specialization</span>
                                <ChevronDown className="w-4 h-4 text-alert-desc/50" />
                            </div>
                        </div>
                    </>
                )}

                {variant === 'Notifications' && (
                    <>
                        <div className="flex flex-col gap-2 w-[320px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Notification Type</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Type" />
                                </SelectTrigger>
                                <SelectContent className='w-[var(--radix-select-trigger-width)]'>
                                    <SelectItem value="Defense Management">Defense Management</SelectItem>
                                    <SelectItem value="Panel Assignment">Panel Assignment</SelectItem>
                                    <SelectItem value="Reminder">Reminder</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 w-[320px] font-dm">
                            <label className="text-sm font-medium text-alert-desc font-dm">Status</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent className='w-[var(--radix-select-trigger-width)]'>
                                    <SelectItem value="Read">Read Only</SelectItem>
                                    <SelectItem value="Unread">Unread Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}

                {/* --- SHARED ACTION BUTTONS --- */}
                <div className={cn(
                    "flex flex-row items-center gap-[10px] font-dm",
                    (variant === 'ThesisArchive' || variant === 'Notifications') ? "mt-auto h-9" : ""
                )}>
                    {(variant === 'StudentManagement' || variant === 'Notifications') && (
                        <Button variant="secondary" size="icon" className="rounded-lg border-none font-dm" onClick={() => setIsSort3ModalOpen(true)}>
                            <Icon name="sortDefault" size={16} />
                        </Button>
                    )}

                    {variant !== 'Notifications' && (
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="rounded-lg border-none font-dm"
                            onClick={() => setIsFilterModalOpen(true)} // Calls the modal
                        >
                            <Filter className="w-4 h-4" />
                        </Button>
                    )}

                    {variant === 'Notifications' && (
                        <Button variant="ghost" className="h-9 gap-2 px-3 border border-transparent font-dm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[13.33px] font-medium font-dm">Mark Read</span>
                        </Button>
                    )}

                    <Button variant="negative" className="px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px] font-dm">
                        {variant === 'ThesisArchive' || variant === 'Notifications' ? (
                            <Trash2 className="w-4 h-4 text-white" />
                        ) : null}
                        <span className="text-[13.33px] font-medium font-dm">Clear Filter</span>
                    </Button>
                </div>
            </div>

            {/* --- INTEGRATED REPO FILTER MODAL --- */}
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none">
                    <RepoFilter 
                        onClose={() => setIsFilterModalOpen(false)} 
                        onApply={handleApplyFilters}
                    />
                </DialogContent>
            </Dialog>

            {/* --- INTEGRATED SORT MODAL --- */}
            <Dialog open={isSort3ModalOpen} onOpenChange={setIsSort3ModalOpen}>
                <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none">
                    <Sort3/>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// ----------------------------------------------------------------------
// 3. MAIN DASHBOARD COMPONENT
// ----------------------------------------------------------------------

interface PanelMember {
    id: string;
    name: string;
    role: 'P1' | 'P2' | 'P3';
}

interface Proposal {
    id: string;
    title: string;
    groupCode: string;
    proponents: string[];
    block: string;
    adviser: string;
    approvalDate: string;
    panelMembers: PanelMember[];
    status: 'Endorsed' | 'Compliant' | 'Pending'; 
    manuscriptUrl?: string;
}

const mockProposals: Proposal[] = Array(6).fill({
    id: '1',
    title: 'Cloud-Based Hospital Management System',
    groupCode: '2101',
    proponents: ['William Brown', 'Amelia Wilson', 'Benjamin Lee'],
    block: 'BSCpE 3-3',
    adviser: 'Prof. James Lee',
    approvalDate: '12/5/2025',
    status: 'Endorsed',
    manuscriptUrl: '#',
    panelMembers: [
        { id: 'p1', role: 'P1', name: 'Dr. Robert Chen' },
        { id: 'p2', role: 'P2', name: 'Dr. Sofia Smith' },
        { id: 'p3', role: 'P3', name: 'Engr. John Johnson' },
    ],
}).map((item, index) => ({ ...item, id: index.toString() }));

interface AppContentProps extends React.ComponentProps<'div'> {
  variant?: 'header' | 'sidebar';
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AppContent({ variant = 'header', title, subtitle, icon, children, ...props }: AppContentProps) {
  if (variant === 'sidebar') {
    return (
      <SidebarInset>
        <div className="flex-1 p-6" style={{ backgroundColor: 'var(--primary-foreground)' }} {...props}>
          {children}
        </div>
      </SidebarInset>
    )
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }} {...props}>
      {(title || subtitle) && (
        <div className="w-full border-b border-sidebar-border">
          <div className="mx-auto max-w-[1440px] h-[124px] flex flex-row items-center px-6 py-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {icon ? icon : <div className="w-8 h-8 rounded bg-[#800000]"></div>}
                <h2 className="text-[30px] font-normal leading-[36px] text-[#800000] dark:text-red-400">
                  {title}
                </h2>
              </div>
              <p className="text-[18px] font-normal leading-[16px] ml-11 text-[#800000]">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-[1440px] p-6">
        {children}
      </div>
    </div>
  )
}

const EndorsementCard = ({ data }: { data: Proposal }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showEndorseModal, setShowEndorseModal] = useState(false);
    const [remarks, setRemarks] = useState('');

    const handleEndorseSubmit = () => {
        console.log("Endorsing:", data.id, "Remarks:", remarks);
        setShowEndorseModal(false);
    };

    return (
        <>
            <div className="bg-card dark:bg-card rounded-[var(--radius-lg)] shadow-sm border border-border p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h3 className="font-bold text-foreground text-sm leading-tight mb-1">{data.title}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{data.groupCode}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[var(--endorsed-bg)] text-[var(--endorsed-font-color)] border border-[var(--endorsed-border)]">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {data.status}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Proponents</p>
                    <p className="text-sm font-medium text-foreground">{data.proponents.join(', ')}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                        <p className="text-[10px] text-muted-foreground">Block</p>
                        <p className="text-xs font-semibold text-foreground">{data.block}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground">Adviser</p>
                        <p className="text-xs font-semibold text-foreground">{data.adviser}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground">Approval Date</p>
                        <p className="text-xs font-semibold text-foreground">{data.approvalDate}</p>
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    <p className="text-[10px] text-muted-foreground mb-2">Panel Members</p>
                    <div className="space-y-2">
                        {data.panelMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                                     style={{ backgroundColor: member.role === 'P1' ? 'var(--chart-1)' : member.role === 'P2' ? 'var(--chart-2)' : 'var(--chart-3)' }}>
                                    {member.role}
                                </div>
                                <span className="text-xs text-foreground font-medium">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                    <button onClick={() => setShowPreview(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-transparent border border-border rounded-[var(--radius-sm)] hover:bg-[var(--breadcrumb)] transition-colors">
                        <Eye size={14} /> View Manuscript
                    </button>
                    <button onClick={() => setShowEndorseModal(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-transparent border border-border rounded-[var(--radius-sm)] hover:bg-[var(--breadcrumb)] transition-colors">
                        <CheckCircle size={14} /> Endorse
                    </button>
                </div>
            </div>

            {/* Modal & Preview Logic */}
            {showPreview && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="bg-background rounded-[var(--radius-lg)] max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">{data.title}</h2>
                            <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <div className="p-4">
                            <DocumentPreview documentTitle={data.title} documentUrl={data.manuscriptUrl} showDownloadButton={true} />
                        </div>
                    </div>
                </div>
            )}

            {showEndorseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-dm">
                    <div className="bg-background rounded-[var(--radius-lg)] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Primary Color Header */}
                        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Send className="w-5 h-5 -rotate-45" />
                                <h2 className="text-lg font-medium tracking-wide">Endorse Proposal for Defense</h2>
                            </div>
                            <button 
                                onClick={() => setShowEndorseModal(false)}
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 leading-snug">
                                {data.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-6">
                                <div className="flex">
                                    <span className="w-24">Students:</span>
                                    <span className="font-medium text-foreground">{data.proponents.join(', ')}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className="w-20">Adviser:</span>
                                    <span className="font-medium text-foreground">{data.adviser}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24">Block:</span>
                                    <span className="font-medium text-foreground">{data.block}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className="w-20">Approval Date:</span>
                                    <span className="font-medium text-foreground">{data.approvalDate}</span>
                                </div>
                            </div>

                            {/* INSERTED: Assigned Panel Members Section */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-foreground mb-2">Assigned Panel Members</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.panelMembers.map((member) => (
                                        <div key={member.id} className="flex items-center px-3 py-1 rounded-full bg-[var(--pending-bg)] border border-[var(--pending-border)] text-[var(--pending-font-color)] text-sm">
                                            {member.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Warning/Confirmation Box */}
                            <div className="bg-[var(--revision-bg)] border border-[var(--revision-border)] rounded-lg p-4 mb-6 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-[var(--revision-font-color)] flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--revision-font-color)] mb-1">Endorsement Confirmation</h4>
                                    <p className="text-xs text-[var(--revision-font-color)] opacity-90 mb-2">By endorsing this proposal, you confirm that:</p>
                                    <ul className="list-none space-y-1">
                                        {['All panel members have been properly assigned', 'The proposal meets defense requirements', 'The panel is ready to schedule the defense'].map((item, idx) => (
                                            <li key={idx} className="text-xs text-[var(--revision-font-color)] flex items-start gap-1.5 font-medium">
                                                <span>›</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Remarks / Justification
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Text field input..."
                                    className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-foreground focus:border-ring focus:ring-1 focus:ring-ring text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setShowEndorseModal(false)}
                                className="px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border rounded-md hover:bg-[var(--breadcrumb)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndorseSubmit}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border rounded-md hover:bg-[var(--breadcrumb)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                            >
                                <CheckCircle size={16} />
                                Submit Endorsement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Compliance and Eligibility',
        href: compliance().url,
    },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("MOR");

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Endorsement Management" />
            
            <AppContent
                variant="header"
                title="Endorsement Management"
                subtitle="Issue a digital signature for the Coordinator Endorsement Sheet"
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#800000] text-white">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                }
            >
                <div className="space-y-8 pb-10">
                    
                    {/* 1. TABS (Top Right) */}
                    <div className="flex justify-end">
                        <ToggleGroup 
                            type="single" 
                            value={activeTab} 
                            onValueChange={(value) => { if (value) setActiveTab(value); }}
                        >
                            {["MOR", "DP1", "DP2"].map((tab) => (
                                <ToggleGroupItem 
                                    key={tab} 
                                    value={tab}
                                    className="px-6 py-1.5 text-xs font-bold text-[#800000] data-[state=on]:bg-[#800000] data-[state=on]:text-white hover:bg-[#800000]/10 transition-all"
                                >
                                    {tab}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    {/* 2. STATISTICS CARDS (Flex Centered) */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Card variant="metric" className="border-0 shadow-sm rounded-xl overflow-hidden w-full max-w-[400px]">
                            <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                <CheckCircle2 className="size-5" />
                                <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">COMPLIANT GROUPS</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-green-600">286</span>
                                <span className="text-sm font-medium text-green-600">Ready for Defense</span>
                            </CardContent>
                        </Card>

                        <Card variant="metric" className="border-0 shadow-sm rounded-xl overflow-hidden w-full max-w-[400px]">
                            <CardHeader className="bg-[#800000] text-[#F3E5CA] flex flex-row items-center gap-2">
                                <Clock className="size-5" />
                                <CardTitle className="text-xs font-bold tracking-wide text-[#F3E5CA]">PENDING REVIEW</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <span className="text-4xl font-bold text-amber-500">286</span>
                                <span className="text-sm font-medium text-amber-500">Awaiting Assessment</span>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* 3. CONTROL BAR: FILTER SEARCH SECTION (Replaces manual controls) */}
                    <div className="flex justify-center w-full">
                         <FilterSearchSection variant="DefenseManagement" />
                    </div>

                    {/* 4. CONTENT GRID */}
                    <div className="font-dm">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {mockProposals.map((proposal) => (
                                <EndorsementCard key={proposal.id} data={proposal} />
                            ))}
                        </div>
                    </div>

                </div>
            </AppContent>
        </AppLayout>
    );
}