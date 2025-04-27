import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-statistics-pages',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, StatisticBoxComponent, StatisticGraphComponent, CommonModule, MatPaginatorModule, MatSliderModule, MatInputModule, MatIconModule, MatDialogModule, MatTooltipModule],
  templateUrl: './statistics-pages.component.html',
  styleUrl: './statistics-pages.component.scss',
  providers: [
    { provide: DateAdapter, useClass: DateFormatter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class StatisticsPagesComponent {
  readonly dialog = inject(MatDialog);
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
  public statistics: StatisticsRo = new StatisticsRo({}, {}, {});
  public range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public statisticsUnits: string[] = ["%", "ms", "ms", "ms", "%"]
  private graphsToFormat: string[] = ["CorruptedPacket"];
  constructor(private statisticsPageService: StatisticsPagesService, private exportService: ExportService<StatisticsGraphType>) {
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
  public statisticValueKeys(statisticTypeKey: string): string[] {
    return Object.keys(this.statisticsType[statisticTypeKey].values);
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
        if (!this.statisticsType.hasOwnProperty(newKey))
          this.statisticsType[newKey] = new StatisticsRo({}, {}, {});

        this.statisticsType[newKey].graphs[keySplit[0]] = this.statistics.graphs[key]
        this.statisticsType[newKey].sevirityValues[keySplit[0]] = this.statistics.sevirityValues[key]
        this.statisticsType[newKey].values[keySplit[0]] = this.statistics.values[key]

        delete this.statistics.graphs[key];
        delete this.statistics.sevirityValues[key];
        delete this.statistics.values[key];
      }
    });
    this.formatGraphsUnits();
  }

  private formatGraphsUnits(): void {
    this.graphsToFormat.forEach(key => {
      if (this.statisticsType.hasOwnProperty(key)) {
        Object.keys(this.statisticsType[key].graphs).forEach((graphName: string) => {
          for (let pointIndex = 0; pointIndex < this.statisticsType[key].graphs[graphName].length; pointIndex++) {
            let newY: number = this.statisticsType[key].graphs[graphName][pointIndex].y * 100;
            let oldX: number = this.statisticsType[key].graphs[graphName][pointIndex].x;
            this.statisticsType[key].graphs[graphName][pointIndex] = new StatisticsPoint(oldX, newY)
          }
        });
        Object.keys(this.statisticsType[key].values).forEach((valueName: string) => {
          this.statisticsType[key].values[valueName] = this.statisticsType[key].values[valueName] * 100;
        });
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
  }
  public sendTimelineStatistics(): void {

    if (this.startTimeLineDate == null || this.endTimeLineDate == null)
      return
    let getStatisticsDto: GetFullStatisticsDto = new GetFullStatisticsDto(this.startTimeLineDate, this.endTimeLineDate);
    this.statisticsPageService.getFullStatistics(getStatisticsDto).subscribe((result) => { this.statistics = result; this.loadGraphs(); })
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
}
