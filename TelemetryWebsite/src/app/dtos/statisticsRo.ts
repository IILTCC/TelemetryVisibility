import { Sevirity } from "./sevirityEnum";
import { StatisticsPoint } from "./statisticsPoint";
export class StatisticsRo {
    public graphs: { [key: string]: StatisticsPoint[] };

    constructor(graphs: { [key: string]: StatisticsPoint[] }) {
        this.graphs = graphs;
    }
}