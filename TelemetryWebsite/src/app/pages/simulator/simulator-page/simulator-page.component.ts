import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'


@Component({
  selector: 'app-simulator-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './simulator-page.component.html',
  styleUrl: './simulator-page.component.scss'
})
export class SimulatorPageComponent {
  channelNames: [string, boolean][] = [["FiberBoxUp", true], ["FiberBoxDown", false], ["FlightBoxDown", true], ["FlightBoxUp", false]]
  channelDelayInput: { [key: string]: string } = { FiberBoxUp: "0", FiberBoxDown: "0", FlightBoxDown: "0", FlightBoxUp: "0" };
  channelErrorsInput: { [key: string]: string } = { FiberBoxUp: "0", FiberBoxDown: "0", FlightBoxDown: "0", FlightBoxUp: "0" };


  clickOnStart(channelName: string): void {
    console.log("Start clicked on channel " + channelName + " " + this.channelDelayInput[channelName] + " with delay " + this.channelErrorsInput[channelName]);
  }
}

