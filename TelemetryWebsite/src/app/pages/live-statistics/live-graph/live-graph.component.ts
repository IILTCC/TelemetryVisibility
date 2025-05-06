import { Component, input, Input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';

import * as Highcharts from 'highcharts';
import { DataPoint } from './dataPoint';
@Component({
  selector: 'app-live-graph',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './live-graph.component.html',
  styleUrl: './live-graph.component.scss'
})
export class LiveGraphComponent {
  @Input() public graphName = "testing";
  @Input() public seriesName: string = "data";
  @Input() public graphPoint: DataPoint = new DataPoint(0, new Date());
  private graphSeries: DataPoint[] = [];
  private formateGraphData(): [Date, number][] {
    let ret: [Date, number][] = [];
    this.graphSeries.forEach((point) => {
      ret.push([point.time!, point.value!])
    })
    return ret;
  }
  ngOnChange() {
    this.graphSeries.push(this.graphPoint)
  }
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: this.graphName,
      style: {
        color: "#ffffff"
      }
    },

    legend: {
      itemStyle: {
        color: '#ffffff',
        fontWeight: 'normal'
      }
    },
    chart: {
      type: 'line',
      backgroundColor: '#262626',

    },
    xAxis: {
      type: 'datetime',
      lineColor: '#d6d6d6',
      labels: {

        style: {
          color: "#d6d6d6"
        }
      }
    },
    yAxis: {
      title: {
        text: 'Value',
        style: {
          color: '#ffffff',
        }
      },
      labels: {

        style: {
          color: "#d6d6d6"
        }
      }
    },


    series: [{
      lineWidth: 4,
      type: 'line',
      name: this.seriesName,
      color: '#a06cd5',
      data: this.formateGraphData()
      // data: [
      //   [Date.UTC(2025, 0, 1), 10],
      //   [Date.UTC(2025, 0, 2), 12],
      //   [Date.UTC(2025, 0, 3), 8],
      // ],
    }]
  }
}
