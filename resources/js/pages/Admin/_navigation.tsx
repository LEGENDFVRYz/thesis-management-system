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
    system as rsystem
} from '@/routes/admin/repository';
import { theses } from '@/routes/repository';


export const adminMainNav: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
    {
        title: 'Admin Management',
        href: '/admin/management',
        children: [
            {
                title: 'User',
                href: dashboard(),
                children: [
                    { title: 'Faculty Management',     href: faculty() },
                    { title: 'Student Management',     href: student() },
                ]
            },
            {
                title: 'System',
                href: dashboard(),
                children: [
                    { title: 'Academic Settings',   href: academic() },
                    { title: 'Deadline Config',            href: deadline() },
                    { title: 'Department Policies', href: depPolicies() },
                ]
            },
            {
                title: 'Defense',
                href: dashboard(),
                children: [
                    { title: 'Defense Monitoring',    href: defenses() },
                ]
            },
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