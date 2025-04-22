import { Injectable } from "@angular/core";
import { Consts } from "./consts";
import JSZip from "jszip";
import saveAs from "file-saver";

@Injectable({
    providedIn: 'root'
})
export class ExportService<RowType extends Object> {
    private isExporting: boolean = false;

    public async exportAllGraphs(rawData: RowType[][], headerNames: string[][], fileNames: string[]): Promise<void> {
        const promises: Promise<{ filename: string, blob: Blob } | null>[] = this.createGraphFilePromises(rawData, headerNames, fileNames);

        if (promises.length === 0) {
            this.isExporting = false;
            return;
        }
        const allFileCsvResults: ({ filename: string, blob: Blob } | null)[] = await Promise.all(promises);
        this.createZipFile(allFileCsvResults);
    }

    public createGraphFilePromises(rawData: RowType[][], headerNames: string[][], fileNames: string[]): Promise<{ filename: string, blob: Blob } | null>[] {
        if (this.isExporting)
            return [];

        if (!rawData || rawData.length === 0)
            return [];
        this.isExporting = true;
        const promises: Promise<{ filename: string, blob: Blob } | null>[] = [];

        for (let dataIndex = 0; dataIndex < rawData.length; dataIndex++) {
            promises.push(this.getCSVBlob(rawData[dataIndex], headerNames[dataIndex], fileNames[dataIndex]));
        }

        return promises;
    }
    public async getCSVBlob(rawData: RowType[], headerNames: string[], filename: string): Promise<{ filename: string, blob: Blob } | null> {
        try {
            const safeGraphName: string = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const finalFilename: string = `${safeGraphName || 'chart_data'}.csv`;

            const csvRows: string[] = this.pushCsvData(rawData, headerNames);

            const csvString: string = csvRows.join("\n");
            const blob: Blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            return { filename: finalFilename, blob };

        } catch (error) {
            return null;
        }
    }

    public pushCsvData(data: RowType[], headerNames: string[]): string[] {
        let csvRows: string[] = [];
        csvRows.push(headerNames.join(","));
        data.forEach(row => {
            let objects: string[] = []
            Object.values(row).forEach((value) => {
                if (value instanceof Date)
                    objects.push(new Date(value).toISOString())
                else objects.push(value)
            })
            csvRows.push(objects.join(","))
        });
        return csvRows
    }

    public async createZipFile(allFileCsvResults: ({ filename: string, blob: Blob } | null)[]): Promise<void> {
        try {
            const zip: JSZip = this.addCsvFiles(allFileCsvResults);

            const zipBlob: Blob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 6
                }
            });
            saveAs(zipBlob, Consts.CSV_EXPORT_NAME);
        } finally {
            this.isExporting = false;
        }
    }
    public addCsvFiles(allFileCsvResults: ({ filename: string, blob: Blob } | null)[]): JSZip {
        const zip: JSZip = new JSZip();
        let filesAdded: number = 0;
        allFileCsvResults.forEach(allFileCsvResults => {
            if (allFileCsvResults) {
                zip.file(allFileCsvResults.filename, allFileCsvResults.blob);
                filesAdded++;
            }
        });

        if (filesAdded === 0) {
            this.isExporting = false;
            return new JSZip();
        }
        return zip
    }
}