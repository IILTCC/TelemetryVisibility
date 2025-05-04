export class TableMultipleStatisticsData {
    public flightBoxDown: number;
    public flightBoxUp: number;
    public fiberBoxDown: number;
    public fiberBoxUp: number;
    public date: Date;
    constructor(fligthBoxDown: number, flightBoxUp: number, fiberBoxDown: number, fiberBoxUp: number, date: Date) {
        this.flightBoxDown = fligthBoxDown;
        this.flightBoxUp = flightBoxUp;
        this.fiberBoxDown = fiberBoxDown;
        this.fiberBoxUp = fiberBoxUp;
        this.date = date;
    }
}