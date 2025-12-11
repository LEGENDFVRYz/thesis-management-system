import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';



type EffectiveRole = 'admin' | 'faculty' | 'student' | null;

export default function useUserRole(): EffectiveRole {
    const { user_info } = usePage<SharedData>().props;

    if (!user_info) return null;    // guest

    // If user is faculty, check if admin or faculty
    if (user_info.user_role === 'faculty') {
        return user_info.is_admin ? 'admin' : 'faculty';
    }

    return user_info.user_role;
}
