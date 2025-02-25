export class GetPacketCountDto {
    public readonly collectionType: number;
    public readonly startDate: Date;
    public readonly endDate: Date;
    constructor( collectionType: number, startDate: Date, endDate: Date) {
        this.collectionType = collectionType;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}