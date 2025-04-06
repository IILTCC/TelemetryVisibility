import { Component, Input } from '@angular/core';
import { TableData } from './tableData';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table-graph',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table-graph.component.html',
  styleUrl: './table-graph.component.scss'
})

export class TableGraphComponent<Row> {
  @Input() public tableData: Row[] = [];
  @Input() public displayedColumns: string[] = [];
  public getRowKeys(): string[] {
    return Object.keys(this.tableData[0] as TableData);
  }
}
