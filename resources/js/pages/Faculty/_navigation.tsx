import { NavItem } from "@/types";
import { 
    dashboard, res
} from '@/routes/admin';


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
        href: dashboard(),
        children: [
            { title: 'Thesis',     href: '#' },
            { title: 'System',     href: '#' },
        ]
    },
    {
        title: 'Resources',
        href: dashboard(),
    },
];