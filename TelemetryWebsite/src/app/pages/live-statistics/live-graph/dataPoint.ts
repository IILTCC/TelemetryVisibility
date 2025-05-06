export class DataPoint {
    public value: number;
    public time: Date;
    constructor(value: number, time: Date) {
        this.value = value;
        this.time = time;
    }
}