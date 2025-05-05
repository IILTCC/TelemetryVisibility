import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { StatisticsPagesService } from '../../services/statisticsPage.Service';
import { GetStatisticsDto } from '../../dtos/getStatisticsDto';
import { StatisticsRo } from '../../dtos/statisticsRo';
import { StatisticBoxComponent } from "./statistic-box/statistic-box.component";
import { StatisticGraphComponent } from "./statistic-graph/statistic-graph.component";
import { CommonModule } from '@angular/common';
import { StatisticsPoint } from '../../dtos/statisticsPoint';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GetStatisticsCount } from '../../dtos/getStatisticsCount';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, DateFormatter } from '../../common/dateFormatter';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GetFullStatisticsDto } from '../../dtos/getFullStatisticsDto';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LegendPopUpComponent } from './legend-pop-up/legend-pop-up.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExportService } from '../../services/export.Service';
import { StatisticsGraphType } from './statistic-graph/multiStatisticsGraphType';
import { TableGraphComponent } from "../archive-page/table-graph/table-graph.component";
import { TableSingleStatisticsData } from './tableSingleStatisticsData';
import { TableMultipleStatisticsData } from './tableMultipleStatisticsData';
import { StatisticsUpdate } from './statistic-graph/statisticsUpdate';

@Component({
  selector: 'app-statistics-pages',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, StatisticBoxComponent, StatisticGraphComponent, CommonModule, MatPaginatorModule, MatSliderModule, MatInputModule, MatIconModule, MatDialogModule, MatTooltipModule, TableGraphComponent],
  templateUrl: './statistics-pages.component.html',
  styleUrl: './statistics-pages.component.scss',
  providers: [
    { provide: DateAdapter, useClass: DateFormatter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class StatisticsPagesComponent {
  readonly dialog = inject(MatDialog);
  public dataMultiHeader: string[] = ["Date", "FlightBoxDown", "FlightBoxUp", "FiberBoxDown", "FiberBoxUp"];
  public valueMultiHeader: string[] = ["date", "flightBoxDown", "flightBoxUp", "fiberBoxDown", "fiberBoxUp"];
  public dataSingleHeader: string[] = ["Date", "Value"];
  public valueSingleHeader: string[] = ["date", "value"];
  public tableSingleData: Map<string, TableSingleStatisticsData[]> = new Map<string, TableSingleStatisticsData[]>();
  public tableMultiData: Map<string, TableMultipleStatisticsData[]> = new Map<string, TableMultipleStatisticsData[]>();

  public isTable: boolean = false;
  public minTimeline: number = 0;
  public maxTimeline: number = 0;
  public startTimeLine: number = 0;
  public endTimeLine: number = 0;
  public timelineForm = new FormGroup({
    timelineStart: new FormControl<Date | null>(null),
    timelineEnd: new FormControl<Date | null>(null),
  });
  public isTimeLine: boolean = false;
  public startTimeLineDate: Date = new Date();
  public endTimeLineDate: Date = new Date();
  public Object: any;
  public currentStatisticsCount: number = 0;
  private pageStart: number = 0;
  private pageEnd: number = 10;
  public statisticsType: { [key: string]: StatisticsRo } = {};
  public chartColors: string[] = ['#7862b3', '#33b2df', '#f48024', '#2ecc71'];
  public statistics: StatisticsRo = new StatisticsRo({});
  public range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public statisticsUnits: string[] = ["%", "ms", "ms", "ms", "%"]
  private graphsToFormat: string[] = ["CorruptedPacket"];
  public labelValues: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
  public labelSevirity: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
  constructor(private statisticsPageService: StatisticsPagesService, private exportService: ExportService<StatisticsGraphType>, private cdr: ChangeDetectorRef
  ) {
    this.sendStatisticsPage();
    this.initializeTimeLine();
  }
  public formatUnixDate = (value: number): string => {
    const date: Date = new Date(value);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  public statisticsTypeKeys(): string[] {
    return Object.keys(this.statisticsType);
  }
  public statisticsKeys(): string[] {
    return Object.keys(this.statistics.graphs);
  }
  public statisticTableValueKeys(statisticTypeKey: string): string[][] {
    let ret: string[][] = []
    // let values: string[] = Object.keys(this.statisticsType[statisticTypeKey].values);
    // let values: string[] = Object.keys(this.labelValues.get(statisticTypeKey) ?? {});
    const item: Map<string, number> | undefined = this.labelValues.get(statisticTypeKey);
    let values: string[] = []
    if (item != undefined)
      values = Array.from(item.keys())
    for (let index: number = 0; index < values.length; index += 2)
      ret.push([values[index], values[index + 1]])
    return ret;
  }

  private convertSingleTableDate(): void {
    console.log("im here")
    Object.keys(this.statistics.graphs).forEach((singleGraphKey) => {
      let oneGraph: TableSingleStatisticsData[] = []
      this.statistics.graphs[singleGraphKey].forEach((graphPoint) => {
        oneGraph.push(new TableSingleStatisticsData(graphPoint.y, new Date(graphPoint.x)))
      });
      this.tableSingleData.set(singleGraphKey, oneGraph)
    })
  }
  public toggleTable(): void {
    this.convertToTableData()
    this.isTable = !this.isTable;
  }
  private convertMultiTableDate(): void {
    Object.keys(this.statisticsType).forEach((statisticsType) => {
      let mapGraph: Map<number, TableMultipleStatisticsData> = new Map<number, TableMultipleStatisticsData>();
      Object.keys(this.statisticsType[statisticsType].graphs).forEach((channelType) => {
        this.statisticsType[statisticsType].graphs[channelType].forEach((graphPoint: StatisticsPoint) => {
          const newChannelType: string = (channelType[0].toLowerCase() + channelType.slice(1)).slice(0, -3);;
          if (mapGraph.has(graphPoint.x))
            (mapGraph.get(graphPoint.x) as any)[newChannelType] = graphPoint.y
          else {
            mapGraph.set(graphPoint.x, new TableMultipleStatisticsData(0, 0, 0, 0, new Date(graphPoint.x)));
            (mapGraph.get(graphPoint.x) as any)[newChannelType] = graphPoint.y;
          }
        })
      })
      let oneGraph: TableMultipleStatisticsData[] = []
      mapGraph.forEach((value: TableMultipleStatisticsData) => {
        oneGraph.push(value)
        this.tableMultiData.set(statisticsType, oneGraph)
      })

    })
  }
  private convertToTableData(): void {
    this.convertSingleTableDate();
    this.convertMultiTableDate();
  }
  public statisticGraphValueKeys(statisticTypeKey: string): string[] {
    const item: Map<string, number> | undefined = this.labelValues.get(statisticTypeKey);
    if (item != undefined)
      return Array.from(item.keys());
    return []
  }
  public formatStatisticDict(list: StatisticsPoint[], name: string): { [key: string]: StatisticsPoint[] } {
    let retDict: { [key: string]: StatisticsPoint[] } = {}
    retDict[name] = list;
    return retDict
  }
  public loadGraphs(): void {
    this.statisticsType = {}
    Object.keys(this.statistics.graphs).forEach(key => {
      let keySplit: string[] = key.split(" ");
      if (keySplit.length != 1) {
        let newKey = keySplit[1]
        if (!this.statisticsType.hasOwnProperty(newKey)) {
          this.statisticsType[newKey] = new StatisticsRo({});
          this.labelValues.set(newKey, new Map<string, number>());
          this.labelSevirity.set(newKey, new Map<string, number>());
        }

        this.statisticsType[newKey].graphs[keySplit[0]] = this.statistics.graphs[key]
        delete this.statistics.graphs[key];
      }
    });
    this.formatGraphsUnits();
    Object.keys(this.statisticsType).forEach((statisticName) => {
      Object.keys(this.statisticsType[statisticName].graphs).forEach((channelName) => {
        const channelLength: number = this.statisticsType[statisticName].graphs[channelName].length;
        this.labelSevirity.get(statisticName)?.set(channelName, this.statisticsType[statisticName].graphs[channelName][channelLength - 1].sevirity);
        this.labelValues.get(statisticName)?.set(channelName, this.statisticsType[statisticName].graphs[channelName][channelLength - 1].y);
      })
    })
    // this.labelSevirity.get(newKey)?.set(keySplit[0], this.statistics.graphs[key][0].sevirity);
    // this.labelValues.get(newKey)?.set(keySplit[0], this.statistics.graphs[key][0].y);
  }

  private formatGraphsUnits(): void {
    this.graphsToFormat.forEach(key => {
      if (this.statisticsType.hasOwnProperty(key)) {
        Object.keys(this.statisticsType[key].graphs).forEach((graphName: string) => {
          for (let pointIndex = 0; pointIndex < this.statisticsType[key].graphs[graphName].length; pointIndex++) {
            let newY: number = this.statisticsType[key].graphs[graphName][pointIndex].y * 100;
            let oldX: number = this.statisticsType[key].graphs[graphName][pointIndex].x;
            let oldSevirity: number = this.statisticsType[key].graphs[graphName][pointIndex].sevirity;
            this.statisticsType[key].graphs[graphName][pointIndex] = new StatisticsPoint(oldX, newY, oldSevirity)
          }
        });
        // Object.keys(this.statisticsType[key].values).forEach((valueName: string) => {
        //   this.statisticsType[key].values[valueName] = this.statisticsType[key].values[valueName] * 100;
        // });
        Object.keys(this.labelValues).forEach((valueName: string) => {
          // this.statisticsType[key].values[valueName] = this.statisticsType[key].values[valueName] * 100;
          const length: number = Object.keys(this.statisticsType[key].graphs).length;
          this.labelValues.get(key)?.set(valueName, this.statisticsType[key].graphs[valueName][length].y * 100);
        })
      }
    })
  }
  public initializeTimeLine(): void {
    this.statisticsPageService.getStatisticsDateRange().subscribe((result) => {
      this.minTimeline = new Date(result.startDate).getTime();
      this.maxTimeline = new Date(result.endDate).getTime();

      this.startTimeLine = this.minTimeline;
      this.endTimeLine = (this.maxTimeline + this.minTimeline) / 2;

      this.startTimeLineDate = new Date(result.startDate);
      this.endTimeLineDate = new Date(result.endDate);
      this.timelineForm.patchValue({ timelineStart: this.startTimeLineDate, timelineEnd: this.endTimeLineDate });
    });
  }
  public sendStatisticsPage(): void {
    if (!this.isTimeLine)
      this.sendTimelineStatistics()
    else
      this.sendPaginationStatistics()

  }

  public sendPaginationStatistics(): void {
    if (this.range.get('start')?.value == null || this.range.get('end')?.value == null)
      return

    let startDate: Date = this.range.get('start')?.value ?? new Date();
    let endDate: Date = this.range.get('end')?.value ?? new Date();

    let statisticsCountRequest: GetStatisticsCount = new GetStatisticsCount(startDate, endDate);
    this.statisticsPageService.getStatisticsCount(statisticsCountRequest).subscribe((result) => this.currentStatisticsCount = result)

    let getStatisticsDto: GetStatisticsDto = new GetStatisticsDto(startDate, endDate, this.pageStart, this.pageEnd);
    this.statisticsPageService.getStatistics(getStatisticsDto).subscribe((result) => { this.statistics = result; this.loadGraphs(); })
    if (this.isTable)
      this.convertToTableData()
  }
  public sendTimelineStatistics(): void {
    if (this.startTimeLineDate == null || this.endTimeLineDate == null)
      return

    let getStatisticsDto: GetFullStatisticsDto = new GetFullStatisticsDto(this.startTimeLineDate, this.endTimeLineDate);
    this.statisticsPageService.getFullStatistics(getStatisticsDto).subscribe((result) => {
      this.statistics = result; this.loadGraphs(); if (this.isTable)
        this.convertToTableData()
    })
  }
  public onPageChange(event: any): void {
    this.pageStart = event.pageIndex * event.pageSize
    this.pageEnd = event.pageIndex * event.pageSize + event.pageSize
    this.sendStatisticsPage()
  }

  public onTimeLineChange(event: any): void {
    this.startTimeLineDate = new Date(this.startTimeLine);
    this.endTimeLineDate = new Date(this.endTimeLine);
    this.timelineForm.patchValue({ timelineStart: this.startTimeLineDate, timelineEnd: this.endTimeLineDate });
  }
  public onEndDateChange(event: any): void {
    this.endTimeLine = new Date(event.value).getTime();
  }
  public onStartDateChange(event: any): void {
    this.startTimeLine = new Date(event.value).getTime();
  }
  public swithcTimelinePagination(): void {
    this.isTimeLine = !this.isTimeLine;
  }
  public openLegend(): void {
    this.dialog.open(LegendPopUpComponent);
  }
  public async exportAllGraphs(): Promise<void> {
    let allGraphs: StatisticsGraphType[][] = [];
    let fileNames: string[] = [];
    let headerNames: string[][] = []

    Object.keys(this.statistics.graphs).forEach((singleGraphKey) => {
      let oneGraph: StatisticsGraphType[] = []
      fileNames.push(singleGraphKey)
      headerNames.push(["Date", "Value"])

      this.statistics.graphs[singleGraphKey].forEach(graphPoint => {
        oneGraph.push(new StatisticsGraphType(new Date(graphPoint.x), graphPoint.y))
      });
      allGraphs.push(oneGraph)
    });

    Object.keys(this.statisticsType).forEach((multiTopGraphKey) => {
      Object.keys(this.statisticsType[multiTopGraphKey].graphs).forEach((multiBottomGraphKey) => {
        let oneGraph: StatisticsGraphType[] = []
        fileNames.push(multiTopGraphKey + " " + multiBottomGraphKey)
        headerNames.push(["Date", "Value"])
        this.statisticsType[multiTopGraphKey].graphs[multiBottomGraphKey].forEach((graphPoint) => {
          oneGraph.push(new StatisticsGraphType(new Date(graphPoint.x), graphPoint.y))
        })
        allGraphs.push(oneGraph)
      })

    });
    this.exportService.exportAllGraphs(allGraphs, headerNames, fileNames);
  }
  public onNewLableValues(data: StatisticsUpdate): void {
    // this.statisticsType[data.statisticsName].values[data.channelName] = data.value;
    // this.statisticsType[data.statisticsName].sevirityValues[data.channelName] = data.sevirityValue;
    this.labelValues.get(data.statisticsName)?.set(data.channelName, data.value);
    this.labelSevirity.get(data.statisticsName)?.set(data.channelName, data.sevirityValue);

    this.cdr.detectChanges();

  }

}
