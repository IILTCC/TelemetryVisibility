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


@Component({
  selector: 'app-simulator-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './simulator-page.component.html',
  styleUrl: './simulator-page.component.scss'
})
export class SimulatorPageComponent {
  constructor(private simulatorPageService: SimulatorPage) { }
  channelNames: [string, boolean, number][] = [["FiberBoxUp", true, 3], ["FiberBoxDown", false, 2], ["FlightBoxDown", true, 0], ["FlightBoxUp", false, 1]]
  channelDelayInput: { [key: string]: string } = { FiberBoxUp: "0", FiberBoxDown: "0", FlightBoxDown: "0", FlightBoxUp: "0" };
  channelErrorsInput: { [key: string]: string } = { FiberBoxUp: "0", FiberBoxDown: "0", FlightBoxDown: "0", FlightBoxUp: "0" };
  channelNameId: { [key: string]: number } = { FiberBoxUp: 3, FiberBoxDown: 2, FlightBoxDown: 0, FlightBoxUp: 1 };

  clickOnStart(channelName: string): void {
    let startSimulatorDto: StartSimulatorDto = new StartSimulatorDto(this.channelNameId[channelName], Number(this.channelErrorsInput[channelName]), Number(this.channelDelayInput[channelName]));
    this.simulatorPageService.startSimulator(startSimulatorDto).subscribe((res) => { console.log(res) });
  }
  clickOnPause(channelName: string): void {
    let stopSimulatorDto: StopSimulatorDto = new StopSimulatorDto(this.channelNameId[channelName]);
    this.simulatorPageService.stopSimulator(stopSimulatorDto).subscribe((res) => { console.log(res) });
  }
}

