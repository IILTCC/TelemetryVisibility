export class DataPoint {
    public readonly value: number;
    public readonly isFaulty: boolean;
    public readonly packetTime: Date;

    constructor(value: number, isFaulty: boolean, packetTime: Date) {
        this.value = value;
        this.isFaulty = isFaulty;
        this.packetTime = packetTime;
    }
    
}