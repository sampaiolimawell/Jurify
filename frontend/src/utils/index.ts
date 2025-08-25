// This file contains utility functions used throughout the application.

export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isEmpty = (value: any): boolean => {
    return value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0);
};