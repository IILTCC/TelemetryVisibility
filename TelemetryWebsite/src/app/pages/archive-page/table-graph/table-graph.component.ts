import { AfterViewInit, Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TableData } from './tableData';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'app-table-graph',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatSortModule],
  templateUrl: './table-graph.component.html',
  styleUrl: './table-graph.component.scss'
})

export class TableGraphComponent<Row> implements AfterViewInit, OnChanges {
  @Input() public tableData: Row[] = [];
  @Input() public tableName: string = "";
  @Input() public displayedColumns: string[] = [];
  @Input() public valueColumns: string[] = [];
  @Input() public seriesData: [number, number][] = [];

  private _liveAnnouncer = inject(LiveAnnouncer);
  public dataSource = new MatTableDataSource<Row>([]);
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData'] && this.tableData) {
      this.dataSource.data = this.tableData;
    }
  }
  public getRowKeys(): string[] {
    return Object.keys(this.tableData[0] as TableData);
  }
  public isDate(value: any): boolean {
    return value instanceof Date;

  }
  public formatValue(value: any): string {
    if (value instanceof Date) {
      const date: Date = new Date(value);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }
    return value;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
