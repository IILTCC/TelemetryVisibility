import { StatisticsDictValue } from "./statisticsDictValue";

export class ReceiveStatisticsDto {
    public statisticValues: { [key: string]: StatisticsDictValue };
    constructor(statisticValues?: { [key: string]: StatisticsDictValue }) {
        this.statisticValues = statisticValues || {};
    }

}