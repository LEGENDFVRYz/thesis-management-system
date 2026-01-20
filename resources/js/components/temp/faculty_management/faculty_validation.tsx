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

// --- VALIDATION REGEX PATTERNS ---

// Email validation regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Name validation regex (Letters, spaces, hyphens, periods only. No numbers.)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-\.]+$/;
  return nameRegex.test(name);
};

// Faculty ID validation regex
// Format: xxxx(numbers)-xxxxx(numbers)-xx(letters/numbers)-x(number)
// Example: 2020-12345-MN-0
export const validateFacultyId = (id: string): boolean => {
  const idRegex = /^\d{4}-\d{5}-[a-zA-Z0-9]{1,5}-[a-zA-Z0-9]{1,4}$/;
  return idRegex.test(id);
};

// --- FIELD VALIDATION LOGIC ---

export const validateField = (
  name: string, 
  value: string, 
  formData: FacultyFormData
): string | undefined => {
  switch (name) {
    case 'firstName':
      if (value.trim() === '') return 'First name is required';
      if (!validateName(value)) return 'First name cannot contain numbers';
      return undefined;

    case 'lastName':
      if (value.trim() === '') return 'Last name is required';
      if (!validateName(value)) return 'Last name cannot contain numbers';
      return undefined;

    case 'facultyId':
      if (value.trim() === '') return 'Faculty ID is required';
      if (!validateFacultyId(value)) return 'Invalid ID Format (e.g., 2020-12345-MN-0)';
      return undefined;

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

// --- FORM VALIDATION ---

export const validateForm = (
  formData: FacultyFormData,
  setErrors: (errors: ValidationErrors) => void
): boolean => {
  const newErrors: ValidationErrors = {};
  
  // Validate all fields
  const fieldsToValidate = ['firstName', 'lastName', 'facultyId', 'pupWebmail', 'facultyType', 'adviseeBlock'];
  
  fieldsToValidate.forEach(field => {
    // Cast field to keyof FacultyFormData to access value safely
    // However, adviseeBlock needs special handling in validateField which accepts full formData
    const error = validateField(field, formData[field as keyof FacultyFormData] as string, formData);
    if (error) {
      newErrors[field as keyof ValidationErrors] = error;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// --- CUSTOM HOOK ---

export const useFacultyValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const handleBlur = (fieldName: string, formData: FacultyFormData) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate immediately on blur only if submit was already attempted OR strictly per field logic
    // Usually, we want instant feedback on blur for format errors
    const value = formData[fieldName as keyof FacultyFormData] as string;
    const error = validateField(fieldName, value, formData);
    
    // Update error state
    setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
            newErrors[fieldName as keyof ValidationErrors] = error;
        } else {
            delete newErrors[fieldName as keyof ValidationErrors];
        }
        return newErrors;
    });
  };

  const handleInputChange = (
    fieldName: string, 
    value: string, 
    formData: FacultyFormData
  ) => {
    // If field has an error, clear it as the user types (optimistic UI)
    // OR re-validate to see if fixed
    if (errors[fieldName as keyof ValidationErrors]) {
       const error = validateField(fieldName, value, formData);
       setErrors(prev => {
         const newErrors = { ...prev };
         if (!error) {
             delete newErrors[fieldName as keyof ValidationErrors];
         } else {
             // Optional: Update error message dynamically while typing
             // newErrors[fieldName as keyof ValidationErrors] = error; 
         }
         return newErrors;
       });
    }
  };

  const handleRoleToggle = (
    role: string,
    currentRoles: string[],
    formData: FacultyFormData
  ) => {
    if (role === "Thesis Adviser" && currentRoles.includes(role)) {
      setErrors(prev => ({ ...prev, adviseeBlock: undefined }));
      setTouched(prev => ({ ...prev, adviseeBlock: false }));
    }
    
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
  
    // Mark all relevant fields as touched
    const touchedFields: Record<string, boolean> = {
      firstName: true,
      lastName: true,
      facultyId: true,
      pupWebmail: true,
      facultyType: true,
    };

    if (formData.roles.includes("Thesis Adviser")) {
      touchedFields.adviseeBlock = true;
    }

    setTouched(prev => ({ ...prev, ...touchedFields }));

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