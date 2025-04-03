import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { DataPoint } from '../../dtos/dataPoint';
import { GetFrameDto } from '../../dtos/getFramesDto';
import { archiveFramesRo } from '../../dtos/archiveFramesRo';
import { ArchivePageService } from '../../services/archivePage.Service';
import { GraphComponent } from "./graph/graph.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GetPacketCountDto } from '../../dtos/getPacketCountDto';
import { ChannelName } from '../../common/channelName';
import { CUSTOM_DATE_FORMATS, DateFormatter } from '../../common/dateFormatter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Consts } from '../../services/consts';


@Component({
  selector: 'app-archive-page',
  standalone: true,
  imports: [GraphComponent, CommonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatExpansionModule, MatCheckboxModule, MatIconModule],
  templateUrl: './archive-page.component.html',
  styleUrl: './archive-page.component.scss',
  providers: [
    { provide: DateAdapter, useClass: DateFormatter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class ArchivePageComponent {
  @ViewChildren(GraphComponent) graphComponents!: QueryList<GraphComponent>;
  public selectedParmateres: Map<string, boolean> = new Map<string, boolean>();
  public showFiller = false;
  public currentPacketCount = 0;
  public packetTypes: string[] = [ChannelName.flightBoxDown, ChannelName.flightBoxUp, ChannelName.fiberBoxDown, ChannelName.fiberBoxUp];
  public packetTypeSelected: string = this.packetTypes[0];
  private pageStart: number = 0;
  private pageEnd: number = 10;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public graphsRequest: archiveFramesRo = new archiveFramesRo({});
  public framesList: DataPoint[] = [];
  public isExporting = false;
  constructor(private archiveService: ArchivePageService) { }
  onPageChange(event: any) {
    this.pageStart = event.pageIndex * event.pageSize
    this.pageEnd = event.pageIndex * event.pageSize + event.pageSize
    this.sendArchiveRequest(false)
  }

  public async exportAllGraphs(): Promise<void> {
    if (this.isExporting) {
      return;
    }
    if (!this.graphComponents || this.graphComponents.length === 0) {
      return;
    }
    this.isExporting = true;
    const promises: Promise<{ filename: string, blob: Blob } | null>[] = [];

    this.graphComponents.forEach((graphComponent) => {
      if (this.selectedParmateres.get(graphComponent.graphName))
        promises.push(graphComponent.getCSVBlob());
    });

    if (promises.length === 0) {
      this.isExporting = false;
      return;
    }
    const allFileCsvResults: ({ filename: string, blob: Blob } | null)[] = await Promise.all(promises);
    this.createZipSave(allFileCsvResults);
  }
  public async createZipSave(allFileCsvResults: ({ filename: string, blob: Blob } | null)[]): Promise<void> {
    const zip: JSZip = new JSZip();
    try {

      let filesAdded: number = 0;
      allFileCsvResults.forEach(allFileCsvResults => {
        if (allFileCsvResults) {
          zip.file(allFileCsvResults.filename, allFileCsvResults.blob);
          filesAdded++;
        }
      });

      if (filesAdded === 0) {
        this.isExporting = false;
        return;
      }
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
  public sendArchiveRequest(restartFilter: boolean): void {

    if (this.range.get('start')?.value == null || this.range.get('end')?.value == null)
      return
    let startDate = this.range.get('start')?.value ?? new Date();
    let endDate = this.range.get('end')?.value ?? new Date();
    let packetCountRequest = new GetPacketCountDto(this.packetTypeToNumber(this.packetTypeSelected), startDate, endDate);
    this.archiveService.getPacketCount(packetCountRequest).subscribe((result) => this.currentPacketCount = result)

    let request: GetFrameDto = new GetFrameDto(this.pageStart, this.pageEnd - this.pageStart, this.packetTypeToNumber(this.packetTypeSelected), startDate, endDate);
    this.archiveService.getPackets(request).subscribe((result: any) => {
      this.graphsRequest = new archiveFramesRo(result)
      if (restartFilter) {
        Object.keys(this.graphsRequest.framesList).forEach((key) => {
          this.selectedParmateres.set(key, true);
        });
      }
    })
  }
  private packetTypeToNumber(wantedPacket: string): number {
    for (let packetIndex = 0; packetIndex < this.packetTypes.length; packetIndex++)
      if (this.packetTypes[packetIndex] == wantedPacket)
        return packetIndex
    return 0
  }
  public onPacketTypeChange(): void {
    this.sendArchiveRequest(true)
  }
  public frameKeys(): string[] {
    return Object.keys(this.graphsRequest.framesList);
  }
  public onStartDateChange(event: any) {
    if (event.value == null)
      return
  }
  public onSidenavToggle() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }
  public onCheckboxChange(event: any): void {
    this.selectedParmateres.set(event.source.value, !this.selectedParmateres.get(event.source.value))
  }
} 
