import { Component } from '@angular/core';
import { WebSocketService } from '../../../services/webSocketService';
import { ReceiveStatisticsDto } from '../../../dtos/webSockets/receiveStatisticsDto';
import { StatisticBoxComponent } from '../../statistics-pages/statistic-box/statistic-box.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-live-statistics',
  standalone: true,
  imports: [StatisticBoxComponent],
  templateUrl: './live-statistics.component.html',
  styleUrls: ['./live-statistics.component.scss',
  ]
})
export class LiveStatisticsComponent {

  public multipleStatistics: { [key: string]: ReceiveStatisticsDto } = {};
  public singleStatistics: ReceiveStatisticsDto = new ReceiveStatisticsDto({});
  private activeToast: Map<string, boolean> = new Map<string, boolean>();
  public statisticsUnits: string[] = ["%", "ms", "ms", "ms", "%"]
  private graphsToFormat: string[] = ["CorruptedPacket"];

  constructor(private webSocketService: WebSocketService, private toastService: ToastrService) {
    webSocketService.connect()
    this.updateStatistics()
    this.webSocketService.startListen()
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
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
  public formatStatistics(): void {
    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      let newKey: string[] = key.split(" ")
      if (newKey.length != 1) {
        if (!this.multipleStatistics.hasOwnProperty(newKey[1]))
          this.multipleStatistics[newKey[1]] = new ReceiveStatisticsDto({});

        this.multipleStatistics[newKey[1]].statisticValues[newKey[0]] = (this.singleStatistics.statisticValues[key]);
        delete this.singleStatistics.statisticValues[key];
      }
    });
    Object.keys(this.singleStatistics.statisticValues).forEach((key) => {
      if (this.graphsToFormat.includes(key)) {
        this.singleStatistics.statisticValues[key].value = this.singleStatistics.statisticValues[key].value * 100;
      }
    })
    console.log(this.multipleStatistics)
    Object.keys(this.multipleStatistics).forEach((key) => {
      if (this.graphsToFormat.includes(key)) {
        Object.keys(this.multipleStatistics[key].statisticValues).forEach((innerKey) => {
          this.multipleStatistics[key].statisticValues[innerKey].value = this.multipleStatistics[key].statisticValues[innerKey].value * 100;
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
  public updateStatistics(): void {
    this.webSocketService.updateStatistics().subscribe(statisticsUpdate => {
      this.singleStatistics = statisticsUpdate;
      this.formatStatistics();
    });
  }
}