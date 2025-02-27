import { Sevirity } from "./sevirityEnum";
import { StatisticsPoint } from "./statisticsPoint";
export class StatisticsRet {
    public graphs: { [key: string]: StatisticsPoint[] };
    public sevirityValues: { [key: string]: Sevirity };
    public values: { [key: string]: number };

    constructor(graphs: { [key: string]: StatisticsPoint[] }, sevirityValues: { [key: string]: Sevirity }, values: { [key: string]: number }) {
        this.graphs = graphs;
        this.sevirityValues = sevirityValues;
        this.values = values;
    }
}