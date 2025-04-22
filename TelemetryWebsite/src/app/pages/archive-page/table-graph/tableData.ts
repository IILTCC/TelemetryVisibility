import { TableTelemetryData } from "./tableTelemetryData";

export class TableData {
    public data: TableTelemetryData[];
    constructor(data: TableTelemetryData[]) {
        this.data = data;
    }
}