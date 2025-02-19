import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { StartSimulatorDto } from '../../../dtos/startSimulatorDto';
import { HttpClient } from '@angular/common/http';
import { SimulatorPage } from '../../../services/simulatorPage.Service';
import { StopSimulatorDto } from '../../../dtos/stopSimulatorDto';
import { SimulatorPageService } from '../../../services/simulatorPage.Service';
import { Channel } from './channel';
import Swal from "sweetalert2";


@Component({
  selector: 'app-simulator-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './simulator-page.component.html',
  styleUrl: './simulator-page.component.scss'
})
export class SimulatorPageComponent {
  constructor(private simulatorPageService: SimulatorPageService) { }
  channels: Channel[] = [new Channel("FiberBoxUp", "0", "0", 3), new Channel("FiberBoxDown", "0", "0", 2), new Channel("FlightBoxDown", "0", "0", 0), new Channel("FlightBoxUp", "0", "0", 1)];

  clickOnStart(channelNumber: number): void {
    let startSimulatorDto: StartSimulatorDto = new StartSimulatorDto(this.channels[channelNumber].id, Number(this.channels[channelNumber].errorInput), Number(this.channels[channelNumber].delayInput));
    this.simulatorPageService.startSimulator(startSimulatorDto).subscribe((res) => {
       if(res != 0)
       {
        Swal.fire({
          title: 'simulator request',
          text: 'reuqest failed',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'confirm',
          allowEscapeKey: true,
          allowEnterKey: true,
          allowOutsideClick: true
        })
       }
      });
  }
  clickOnPause(channelNumber: number): void {
    let stopSimulatorDto: StopSimulatorDto = new StopSimulatorDto(this.channels[channelNumber].id);
    this.simulatorPageService.stopSimulator(stopSimulatorDto).subscribe((res) => {        
      if(res != 0)
       {
        
       } });
  }
}

