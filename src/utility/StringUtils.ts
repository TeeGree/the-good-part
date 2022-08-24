const padSeconds = (seconds: number): string => {
    if (seconds < 10) {
        return `0${seconds}`;
    }
    return seconds.toString();
};

export const parseNumberAsMinutesText = (time: number): string => {
    const flooredTime = Math.floor(time);
    const minutes = Math.floor(flooredTime / 60);
    const seconds = padSeconds(flooredTime % 60);
    return `${minutes}:${seconds}`;
};
