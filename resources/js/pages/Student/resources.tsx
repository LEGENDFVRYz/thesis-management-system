// ----------------------------------------------------------------------
// Resources Page
// ----------------------------------------------------------------------

import { FileText, Download, BookMarked} from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type BreadcrumbItem } from "@/types";
import { AppContent } from "@/components/app-content";
import { NavFooter } from "@/components/nav-footer";

const primaryBg = "#730000";

// ----------------------------------------------------------------------
// DATA & MOCK CONTENT
// ----------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Repository", href: "" },
  { title: "Resources", href: "" },
];

const templatesData = [
  {
    type: "Thesis Proposal Template",
    description:
      "Structured template for your thesis proposal with all required sections",
  },
  {
    type: "Thesis Paper Template",
    description:
      "Complete thesis paper format with proper formatting and guidelines",
  },
  {
    type: "Defense Presentation Template",
    description:
      "PowerPoint template for your thesis defense presentation",
  },
  {
    type: "Documentation Template",
    description: "All necessary documentation forms",
  },
  {
    type: "Required Forms",
    description:
      "Essential forms for thesis submission and approval process",
  },
  {
    type: "Formatting Guidelines",
    description:
      "Comprehensive guide for thesis formatting and style requirements",
  },
  {
    type: "Consultation Record Forms",
    description:
      "Track your meetings and consultations with advisers",
  },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function StudentResources() {
  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <AppContent
          key="student-resources"
          variant="header"
          title="Student Resources"
          subtitle="Access templates, forms, and guidelines for your thesis"
          icon={
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#730000] text-white">
              <BookMarked className="h-5 w-5" />
            </div>
          }
        >
          {/* Content Section */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-6xl">
              <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow
                      className="border-0 hover:bg-transparent"
                      style={{ backgroundColor: primaryBg }}
                    >
                      <TableHead className="text-center text-sm font-medium text-white">
                        Template Type
                      </TableHead>
                      <TableHead className="text-center text-sm font-medium text-white">
                        Description
                      </TableHead>
                      <TableHead className="text-center text-sm font-medium text-white">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {templatesData.map((template, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-center font-semibold text-sm text-gray-800">
                          {template.type}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-800">
                          {template.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="tertiary"
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Preview
                            </Button>

                            <Button
                              variant="negative"
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </AppContent>
      </AppLayout>

      <NavFooter />
    </>
  );
}
