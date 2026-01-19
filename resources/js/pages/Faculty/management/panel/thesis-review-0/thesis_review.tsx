import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/panel/evaluation/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import OptionToggle from '@/pages/Faculty/management/adviser/advisee_management/components/option-toggle';
import FilterSearchSection from '@/components/filter-search-section';
import StageSwitchToggle from '@/components/stage-toggle';
import { useState } from 'react';
import { Users } from 'lucide-react';
import {Table,TableHeader,TableBody,TableHead,TableRow,TableCell,TableCaption,} from '@/components/ui/table';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,} from '@/components/ui/dialog';
import ThesisModal from './thesis-modal';
import { Button } from '@/components/ui/button';
import { TextLink } from '@/components/text-link';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis Review',
        href: index().url,
    },
];

// Define Defense interface
interface Defense {
    id: string;
    title: string;
    proponents: number;
    adviser: string;
    block: string;
    dateTime: string;
    type: string;
}

// Sample data organized by stage and status
const defenseData = {
    mor: {
        pending: Array(12).fill(null).map((_, index) => ({
            id: `330${index + 1}`,
            title: 'MOR Thesis Topic Analysis and Research',
            proponents: 4,
            adviser: 'Dr. Cherry D. Casuat',
            block: 'BSCPE 3-3',
            dateTime: 'November 28, 2025\n09:00 AM',
            type: 'MOR Defense',
        })),
        approved: Array(8).fill(null).map((_, index) => ({
            id: `440${index + 1}`,
            title: 'MOR Completed Research on Machine',
            proponents: 3,
            adviser: 'Dr. John Smith',
            block: 'BSCPE 4-1',
            dateTime: 'October 15, 2025\n02:00 PM',
            type: 'MOR Defense',
        }))
    },
    dp1: {
        pending: Array(10).fill(null).map((_, index) => ({
            id: `550${index + 1}`,
            title: 'DP1 Implementation of AI System',
            proponents: 5,
            adviser: 'Dr. Maria Santos',
            block: 'BSIT 3-2',
            dateTime: 'December 5, 2025\n10:00 AM',
            type: 'Defense Proper 1',
        })),
        approved: Array(6).fill(null).map((_, index) => ({
            id: `660${index + 1}`,
            title: 'DP1 Completed Development ',
            proponents: 4,
            adviser: 'Dr. Robert Lee',
            block: 'BSCPE 4-2',
            dateTime: 'September 20, 2025\n01:00 PM',
            type: 'Defense Proper 1',
        }))
    },
    dp2: {
        pending: Array(7).fill(null).map((_, index) => ({
            id: `770${index + 1}`,
            title: 'DP2 Final Implementation and Testing',
            proponents: 3,
            adviser: 'Dr. Emily Brown',
            block: 'BSCPE 4-3',
            dateTime: 'January 10, 2026\n03:00 PM',
            type: 'Defense Proper 2',
        })),
        approved: Array(15).fill(null).map((_, index) => ({
            id: `880${index + 1}`,
            title: 'DP2 Successfully on IoT',
            proponents: 4,
            adviser: 'Dr. David Wilson',
            block: 'BSIT 4-1',
            dateTime: 'August 30, 2025\n11:00 AM',
            type: 'Defense Proper 2',
        }))
    }
};

