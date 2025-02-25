import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { StatisticsPagesService } from '../../services/statisticsPage.Service';
import { GetStatisticsDto } from '../../dtos/getStatisticsDto';
import { StatisticsRet } from '../../dtos/statisticsRet';
import { StatisticBoxComponent } from "./statistic-box/statistic-box.component";
import { Sevirity } from '../../dtos/SevirityEnum';

@Component({
  selector: 'app-statistics-pages',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, StatisticBoxComponent],
  templateUrl: './statistics-pages.component.html',
  styleUrl: './statistics-pages.component.scss'
})
export class StatisticsPagesComponent {
  Object: any;
  constructor(private statisticsPageService: StatisticsPagesService) {
    this.sendStatisticsPage();
  }
  public statisticsType: { [key: string]: StatisticsRet } = {};

  public sev: Sevirity = Sevirity.bad;
  public statistics: StatisticsRet = new StatisticsRet({}, {}, {});
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  public onEndDateChange(event: any): void {
    console.log(event)
    this.sendStatisticsPage()
  }
  public loadGraphs(): void {
    console.log("in load graphs")
    // statisticsType: { [key: string]: StatisticsRet } = {};

    Object.keys(this.statistics.graphs).forEach(key => {
      let keySplit: string[] = key.split(" ");
      if (keySplit.length != 1) {
        let newKey = keySplit[1]
        console.log(newKey)
        if (!this.statisticsType.hasOwnProperty(newKey))
          this.statisticsType[newKey] = new StatisticsRet({}, {}, {});

        this.statistics.graphs[newKey];
        this.statisticsType[newKey].graphs[keySplit[0]] = this.statistics.graphs[key]
        this.statisticsType[newKey].sevirityValues[keySplit[0]] = this.statistics.sevirityValues[key]
        this.statisticsType[newKey].values[keySplit[0]] = this.statistics.values[key]
        console.log("-----------------")
        delete this.statistics.graphs[key];
        delete this.statistics.sevirityValues[key];
        delete this.statistics.values[key];
        console.log(this.statistics)
      }

    });
    console.log(this.statisticsType)
  }

  public sendStatisticsPage(): void {

    if (this.range.get('start')?.value == null || this.range.get('end')?.value == null)
      return
    let startDate = this.range.get('start')?.value ?? new Date();
    let endDate = this.range.get('end')?.value ?? new Date();
    let getStatisticsDto = new GetStatisticsDto(startDate, endDate);
    this.statisticsPageService.getStatistics(getStatisticsDto).subscribe((result) => { console.log(result); this.statistics = result })

  }
  ngOnInit() {
    let getStatisticsDto = new GetStatisticsDto(new Date("2024-02-18T19:19:06.738z"), new Date("2025-02-18T19:19:20.738z"));
    this.statisticsPageService.getStatistics(getStatisticsDto).subscribe((result) => {
      console.log(result); this.statistics = result; this.loadGraphs()
    })
  }
}
