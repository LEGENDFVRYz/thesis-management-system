import { NavItem } from "@/types";
import { 
    dashboard, resources, repository
} from '@/routes/faculty';




export const facultyMainNav: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
    {
        title: 'Management',
        href: 'management',
        children: [
            { title: 'Faculty',     href: '#' },
            { title: 'Student',     href: '#' },
            { title: 'Deadline',    href: '#' },
            { title: 'Defense',     href: '#' },
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