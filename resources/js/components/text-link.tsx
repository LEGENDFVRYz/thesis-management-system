import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: LinkProps) {
    return (
        <Link
            className={cn(
                "font-['DM_Sans:Medium',sans-serif] font-medium text-[#730000] text-[13.33px] text-justify hover:underline transition-colors",
                className,
            )}
            {...props}
            style={{ fontVariationSettings: "'opsz' 14" }}
        >
            {children}
        </Link>
    );
}