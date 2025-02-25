import { DataPoint } from './dataPoint';

export class archiveFramesRo {
    public readonly framesList: { [key: string]: DataPoint[] };

    constructor(framesList: { [key: string]: DataPoint[] }) {
        this.framesList = framesList;
    }
}