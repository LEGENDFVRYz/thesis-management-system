import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload } from 'lucide-react';

interface AddFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFacultyModal({ isOpen, onClose }: AddFacultyModalProps) {
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