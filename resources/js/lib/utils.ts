import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

// Check if a URL belongs to a specific section prefix dynamically
export function isSectionUrl(
    url: NonNullable<InertiaLinkProps['href']>,
    parentPrefix: NonNullable<InertiaLinkProps['href']>,
): boolean {
    const resolvedUrl = resolveUrl(url);

    // Remove domain if present
    const path = resolvedUrl.replace(/^https?:\/\/[^/]+/, '');

    // Check if the path starts with the parent prefix
    return path.startsWith(parentPrefix);
}