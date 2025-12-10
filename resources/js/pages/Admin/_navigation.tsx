import { NavItem } from "@/types";
import { 
    dashboard, resources, system
} from '@/routes/admin';
import { 
    faculty, students, deadlines, defenses
} from '@/routes/admin/management';
import { 
    theses, system as rsystem
} from '@/routes/admin/repository';


export const adminMainNav: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
    {
        title: 'Management',
        href: '/admin/management',
        children: [
            { title: 'Faculty',     href: faculty() },
            { title: 'Student',     href: students() },
            { title: 'Deadline',    href: deadlines() },
            { title: 'Defense',     href: defenses() },
        ]
    },
    {
        title: 'System',
        href: system(),
    },
    {
        title: 'Repository',
        href: '/admin/repository',
        children: [
            { title: 'Thesis',     href: theses() },
            { title: 'System',     href: rsystem() },
        ]
    },
    {
        title: 'Resources',
        href: resources(),
    },
];