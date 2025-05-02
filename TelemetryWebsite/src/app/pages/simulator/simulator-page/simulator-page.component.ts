import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from "sweetalert2";
import { StartSimulatorDto } from '../../../dtos/startSimulatorDto';
import { StopSimulatorDto } from '../../../dtos/stopSimulatorDto';
import { SimulatorPageService } from '../../../services/simulatorPage.Service';
import { Channel } from './channel';


@Component({
  selector: 'app-simulator-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './simulator-page.component.html',
  styleUrl: './simulator-page.component.scss'
})
export class SimulatorPageComponent {
  public channels: Channel[] = [];
  constructor(private simulatorPageService: SimulatorPageService) {
    simulatorPageService.getCurrent().subscribe((result) => {
      Object.keys(result.channelsCurrent).forEach((channel) => {
        this.channels.push(new Channel(channel, String(result.channelsCurrent[channel].error), String(result.channelsCurrent[channel].delay), result.channelsCurrent[channel].id));
      })
    })
  }

  clickOnStart(channelNumber: number): void {
    let startSimulatorDto: StartSimulatorDto = new StartSimulatorDto(this.channels[channelNumber].id, Number(this.channels[channelNumber].errorInput), Number(this.channels[channelNumber].delayInput));
    this.simulatorPageService.startSimulator(startSimulatorDto).subscribe((res) => {
      if (res != 0) {
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
      if (res != 0) {
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
}

