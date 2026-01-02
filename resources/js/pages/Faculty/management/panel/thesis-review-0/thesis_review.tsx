import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { thesis_review } from '@/routes/faculty/management/panel';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import OptionToggle from '@/pages/Faculty/management/adviser/advisee_management/option-toggle';
import FilterSearchSection from '@/components/filter-search-section';
import StageSwitchToggle from '@/components/stage-toggle';
import { useState } from 'react';
import { Users } from 'lucide-react';
import {Table,TableHeader,TableBody,TableHead,TableRow,TableCell,TableCaption,} from '@/components/ui/table';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,} from '@/components/ui/dialog';
import ThesisModal from './thesis-modal';
import { Button } from '@/components/ui/button';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Thesis Review',
            href: thesis_review().url,
        },
    ];

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
                title: 'MOR Thesis Topic Analysis and...',
                proponents: 4,
                adviser: 'Dr. Cherry D. Casuet',
                block: 'BSCPE 3-3',
                dateTime: 'November 28, 2025\n09:00 AM',
                type: 'MOR Defense',
            })),
            approved: Array(8).fill(null).map((_, index) => ({
                id: `440${index + 1}`,
                title: 'MOR Completed Research on...',
                proponents: 3,
                adviser: 'Dr. John Smith',
                block: 'BSCS 4-1',
                dateTime: 'October 15, 2025\n02:00 PM',
                type: 'MOR Defense',
            }))
        },
        dp1: {
            pending: Array(10).fill(null).map((_, index) => ({
                id: `550${index + 1}`,
                title: 'DP1 Implementation of AI System...',
                proponents: 5,
                adviser: 'Dr. Maria Santos',
                block: 'BSIT 3-2',
                dateTime: 'December 5, 2025\n10:00 AM',
                type: 'Defense Proper 1',
            })),
            approved: Array(6).fill(null).map((_, index) => ({
                id: `660${index + 1}`,
                title: 'DP1 Completed Development of...',
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
                title: 'DP2 Final Implementation and Testing...',
                proponents: 3,
                adviser: 'Dr. Emily Brown',
                block: 'BSCS 4-3',
                dateTime: 'January 10, 2026\n03:00 PM',
                type: 'Defense Proper 2',
            })),
            approved: Array(15).fill(null).map((_, index) => ({
                id: `880${index + 1}`,
                title: 'DP2 Successfully Defended Project on...',
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
        // Get current data based on selected stage and status
        const currentData = defenseData[currentStage][currentStatus];
        
        // Get counts for the toggle labels
        const pendingCount = defenseData[currentStage].pending.length;
        const approvedCount = defenseData[currentStage].approved.length;

        return (
            <FacultyManagementLayout
                breadcrumbs={breadcrumbs}
                title="Thesis Review" 
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

                    {/* Filter and Search Section */}
                    <FilterSearchSection variant="DefenseManagement" />

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
                    <div className="w-full" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        <Table className="border-separate border-spacing-0 w-full">
                            <TableHeader>
                                <TableRow className="bg-[#730000] border-none hover:bg-[#730000]">
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center rounded-tl-[8px]">
                                        Defense ID
                                    </TableHead>
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                        Title
                                    </TableHead>
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                        {currentStatus === 'approved' ? 'Proponent' : 'Proponents'}
                                    </TableHead>
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                        Adviser
                                    </TableHead>
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                        Block
                                    </TableHead>
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                        Date & Time
                                    </TableHead>
                                    {currentStatus === 'pending' && (
                                        <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                            Type
                                        </TableHead>
                                    )}
                                    {currentStatus === 'approved' && (
                                        <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                            Status
                                        </TableHead>
                                    )}
                                    {currentStatus === 'approved' && (
                                        <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center">
                                            Details
                                        </TableHead>
                                    )}
                                    <TableHead className="text-white font-medium text-[13.33px] leading-[17px] h-[40px] text-center rounded-tr-[8px]">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.map((defense: Defense, index: number) => {
                                    // Determine status badge based on index for demo
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
                                            
                                            {/* For Upcoming Defenses - Show Type column */}
                                            {currentStatus === 'pending' && (
                                                <TableCell className="text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] text-center p-[10px]">
                                                    {defense.type}
                                                </TableCell>
                                            )}
                                            
                                            {/* For Completed Defenses - Show Status column */}
                                            {currentStatus === 'approved' && (
                                                <TableCell className="text-center p-[10px]">
                                                    <div 
                                                        className="inline-flex items-center justify-center px-[9px] py-[2px] rounded-[25px] font-['DM_Sans'] font-medium text-[12px] leading-[16px] text-white"
                                                        style={{ 
                                                            backgroundColor: status.bg,
                                                            border: `1px solid ${status.bg}`
                                                        }}
                                                    >
                                                        {status.text}
                                                    </div>
                                                </TableCell>
                                            )}
                                            
                                            {/* For Completed Defenses - Show Details column */}
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
                                            
                                            {/* Action column - Different content based on status */}
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
                                                    <button
                                                        className="flex items-center justify-center gap-[4px] text-[#0A0A0A] font-medium text-[13.33px] leading-[17px] underline mx-auto"
                                                    >
                                                        Evaluation
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableCaption 
                                className="mt-4"
                                style={{ 
                                    fontFamily: 'Arimo, sans-serif',
                                    color: '#717182',
                                    fontSize: '14px',
                                    lineHeight: '20px'
                                }}
                            >
                                {currentData.length} of {currentData.length} {currentStatus === 'pending' ? 'Upcoming' : 'Completed'} Defenses
                            </TableCaption>
                        </Table>
                        {/* Thesis Modal */}
                        <ThesisModal
                            defense={selectedDefense}
                            open={modalOpen}
                            onOpenChange={setModalOpen}
                        />

                    </div>
                </div>
            </FacultyManagementLayout>
        );
    }