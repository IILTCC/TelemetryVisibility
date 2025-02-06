export class StopSimulatorDto {
    public readonly icdType: number;
    constructor(icdType: number) {
        this.icdType = icdType;
    }
}