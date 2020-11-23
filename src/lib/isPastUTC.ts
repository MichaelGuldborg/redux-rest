export const isPastUTC = (timeStamp: string | undefined): boolean => {
    try {
        const parsedTime = Date.parse(timeStamp as string);
        const now = Date.now();
        return parsedTime <= now;
    } catch (e) {
        return false;
    }
};

export const isFutureUTC = (timeStamp: string): boolean => {
    return !isPastUTC(timeStamp);
};


export default isPastUTC;