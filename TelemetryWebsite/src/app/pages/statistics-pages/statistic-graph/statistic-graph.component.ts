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
import { StatisticsPoint } from '../../../dtos/statisticsPoint';
import { CommonConsts } from '../../../common/commonConsts';
import { Output, EventEmitter } from '@angular/core';
import { StatisticsUpdate } from './statisticsUpdate';
import { PointHelper } from './pointHelper';


@Component({
  selector: 'app-statistic-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './statistic-graph.component.html',
  styleUrl: './statistic-graph.component.scss'
})

export class StatisticGraphComponent {
  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;
  public legend!: ApexLegend;
  public colors: string[] = ["#9478de"]; // Custom color for the series
  public annotations: ApexAnnotations = {
    points: [

    ]
  };
  @Output() newLableValues = new EventEmitter<StatisticsUpdate>();
  @Input() public graphName = "testing";
  @Input() public graphData: { [key: string]: StatisticsPoint[] } = {};
  private _graphSevirity: Map<string, Map<number, PointHelper>> = new Map<string, Map<number, PointHelper>>();
  @Input() public lineColor: string[] = [];
  @Input() public graphUnits: string = "";

  constructor() { }

  ngOnInit(): void {
    if (this.graphData != undefined && Object.keys(this.graphData).length != 0)
      this.initChartData();
  }
  ngOnChanges(): void {
    this.initChartData()
  }
  public initChartData(): void {
    let graphDataPoints: { [key: string]: number[][] } = {};
    this.series = [
    ];
    let colorIndex: number = 0
    Object.keys(this.graphData).forEach((graph) => {

      this.graphData[graph].forEach((point) => {
        if (point.sevirity == 2) {
          this.annotations.points?.push({
            x: point.x,
            y: point.y,
            marker: {
              size: 6,
              fillColor: "#FF4560", // Marker color
              strokeColor: "#e2cfea",
              strokeWidth: 2
            },
          });

        }
        if (!graphDataPoints.hasOwnProperty(graph)) {
          graphDataPoints[graph] = [];
          this._graphSevirity.set(graph, new Map<number, PointHelper>());
        }
        graphDataPoints[graph].push([point.x, point.y])
        this._graphSevirity.get(graph)?.set(point.x, new PointHelper(point.y, point.sevirity));
      });
      this.series.push({ name: graph, data: graphDataPoints[graph], color: this.lineColor[colorIndex] });
      colorIndex++;
    });

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
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.legend = {
      show: true,
      labels: {
        colors: ["#e2cfea", "#e2cfea", "#e2cfea", "#e2cfea"]
      }
    }
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
        formatter: (value: number, opts) => {
          console.log(value)
          this._graphSevirity.forEach((dictValue, key) => {
            const pointHelper = this._graphSevirity.get(key)?.get(value);
            if (pointHelper !== undefined)
              this.newLableValues.emit(new StatisticsUpdate(pointHelper.sevirity, pointHelper.y, this.graphName, key));

          })

          const date = new Date(value);
          return date.toISOString();
        }
      },
      shared: true,
      y: {
        formatter: (val, opts) => {
          return (val).toFixed(CommonConsts.DECIMAL_PRECISION) + this.graphUnits;
        }
      },

    };
  }
}
