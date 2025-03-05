import { Component, Input } from '@angular/core';
import { Sevirity } from '../../../dtos/sevirityEnum';

@Component({
  selector: 'app-statistic-box',
  standalone: true,
  imports: [],
  templateUrl: './statistic-box.component.html',
  styleUrl: './statistic-box.component.scss'
})
export class StatisticBoxComponent {
  constructor() {
  }
  public Sevirity = Sevirity;
  @Input() public statisticName: string = "";
  @Input() public statisticValue: number = 0;
  @Input() public statisticSevirity: Sevirity = 0;
  @Input() public statisticUnit: string = "";
  get formattedStatisticValue(): string {
    return parseFloat(this.statisticValue.toFixed(3)).toString();
  }
}
