import { Component, input, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { DataPoint } from './dataPoint';
import { Subject } from 'rxjs';
import { CommonConsts } from '../../../common/commonConsts';

@Component({
  selector: 'app-live-graph',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './live-graph.component.html',
  styleUrl: './live-graph.component.scss'
})
export class LiveGraphComponent {
  @Input() public graphName = "";
  @Input() public seriesName: string = "data";
  @Input() public graphSeries: Subject<DataPoint> = new Subject<DataPoint>();
  private graphData: [number, number][] = [];
  public chartRef!: Highcharts.Chart;
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions!: Highcharts.Options;

  ngOnInit() {
    this.graphSeries.subscribe((point) => {
      this.graphData.push([point.time!.getTime(), point.value!])
      if (this.graphData.length > CommonConsts.MAX_POINTS_LIVE_GRAPH)
        this.graphData.shift()
      this.chartRef.series[0].setData(this.graphData)

    });

    this.chartOptions = {
      title: {
        text: this.graphName,
        style: {
          color: "#ffffff"
        }
      },
      credits: { enabled: false },

      tooltip: {
        xDateFormat: '%Y-%m-%d %H:%M:%S', // Custom time format
        shared: true,
      },
      legend: {
        itemStyle: {
          color: '#ffffff',
          fontWeight: 'normal'
        }
      },
      chart: {
        width: null,
        type: 'line',
        backgroundColor: '#262626',
      },
      xAxis: {
        type: 'datetime',
        lineColor: '#d6d6d6',
        labels: {
          formatter: function () {
            return Highcharts.dateFormat('%H:%M:%S', Number(this.value));
          },
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
        data: []
      }]

    }
  }
}
