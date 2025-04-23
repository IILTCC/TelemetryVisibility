export class GetFullFramesDto {
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly collectionType: number;
    constructor(collectionType: number, startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.collectionType = collectionType;
    }
}