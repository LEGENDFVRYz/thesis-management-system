import { NavItem } from "@/types";
import { 
    dashboard, resources
} from '@/routes/admin';
import { 
    student, faculty,
    academic, deadline, depPolicies,
    defenses
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
            { title: 'Faculty',         href: faculty() },
            { title: 'Student',         href: student() },

            { title: 'Academic Settings',   href: academic() },
            { title: 'Deadline',            href: deadline() },
            { title: 'Department Policies', href: depPolicies() },

            { title: 'Defense',         href: defenses() },
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