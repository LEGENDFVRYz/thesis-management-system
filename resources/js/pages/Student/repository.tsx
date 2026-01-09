// ----------------------------------------------------------------------
// Repository Page (Fully Self-Contained)
// ----------------------------------------------------------------------

import React, { useState } from 'react';
import { Users, ChevronDown, BookMarked, Calendar, Filter } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { AppContent } from "@/components/app-content";
import { NavFooter } from "@/components/nav-footer";
import { RepoFilter } from "@/components/filter-search";
import { DocumentReviewModal } from '@/components/document-review';
import { Button } from '@/components/ui/button';
import { Link } from "@inertiajs/react";
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle, CardContent, CardDescription, CardHeader, CardFooter  } from '@/components/ui/card';

const primaryBg = "#730000";

// ----------------------------------------------------------------------
// ARCHIVE CARD COMPONENT 
// ----------------------------------------------------------------------

interface ArchiveCardProps {
  title: string
  members: string[]
  date: string
  badges: string[]
  onViewDetails?: () => void
  className?: string
}

function ArchiveCard({
  title,
  members,
  date,
  badges,
  onViewDetails,
  className
}: ArchiveCardProps) {
  return (
    <Card variant="archive" className={className}>
      <div className="px-3 sm:px-5 w-full h-auto sm:h-50 overflow-hidden relative">
        <CardHeader>
          <div className="w-full h-auto sm:h-15 overflow-hidden relative">
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full h-auto sm:h-21 overflow-hidden relative">
            <CardDescription className="text-black text-xs sm:text-sm">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Users className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
                <p className="truncate text-xs sm:text-sm">{members.join(", ")}</p>
              </div>

              <div className="flex items-center gap-2 py-2">
                <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
                <p className="text-xs sm:text-sm">{date}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-primary text-primary h-auto sm:h-4.5 text-[10px] sm:text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardDescription>
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-3 sm:px-5 py-0.5">
        <div className="w-full sm:h-9 relative">
          <Button onClick={onViewDetails} className="w-full sm:w-auto text-xs sm:text-sm">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// ----------------------------------------------------------------------
// PAGE DATA
// ----------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Repository", href: "" },
  { title: "Thesis Archive", href: "" },
];

const academicYearOptions = ["2024 - 2025", "2023 - 2024", "2022 - 2023"];
const specializationOptions = ["Big Data", "Computer Network", "Machine Learning", "System Development"];

const repositoriesData = [
  {
    title: "Machine Learning Applications in Healthcare Diagnostics",
    members: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
    date: "November 2025",
    badges: ["Computer Vision", "Neural Networks"],
    specialization: "Machine Learning",
    year: "2024"
  },
  {
    title: "Cloud-Based IoT Framework for Smart Cities",
    members: ["Alice Brown", "Bob Chen", "Carol Davis"],
    date: "October 2025",
    badges: ["Internet of Things", "Cloud Computing"],
    specialization: "System Development",
    year: "2024"
  },
  {
    title: "Deep Learning for Natural Language Processing",
    members: ["David Lee", "Emma Taylor", "Frank White", "Grace Kim"],
    date: "September 2025",
    badges: ["Deep Learning", "NLP"],
    specialization: "Machine Learning",
    year: "2024"
  },
  {
    title: "Network Security Analysis Using AI",
    members: ["Henry Park", "Iris Chen", "Jack Miller"],
    date: "August 2025",
    badges: ["Cybersecurity", "Machine Learning"],
    specialization: "Computer Network",
    year: "2024"
  },
  {
    title: "Big Data Analytics for E-Commerce Platforms",
    members: ["Karen Lopez", "Liam Garcia", "Maya Patel"],
    date: "July 2025",
    badges: ["Big Data", "Data Mining"],
    specialization: "Big Data",
    year: "2024"
  },
  {
    title: "Computer Vision for Autonomous Vehicles",
    members: ["Nathan Scott", "Olivia Martin", "Peter Zhang"],
    date: "June 2025",
    badges: ["Computer Vision", "Autonomous Systems"],
    specialization: "Machine Learning",
    year: "2024"
  }
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function App() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024 - 2025");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<typeof repositoriesData[0] | null>(null);
  const [showDocumentReview, setShowDocumentReview] = useState(false);

  const filteredRepositories = repositoriesData.filter(repo => {
    const matchesSearch = searchTerm === "" || 
      repo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.members.some(member => member.toLowerCase().includes(searchTerm.toLowerCase())) ||
      repo.badges.some(badge => badge.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = selectedSpecialization === "" || repo.specialization === selectedSpecialization;
    
    const matchesYear = selectedYear === "2024 - 2025" ? repo.year === "2024" : selectedYear === "2023 - 2024" ? repo.year === "2023" : true;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => repo.badges.includes(tag));

    return matchesSearch && matchesSpecialization && matchesYear && matchesTags;
  });

  const handleApplyFilter = (tags: string[]) => { setSelectedTags(tags); setShowFilter(false); };
  const handleClearFilter = () => { setSearchTerm(""); setSelectedYear("2024 - 2025"); setSelectedSpecialization(""); setSelectedTags([]); };
  const handleViewDetails = (repo: typeof repositoriesData[0]) => { setSelectedRepo(repo); setShowDocumentReview(true); };
  const handleCloseDocumentReview = () => { setShowDocumentReview(false); setSelectedRepo(null); };

  if (showDocumentReview && selectedRepo) {
    return (
      <DocumentReviewModal
        title={selectedRepo.title}
        members={selectedRepo.members}
        date={selectedRepo.date}
        badges={selectedRepo.badges}
        specialization={selectedRepo.specialization}
        onClose={handleCloseDocumentReview}
      />
    );
  }

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <AppContent
          key="student-repository"
          variant="header"
          title="Thesis Archive"
          subtitle="Access complete repository with full administrative controls"
          icon={<div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#730000] text-white"><BookMarked className="h-5 w-5" /></div>}
        >
          {/* Filters Section */}
          <div className="flex items-start justify-center px-4 py-6">
            <div className="w-full max-w-7xl">
              {/* Filter Row */}
              <div className="flex flex-col items-start self-stretch w-full max-w-[1360px] bg-card rounded-[10px] border-[0.8px] transition-all duration-200 h-[120px] p-[25px_19px] gap-[25px] border-border mb-8">
                <div className="flex flex-row items-center gap-[10px] self-stretch w-full justify-center">
                  {/* Search */}
                  <div className="flex flex-col gap-2 w-[320px]">
                    <label className="text-sm font-medium text-alert-desc font-['DM_Sans']">Search</label>
                    <div className="flex flex-row items-center h-9 w-full max-w-[1153.4px] bg-breadcrumb border-[0.8px] border-primary/30 rounded-lg hover:bg-breadcrumb/50 focus-within:border-primary pl-5 pr-3 py-1 flex-1 transition-colors duration-200">
                      <input placeholder="Search thesis titles..." className="h-7 w-full bg-transparent border-none outline-none focus:ring-0 text-[13.33px] font-medium leading-[17px] text-alert-desc placeholder:text-alert-desc font-['DM_Sans']" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>

                  {/* Academic Year */}
                  <div className="flex flex-col gap-2 w-[374px]">
                    <label className="text-sm font-medium text-alert-desc font-['DM_Sans']">Academic Year</label>
                    <div className="relative">
                      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="flex items-center justify-between px-3 h-9 w-full bg-breadcrumb rounded-lg border-[0.8px] border-primary/10 cursor-pointer transition-colors hover:bg-white appearance-none text-primary text-sm font-medium font-['DM_Sans']">
                        {academicYearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="flex flex-col gap-2 w-[374.33px]">
                    <label className="text-sm font-medium text-alert-desc font-['DM_Sans']">Specialization</label>
                    <div className="relative">
                      <select value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)} className="flex h-9 w-full cursor-pointer appearance-none items-center justify-between rounded-lg bg-breadcrumb px-3 text-[13.33px] font-medium text-alert-desc font-['DM_Sans'] transition-colors hover:bg-white">
                        <option value="">Filter by Specialization</option>
                        {specializationOptions.map((spec) => <option key={spec} value={spec}>{spec}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-row items-center gap-[10px] mt-auto h-9">
                    <button onClick={() => setShowFilter(true)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-breadcrumb shadow-sm hover:bg-background active:bg-primary-foreground-2 border border-primary-15 text-primary size-9 rounded-lg border-none font-['DM_Sans']">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button onClick={handleClearFilter} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-sidebar-gradient-mid text-white hover:bg-destructive active:bg-primary px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px] font-['DM_Sans']">
                      <Filter className="w-4 h-4" />
                      <span className="text-[13.33px] font-medium font-['DM_Sans']">Clear Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 font-['DM_Sans']">
                  Showing {filteredRepositories.length} of {repositoriesData.length} results
                </p>
                {selectedTags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-['DM_Sans']">Active tags:</span>
                    <div className="flex gap-2">
                      {selectedTags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary text-primary rounded-full text-xs font-medium font-['DM_Sans']">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Repository Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-x-6 gap-y-8 pb-8">
                {filteredRepositories.length > 0 ? filteredRepositories.map((repo, index) => (
                  <ArchiveCard key={index} title={repo.title} members={repo.members} date={repo.date} badges={repo.badges} onViewDetails={() => handleViewDetails(repo)} className="max-w-sm mx-auto w-full" />
                )) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg font-['DM_Sans']">No repositories found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AppContent>
      </AppLayout>

      <NavFooter />

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <RepoFilter onClose={() => setShowFilter(false)} onApply={handleApplyFilter} />
        </div>
      )}
    </>
  );
}
