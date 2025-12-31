import * as React from 'react';
import { useState } from 'react';
import { Search, Filter, Users, Calendar, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ManagementLayout from '.';
import { defenses as defensesRoute } from '@/routes/admin/management/index';
import { cn } from '@/lib/utils';
import FilterSearchSection from '@/components/filter-search-section';

export default function Dashboard({ defenses }: { defenses: any[] }) {
    const [statusFilter, setStatusFilter] = useState('upcoming');
    const [view, setView] = useState('table');

    return (
        <ManagementLayout 
            breadcrumbs={[{ title: 'Defense', href: defensesRoute().url }]}
            title="Defense Management" 
            description="Monitor all defense schedules and panel assignments"
        >    
            <div className="space-y-6">
                
                {/* 1. Filters & Search */}
                <FilterSearchSection variant="DefenseManagement" />

                {/* 2. Toggle Groups Row (Pill Style) */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    
                    {/* Status Toggle - Fit to Content */}
                    <ToggleGroup 
                        type="single" 
                        value={statusFilter} 
                        onValueChange={(val) => val && setStatusFilter(val)}
                        className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit" 
                    >
                        <ToggleGroupItem 
                            value="upcoming" 
                            className={cn(
                                "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap",
                                statusFilter === 'upcoming' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            Upcoming Defense
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                            value="completed" 
                            className={cn(
                                "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap",
                                statusFilter === 'completed' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            Completed Defenses
                        </ToggleGroupItem>
                    </ToggleGroup>

                    {/* View Toggle - Fit to Content */}
                    <ToggleGroup 
                        type="single" 
                        value={view} 
                        onValueChange={(val) => val && setView(val)}
                        className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit"
                    >
                        <ToggleGroupItem 
                            value="table" 
                            className={cn(
                                "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
                                view === 'table' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            <TableIcon className="w-4 h-4" /> Table View
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                            value="calendar" 
                            className={cn(
                                "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
                                view === 'calendar' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            <Calendar className="w-4 h-4" /> Calendar View
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {/* 3. Content Area */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {view === 'table' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#800000] text-white uppercase text-[11px] font-bold tracking-[0.1em]">
                                    <tr>
                                        <th className="px-6 py-4 border-r border-white/10">Defense ID</th>
                                        <th className="px-6 py-4 border-r border-white/10">Title</th>
                                        <th className="px-6 py-4 border-r border-white/10">Proponents</th>
                                        <th className="px-6 py-4 border-r border-white/10">Adviser</th>
                                        <th className="px-6 py-4 border-r border-white/10">Block</th>
                                        <th className="px-6 py-4 border-r border-white/10">Date & Time</th>
                                        <th className="px-6 py-4 border-r border-white/10">Type</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {defenses?.map((def, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                                            <td className="px-6 py-4 text-gray-500 font-medium text-xs">3306</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">Machine Learning Something with...</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[#800000] font-bold">
                                                    <Users className="w-4 h-4" /> 4
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">Dr. Cherry D. Casuat</td>
                                            <td className="px-6 py-4 text-gray-600">BSCPE 3-3</td>
                                            <td className="px-6 py-4 text-gray-600 text-xs leading-tight">
                                                November 28, 2025<br/>09:00 AM
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 font-medium text-xs">Title Defense</td>
                                            <td className="px-6 py-4 text-center">
                                                <Button variant="outline" className="rounded-md border-[#800000]/30 text-[#800000] hover:bg-red-50 h-8 px-4 text-[10px] font-bold uppercase shadow-sm">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-20 text-center text-gray-400">
                           {/* Calendar content */}
                        </div>
                    )}
                </div>
            </div>
        </ManagementLayout>
    );
}