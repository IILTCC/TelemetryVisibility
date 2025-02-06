import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StartSimulatorDto } from "../dtos/startSimulatorDto";
import { Observable } from "rxjs";
import { StopSimulatorDto } from "../dtos/stopSimulatorDto";

@Injectable({
    providedIn: 'root'
})
export class SimulatorPage {
    constructor(private http: HttpClient) { }
    public startSimulator(startSimulatorDto: StartSimulatorDto): Observable<any> {
        return this.http.post('http://localhost:5000/api/Bitstream/startErrorSimulation', startSimulatorDto);
    }
    public stopSimulator(stopSimulatorDto: StopSimulatorDto): Observable<any> {
        return this.http.post('http://localhost:5000/api/Bitstream/stopSimulator', stopSimulatorDto);
    }

}