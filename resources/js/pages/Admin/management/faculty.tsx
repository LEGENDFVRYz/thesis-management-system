//IMPORTS
import { useState, useMemo, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';

//SHARED COMPONENTS 
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Filter as FilterIcon, X, Upload } from 'lucide-react';
import { Icon } from '@/components/icon-index';
import { SearchBar } from '@/components/filter-search';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Faculty {
  id: string;
  name: string;
  email: string;
  roles: string[];
  type: string;
  dateAdded: string;
  initials?: string;
  hasPhoto?: boolean;
}

//sample data
const facultyData: Faculty[] = [
  {
    id: "FAC - 001",
    name: "Angelo Dela Cruz",
    email: "aadelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "AD",
  },
  {
    id: "FAC - 002",
    name: "Carlo A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Coordinator"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 003",
    name: "Benedict A. Dela Cruz",
    email: "badelacruz@pup.edu.ph",
    roles: ["Thesis Adviser", "Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "BD",
  },
  {
    id: "FAC - 004",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser", "Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 005",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 006",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 007",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 008",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 009",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 010",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 011",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 012",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 013",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 014",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 015",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 016",
    name: "Joseph De Guzman",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "External (Non-Faculty)",
    dateAdded: "December 1, 2025",
    initials: "JD",
  },
];

interface FilterState {
  roles: string[];
  facultyType: string;
}

function Dropdown({ 
  isOpen, 
  onClose, 
  children, 
  triggerRef 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 z-50"
      style={{ minWidth: '400px' }}
    >
      {children}
    </div>
  );
}

// ========== MODALS ==========
// Add Faculty Modal
function AddFacultyModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    suffix: "",
    facultyId: "",
    pupWebmail: "",
    title: "",
    facultyType: "",
    roles: [] as string[],
    adviseeBlock: "",
    photoPreview: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role) 
        : [...prev.roles, role]
    }));
  };

  const handleSubmit = () => {
    // Add faculty logic here
    console.log("Faculty data:", formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      suffix: "",
      facultyId: "",
      pupWebmail: "",
      title: "",
      facultyType: "",
      roles: [],
      adviseeBlock: "",
      photoPreview: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-lg relative">
          <h2 className="text-[35px] font-bold text-center">Add Faculty</h2>
          <Button
            onClick={handleCancel}
            className="absolute right-4 top-4 text-white hover:text-gray-200"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="p-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-primary bg-transparent text-sm hover:underline"
            >
              Upload Photo
            </Button>
          </div>

          {/* Faculty Information */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary mb-4">FACULTY INFORMATION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium mb-1 block">
                  FIRST NAME <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="!w-60"

                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium mb-1 block">
                  LAST NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="!w-60"
                />
              </div>
              <div>
                <Label htmlFor="suffix" className="text-sm font-medium mb-1 block">
                  SUFFIX
                </Label>
                <Input
                  id="suffix"
                  placeholder="Suffix (Optional)"
                  value={formData.suffix}
                  onChange={(e) => setFormData(prev => ({ ...prev, suffix: e.target.value }))}
                  className="!w-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="facultyId" className="text-sm font-medium mb-1 block">
                  FACULTY ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="facultyId"
                  placeholder="Faculty ID"
                  value={formData.facultyId}
                  onChange={(e) => setFormData(prev => ({ ...prev, facultyId: e.target.value }))}
                  className="!w-80"
                />
              </div>
              <div>
                <Label htmlFor="pupWebmail" className="text-sm font-medium mb-1 block">
                  PUP WEBMAIL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pupWebmail"
                  placeholder="PUP Webmail"
                  value={formData.pupWebmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, pupWebmail: e.target.value }))}
                  className="!w-92"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">TITLE</Label>
                <RadioGroup
                  value={formData.title}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                  className="flex gap-4"
                >
                  <RadioGroupItemWithLabel id="dr" value="Dr." label="Dr." />
                  <RadioGroupItemWithLabel id="engr" value="Engr." label="Engr." />
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  FACULTY TYPE <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.facultyType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, facultyType: value }))}
                  className="flex flex-col gap-2"
                >
                  <RadioGroupItemWithLabel id="fullTime" value="Full-Time" label="Full-Time" />
                  <RadioGroupItemWithLabel id="partTime" value="Part-Time" label="Part-Time" />
                  <RadioGroupItemWithLabel id="external" value="External (Non-Faculty)" label="External (Non-Faculty)" />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary mb-2">ROLE ASSIGNMENT</h3>
            <p className="text-sm text-gray-600 mb-3">Can select more than one role</p>
            
            <div className="flex gap-4 mb-4">
              <CheckboxWithLabel
                id="thesisCoordinator"
                label="Thesis Coordinator"
                checked={formData.roles.includes("Thesis Coordinator")}
                onCheckedChange={() => handleRoleToggle("Thesis Coordinator")}
              />
              <CheckboxWithLabel
                id="thesisAdviser"
                label="Thesis Adviser"
                checked={formData.roles.includes("Thesis Adviser")}
                onCheckedChange={() => handleRoleToggle("Thesis Adviser")}
              />
              <CheckboxWithLabel
                id="panelMember"
                label="Panel Member"
                checked={formData.roles.includes("Panel Member")}
                onCheckedChange={() => handleRoleToggle("Panel Member")}
              />
            </div>

            {formData.roles.includes("Thesis Adviser") && (
              <div>
                <Label htmlFor="adviseeBlock" className="text-sm font-medium mb-1 block">
                  THESIS ADVISEE BLOCK ASSIGNMENT
                </Label>
                <Select
                  value={formData.adviseeBlock}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, adviseeBlock: value }))}
                >
                  <SelectTrigger id="adviseeBlock" className="!w-100 text-sm">
                    <SelectValue placeholder="Select Block..." />
                  </SelectTrigger>
                  <SelectContent className='!w-100'>
                    <SelectItem value="Block A">BSCPE Section 1</SelectItem>
                    <SelectItem value="Block A">BSCPE Section 2</SelectItem>
                    <SelectItem value="Block A">BSCPE Section 3</SelectItem>
                    <SelectItem value="Block A">BSCPE Section 4</SelectItem>
                    <SelectItem value="Block A">BSCPE Section 5</SelectItem>
                    <SelectItem value="Block A">BSCPE Section 6</SelectItem>
                    <SelectItem value="Block A">BSCPE Section 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}> Cancel </Button>
            <Button onClick={handleSubmit}> Add Faculty </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// View & Edit Faculty Modal
