
export class GraphType {
    public date: Date;
    public value: number;
    public isFaulty: boolean;
    constructor(date: Date, value: number, isFaulty: boolean) {
        this.date = date;
        this.value = value;
        this.isFaulty = isFaulty;
    }
}