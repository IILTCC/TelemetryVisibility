import { ChangeDetectorRef, Component } from '@angular/core';
import { WebSocketService } from '../../../services/webSocketService';
import { ReceiveStatisticsDto } from '../../../dtos/webSockets/receiveStatisticsDto';
import { StatisticBoxComponent } from '../../statistics-pages/statistic-box/statistic-box.component';
import { ToastrService } from 'ngx-toastr';
import { LiveGraphComponent } from "../live-graph/live-graph.component";
import { DataPoint } from '../live-graph/dataPoint';
import { StatisticsDictValue } from '../../../dtos/webSockets/statisticsDictValue';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-live-statistics',
  standalone: true,
  imports: [StatisticBoxComponent, LiveGraphComponent],
  templateUrl: './live-statistics.component.html',
  styleUrls: ['./live-statistics.component.scss',
  ]
})
export class LiveStatisticsComponent {

  public multipleStatistics: { [key: string]: ReceiveStatisticsDto } = {};
  public singleStatistics: ReceiveStatisticsDto = new ReceiveStatisticsDto();
  public singleGraphData: Map<string, Subject<DataPoint>> = new Map<string, Subject<DataPoint>>();
  public multiGraphData: Map<string, Map<string, Subject<DataPoint>>> = new Map<string, Map<string, Subject<DataPoint>>>();
  private activeToast: Map<string, boolean> = new Map<string, boolean>();
  public statisticsUnits: string[] = ["%", "ms", "ms", "ms", "%"]
  private graphsToFormat: string[] = ["CorruptedPacket"];
  private isLoaded: boolean = false;
  constructor(private webSocketService: WebSocketService, private toastService: ToastrService,
  ) {
    this.formatStatistics();
    webSocketService.connect()
    this.updateStatistics()
    this.webSocketService.startListen()
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
  public liveGraphKeyName(key: string): string[] {
    return Array.from(this.multiGraphData.get(key)!.keys());
  }
  private tryShowToast(key: string, message: string): void {
    if (!this.activeToast.has(key)) {

      const toast = this.toastService.error(key, message, {
        positionClass: 'toast-bottom-right',
      })
      this.activeToast.set(key, true);
      toast.onHidden.subscribe(() => { this.activeToast.set(key, false) })
    } else if (!this.activeToast.get(key)) {
      const toast = this.toastService.error(key, message, {
        positionClass: 'toast-bottom-right',
      })
      this.activeToast.set(key, true);
      toast.onHidden.subscribe(() => { this.activeToast.set(key, false) })
    }
  }

  private checkSevirity(): void {
    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      if (this.singleStatistics.statisticValues[key].sevirity == 2) {
        this.tryShowToast(key, "sevirity reached error");
      }
    });
    Object.keys(this.multipleStatistics).forEach((topKey) => {
      Object.keys(this.multipleStatistics[topKey].statisticValues).forEach((bottomKey) => {
        if (this.multipleStatistics[topKey].statisticValues[bottomKey].sevirity == 2) {
          this.tryShowToast(topKey + " " + bottomKey, "sevirity reached error");
        }
      });

    });
  }
  public loadSubjects(): void {
    this.isLoaded = true;
    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      let newKey: string[] = key.split(" ")
      if (newKey.length != 1) {
        if (!this.multiGraphData.has(newKey[1]))
          this.multiGraphData.set(newKey[1], new Map<string, Subject<DataPoint>>());

        (this.multiGraphData.get(newKey[1])!).set(newKey[0], new Subject<DataPoint>())
      }
    })
    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      this.singleGraphData.set(key, new Subject<DataPoint>());
    })
  }
  public formatStatistics(): void {

    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      let newKey: string[] = key.split(" ")
      if (newKey.length != 1) {
        if (!this.multipleStatistics.hasOwnProperty(newKey[1]))
          this.multipleStatistics[newKey[1]] = new ReceiveStatisticsDto({});

        this.multipleStatistics[newKey[1]].statisticValues[newKey[0]] = (this.singleStatistics.statisticValues[key]);

        if (!this.graphsToFormat.includes(newKey[1]))
          this.multiGraphData.get(newKey[1])!.get(newKey[0])?.next(new DataPoint(this.singleStatistics.statisticValues[key].value, new Date()))

        delete this.singleStatistics.statisticValues[key];
      } else
        this.singleGraphData.get(key)?.next(new DataPoint(this.singleStatistics.statisticValues[key].value, new Date()))
    });
    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      if (this.graphsToFormat.includes(key)) {
        this.singleStatistics.statisticValues[key].value = this.singleStatistics.statisticValues[key].value * 100;
      }
    })
    Object.keys(this.multipleStatistics).forEach((key) => {
      if (this.graphsToFormat.includes(key)) {
        Object.keys(this.multipleStatistics[key].statisticValues).forEach((innerKey) => {
          this.multipleStatistics[key].statisticValues[innerKey].value = this.multipleStatistics[key].statisticValues[innerKey].value * 100;
          this.multiGraphData.get(key)!.get(innerKey)?.next(new DataPoint(this.multipleStatistics[key].statisticValues[innerKey].value, new Date()))
        })
      }
    })
    this.checkSevirity();
  }
  public multipleStatisticKeys(): string[] {
    return Object.keys(this.multipleStatistics);
  }
  public multipleStatisticValueKeys(statisticTypeKey: string): string[] {
    return Object.keys(this.multipleStatistics[statisticTypeKey].statisticValues);
  }
  public singleStatisticValueKeys(): string[] {
    return Object.keys(this.singleStatistics.statisticValues);
  }
  public formatSingle(key: string) {
    let ret: Map<string, Subject<DataPoint>> = new Map<string, Subject<DataPoint>>();
    ret.set(key, this.singleGraphData.get(key)!)
    return ret;
  }
  public updateStatistics(): void {
    this.webSocketService.updateStatistics().subscribe(statisticsUpdate => {
      this.singleStatistics = statisticsUpdate;
      if (!this.isLoaded)
        this.loadSubjects()
      this.formatStatistics();

    });
  }
}