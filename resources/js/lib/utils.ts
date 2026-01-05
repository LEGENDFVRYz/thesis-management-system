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

// Convert Date Object to a string for backend (sync the timezone difference)
export function formatLocal(date: Date) {
    return date.toLocaleDateString('en-CA');
};

// Recieved created_at or updated_at to check the past time
export function getTimeAgo(date: string | Date): string {
    const inputDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(inputDate.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}
