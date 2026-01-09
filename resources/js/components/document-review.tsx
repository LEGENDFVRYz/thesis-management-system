import React from 'react';
import { Download, FileText, Calendar, ChevronLeftCircle, BookMarked } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/layouts/app-layout";
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { type BreadcrumbItem } from "@/types";

interface DefensePanel {
  name: string;
  initial: string;
  color: string;
}

interface DocumentReviewModalProps {
  title: string;
  members: string[];
  date: string;
  badges: string[];
  specialization: string;
  onClose: () => void;
}

export function DocumentReviewModal({
  title,
  members,
  date,
  badges,
  specialization,
  onClose
}: DocumentReviewModalProps) {

  const primaryBg = "#730000";
  const yellowBg = "rgba(255, 189, 0, 0.5)";

  const defenseId = "DEF-001";
  const block = "BSCS 3-3";
  const adviser = "Dr. Maria Santos";

  const proponents = members.map((member) => {
    const nameParts = member.split(' ');
    const initial = nameParts.map(part => part[0]).join('');
    return { name: member, initial };
  });

  const defensePanel: DefensePanel[] = [
    { name: "Dr. Robert Chen", initial: "RC", color: primaryBg },
    { name: "Dr. Sofia Smith", initial: "SS", color: primaryBg },
    { name: "Engr. John Johnson", initial: "JJ", color: primaryBg }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Repository", href: "" },
    { title: "Thesis Archive", href: "" },
    { title: "Document Review", href: "" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <AppContent
        key="document-review"
        variant="header"
        title="Document Review"
        subtitle="Complete details of the selected thesis"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#730000] text-white">
            <BookMarked className="h-5 w-5" />
          </div>
        }
      >
        <div className="bg-white min-h-screen p-6">
          {/* Return Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#730000] hover:text-[#590000] transition-colors font-['DM_Sans'] mb-6"
          >
            <ChevronLeftCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Return</span>
          </button>

          {/* Defense Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            {/* Row: Title + Defense ID */}
            <div className="flex justify-between items-start " >
              {/* Left: Title + Description */}
              <div>
                <h3 className="text-lg font-bold font-['DM_Sans']" style={{ color: primaryBg }}>
                  Defense Details
                </h3>
                <p className="text-sm text-black font-['DM_Sans'] mt-0">
                  Complete information about the thesis defense
                </p>
              </div>

              {/* Right: Defense ID */}
              <div className="text-right">
                <span className="text-xs text-gray-500 font-['DM_Sans'] font-bold block" style={{ color: primaryBg }}>Defense ID</span>
                <span className="text-lg font-bold text-black font-['DM_Sans']">{defenseId}</span>
              </div>
            </div>

            <hr className="border-t border-gray-300 my-4" />

            {/* Grid Layout */}
            <div className="grid grid-cols-4 gap-6 text-sm font-['DM_Sans']">
              {/* Thesis Title */}
              <div className="col-span-4">
                <label className="font-bold block mb-1" style={{ color: primaryBg }}>Thesis Title</label>
                <p className="text-black">{title}</p>
              </div>

              {/* Specialization + Tags */}
              <div className="col-span-4 flex flex-col gap-4">
                <div>
                  <label className="font-bold block mb-1" style={{ color: primaryBg }}>Specialization</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{ color: primaryBg, borderColor: primaryBg, borderWidth: 1 }}>
                    {specialization}
                  </span>
                </div>

                <div>
                  <label className="font-bold block mb-1" style={{ color: primaryBg }}>Tag</label>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-primary text-primary"
                        style={{ borderColor: primaryBg, color: primaryBg }}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Block + Adviser */}
              <div className="flex flex-col gap-2">
                <div>
                  <label className="font-bold block mb-1" style={{ color: primaryBg }}>Block</label>
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                    style={{ borderColor: primaryBg, color: primaryBg }}
                  >
                    {block}
                  </Badge>
                </div>
                <div className="mt-2">
                  <label className="font-bold block mb-1" style={{ color: primaryBg }}>Thesis Adviser</label>
                  <p className="text-black">{adviser}</p>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="font-bold block mb-1" style={{ color: primaryBg }}>Date of Publication</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" style={{ color: primaryBg }} />
                  <span className="text-black">{date}</span>
                </div>
              </div>

              {/* Proponents */}
              <div>
                <label className="font-bold block mb-1" style={{ color: primaryBg }}>Proponents</label>
                <div className="flex flex-col gap-2 mt-1">
                  {proponents.map((proponent, idx) => (
                    <Badge
                      key={idx}
                      className="text-black"
                      style={{ backgroundColor: yellowBg }}
                    >
                      {proponent.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Defense Panel */}
              <div>
                <label className="font-bold block mb-1" style={{ color: primaryBg }}>Defense Panel</label>
                <div className="flex flex-col gap-2 mt-1">
                  {defensePanel.map((panelist, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback style={{ backgroundColor: primaryBg, color: "#FFFFFF" }}>
                          {panelist.initial}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-black">{panelist.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Document Preview Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-['DM_Sans']" style={{ color: primaryBg }}>
                Document Preview
              </h3>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:brightness-90 transition-colors font-['DM_Sans']"
                  style={{ backgroundColor: primaryBg }}
                >
                  <Download className="w-4 h-4" />
                  Download Full Document
                </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-black font-['DM_Sans']">{title}</p>
            </div>

            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-96 flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-sm text-black font-['DM_Sans']">Document Preview Area</p>
            </div>
          </div>
        </div>
      </AppContent>
      <NavFooter />
    </AppLayout>
  );
}
