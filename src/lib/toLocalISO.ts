export const twoDigit = (s: string | number): string => `${s}`.padStart(2, "0");
export const toLocalISODate = (input: Date | string) => {
    const date = new Date(input);
    return [date.getFullYear(), twoDigit(date.getMonth() + 1), twoDigit(date.getDate())].join("-");
};

export const toLocalISOTime = (input: Date | string) => {
    const date = new Date(input);
    return [twoDigit(date.getHours()), twoDigit(date.getMinutes())].join(":")
};


export const toLocalDayDateString = (input: Date | string) => {
    const date = new Date(input);
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    return `${dayName} ${date.getDate()}. ${monthName}`;
    // return toLocalISOTime(date) + " " + [twoDigit(date.getDate()), twoDigit(date.getMonth() + 1), date.getFullYear()].join("/")
};

export const toLocalDayDateYearString = (input: Date | string) => {
    const date = new Date(input);
    const dayName = dayNames[date.getDay()].substring(0, 3);
    const monthName = monthNames[date.getMonth()];
    return `${dayName} ${date.getDate()}. ${monthName} ${date.getFullYear()}`;
    // return toLocalISOTime(date) + " " + [twoDigit(date.getDate()), twoDigit(date.getMonth() + 1), date.getFullYear()].join("/")
};

export const toLocalDateMothYearString = (input: Date | string) => {
    const date = new Date(input);
    const monthName = monthNames[date.getMonth()];
    return `${monthName} ${date.getFullYear()}`;
    // return toLocalISOTime(date) + " " + [twoDigit(date.getDate()), twoDigit(date.getMonth() + 1), date.getFullYear()].join("/")
};

export const toLocalDateTimeString = (input?: Date | string): string => {
    if (input === undefined) return '';
    const date = new Date(input);
    const monthName = monthNames[date.getMonth()];
    return `${date.getDate()}. ${monthName} ${toLocalISOTime(date)}`;
};

const dayNames = [
    'Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'
];

const monthNames = [
    'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'
];
