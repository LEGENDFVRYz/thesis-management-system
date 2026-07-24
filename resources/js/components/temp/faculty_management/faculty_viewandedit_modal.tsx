import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Check, AlertCircle, AlertCircleIcon } from 'lucide-react';
import { useFacultyValidation } from './faculty_validation';
import { router } from '@inertiajs/react';


interface SectionOption {
  value: string;
  label: string;
}

interface Faculty {
  id: string;
  name: string;
  firstName: string; 
  lastName: string;
  suffix: string;
  prefix: string;
  email: string;
  roles: string[];
  type: string;
  dateAdded: string;
  initials?: string;
  hasPhoto?: boolean;
  adviseeBlock?: string;
  adviseeYear?: string;
}

interface ViewEditFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty | null;
  availableSections: SectionOption[];
}

// Confirmation Popup Component
function ConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-17 h-17 flex items-center justify-center mb-4">
            <AlertCircle size={60} className="text-primary" />
          </div>
          
          {/* Confirmation Message */}
          <p className="text-gray-800 text-base mb-2 font-medium">
            Are you sure you want to archive this user?
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button variant="outline"
              onClick={onClose}
              className="flex-1 px-6 py-2 rounded-full border-2 border-gray-800 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="flex-1 px-6 py-2 rounded-full bg-primary hover:bg-red-700 text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success Popup Component
