import { Component, Input, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  NgApexchartsModule,
  ChartComponent

} from "ng-apexcharts";
import { DataPoint } from '../../../dtos/dataPoint';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent {
  public colors: string[] = ["#9478de"]; // Custom color for the series
  @Input() public graphName = "testing";
  @Input() public graphData: DataPoint[] = [];
  @ViewChild(ChartComponent) chartInstance!: ChartComponent;

  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;
  public annotations: ApexAnnotations = {
    points: [

    ]
  };
  constructor() {
  }

  ngOnInit(): void {
    if (this.graphData != undefined && this.graphData.length != 0)
      this.initChartData();
  }
  ngOnChanges(): void {
    this.initChartData()
  }

  public initChartData(): void {
    let prevPacketTime = new Date(this.graphData[0].packetTime).getTime();
    let runnignPacketTime = prevPacketTime;
    this.annotations.points = [];
    let dates = [];
    for (let i = 0; i < this.graphData.length; i++) {
      runnignPacketTime = runnignPacketTime + new Date(this.graphData[i].packetTime).getTime() - prevPacketTime;
      prevPacketTime = runnignPacketTime;
      dates.push([runnignPacketTime, this.graphData[i].value]);

      if (this.graphData[i].isFaulty && this.annotations.points != undefined) {
        this.annotations.points.push({
          x: runnignPacketTime,
          y: this.graphData[i].value,
          marker: {
            size: 6,
            fillColor: "#FF4560", // Marker color
            strokeColor: "#e2cfea",
            strokeWidth: 2
          },
        });
      }
    }

    this.series = [
      {
        name: this.graphName,
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
        allowMouseWheelZoom: false
      },
      toolbar: {
        autoSelected: "zoom",
        export: {
          csv: {
            filename: this.graphName,
            columnDelimiter: ",",
            headerCategory: "Date,Time",
            headerValue: this.graphName,

            categoryFormatter: (timestamp: number) => {
              return dayjs(timestamp).format("YYYY-MM-DD,HH:mm:ss");
            },

            valueFormatter: (value: number) => {
              return value.toFixed(2);
            }
          }
        }

      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: this.graphName,
      align: "left",
      style: {
        color: "#a06cd5",
        fontSize: "16px"
      }
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        style: {
          colors: "#e2cfea"
        },
        formatter: function (val) {
          return (val).toFixed(0);
        }
      },

    };

    this.xaxis = {

      labels: {
        style: {
          colors: "#e2cfea"
        },
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      type: "datetime"
    };
    this.tooltip = {
      x: {
        formatter: function (value: number) {
          const date = new Date(value);
          return date.toISOString(); // ISO format includes milliseconds
        }
      },
      shared: false,
      y: {
        formatter: function (val) {
          return (val).toFixed(0);
        }
      }
    };
  }
}

