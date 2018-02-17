export class Utils {
    public static substractDaysFromDate(date: Date, days: number): Date {
        return new Date(date.getTime()-(days*1000*60*60*24));
    }

    /**
     *
     * @param {Date} date
     * @returns {number | string} either the epoch timestamp as number, or an empty string if the date parameter was null
     */
    public static getEpochTime(date: Date): number|string {
        return date == null ? '' : Math.floor(date.getTime() / 1000);
    }
}