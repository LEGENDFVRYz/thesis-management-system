import { NavItem, SharedData } from "@/types";
import { 
    dashboard, resources, repository
} from '@/routes/faculty';
import { endorsement, eval_n_grading } from '@/routes/faculty/management/adviser';
import { my_advisees } from '@/routes/faculty/management/adviser/advisee_management';
import { awards_evaluation } from '@/routes/faculty/management/award';
import { 
    proposal_review
} from '@/routes/faculty/management/committee';
import { 
    communication, compliance, grading_management
} from '@/routes/faculty/management/coordinator';
import { matrix } from '@/routes/faculty/management/coordinator/defense_management';
import { thesis_registry } from '@/routes/faculty/management/coordinator/thesis_monitoring';
import { thesis_review } from '@/routes/faculty/management/panel';
import { 
    defense_management as joint_defense_management
} from '@/routes/faculty/management/joint';
import { usePage } from '@inertiajs/react';



// Export a function that returns NavItem[]
export const facultyMainNav = (): NavItem[] => {
    const { user_info } = usePage<SharedData>().props;
    const userRoles = user_info?.faculty_roles ?? [];

    // Helper to check if user has at least one required role
    const hasRole = (requiredRoles: string[]) => {
        return requiredRoles.some(role => userRoles.includes(role));
    };
    

    // Render management children 
    const managementChildren: NavItem[] = [];

    if (hasRole(['Adviser', 'Co-adviser'])) {
        managementChildren.push({
            title: 'Adviser',
            href: '#', // Role headers aren't clickable links
            children: [
                { title: 'Advisee',             href: my_advisees() },
                { title: 'Defense (adviser)',   href: joint_defense_management() },
                { title: 'Endorsement',         href: endorsement() },
                { title: 'Evaluation',          href: eval_n_grading() },
            ]
        });
    }

    if (hasRole(['Coordinator'])) {
        managementChildren.push({
            title: 'Coordinator',
            href: '#',
            children: [
                { title: 'Communication',       href: communication() },
                { title: 'Compliance',          href: compliance() },
                { title: 'Defense (coor)',      href: matrix() },
                { title: 'Grading',             href: grading_management() },
                { title: 'Thesis Monitoring',   href: thesis_registry() },
            ]
        });
    }
    
    if (hasRole(['Awardee'])) {
        managementChildren.push({
            title: 'Awardee',
            href: '#',
            children: [
                { title: 'Awards Evaluation', href: awards_evaluation() },
            ]
        });
    }

    if (hasRole(['Panelist'])) {
        managementChildren.push({
            title: 'Panelist',
            href: '#',
            children: [
                { title: 'Thesis Review',   href: thesis_review() },
                { title: 'Defense (panel)', href: joint_defense_management() },
            ]
        });
    }
    
    if (hasRole(['Committee'])) {
        managementChildren.push({
            title: 'Committee',
            href: '#',
            children: [
                { title: 'Proposal Review', href: proposal_review() }
            ]
        });
    }


    // Combine and Return
    return [
        { title: 'Home', href: dashboard() },

        // Add management if has children
        ...(managementChildren.length > 0 ? [{ 
            title: 'Management', 
            href: '/faculty/management', 
            children: managementChildren 
        }] : []),

        { title: 'Repository', href: repository() },
        { title: 'Resources', href: resources() },
    ];
};
