import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { DataPoint } from '../../dtos/dataPoint';
import { GetFrameDto } from '../../dtos/getFramesDto';
import { RetFramesDto } from '../../dtos/retFrameDto';
import { ArchivePageService } from '../../services/archivePage.Service';
import { GraphComponent } from "./graph/graph.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GetPacketCountDto } from '../../dtos/getPacketCountDto';


@Component({
  selector: 'app-archive-page',
  standalone: true,
  imports: [GraphComponent, CommonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatExpansionModule],
  templateUrl: './archive-page.component.html',
  styleUrl: './archive-page.component.scss'
})
export class ArchivePageComponent {
  public currentPacketCount = 0;
  public packetTypes: string[] = ["FlightBoxDown", "FlightBoxUp", "FiberBoxDown", "FiberBoxUp"];
  public packetTypeSelected: string = this.packetTypes[0];
  private pageStart: number = 0;
  private pageEnd: number = 10;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public graphsRequest: RetFramesDto = new RetFramesDto({});
  public framesList: DataPoint[] = [];
  constructor(private archiveService: ArchivePageService) { }

  sendArchiveRequest(): void {

    if (this.range.get('start')?.value == null || this.range.get('end')?.value == null)
      return
    let startDate = this.range.get('start')?.value ?? new Date();
    let endDate = this.range.get('end')?.value ?? new Date();
    let packetCountRequest = new GetPacketCountDto(this.packetTypeToNumber(this.packetTypeSelected), startDate, endDate);
    this.archiveService.getPacketCount(packetCountRequest).subscribe((result) => this.currentPacketCount = result)

    let request: GetFrameDto = new GetFrameDto(this.pageStart, this.pageEnd - this.pageStart, this.packetTypeToNumber(this.packetTypeSelected), startDate, endDate);
    this.archiveService.getPackets(request).subscribe((result: any) => {
      this.graphsRequest = new RetFramesDto(result)
      console.log(this.graphsRequest)
    })
  }
  packetTypeToNumber(wantedPacket: string): number {
    for (let packetIndex = 0; packetIndex < this.packetTypes.length; packetIndex++)
      if (this.packetTypes[packetIndex] == wantedPacket)
        return packetIndex
    return 0
  }
  onPacketTypeChange(): void {
    this.sendArchiveRequest()
  }
  frameKeys(): string[] {
    return Object.keys(this.graphsRequest.framesList);
  }
  onStartDateChange(event: any) {
    if (event.value == null)
      return


  }
  onEndDateChange(event: any) {
    if (event.value == null)
      return

    this.sendArchiveRequest()
  }
  onPageChange(event: any) {
    this.pageStart = event.pageIndex * event.pageSize
    this.pageEnd = event.pageIndex * event.pageSize + event.pageSize
    this.sendArchiveRequest()
  }
} 
