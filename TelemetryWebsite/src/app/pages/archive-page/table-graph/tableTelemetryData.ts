export class TableTelemetryData {
    public value: number;
    public isFaulty: boolean;
    public date: Date;
    constructor(value: number, isFaulty: boolean, date: Date) {
        this.value = value;
        this.isFaulty = isFaulty;
        this.date = date;
    }
}