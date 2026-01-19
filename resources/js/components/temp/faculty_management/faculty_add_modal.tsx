import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Check, AlertCircle} from 'lucide-react';
import { useFacultyValidation } from './faculty_validation';
import { router } from '@inertiajs/react';

interface SectionOption {
  value: string;
  label: string;
}
interface AddFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSections: SectionOption[];
}

// Success Popup Component
function SuccessPopup({ isOpen, onClose}: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-evaluated-font-color flex items-center justify-center mb-4">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
          
          {/* Success Message */}
          <p className="text-gray-800 text-base mb-6">
            Faculty added successfully.
          </p>
          
          {/* Done Button */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-8 py-2 rounded-full border-2 border-gray-800 hover:bg-gray-100"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AddFacultyModal({ isOpen, onClose, availableSections = [] }: AddFacultyModalProps) {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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

  const {
    errors,
    touched,
    isSubmitAttempted,
    handleBlur,
    handleInputChange,
    handleRoleToggle,
    handleSubmit,
    resetValidation,
  } = useFacultyValidation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if there are sections available
  const hasAvailableSections = availableSections.length > 0;

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

  const onRoleToggle = (role: string) => {
    handleRoleToggle(role, formData.roles, formData);
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role) 
        : [...prev.roles, role],
      // Clear advisee block if removing Thesis Adviser
      adviseeBlock: role === "Thesis Adviser" && prev.roles.includes(role) ? "" : prev.adviseeBlock
    }));
  };

  const onSubmit = () => {
    // Run existing validation
    handleSubmit(formData, () => {

      // Map your Role Names
      const dbRoles = formData.roles.map(role => {
          if (role === "Thesis Coordinator")
              return "Coordinator";
          if (role === "Thesis Adviser")
              return "Adviser";
          // if (role === "Panel Member")
          //     return "Panelist";
          return role;
      });

      // Map your State Names -> Database Column Names
      const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          suffix: formData.suffix,
          faculty_id: formData.facultyId,
          email: formData.pupWebmail,
          name_prefix: formData.title,
          type: formData.facultyType,
          roles: dbRoles,
          advisee_block: formData.adviseeBlock
      };

      // Submit manually using Inertia Router
      router.post('/admin/management/faculty', payload, {
          onSuccess: () => {
              setShowSuccessPopup(true);
          },
          onError: (errors) => {
              console.error("Backend errors:", errors);
          }
      });
    });
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    
    // Reset form
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
    resetValidation();
    
    // Close main modal
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
    resetValidation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-primary text-white p-6 rounded-t-lg relative">
            <h2 className="text-[25px] font-bold text-center">Add Faculty</h2>
            <Button variant="link"
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
                className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
              <Button variant="link"
                onClick={() => fileInputRef.current?.click()}
                className="hover:underline"
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, firstName: e.target.value }));
                      handleInputChange('firstName', e.target.value, formData);
                    }}
                    onBlur={() => handleBlur('firstName', formData)}
                    className={`!w-60 ${errors.firstName && touched.firstName && isSubmitAttempted ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && touched.firstName && isSubmitAttempted && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium mb-1 block">
                    LAST NAME <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, lastName: e.target.value }));
                      handleInputChange('lastName', e.target.value, formData);
                    }}
                    onBlur={() => handleBlur('lastName', formData)}
                    className={`!w-60 ${errors.lastName && touched.lastName && isSubmitAttempted ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && touched.lastName && isSubmitAttempted && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, facultyId: e.target.value }));
                      handleInputChange('facultyId', e.target.value, formData);
                    }}
                    onBlur={() => handleBlur('facultyId', formData)}
                    className={`!w-80 ${errors.facultyId && touched.facultyId && isSubmitAttempted ? 'border-red-500' : ''}`}
                  />
                  {errors.facultyId && touched.facultyId && isSubmitAttempted && (
                    <p className="text-red-500 text-xs mt-1">{errors.facultyId}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pupWebmail" className="text-sm font-medium mb-1 block">
                    PUP WEBMAIL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pupWebmail"
                    placeholder="PUP Webmail"
                    value={formData.pupWebmail}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, pupWebmail: e.target.value }));
                      handleInputChange('pupWebmail', e.target.value, formData);
                    }}
                    onBlur={() => handleBlur('pupWebmail', formData)}
                    className={`!w-92 ${errors.pupWebmail && touched.pupWebmail && isSubmitAttempted ? 'border-red-500' : ''}`}
                  />
                  {errors.pupWebmail && touched.pupWebmail && isSubmitAttempted && (
                    <p className="text-red-500 text-xs mt-1">{errors.pupWebmail}</p>
                  )}
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
                    <RadioGroupItemWithLabel id="engr" value="Engr." label="Engr." />
                    <RadioGroupItemWithLabel id="dr" value="Dr." label="Dr." />
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    FACULTY TYPE <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.facultyType}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, facultyType: value }));
                      handleInputChange('facultyType', value, formData);
                      if (isSubmitAttempted) {
                        handleBlur('facultyType', formData);
                      }
                    }}
                    className="flex flex-col gap-2"
                  >
                    <RadioGroupItemWithLabel id="fullTime" value="Full-time" label="Full-time" />
                    <RadioGroupItemWithLabel id="partTime" value="Part-time" label="Part-time" />
                    {/* <RadioGroupItemWithLabel id="external" value="External (Non-Faculty)" label="External (Non-Faculty)" /> */}
                  </RadioGroup>
                  {errors.facultyType && touched.facultyType && isSubmitAttempted && (
                    <p className="text-red-500 text-xs mt-1">{errors.facultyType}</p>
                  )}
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
                  onCheckedChange={() => onRoleToggle("Thesis Coordinator")}
                />
                <CheckboxWithLabel
                  id="thesisAdviser"
                  label="Thesis Adviser"
                  checked={formData.roles.includes("Thesis Adviser")}
                  onCheckedChange={() => onRoleToggle("Thesis Adviser")}
                  disabled={!hasAvailableSections}
                />
                {/* <CheckboxWithLabel
                  id="panelMember"
                  label="Panel Member"
                  checked={formData.roles.includes("Panel Member")}
                  onCheckedChange={() => onRoleToggle("Panel Member")}
                /> */}
              </div>

              {/* SHOW WARNING IF NO SECTIONS */}
              {!hasAvailableSections && (
                  <div className="flex items-center gap-2 p-2 mb-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-200">
                      <AlertCircle className="w-4 h-4" />
                      <span>All sections currently have an assigned adviser.</span>
                  </div>
              )}

              {formData.roles.includes("Thesis Adviser") && (
                <div>
                  <Label htmlFor="adviseeBlock" className="text-sm font-medium mb-1 block">
                    THESIS ADVISEE BLOCK ASSIGNMENT <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.adviseeBlock}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, adviseeBlock: value }));
                      handleInputChange('adviseeBlock', value, formData);
                    }}
                  >
                    <SelectTrigger 
                      id="adviseeBlock" 
                      className={`!w-100 text-sm ${errors.adviseeBlock && touched.adviseeBlock && isSubmitAttempted ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Select Block..." />
                    </SelectTrigger>
                    <SelectContent className='!w-100'>
                      {availableSections.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                            {section.label} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.adviseeBlock && touched.adviseeBlock && isSubmitAttempted && (
                    <p className="text-red-500 text-xs mt-1">{errors.adviseeBlock}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}> Cancel </Button>
              <Button onClick={onSubmit}> Add Faculty </Button>
            </div>
            <p className='italic text-xs text-black/50'> Fields with asterisks (*) are required. </p>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup isOpen={showSuccessPopup} onClose={handleSuccessClose} />
    </>
  );
}