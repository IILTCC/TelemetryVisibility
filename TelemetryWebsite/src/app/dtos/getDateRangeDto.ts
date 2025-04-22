export class GetDateRangeDto {
    public readonly startDate: Date;
    public readonly endDate: Date;
    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}