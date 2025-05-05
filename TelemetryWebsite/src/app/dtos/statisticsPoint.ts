export class StatisticsPoint {
    public readonly x: number;
    public readonly y: number;
    public readonly sevirity: number;
    constructor(x: number, y: number, sevirity: number) {
        this.sevirity = sevirity;
        this.x = x;
        this.y = y;
    }
}