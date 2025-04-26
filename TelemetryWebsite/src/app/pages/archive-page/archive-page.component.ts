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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableGraphComponent } from "./table-graph/table-graph.component";
import { TableTelemetryData } from './table-graph/tableTelemetryData';
import { CommonConsts } from '../../common/commonConsts';
import { ExportService } from '../../services/export.Service';
import { GraphType } from './graphType';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { GetFullFramesDto } from '../../dtos/getFullFramesDto';

@Component({
  selector: 'app-archive-page',
  standalone: true,
  imports: [GraphComponent, CommonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatExpansionModule, MatCheckboxModule, MatIconModule, MatTooltipModule, TableGraphComponent, MatSliderModule, MatInputModule],
  templateUrl: './archive-page.component.html',
  styleUrl: './archive-page.component.scss',
  providers: [
    { provide: DateAdapter, useClass: DateFormatter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class ArchivePageComponent {
  @ViewChildren(GraphComponent) graphComponents!: QueryList<GraphComponent>;
  @ViewChildren(TableGraphComponent) tableComponents!: QueryList<TableGraphComponent<TableTelemetryData[]>>;
  public minTimeline: number = 0;
  public maxTimeline: number = 0;
  public startTimeLine: number = 0;
  public endTimeLine: number = 0;
  public timelineForm = new FormGroup({
    timelineStart: new FormControl<Date | null>(null),
    timelineEnd: new FormControl<Date | null>(null),
  });
  public startTimeLineDate: Date = new Date();
  public endTimeLineDate: Date = new Date();
  public isTimeLine: boolean = true;
  public isShowTable: boolean = false;
  public tableData: Map<string, TableTelemetryData[]> = new Map<string, TableTelemetryData[]>();
  public dataHeader: string[] = ["Date", "Is faulty", "Value"];
  public valueHeader: string[] = ["date", "isFaulty", "value"];
  private currentTablesStartIndex: number = 1;
  private currentGraphsStartIndex: number = 1;
  public selectedParmateres: Map<string, boolean> = new Map<string, boolean>();
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
  public isExporting: boolean = false;
  constructor(private archiveService: ArchivePageService, private exportService: ExportService<GraphType>) {
    this.initializeTimeLine();
  }

  onPageChange(event: any) {
    this.pageStart = event.pageIndex * event.pageSize
    this.pageEnd = event.pageIndex * event.pageSize + event.pageSize
    this.sendArchiveRequest(false)
  }

  public async exportAllGraphs(): Promise<void> {
    let allGraphs: GraphType[][] = [];
    let fileNames: string[] = [];
    let headerNames: string[][] = []
    Object.keys(this.graphsRequest.framesList).forEach((graphKey) => {
      if (this.selectedParmateres.get(graphKey)) {
        let oneGraph: GraphType[] = [];
        fileNames.push(graphKey)
        this.graphsRequest.framesList[graphKey].forEach(graphPoint => {
          oneGraph.push(new GraphType(graphPoint.packetTime, graphPoint.value, graphPoint.isFaulty))
        });
        allGraphs.push(oneGraph);
        headerNames.push(["Value", "Is faulty", "Date"])
      }
    });
    this.exportService.exportAllGraphs(allGraphs, headerNames, fileNames);
  }

  public sendArchiveRequest(restartFilter: boolean): void {
    if (this.isTimeLine) {
      this.sendTimelineRequest(restartFilter);
    } else {
      this.sendPaginationRequest(restartFilter);
    }
  }
  public sendTimelineRequest(restartFilter: boolean): void {
    let request: GetFullFramesDto = new GetFullFramesDto(this.packetTypeToNumber(), this.startTimeLineDate, this.endTimeLineDate);
    this.archiveService.getFullFrames(request).subscribe((result: any) => {
      this.graphsRequest = new archiveFramesRo(result)
      if (restartFilter) {
        Object.keys(this.graphsRequest.framesList).forEach((key) => {
          this.selectedParmateres.set(key, true);
        });
      }
      if (this.isShowTable) {
        this.convertToTable();
      }
    })
  }

  public sendPaginationRequest(restartFilter: boolean): void {
    if (this.range.get('start')?.value == null || this.range.get('end')?.value == null)
      return
    let startDate = this.range.get('start')?.value ?? new Date();
    let endDate = this.range.get('end')?.value ?? new Date();
    let packetCountRequest = new GetPacketCountDto(this.packetTypeToNumber(), startDate, endDate);
    this.archiveService.getPacketCount(packetCountRequest).subscribe((result) => this.currentPacketCount = result)

    let request: GetFrameDto = new GetFrameDto(this.pageStart, this.pageEnd - this.pageStart, this.packetTypeToNumber(), startDate, endDate);
    this.archiveService.getPackets(request).subscribe((result: any) => {
      this.graphsRequest = new archiveFramesRo(result)
      if (restartFilter) {
        Object.keys(this.graphsRequest.framesList).forEach((key) => {
          this.selectedParmateres.set(key, true);
        });
      }
      if (this.isShowTable) {
        this.convertToTable();
      }
    })
  }
  private packetTypeToNumber(): number {
    for (let packetIndex = 0; packetIndex < this.packetTypes.length; packetIndex++)
      if (this.packetTypes[packetIndex] == this.packetTypeSelected)
        return packetIndex
    return 0
  }
  public frameKeys(): string[] {
    return Object.keys(this.graphsRequest.framesList);
  }

  public onSidenavToggle(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }
  public formatUnixDate = (value: number): string => {
    const date: Date = new Date(value);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  public onCheckboxChange(event: any): void {
    this.selectedParmateres.set(event.source.value, !this.selectedParmateres.get(event.source.value))
  }
  public convertToTable(): void {
    Object.keys(this.graphsRequest.framesList).forEach((tableName) => {
      this.tableData.set(tableName, [])
      for (let dataPointIndex: number = 0; dataPointIndex < this.graphsRequest.framesList[tableName].length; dataPointIndex++)
        this.tableData.get(tableName)?.push(new TableTelemetryData(this.graphsRequest.framesList[tableName][dataPointIndex].value, this.graphsRequest.framesList[tableName][dataPointIndex].isFaulty, new Date(this.graphsRequest.framesList[tableName][dataPointIndex].packetTime)))

    })
  }
  public onEndDateChange(event: any): void {
    this.endTimeLine = new Date(event.value).getTime();
  }
  public onStartDateChange(event: any): void {
    this.startTimeLine = new Date(event.value).getTime();
  }
  public toggleTable(): void {
    this.isShowTable = !this.isShowTable;
    if (this.isShowTable) {
      this.convertToTable();
    }
  }
  public onTimeLineChange(event: any): void {
    this.startTimeLineDate = new Date(this.startTimeLine);
    this.endTimeLineDate = new Date(this.endTimeLine);
    this.timelineForm.patchValue({ timelineStart: this.startTimeLineDate, timelineEnd: this.endTimeLineDate });
  }
  public initializeTimeLine(): void {
    this.archiveService.getFramesDateRange(this.packetTypeToNumber()).subscribe((result) => {
      this.minTimeline = new Date(result.startDate).getTime();
      this.maxTimeline = new Date(result.endDate).getTime();

      this.startTimeLine = this.minTimeline;
      this.endTimeLine = (this.maxTimeline + this.minTimeline) / 2;

      this.startTimeLineDate = new Date(result.startDate);
      this.endTimeLineDate = new Date(result.endDate);
      this.timelineForm.patchValue({ timelineStart: this.startTimeLineDate, timelineEnd: this.endTimeLineDate });
    });
  }
  public filterTables(index: number): boolean {
    let decision: boolean = index >= this.currentTablesStartIndex * CommonConsts.TABLES_IN_ROW - CommonConsts.TABLES_IN_ROW && index < CommonConsts.TABLES_IN_ROW * this.currentTablesStartIndex;
    return decision;
  }
  public filterGraphs(index: number): boolean {
    let decision: boolean = index >= this.currentGraphsStartIndex * CommonConsts.TABLES_IN_ROW - CommonConsts.TABLES_IN_ROW && index < CommonConsts.TABLES_IN_ROW * this.currentGraphsStartIndex;
    return decision;
  }
  public getVisibleFrameKeys(): string[] {
    let visibleKeys: string[] = [];
    Object.keys(this.graphsRequest.framesList).forEach((key) => {
      if (this.selectedParmateres.get(key))
        visibleKeys.push(key);
    });
    return visibleKeys;
  }
  public moveTableRight(): void {
    if (this.currentTablesStartIndex > 1)
      this.currentTablesStartIndex--;

  }
  public moveTableLeft(): void {
    let counter: number = 0;
    this.selectedParmateres.forEach((value, key) => {
      if (!value) {
        counter++;
      }
    })
    if (this.currentTablesStartIndex * CommonConsts.TABLES_IN_ROW < Object.keys(this.graphsRequest.framesList).length - counter) {
      this.currentTablesStartIndex++;
    }
  }
  public moveGraphLeft(): void {
    if (this.currentGraphsStartIndex > 1)
      this.currentGraphsStartIndex--;

  }
  public moveGraphRight(): void {
    let counter: number = 0;
    this.selectedParmateres.forEach((value, key) => {
      if (!value) {
        counter++;
      }
    })
    if (this.currentGraphsStartIndex * CommonConsts.TABLES_IN_ROW < Object.keys(this.graphsRequest.framesList).length - counter) {
      this.currentGraphsStartIndex++;
    }
  }
  public swithcTimelinePagination(): void {
    this.isTimeLine = !this.isTimeLine;
  }
}