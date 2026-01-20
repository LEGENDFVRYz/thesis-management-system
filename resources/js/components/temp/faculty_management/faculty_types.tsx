export interface Faculty {
    // Basic Info
    id: string;
    name: string;
    email: string;
    
    // Name Parts (New fields required for Edit Modal)
    firstName: string;
    lastName: string;
    prefix: string; // Corresponds to name_prefix/title
    suffix: string;

    // Roles & Details
    roles: string[];
    type: string; // 'Full-time' | 'Part-time'
    dateAdded: string;
    
    // Optional / UI fields
    initials?: string;
    hasPhoto?: boolean;
    adviseeBlock?: string;
    adviseeYear?: string;
} 