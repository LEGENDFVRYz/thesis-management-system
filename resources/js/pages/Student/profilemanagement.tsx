import AppLayout from '@/layouts/app-layout';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { type BreadcrumbItem } from '@/types';
import { User, UserCircle2, Users2, Users2Icon, UsersIcon, UserSquare2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Profile Management', href: '' },
];

// Mock profile data
const profileData = {
  name: "Juan Dela Cruz",
  role: "Student",
  status: "Active",
  email: "juandelacruz@iskolarngbayan.pup.edu.ph",
  thesis: "Automated Hydroponics System using IoT and Machine Learning",
  thesisStatus: "Approved",
  thesisAdviser: "Engr. Maria Santos, PhD",
  dateJoined: "January 15, 2024",
  studentId: "2022-XXXXX-MN-0"
};

// Mock Thesis group members data
const thesisMembers = [
  {
    name: "Juan Dela Cruz (You)",
    studentId: "2022-XXXXX-MN-0",
    role: "Group Leader",
    isCurrentUser: true
  },
  {
    name: "Miguel P. Reyes",
    studentId: "2022-XXXXX-MN-0",
    role: "Lead Developer",
    isCurrentUser: false
  },
  {
    name: "Ana T. Lim",
    studentId: "2022-XXXXX-MN-0",
    role: "UI/UX Designer",
    isCurrentUser: false
  }
];

export default function ProfileManagement() {
  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <AppContent
          variant="header"
          title="Profile Management"
          subtitle="View student information and thesis group details"
          icon={
            <div className="flex h-8 w-8 items-center justify-center text-primary ">
              <UsersIcon className="h-30 w-30 fill-primary" />
            </div>
          }
        >
          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 w-full">
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
              
              {/* --- Left Container: Profile Information --- */}
              <div className="w-full lg:w-1/2 border border-primary rounded-xl overflow-hidden bg-primary-foreground shadow-sm flex flex-col font-size">
                <div className="bg-primary h-32 p-4">
                  <h2 className="text-primary-foreground-2 text-center text-base tracking-wide">Profile Information</h2>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center -mt-20 mb-6"> 
                  <div className="w-40 h-40 bg-gray-300 rounded-full border-4 border-primary-foreground flex items-center justify-center overflow-hidden shadow-md">
                    <User className="w-30 h-30 text-gray-500" />
                  </div>
                  <h3 className="text-primary font-bold text-2xl mt-4 uppercase tracking-tight">{profileData.name}</h3>
                  <span className="bg-primary-foreground-2 text-primary text-xs font-bold px-6 py-1 rounded-full mt-2 shadow-sm">
                    {profileData.role}
                  </span>
                </div>

                <div className="px-8 pb-8 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-t border-b border-gray-100 py-8">
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Full Name</p>
                      <p className="text-gray-800 text-sm">{profileData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-gray-800 text-sm">{profileData.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">PUP Webmail</p>
                      <p className="text-gray-800 text-sm break-words">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Date Joined</p>
                      <p className="text-gray-800 text-sm">{profileData.dateJoined}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Student ID</p>
                      <p className="text-gray-800 text-sm">{profileData.studentId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Role</p>
                      <p className="text-gray-800 text-sm ">{profileData.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Right Container: Thesis Information --- */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                
                {/* Thesis Card */}
                <div className="border border-primary rounded-xl overflow-hidden bg-primary-foreground shadow-sm">
                  <div className="bg-primary p-4">
                    <h2 className="text-primary-foreground-2 text-base tracking-wide">Thesis</h2>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-gray-900 text-xl font-bold mb-3">
                      {profileData.thesis}
                    </h3>
                    <span className="inline-block bg-evaluated-font-color text-white text-xs px-3 py-1 rounded-full mb-6">
                      {profileData.thesisStatus}
                    </span>
                    
                    <div className="border border-primary rounded-lg p-4">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Assigned Adviser</p>
                      <h4 className="text-gray-900 font-bold text-base">{profileData.thesisAdviser} </h4>
                      <p className="text-gray-600 text-sm">Department of Computer Engineering</p>
                    </div>
                  </div>
                </div>

                {/* Thesis Group Members Card */}
                <div className="border border-primary rounded-xl overflow-hidden bg-primary-foreground shadow-sm">
                  <div className="bg-primary p-4">
                    <h2 className="text-primary-foreground-2 text-base tracking-wide">Thesis Group Members & Roles</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {thesisMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {member.isCurrentUser ? (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                              <UserCircle2 className="w-12 h-12 text-gray-400" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                              <UserCircle2 className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-gray-900 font-semibold text-sm">{member.name}</p>
                            <p className="text-gray-500 text-xs">{member.studentId}</p>
                          </div>
                        </div>
                        <span className="border border-primary text-primary text-xs font-semibold px-3 rounded-full">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppContent>
      </AppLayout>
      <NavFooter />
    </>
  );
}