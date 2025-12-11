import { NavItem } from "@/types";
import { 
    dashboard, resources
} from '@/routes/admin';
import { 
    user, system, defenses, index as management
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
            { title: 'User',     href: user() },
            { title: 'System Config',     href: system() },
            { title: 'Defense',     href: defenses() },
        ]
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