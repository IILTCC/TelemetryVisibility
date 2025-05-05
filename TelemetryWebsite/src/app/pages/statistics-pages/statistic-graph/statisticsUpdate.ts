import { Sevirity } from "../../../dtos/sevirityEnum";

export class StatisticsUpdate {
    public sevirityValue: Sevirity;
    public value: number;
    public statisticsName: string;
    public channelName: string;

    constructor(sevirityValue: Sevirity, value: number, statisticsName: string, channelName: string) {
        this.sevirityValue = sevirityValue;
        this.value = value;
        this.statisticsName = statisticsName;
        this.channelName = channelName;
    }
}