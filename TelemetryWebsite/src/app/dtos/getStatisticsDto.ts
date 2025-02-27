export class GetStatisticsDto {
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly startPoint:number;
    public readonly statisticsCount:number;
    constructor(startDate: Date, endDate: Date,startPoint:number,statisticsCount:number) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.startPoint = startPoint;
        this.statisticsCount = statisticsCount;
    }
}