export class GetFrameDto {
    public readonly startPoint: number;
    public readonly frameCount: number;
    public readonly collectionType: number;
    public readonly startDate: Date;
    public readonly endDate: Date;
    constructor(startPoint: number, frameCount: number, collectionType: number, startDate: Date, endDate: Date) {
        this.startPoint = startPoint;
        this.frameCount = frameCount;
        this.collectionType = collectionType;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}