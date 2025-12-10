import { NavItem } from "@/types";
import { 
    dashboard, resources, repository
} from '@/routes/faculty';
import { 
    advisee_management, awards_evaluation, proposal_review, thesis_monitoring, thesis_review
} from '@/routes/faculty/management';
import { usePage } from '@inertiajs/react';

type UserInfo = {
    user_id: number;
    user_role: 'student' | 'faculty';
    is_admin?: boolean;
    faculty_id?: number;
    faculty_roles?: string[];
};


// Export a function that returns NavItem[]
export const facultyMainNav = (): NavItem[] => {
    const { user_info } = usePage().props as { user_info?: UserInfo };
    const userRoles = user_info.faculty_roles || [];

    // Helper to check if user has at least one required role
    const hasRole = (requiredRoles: string[]) => {
        return requiredRoles.some(role => userRoles.includes(role));
    };


    // Render management children 
    const managementChildren: NavItem[] = [];

    if (hasRole(['Adviser', 'Co-adviser'])) {
        managementChildren.push(
            { title: 'Advisee', href: advisee_management() },
        );
    }
    if (hasRole(['Awardee'])) {
        managementChildren.push(
            { title: 'Awards Evaluation', href: awards_evaluation() },
        );
    }
    if (hasRole(['Coordinator'])) {
        managementChildren.push(
            { title: 'Thesis Monitoring', href: thesis_monitoring() },
        );
    }
    if (hasRole(['Panelist'])) {
        managementChildren.push(
            { title: 'Thesis Review', href: thesis_review() },
    );
    }
    if (hasRole(['Committee'])) {
        managementChildren.push(
            { title: 'Proposal Review', href: proposal_review() }
        );
    }

    
    // Combine and Return
    return [
        { title: 'Home', href: dashboard() },

        // Add management if has children
        ...(managementChildren.length > 0 ? [{ 
            title: 'Management', 
            href: 'faculty/management', 
            children: managementChildren 
        }] : []),

        { title: 'Repository', href: repository() },
        { title: 'Resources', href: resources() },
    ];
};
