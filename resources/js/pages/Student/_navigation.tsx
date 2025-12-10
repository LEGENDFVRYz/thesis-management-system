import { NavItem } from "@/types";
import { 
    dashboard
} from '@/routes/admin';


export const studentMainNav: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
    {
        title: 'Management',
        href: dashboard(),
        children: [
            { title: 'Faculty',     href: '#' },
            { title: 'Student',     href: '#' },
            { title: 'Deadline',    href: '#' },
            { title: 'Defense',     href: '#' },
        ]
    },
    {
        title: 'Student',
        href: dashboard(),
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