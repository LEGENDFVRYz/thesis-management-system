import { HeaderCard } from '@/components/ui/card';
import { NavFooter } from '@/components/nav-footer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, User } from 'lucide-react';
import { dashboard } from '@/routes';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile Management',
        href: dashboard().url,
    },
];

export default function Profile() {
    const [profileData] = useState({
        name: "FirstName LastName",
        email: "name@pup.edu.ph",
        facultyId: "FAC-001",
        role: "System Administrator",
        dateJoined: "Month Day, Year",
        status: "Active",
    });

    const [twoFactor, setTwoFactor] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Management" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8 bg-slate-50/50">
                
                {/* Header */}
                <HeaderCard 
                    title="Profile Management" 
                    description="Manage admin account settings and security preferences"
                    icon={<Users className="w-8 h-8 text-primary" />}
                    className="w-full lg:w-full rounded-none border-t-0 border-x-0" 
                />

                {/* Main Content */}
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
                    
                    <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
                        
                        {/* --- Left Container: Profile Information --- */}
                        <div className="w-full lg:w-1/2 border border-primary rounded-xl overflow-hidden bg-primary-foreground shadow-sm flex flex-col font-size">
                            <div className="bg-primary h-32 p-4">
                                <h2 className="text-primary-foreground-2 text-base tracking-wide">Profile Information</h2>
                            </div>

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center -mt-20 mb-6"> 
                                <div className="w-40 h-40 bg-gray-300 rounded-full border-4 border-primary-foreground flex items-center justify-center overflow-hidden shadow-md">
                                    <User className="w-28 h-28 text-gray-500" />
                                </div>
                                <h3 className="text-primary font-bold text-2xl mt-4 uppercase tracking-tight">{profileData.name}</h3>
                                <span className="bg-primary-foreground-2 text-primary text-xs font-bold px-6 py-1.5 rounded-full mt-2 shadow-sm">
                                    {profileData.role}
                                </span>
                            </div>

                            <div className="px-8 pb-8 flex-1 flex flex-col justify-between">
                                <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-t border-b border-gray-100 py-8">
                                    <div>
                                        <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Full Name</p>
                                        <p className="text-gray-800 text-sm font-semibold">{profileData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <p className="text-gray-800 text-sm font-semibold">{profileData.status}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">PUP Webmail</p>
                                        <p className="text-gray-800 text-sm font-semibold">{profileData.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Date Joined</p>
                                        <p className="text-gray-800 text-sm font-semibold">{profileData.dateJoined}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Faculty ID</p>
                                        <p className="text-gray-800 text-sm font-semibold">{profileData.facultyId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Role</p>
                                        <p className="text-gray-800 text-sm font-semibold">{profileData.role}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button variant="primary" className="px-8 text-base tracking-wider">
                                        Edit Information
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Container: Security Settings --- */}
                        <div className="w-full lg:w-1/2 flex flex-col border border-primary rounded-xl overflow-hidden bg-primary-foreground shadow-sm self-stretch">
                            
                            {/* Main Card Header  */}
                            <div className="bg-primary p-4 flex items-center gap-2">
                                <h2 className="text-primary-foreground-2 text-base tracking-wide">Security Settings</h2>
                            </div>

                            {/* Update Password Section Header */}
                            <div className="flex flex-col border-b border-gray-100">
                                <div className="bg-destructive px-6 py-4">
                                    <h3 className="text-primary-foreground text-base tracking-[0.1em]">Update Password</h3>
                                </div>
                                
                                <div className="p-6 bg-primary-foreground">
                                    <div className="bg-gray-50/50 border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-primary text-[10px] font-bold block ml-1">Current Password *</label>
                                            <input 
                                                type="password" 
                                                placeholder="Enter current password" 
                                                className="w-full border-gray-300 border rounded-md p-2 text-sm focus:ring-primary focus:border-primary bg-primary-foreground outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-primary text-[10px] font-bold block ml-1">New Password *</label>
                                            <input 
                                                type="password" 
                                                placeholder="Enter new password" 
                                                className="w-full border-gray-300 border rounded-md p-2 text-sm focus:ring-primary focus:border-primary bg-primary-foreground outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-primary text-[10px] font-bold block ml-1">Confirm New Password *</label>
                                            <input 
                                                type="password" 
                                                placeholder="Enter confirm password" 
                                                className="w-full border-gray-300 border rounded-md p-2 text-sm focus:ring-primary focus:border-primary bg-primary-foreground outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button variant="primary" className="px-8 text-base tracking-wider">
                                            Update Password
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Two-Factor Authentication Section */}
                            <div className="mt-auto flex flex-col">
                                <div className="bg-destructive px-6 py-4">
                                    <h3 className="text-primary-foreground text-base tracking-[0.1em]">Two - Factor Authentication</h3>
                                </div>
                                
                                <div className="p-6 bg-primary-foreground">
                                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-5 bg-gray-50/50 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="text-primary text-base tracking-tight">Enable Two-Factor Authentication</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setTwoFactor(!twoFactor)}
                                            className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner ${twoFactor ? 'bg-primary' : 'bg-gray-400'}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full shadow-md transition-all duration-300 ${twoFactor ? 'left-8' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="flex justify-end mt-4">
                        <Button variant="primary" className="px-10 py-6 text-base tracking-widest">
                            Change Admin
                        </Button>
                    </div>

                </div>

                {/* Footer */}
                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>
        </AppLayout>
    );
}