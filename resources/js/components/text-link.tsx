import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: 'template' | 'restriction' | 'group';
    children: React.ReactNode;
}

export function TextLink({ variant = 'template', children, className, ...props }: TextLinkProps) {
    const variants = {
        template: "text-[12px] font-normal leading-[16px] text-[#444444]",
        restriction: "text-[18.76px] font-medium leading-[24px] text-[#1C398E]",
        group: "text-[10px] font-normal leading-[20px] text-[#000000]"
    };

    return (
        <a
            {...props}
            className={cn(
                "font-dm transition-all duration-200 inline-block",
                "hover:text-[#730000] hover:underline",
                "active:text-[#730000] active:underline",
                variants[variant],
                className
            )}
        >
            {children}
        </a>
    );
}

export default TextLink;