function ViewEditFacultyModal({ 
  isOpen, 
  onClose,
  faculty
}: { 
  isOpen: boolean; 
  onClose: () => void;
  faculty: Faculty | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    suffix: "",
    facultyId: "",
    pupWebmail: "",
    title: "",
    facultyType: "",
    roles: [] as string[],
    adviseeBlock: "",
    photoPreview: null as string | null,
    status: "Active",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (faculty) {
      const [firstName, ...lastNameParts] = faculty.name.split(' ');
      setFormData({
        firstName: firstName || "",
        lastName: lastNameParts.join(' ') || "",
        suffix: "",
        facultyId: faculty.id,
        pupWebmail: faculty.email,
        title: "",
        facultyType: faculty.type,
        roles: faculty.roles,
        adviseeBlock: "",
        photoPreview: faculty.hasPhoto ? "" : null,
        status: "Active",
      });
    }
  }, [faculty]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role) 
        : [...prev.roles, role]
    }));
  };

  const handleSave = () => {
    console.log("Saved faculty data:", formData);
    setIsEditing(false);
    onClose();
  };

  const handleArchive = () => {
    console.log("Archive faculty:", faculty?.id);
    onClose();
  };

  if (!isOpen || !faculty) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* View & Edit Modal */}
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-lg relative">
          <h2 className="text-[35px] font-bold text-center">
            {isEditing ? "Edit Faculty" : "View Faculty"}
          </h2>
          <Button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-gray-200"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="p-6">
          {/* Photo */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className={`w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${
                isEditing ? 'cursor-pointer hover:opacity-80' : ''
              } transition-opacity`}
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              {formData.photoPreview || faculty.hasPhoto ? (
                <img src={formData.photoPreview || ""} alt="Faculty" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-[#ECECF0]">
                  <span className="text-black font-arimo text-2xl font-medium">
                    {faculty.initials}
                  </span>
                </div>
              )}
            </div>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-primary bg-transparent text-sm hover:underline"
                >
                  Upload Photo
                </Button>
              </>
            )}
          </div>

          {/* Faculty Name & Role */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-primary mb-2">
              {formData.title && `${formData.title} `}
              {faculty.name.toUpperCase()}
            </h3>
            {!isEditing && formData.roles.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                {formData.roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-sm font-medium bg-[#FFBD00] text-primary"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Faculty Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary mb-4">FACULTY INFORMATION</h3>
            
            {isEditing ? (
              <>

                {/* Editable Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium mb-1 block">
                      FIRST NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="!w-60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium mb-1 block">
                      LAST NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="!w-60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="suffix" className="text-sm font-medium mb-1 block">
                      SUFFIX
                    </Label>
                    <Input
                      id="suffix"
                      placeholder="Suffix (Optional)"
                      value={formData.suffix}
                      onChange={(e) => setFormData(prev => ({ ...prev, suffix: e.target.value }))}
                      className="!w-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="facultyId" className="text-sm font-medium mb-1 block">
                      FACULTY ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="facultyId"
                      placeholder="Faculty ID"
                      value={formData.facultyId}
                      onChange={(e) => setFormData(prev => ({ ...prev, facultyId: e.target.value }))}
                      className="!w-80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pupWebmail" className="text-sm font-medium mb-1 block">
                      PUP WEBMAIL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pupWebmail"
                      placeholder="PUP Webmail"
                      value={formData.pupWebmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, pupWebmail: e.target.value }))}
                      className="!w-92"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">TITLE</Label>
                    <RadioGroup
                      value={formData.title}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                      className="flex gap-4"
                    >
                      <RadioGroupItemWithLabel id="dr-edit" value="Dr." label="Dr." />
                      <RadioGroupItemWithLabel id="engr-edit" value="Engr." label="Engr." />
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      FACULTY TYPE <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.facultyType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, facultyType: value }))}
                      className="flex flex-col gap-2"
                    >
                      <RadioGroupItemWithLabel id="fullTime-edit" value="Full-Time" label="Full-Time" />
                      <RadioGroupItemWithLabel id="partTime-edit" value="Part-Time" label="Part-Time" />
                      <RadioGroupItemWithLabel id="external-edit" value="External (Non-Faculty)" label="External (Non-Faculty)" />
                    </RadioGroup>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">PUP Webmail</p>
                      <p className="text-base font-medium">{formData.pupWebmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date Added</p>
                      <p className="text-base font-medium">{faculty.dateAdded}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Faculty ID</p>
                      <p className="text-base font-medium">{formData.facultyId}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <p className="text-base font-medium">{formData.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Faculty Type</p>
                      <p className="text-base font-medium">{formData.facultyType}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Role & Access Details Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary mb-4">ROLE & ACCESS DETAILS</h3>
            
            {isEditing ? (
              <>
                <p className="text-sm text-gray-600 mb-3">Can select more than one role</p>
                <div className="flex gap-4 mb-4">
                  <CheckboxWithLabel
                    id="thesisCoordinator-edit"
                    label="Thesis Coordinator"
                    checked={formData.roles.includes("Thesis Coordinator")}
                    onCheckedChange={() => handleRoleToggle("Thesis Coordinator")}
                  />
                  <CheckboxWithLabel
                    id="thesisAdviser-edit"
                    label="Thesis Adviser"
                    checked={formData.roles.includes("Thesis Adviser")}
                    onCheckedChange={() => handleRoleToggle("Thesis Adviser")}
                  />
                  <CheckboxWithLabel
                    id="panelMember-edit"
                    label="Panel Member"
                    checked={formData.roles.includes("Panel Member")}
                    onCheckedChange={() => handleRoleToggle("Panel Member")}
                  />
                </div>

                {formData.roles.includes("Thesis Adviser") && (
                  <div>
                    <Label htmlFor="adviseeBlock-edit" className="text-sm font-medium mb-1 block">
                      THESIS ADVISEE BLOCK ASSIGNMENT
                    </Label>
                    <Select
                      value={formData.adviseeBlock}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, adviseeBlock: value }))}
                    >
                      <SelectTrigger id="adviseeBlock-edit" className="!w-100 text-sm">
                        <SelectValue placeholder="Select Block..." />
                      </SelectTrigger>
                      <SelectContent className='!w-100'>
                        <SelectItem value="BSCPE Section 1">BSCPE Section 1</SelectItem>
                        <SelectItem value="BSCPE Section 2">BSCPE Section 2</SelectItem>
                        <SelectItem value="BSCPE Section 3">BSCPE Section 3</SelectItem>
                        <SelectItem value="BSCPE Section 4">BSCPE Section 4</SelectItem>
                        <SelectItem value="BSCPE Section 5">BSCPE Section 5</SelectItem>
                        <SelectItem value="BSCPE Section 6">BSCPE Section 6</SelectItem>
                        <SelectItem value="BSCPE Section 7">BSCPE Section 7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Primary Role/Access</p>
                      <p className="text-base font-medium">{formData.roles[0] || "N/A"}</p>
                    </div>
                  </div>

                  {formData.roles.includes("Thesis Adviser") && (
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 mt-1">
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Assigned Block</p>
                        <p className="text-base font-medium">{formData.adviseeBlock}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleArchive} className='!text-white'> Archive </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}> Cancel </Button>
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90"> Save </Button>
                </div>
              </>
            ) : (
              <>
                <Button onClick={handleArchive} className="bg-primary hover:bg-primary/90">
                  Archive
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}> Cancel </Button>
                  <Button onClick={() => setIsEditing(true)}> Edit </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter
function FacultyFilterDropdown({ 
  onApply, 
  onClose 
}: { 
  onApply: (filters: FilterState) => void; 
  onClose: () => void;
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [facultyType, setFacultyType] = useState("");

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleClear = () => {
    setSelectedRoles([]);
    setFacultyType("");
  };

  const handleApply = () => {
    onApply({ roles: selectedRoles, facultyType });
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-3 text-primary">
        Apply Filter
      </h2>
      <div className="border-t my-4" />

      {/* Roles */}
      <div className="space-y-3 mb-4">
        <label className="font-medium">Roles</label>
        <div className="flex flex-col gap-3">
          <CheckboxWithLabel 
            id="thesisCoordinator" 
            label="Thesis Coordinator"
            checked={selectedRoles.includes("Thesis Coordinator")}
            onCheckedChange={() => handleRoleToggle("Thesis Coordinator")}
          />
          <CheckboxWithLabel 
            id="thesisAdviser" 
            label="Thesis Adviser"
            checked={selectedRoles.includes("Thesis Adviser")}
            onCheckedChange={() => handleRoleToggle("Thesis Adviser")}
          />
          <CheckboxWithLabel 
            id="panelMember" 
            label="Panel Member"
            checked={selectedRoles.includes("Panel Member")}
            onCheckedChange={() => handleRoleToggle("Panel Member")}
          />
        </div>
      </div>

      <div className="border-t my-4" />

      {/* Faculty Type */}
      <div className="space-y-3">
        <label className="font-medium">Faculty Type</label>
        <RadioGroup
          value={facultyType}
          onValueChange={setFacultyType}
          className="flex flex-col gap-3"
        >
          {["Full-Time", "Part-Time", "External (Non-Faculty)"].map((type) => (
            <RadioGroupItemWithLabel
              key={type}
              id={type}
              value={type}
              label={type}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="tertiary" className="flex items-center justify-center" onClick={handleClear}>
          Reset
        </Button>
        <Button variant="negative" className="flex items-center justify-center" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

// Sort
function FacultySortDropdown({ 
  onApply, 
  onClose 
}: { 
  onApply: (sortOption: string) => void; 
  onClose: () => void;
}) {
  const [selectedSort, setSelectedSort] = useState("");

  const handleReset = () => setSelectedSort("");
  
  const handleApply = () => {
    onApply(selectedSort);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-3 text-primary">
        Sort By
      </h2>
      <div className="border-t my-4" />

      {/* Faculty ID */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Faculty ID</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="faculty-id-asc" value="faculty-id-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="faculty-id-desc" value="faculty-id-desc" label="Descending" />
        </RadioGroup>
      </div>

      {/* Faculty Name */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Faculty Name</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="faculty-name-a-z" value="faculty-name-a-z" label="First Name (A-Z)" />
          <RadioGroupItemWithLabel id="faculty-name-z-a" value="faculty-name-z-a" label="First Name (Z-A)" />
        </RadioGroup>
      </div>

      {/* Date Added */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Date Added</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="date-oldest" value="date-oldest" label="Oldest to Newest" />
          <RadioGroupItemWithLabel id="date-newest" value="date-newest" label="Newest to Oldest" />
        </RadioGroup>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="tertiary" onClick={handleReset}>Reset</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

export default function FacultyManagement({ faculties }: { faculties?: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({ roles: [], facultyType: "" });
    const [sortOption, setSortOption] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [addFacultyOpen, setAddFacultyOpen] = useState(false);
    const [viewEditFacultyOpen, setViewEditFacultyOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    // Apply filtering and sorting
    const filteredAndSortedData = useMemo(() => {
        let result = [...facultyData];

        // Apply search
        if (searchQuery) {
            result = result.filter(faculty =>
                faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply role filter
        if (filters.roles.length > 0) {
            result = result.filter(faculty =>
                faculty.roles.some(role => filters.roles.includes(role))
            );
        }

        // Apply faculty type filter
        if (filters.facultyType) {
            result = result.filter(faculty => faculty.type === filters.facultyType);
        }

        // Apply sorting
        if (sortOption === "faculty-id-asc") {
            result.sort((a, b) => a.id.localeCompare(b.id));
        } else if (sortOption === "faculty-id-desc") {
            result.sort((a, b) => b.id.localeCompare(a.id));
        } else if (sortOption === "faculty-name-a-z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "faculty-name-z-a") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === "date-oldest") {
            result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        } else if (sortOption === "date-newest") {
            result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        }

        return result;
    }, [searchQuery, filters, sortOption]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setFilters({ roles: [], facultyType: "" });
        setSortOption("");
    };

    const handleViewEdit = (faculty: Faculty) => {
        setSelectedFaculty(faculty);
        setViewEditFacultyOpen(true);
    };

//Main Content
    return (
        <>
            <Head title="Faculty Management" />
            <AppHeader/>
            <AppContent title="Faculty Management" className='text-primary-foreground-2'
            subtitle='Manage Faculty Accounts and Assign Roles'>
                
                {/* Filter & Search Section */}
                <div className="mb-4">
                    <div className="flex flex-col items-start self-stretch w-full max-w-[1360px] bg-card rounded-[10px] border-[0.8px] border-primary/20 shadow-sm h-[134px] p-[24.8px] gap-4 font-dm">
                        {/* Header */}
                        <div className="flex flex-row items-center gap-2 self-stretch w-full h-6">
                            <FilterIcon className="w-5 h-5 text-primary" />
                            <h2 className="font-dm font-normal text-base leading-6 text-primary">
                                Search, Sort, & Filter
                            </h2>
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-row items-center gap-[10px] self-stretch w-full">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <SearchBar 
                                    variant="filter-section" 
                                    placeholder="Search by name, email, or ID..." 
                                    value={searchQuery} 
                                    onChange={setSearchQuery} 
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-row items-center gap-[10px]">
                                {/* Sort Button with Dropdown */}
                                <div className="relative">
                                    <Button 
                                        ref={sortButtonRef}
                                        variant="secondary" 
                                        size="icon" 
                                        className="rounded-lg border-none"
                                        onClick={() => {
                                            setSortOpen(!sortOpen);
                                            setFilterOpen(false);
                                        }}
                                    >
                                        <Icon name="sortDefault" size={16} />
                                    </Button>
                                    <Dropdown 
                                        isOpen={sortOpen} 
                                        onClose={() => setSortOpen(false)}
                                        triggerRef={sortButtonRef}
                                    >
                                        <FacultySortDropdown 
                                            onApply={setSortOption}
                                            onClose={() => setSortOpen(false)}
                                        />
                                    </Dropdown>
                                </div>

                                {/* Filter Button with Dropdown */}
                                <div className="relative">
                                    <Button 
                                        ref={filterButtonRef}
                                        variant="secondary" 
                                        size="icon" 
                                        className="rounded-lg border-none"
                                        onClick={() => {
                                            setFilterOpen(!filterOpen);
                                            setSortOpen(false);
                                        }}
                                    >
                                        <FilterIcon className="w-4 h-4" />
                                    </Button>
                                    <Dropdown 
                                        isOpen={filterOpen} 
                                        onClose={() => setFilterOpen(false)}
                                        triggerRef={filterButtonRef}
                                    >
                                        <FacultyFilterDropdown 
                                            onApply={setFilters}
                                            onClose={() => setFilterOpen(false)}
                                        />
                                    </Dropdown>
                                </div>

                                {/* Clear Filter Button */}
                                <Button 
                                    variant="negative" 
                                    className="px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px]"
                                    onClick={handleClearFilters}
                                >
                                    <span className="text-[13.33px] font-medium">Clear Filter</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Faculty Button */}
                <div className="flex justify-end mb-6">
                    <Button onClick={() => setAddFacultyOpen(true)}> + Add Faculty </Button>
                </div>
                
                {/* Data Table */}
                <div className="overflow-x-auto">
                    <div className="min-w-[1360px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-7 h-10 rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Faculty ID
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Faculty Name
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    PUP Webmail
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Role(s)
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Faculty Type
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Date Added
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Action
                                </span>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map((faculty) => (
                                <div
                                    key={faculty.id}
                                    className="grid grid-cols-7 min-h-10 bg-white border-b border-gray-100 hover:bg-breadcrumb transition-colors"
                                >
                                    {/* Faculty ID */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-black text-center text-[13.33px] font-medium">
                                            {faculty.id}
                                        </span>
                                    </div>

                                    {/* Faculty Name */}
                                    <div className="flex items-center justify-center p-2.5 gap-2">
                                        {faculty.hasPhoto ? (
                                            <img
                                                src=""
                                                alt=""
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ECECF0]">
                                                <span className="text-black font-arimo text-sm">
                                                    {faculty.initials}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                                            {faculty.name}
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                                            {faculty.email}
                                        </span>
                                    </div>

                                    {/* Roles */}
                                    <div className="flex items-center justify-center p-2.5 gap-1 flex-wrap">
                                        {faculty.roles.map((role, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-1.5 py-0.5 rounded-lg text-sm ${
                                                    role === "Thesis Coordinator"
                                                        ? "bg-primary text-primary-foreground-2"
                                                        : role === "Thesis Adviser"
                                                        ? "bg-primary-foreground-2 text-primary"
                                                        : "bg-breadcrumb text-primary"
                                                }`}
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Faculty Type */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span
                                            className={`text-center font-sans text-[13.33px] font-medium ${
                                                faculty.type === "External (Non-Faculty)"
                                                    ? "text-primary"
                                                    : "text-black"
                                            }`}
                                        >
                                            {faculty.type}
                                        </span>
                                    </div>

                                    {/* Date Added */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-black text-center text-[13.33px] font-medium">
                                            {faculty.dateAdded}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <Button 
                                            variant="outline" 
                                            className='border-primary text-primary'
                                            onClick={() => handleViewEdit(faculty)}
                                        >
                                            View & Edit
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white">
                                <p className="text-gray-500">
                                    No faculty members found matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AppContent>
            
            {/* Add Faculty Modal */}
            <AddFacultyModal isOpen={addFacultyOpen} onClose={() => setAddFacultyOpen(false)} />
            {/* View & Edit Faculty Modal */}
            <ViewEditFacultyModal 
                isOpen={viewEditFacultyOpen} 
                onClose={() => {
                    setViewEditFacultyOpen(false);
                    setSelectedFaculty(null);
                }}
                faculty={selectedFaculty}
            />
            <NavFooter />
        </>
    );
}
