import { Component, Input } from '@angular/core';
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
  NgApexchartsModule
} from "ng-apexcharts";
import { RetFramesDto } from '../../../dtos/retFrameDto';
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

  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;
  constructor() {
  }
  public annotations: ApexAnnotations = {
    points: [

    ]
  };
  public initChartData(): void {
    let prevPacketTime = new Date(this.graphData[0].packetTime).getTime();
    let runnignPacketTime = prevPacketTime;
    this.annotations.points = [];
    let dates = [];
    for (let i = 0; i < this.graphData.length; i++) {
      console.log(new Date(this.graphData[i].packetTime).getTime() - prevPacketTime)
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
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
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
  ngOnInit(): void {
    console.log(this.graphData)
    console.log(this.graphData[0])
    if (this.graphData != undefined && this.graphData.length != 0)
      this.initChartData();
  }
  ngOnChanges(): void {
    // if(this.graphData != undefined &&  this.graphData.length != 0)
    // this.initChartData();  }
    console.log(this.graphData)

    this.initChartData()
  }
}

