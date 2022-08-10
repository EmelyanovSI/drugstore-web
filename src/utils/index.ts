export const correctName = (name: string) => {
    return name
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
};
