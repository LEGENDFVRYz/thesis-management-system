//MODAL for 'View & Edit' btn
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload } from 'lucide-react';

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

interface ViewEditFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty | null;
}

export function ViewEditFacultyModal({ isOpen, onClose, faculty }: ViewEditFacultyModalProps) {
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