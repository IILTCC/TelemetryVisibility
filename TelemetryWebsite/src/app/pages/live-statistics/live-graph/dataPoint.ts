export class DataPoint {
    public value: number;
    public time: Date;
    public sevirity: number;
    constructor(value: number, time: Date, sevirity: number) {
        this.value = value;
        this.time = time;
        this.sevirity = sevirity;
    }
}