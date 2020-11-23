export const splitName = (name?: string): { firstName: string, lastName: string } => {
    if (name === undefined || !name?.length) {
        return {firstName: '', lastName: ''};
    }
    const split = name.split(' ');
    if (split.length <= 1) {
        return {firstName: name, lastName: ''}
    }
    return {firstName: split[0], lastName: split.slice(1).join(' ')}
}

export const toInitials = (name?: string): string => {
    const names = splitName(name);
    const firstLetter = names.firstName[0]?.toUpperCase() ?? '';
    const secondLetter = names.lastName[0]?.toUpperCase() ?? '';
    return '' + firstLetter + secondLetter;
}

export default splitName;