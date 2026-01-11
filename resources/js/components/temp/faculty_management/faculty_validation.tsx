// Required fields and Email Validation
import { useState } from 'react';

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  facultyId?: string;
  pupWebmail?: string;
  facultyType?: string;
  adviseeBlock?: string;
}

export interface FacultyFormData {
  firstName: string;
  lastName: string;
  suffix: string;
  facultyId: string;
  pupWebmail: string;
  title: string;
  facultyType: string;
  roles: string[];
  adviseeBlock: string;
  photoPreview: string | null;
  status?: string;
}

// Email validation regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate individual field
export const validateField = (
  name: string, 
  value: string, 
  formData: FacultyFormData
): string | undefined => {
  switch (name) {
    case 'firstName':
      return value.trim() === '' ? 'First name is required' : undefined;
    case 'lastName':
      return value.trim() === '' ? 'Last name is required' : undefined;
    case 'facultyId':
      return value.trim() === '' ? 'Faculty ID is required' : undefined;
    case 'pupWebmail':
      if (value.trim() === '') return 'PUP Webmail is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return undefined;
    case 'facultyType':
      return value === '' ? 'Faculty type is required' : undefined;
    case 'adviseeBlock':
      if (formData.roles.includes("Thesis Adviser") && value === '') {
        return 'Thesis advisee block is required for thesis adviser role';
      }
      return undefined;
    default:
      return undefined;
  }
};

// Validate all fields
export const validateForm = (
  formData: FacultyFormData,
  setErrors: (errors: ValidationErrors) => void
): boolean => {
  const newErrors: ValidationErrors = {};
  
  const firstNameError = validateField('firstName', formData.firstName, formData);
  if (firstNameError) newErrors.firstName = firstNameError;
  
  const lastNameError = validateField('lastName', formData.lastName, formData);
  if (lastNameError) newErrors.lastName = lastNameError;
  
  const facultyIdError = validateField('facultyId', formData.facultyId, formData);
  if (facultyIdError) newErrors.facultyId = facultyIdError;
  
  const pupWebmailError = validateField('pupWebmail', formData.pupWebmail, formData);
  if (pupWebmailError) newErrors.pupWebmail = pupWebmailError;
  
  const facultyTypeError = validateField('facultyType', formData.facultyType, formData);
  if (facultyTypeError) newErrors.facultyType = facultyTypeError;

  const adviseeBlockError = validateField('adviseeBlock', formData.adviseeBlock, formData);
  if (adviseeBlockError) newErrors.adviseeBlock = adviseeBlockError;

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Custom hook for faculty form validation
export const useFacultyValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const handleBlur = (fieldName: string, formData: FacultyFormData) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate if submit has been attempted
    if (isSubmitAttempted) {
      const value = formData[fieldName as keyof FacultyFormData] as string;
      const error = validateField(fieldName, value, formData);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleInputChange = (
    fieldName: string, 
    value: string, 
    formData: FacultyFormData
  ) => {
    // Only clear/update error when user starts typing if submit has been attempted
    if (isSubmitAttempted && touched[fieldName]) {
      const error = validateField(fieldName, value, formData);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleRoleToggle = (
    role: string,
    currentRoles: string[],
    formData: FacultyFormData
  ) => {
    // If removing Thesis Adviser role, clear advisee block error
    if (role === "Thesis Adviser" && currentRoles.includes(role)) {
      setErrors(prev => ({ ...prev, adviseeBlock: undefined }));
      setTouched(prev => ({ ...prev, adviseeBlock: false }));
    }
    
    // If adding Thesis Adviser role and submit was attempted, validate advisee block
    if (role === "Thesis Adviser" && !currentRoles.includes(role) && isSubmitAttempted) {
      const error = validateField('adviseeBlock', formData.adviseeBlock, formData);
      setErrors(prev => ({ ...prev, adviseeBlock: error }));
    }
  };

  const handleSubmit = (
    formData: FacultyFormData,
    onSuccess: () => void
  ) => {
    
    setIsSubmitAttempted(true);
  
    const touchedFields: Record<string, boolean> = {
      firstName: true,
      lastName: true,
      facultyId: true,
      pupWebmail: true,
      facultyType: true,
    };

    // Add adviseeBlock if Thesis Adviser is selected
    if (formData.roles.includes("Thesis Adviser")) {
      touchedFields.adviseeBlock = true;
    }

    setTouched(touchedFields);

    if (validateForm(formData, setErrors)) {
      setIsSubmitAttempted(false);
      onSuccess();
    }
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
    setIsSubmitAttempted(false);
  };

  return {
    errors,
    touched,
    isSubmitAttempted,
    handleBlur,
    handleInputChange,
    handleRoleToggle,
    handleSubmit,
    resetValidation,
    setErrors,
  };
};