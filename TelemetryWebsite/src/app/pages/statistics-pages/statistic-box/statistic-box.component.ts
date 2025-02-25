import { Component, Input } from '@angular/core';
import { Sevirity } from '../../../dtos/SevirityEnum';

@Component({
  selector: 'app-statistic-box',
  standalone: true,
  imports: [],
  templateUrl: './statistic-box.component.html',
  styleUrl: './statistic-box.component.scss'
})
export class StatisticBoxComponent {
  constructor(){
    console.log()
  }
  public Sevirity = Sevirity;
  @Input() public statisticName:string = "";
  @Input() public statisticValue:number = 0;
  @Input() public statisticSevirity:Sevirity = 0;

}
