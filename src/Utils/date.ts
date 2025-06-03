/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
    dateString?: string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format a date string to a relative time format (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Check if a date is in the past
 * @param dateString ISO date string
 * @returns Boolean indicating if the date is in the past
 */
export const isPastDate = (dateString?: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
};

/**
 * Check if a date is in the future
 * @param dateString ISO date string
 * @returns Boolean indicating if the date is in the future
 */
export const isFutureDate = (dateString?: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
};

/**
 * Get the current date in ISO format
 * @returns Current date in ISO format
 */
export const getCurrentDate = (): string => {
    return new Date().toISOString();
};
