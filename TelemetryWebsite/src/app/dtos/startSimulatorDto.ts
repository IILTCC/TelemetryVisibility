export class StartSimulatorDto {
    public readonly icdType: number;
    public readonly packetDelayAmount: number;
    public readonly packetNoiseAmount: number;
    constructor(icdType: number, packetNoiseAmount: number, packetDelayAmount: number) {
        this.packetDelayAmount = packetDelayAmount;
        this.icdType = icdType;
        this.packetNoiseAmount = packetNoiseAmount;
    }
}