export default function Dashboard() {
    const [currentStatus, setCurrentStatus] = useState<'pending' | 'approved'>('pending');
    const [currentStage, setCurrentStage] = useState<'mor' | 'dp1' | 'dp2'>('mor');
    const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get current data based on selected stage and status
    const currentData = defenseData[currentStage][currentStatus];
    
    // Filter data based on search query
    const filteredData = currentData.filter((defense) =>
        defense.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        defense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        defense.adviser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        defense.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
        defense.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Get counts for the toggle labels
    const pendingCount = defenseData[currentStage].pending.length;
    const approvedCount = defenseData[currentStage].approved.length;

    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title="Assigned Thesis" 
            description="Manage and Review All Assigned Theses"
        >
            <div className="flex flex-col gap-4">
                {/* Stage Switch Toggle */}
                <div className="flex justify-end">
                    <StageSwitchToggle
                        value={currentStage}
                        onChange={setCurrentStage}
                    />
                </div>

                {/* Replace custom filter section with ThesisArchive variant */}
                <FilterSearchSection variant="StudentManagement" />

                {/* Option Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <OptionToggle
                        currentStatus={currentStatus}
                        onStatusChange={setCurrentStatus}
                        pendingCount={pendingCount}
                        approvedCount={approvedCount}
                        pendingLabel="Upcoming Defenses"
                        approvedLabel="Completed Defenses"
                    />
                </div>

                {/* Table */}
                <div className="w-full">
                    <Table className="border-separate border-spacing-0 w-full table-fixed">
                        <TableHeader>
                            <TableRow className="bg-[#730000] border-none hover:bg-[#730000]">
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center rounded-tl-[8px] w-[10%]">
                                    Defense ID
                                </TableHead>
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[18%]">
                                    Title
                                </TableHead>
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[8%]">
                                    {currentStatus === 'approved' ? 'Proponent' : 'Proponents'}
                                </TableHead>
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[13%]">
                                    Adviser
                                </TableHead>
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[9%]">
                                    Block
                                </TableHead>
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[11%]">
                                    Date & Time
                                </TableHead>
                                <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[10%]">
                                    {currentStatus === 'pending' ? 'Type' : 'Status'}
                                </TableHead>
                                {currentStatus === 'approved' && (
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center w-[11%]">
                                        Details
                                    </TableHead>
                                )}
                                <TableHead className={`text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center ${currentStatus === 'approved' ? 'w-[10%]' : 'w-[13%]'} rounded-tr-[8px]`}>
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((defense: Defense, index: number) => {
                                const getStatusBadge = (idx: number) => {
                                    if (idx < 5) return { text: 'Graded', bg: '#0D542B' };
                                    if (idx < 10) return { text: 'In Progress', bg: '#FFBD00' };
                                    return { text: 'Pending', bg: '#730000' };
                                };
                                
                                const status = getStatusBadge(index);
                                
                                return (
                                    <TableRow 
                                        key={index} 
                                        className="bg-white border-b border-[rgba(0,0,0,0.1)] h-[40px] hover:bg-gray-50"
                                    >
                                        <TableCell className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] text-center p-[10px]">
                                            {defense.id}
                                        </TableCell>
                                        <TableCell className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] text-center p-[10px]">
                                            {defense.title}
                                        </TableCell>
                                        <TableCell className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] text-center p-[10px]">
                                            <div className="flex items-center justify-center gap-[10px]">
                                                <Users size={16} strokeWidth={1.5} color="#730000" />
                                                <span>{defense.proponents}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] text-center p-[10px]">
                                            {defense.adviser}
                                        </TableCell>
                                        <TableCell className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] text-center p-[10px]">
                                            {defense.block}
                                        </TableCell>
                                        <TableCell className="text-[#0A0A0A] font-medium text-[12px] leading-[16px] text-center p-[10px] whitespace-pre-line">
                                            {defense.dateTime}
                                        </TableCell>
                                        
                                        <TableCell className="text-center p-[10px]">
                                            {currentStatus === 'pending' ? (
                                                <span className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px]">
                                                    {defense.type}
                                                </span>
                                            ) : (
                                                <div 
                                                    className="inline-flex items-center justify-center px-[9px] py-[2px] rounded-[25px] font-medium text-[12px] leading-[16px] text-white"
                                                    style={{ 
                                                        backgroundColor: status.bg,
                                                        border: `1px solid ${status.bg}`
                                                    }}
                                                >
                                                    {status.text}
                                                </div>
                                            )}
                                        </TableCell>
                                        
                                        {currentStatus === 'approved' && (
                                            <TableCell className="text-center p-[10px]">
                                                <Button
                                                    variant="tertiary"
                                                    onClick={() => {
                                                        setSelectedDefense(defense);
                                                        setModalOpen(true);
                                                    }}
                                                    className="h-[32px] rounded-[8px]"
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        )}
                                        
                                        <TableCell className="text-center p-[10px]">
                                            {currentStatus === 'pending' ? (
                                                <Button
                                                    variant="tertiary"
                                                    onClick={() => {
                                                        setSelectedDefense(defense);
                                                        setModalOpen(true);
                                                    }}
                                                    className="h-[32px] rounded-[8px]"
                                                >
                                                    View Details
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <TextLink
                                                        variant="group"
                                                        href="#"
                                                        className="text-[13.33px] leading-[17px]"
                                                    >
                                                        Evaluation
                                                    </TextLink>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        <TableCaption className="mt-4 text-[#717182] text-[14px] leading-[20px]">
                            {filteredData.length} of {currentData.length} {currentStatus === 'pending' ? 'Upcoming' : 'Completed'} Defenses
                        </TableCaption>
                    </Table>
                    <ThesisModal
                        defense={selectedDefense}
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        status={currentStatus}
                    />
                </div>
            </div>
        </FacultyManagementLayout>
    );
}