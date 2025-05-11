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
  @Input() public graphSeries: Map<string, Subject<DataPoint>> = new Map<string, Subject<DataPoint>>();
  @Input() public graphUnit: string = "";
  private colors: string[] = ['#a06cd5', '#ff6b6b', '#1dd1a1', '#54a0ff', '#feca57'];
  public chartRef!: Highcharts.Chart;
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions!: Highcharts.Options;

  ngOnInit() {
    this.initOptions()
    let index: number = 0;
    this.graphSeries.forEach((val, key) => {
      const currentIndex = index;
      val.subscribe((point) => {
        if (currentIndex == this.graphSeries.size - 1)
          this.chartRef.series[currentIndex].addPoint([point.time!.getTime(), point.value!], true, this.chartRef.series[currentIndex].points.length > CommonConsts.MAX_POINTS_LIVE_GRAPH)
        else this.chartRef.series[currentIndex].addPoint([point.time!.getTime(), point.value!], false, this.chartRef.series[currentIndex].points.length > CommonConsts.MAX_POINTS_LIVE_GRAPH)

      });
      index++;
    })
  }
  public formatGraphs(): Highcharts.SeriesOptionsType[] {
    let index: number = 0;
    let retGraphs: Highcharts.SeriesOptionsType[] = []
    this.graphSeries.forEach((val, key) => {
      retGraphs.push(
        {
          marker: {
            enabled: true,
            radius: 1
          },
          type: 'line',
          lineWidth: 4,
          name: key,
          color: this.colors[index++],
          data: [],
          events: {
            show: function () {
              setTimeout(() => {
                while (this.points.length > CommonConsts.MAX_POINTS_LIVE_GRAPH) {
                  this.removePoint(0, false, false);
                }
              }, 0);
            }
          }

        })
    })
    return retGraphs;
  }
  public initOptions() {
    this.chartOptions = {
      title: {
        text: this.graphName,
        style: {
          color: "#ffffff"
        }
      },
      credits: { enabled: false },

      tooltip: {
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        valueDecimals: 3,
        valueSuffix: this.graphUnit,
        backgroundColor: '#4a4848',
        style: {
          color: "#e0dede"
        },
        shared: true,
      },
      legend: {
        itemStyle: { color: "#ffffff" },
        itemHoverStyle: {
          color: "#cb9ef7",
        },
        itemHiddenStyle: {
          color: '#888888',
          textDecoration: ""
        }
      },

      chart: {
        width: null,
        type: 'line',
        backgroundColor: '#262626',
        zooming: {
          type: "x"
        },
        resetZoomButton: {
          theme: {
            fill: '#a06cd5',
            stroke: '#888',
            style: {
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '12px'
            },
            r: 4,
            states: {
              hover: {
                style: {
                  color: '#5e5e5e'
                }
              }
            }
          }
        }
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
          text: '',
          style: {
            color: '#ffffff',
          }
        },
        labels: {

          style: {
            color: "#d6d6d6"
          }
        },
        gridLineWidth: 0
      },
      series: this.formatGraphs()

    }
  }
}
