import { usePage } from '@inertiajs/react';

type UserInfo = {
    user_id: number;
    user_role: 'student' | 'faculty';
    is_admin?: boolean;
    faculty_id?: number;
    faculty_roles?: string[];
};

type EffectiveRole = 'admin' | 'faculty' | 'student' | null;

export default function useUserRole(): EffectiveRole {
    const { user_info } = usePage().props as { user_info?: UserInfo };

    if (!user_info) return null;    // guest

    // If user is faculty, check if admin or faculty
    if (user_info.user_role === 'faculty') {
        return user_info.is_admin ? 'admin' : 'faculty';
    }

    return user_info.user_role;
}