function SuccessPopup({ 
  isOpen, 
  onClose, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-alert-success flex items-center justify-center mb-4">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
          
          {/* Success Message */}
          <p className="text-gray-800 text-base mb-6">
            {message}
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

export function ViewEditFacultyModal({ isOpen, onClose, faculty, availableSections = [] }: ViewEditFacultyModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
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

  const {
    errors,
    touched,
    isSubmitAttempted,
    handleBlur,
    handleInputChange,
    handleRoleToggle: hookHandleRoleToggle,
    handleSubmit,
    resetValidation,
    setErrors,
  } = useFacultyValidation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dynamicSectionOptions = useMemo(() => {
    // If we have a current block and it's not in availableSections, add it temporarily
    if (formData.adviseeBlock && !availableSections.some(s => s.value === formData.adviseeBlock)) {
        return [
            { value: formData.adviseeBlock, label: `BSCPE 3-${formData.adviseeBlock}` },
            ...availableSections
        ].sort((a, b) => a.value.localeCompare(b.value));
    }
    return availableSections;
  }, [availableSections, formData.adviseeBlock]);

  const canSelectAdviser = dynamicSectionOptions.length > 0;

  // --- HELPER TO PARSE FACULTY DATA ---
  const parseFacultyData = (fac: Faculty) => {
    // 2. FIXED MAPPING: Use correct property names from Interface
    const currentTitle = fac.prefix || ""; 
    const firstName = fac.firstName || "";
    const lastName = fac.lastName || "";
    const suffix = fac.suffix || "";

    // Normalize Roles
    const mappedRoles = fac.roles.map(r => {
        if (r === "Coordinator") return "Thesis Coordinator";
        if (r === "Adviser") return "Thesis Adviser";
        return r; 
    });

    const typeVal = fac.type;

    return {
      firstName,
      lastName,
      suffix,
      facultyId: fac.id,
      pupWebmail: fac.email,
      title: currentTitle, 
      facultyType: typeVal,
      roles: mappedRoles,
      adviseeBlock: fac.adviseeBlock ? String(fac.adviseeBlock) : "",
      photoPreview: fac.hasPhoto ? "" : null,
      status: "Active",
    };
  };
    

  useEffect(() => {
    if (faculty) {
      setFormData(parseFacultyData(faculty));
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

  const onRoleToggle = (role: string) => {
    if (role === "Thesis Adviser" && !canSelectAdviser && !formData.roles.includes("Thesis Adviser")) {
      return;
    }

    hookHandleRoleToggle(role, formData.roles, formData);
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role) 
        : [...prev.roles, role],
      // If unchecking, clear block. If checking, keep existing or empty.
      adviseeBlock: role === "Thesis Adviser" && prev.roles.includes(role) ? "" : prev.adviseeBlock
    }));
  };

  const onSave = () => {
    handleSubmit(formData, () => {
      // 2. Prepare Payload (Match backend expectations)
      // Map roles back to simple strings (e.g., "Thesis Coordinator" -> "Coordinator")
      const dbRoles = formData.roles.map(role => {
          if (role === "Thesis Coordinator") return "Coordinator";
          if (role === "Thesis Adviser") return "Adviser";
          return role;
      });

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

      // 3. Send PUT Request
        if (faculty?.id) {
          router.put(`/admin/management/faculty/${faculty.id}`, payload, {
              onSuccess: () => {
                  setShowSaveSuccess(true);
                  setIsEditing(false);
              },
              onError: (serverErrors) => {
                  // --- FIX START: Map Backend Errors ---
                  const mappedErrors: any = {};

                  if (serverErrors.email) mappedErrors.pupWebmail = serverErrors.email;
                  if (serverErrors.faculty_id) mappedErrors.facultyId = serverErrors.faculty_id;
                  // Handle unique validation on update often returning 'identity_no' error
                  if (serverErrors.identity_no) mappedErrors.facultyId = serverErrors.identity_no; 

                  if (serverErrors.first_name) mappedErrors.firstName = serverErrors.first_name;
                  if (serverErrors.last_name) mappedErrors.lastName = serverErrors.last_name;
                  
                  setErrors(mappedErrors);
                  // --- FIX END ---
              }
          });
      }
    });
  };

  const handleSaveSuccessClose = () => {
    setShowSaveSuccess(false);
    setIsEditing(false);
    onClose();
  };

  const handleArchiveClick = () => {
    setShowArchiveConfirm(true);
  };

  const handleArchiveConfirm = () => {
    setShowArchiveConfirm(false);
    console.log("Archive faculty:", faculty?.id);
    setShowArchiveSuccess(true);
  };

  const handleArchiveSuccessClose = () => {
    setShowArchiveSuccess(false);
    onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetValidation();
    
    if (faculty) {
      setFormData(parseFacultyData(faculty));
    }
  };

  if (!isOpen || !faculty) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-primary text-white p-6 rounded-t-lg relative">
            <h2 className="text-[25px] font-bold text-center">
              {isEditing ? "Edit Faculty" : "View Faculty"}
            </h2>
            <Button variant="link"
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
                className={`w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${
                  isEditing ? 'cursor-pointer hover:opacity-80' : ''
                } transition-opacity`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {formData.photoPreview || faculty.hasPhoto ? (
                  <img src={formData.photoPreview || ""} alt="Faculty" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-[#ECECF0]">
                    <span className="text-black text-[60px] font-medium">
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
                  <Button variant="link"
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
                {`${formData.title ? formData.title + ' ' : ''}${formData.firstName} ${formData.lastName} ${formData.suffix ? ' ' + formData.suffix : ''}`.toUpperCase()}
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
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, facultyType: value }));
                          handleInputChange('facultyType', value, formData);
                          if (isSubmitAttempted) {
                            handleBlur('facultyType', formData);
                          }
                        }}
                        className="flex flex-col gap-2"
                      >
                        <RadioGroupItemWithLabel id="fullTime-edit" value="Full-time" label="Full-time" />
                        <RadioGroupItemWithLabel id="partTime-edit" value="Part-time" label="Part-time" />
                        {/* <RadioGroupItemWithLabel id="external-edit" value="External (Non-Faculty)" label="External (Non-Faculty)" /> */}
                      </RadioGroup>
                      {errors.facultyType && touched.facultyType && isSubmitAttempted && (
                        <p className="text-red-500 text-xs mt-1">{errors.facultyType}</p>
                      )}
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
                      onCheckedChange={() => onRoleToggle("Thesis Coordinator")}
                    />
                    <CheckboxWithLabel
                      id="thesisAdviser-edit"
                      label="Thesis Adviser"
                      checked={formData.roles.includes("Thesis Adviser")}
                      onCheckedChange={() => onRoleToggle("Thesis Adviser")}
                      disabled={!canSelectAdviser}
                    />
                    {/* <CheckboxWithLabel
                      id="panelMember-edit"
                      label="Panel Member"
                      checked={formData.roles.includes("Panel Member")}
                      onCheckedChange={() => onRoleToggle("Panel Member")}
                    /> */}

                    {/* ALERT IF NO SECTIONS */}
                    {!canSelectAdviser && (
                        <div className="flex items-center gap-2 p-2 mb-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-200">
                            <AlertCircle className="w-4 h-4" />
                            <span>All sections currently have an assigned adviser.</span>
                        </div>
                    )}
                  </div>

                  {formData.roles.includes("Thesis Adviser") && (
                    <div>
                      <Label htmlFor="adviseeBlock-edit" className="text-sm font-medium mb-1 block">
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
                          id="adviseeBlock-edit" 
                          className={`!w-100 text-sm ${errors.adviseeBlock && touched.adviseeBlock && isSubmitAttempted ? 'border-red-500' : ''}`}
                        >
                          <SelectValue placeholder="Select Block..." />
                        </SelectTrigger>
                        <SelectContent className='!w-100'>
                          {dynamicSectionOptions.map((section) => (
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
                          {/* Display Label if possible, fallback to value */}        
                            <p className="text-base font-medium">
                                {isEditing 
                                    ? (dynamicSectionOptions.find(s => s.value === formData.adviseeBlock)?.label || "N/A")
                                    : (faculty.adviseeBlock 
                                        ? `BSCPE ${faculty.adviseeYear || '3'}-${faculty.adviseeBlock}` 
                                        : "Not Assigned")
                                }
                            </p>
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
                  <Button onClick={handleArchiveClick} className='!text-white'> Archive </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleCancelEdit}> Cancel </Button>
                    <Button onClick={onSave} className="bg-primary hover:bg-primary/90"> Save </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button onClick={handleArchiveClick} className="bg-primary hover:bg-primary/90">
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

      {/* Archive Confirmation Popup */}
      <ConfirmationPopup 
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchiveConfirm}
      />

      {/* Archive Success Popup */}
      <SuccessPopup 
        isOpen={showArchiveSuccess}
        onClose={handleArchiveSuccessClose}
        message="Faculty user is added to archive."
      />

      {/* Save Success Popup */}
      <SuccessPopup 
        isOpen={showSaveSuccess}
        onClose={handleSaveSuccessClose}
        message="Changes saved successfully."
      />
    </>
  );
}