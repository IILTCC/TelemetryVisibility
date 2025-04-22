
export class GraphType {
    public date: Date;
    public value: number;
    public isFaulty: number;
    constructor(date: Date, value: number, isFaulty: number) {
        this.date = date;
        this.value = value;
        this.isFaulty = isFaulty;
    }
}