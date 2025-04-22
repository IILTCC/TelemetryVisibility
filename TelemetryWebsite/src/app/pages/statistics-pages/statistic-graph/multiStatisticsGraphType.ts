export class StatisticsGraphType {
    public date: Date;
    public values: number;
    constructor(date: Date, values: number) {
        this.date = date;
        this.values = values
    }
}