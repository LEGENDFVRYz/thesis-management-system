import { NavItem } from "@/types";
import { 
    dashboard, resources, repository
} from '@/routes/faculty';
import { 
    advisee_management, awards_evaluation, proposal_review, thesis_monitoring, thesis_review
} from '@/routes/faculty/management';




export const facultyMainNav: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
    {
        title: 'Management',
        href: 'management',
        children: [
            { title: 'Advisee',             href: advisee_management() },
            { title: 'Awards Evaluation',   href: awards_evaluation() },
            { title: 'Proposal Review',     href: proposal_review() },
            { title: 'Thesis Monitoring',   href: thesis_monitoring() },
            { title: 'Thesis Review',       href: thesis_review() },
        ]
    },
    {
        title: 'Repository',
        href: repository(),
    },
    {
        title: 'Resources',
        href: resources(),
    },
];