import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StartSimulatorDto } from "../dtos/startSimulatorDto";
import { Observable } from "rxjs";
import { StopSimulatorDto } from "../dtos/stopSimulatorDto";
import { Consts } from "./consts";
import { GetCurrentChannelsDto } from "../dtos/getCurrentChannelsDto";

@Injectable({
    providedIn: 'root'
})
export class SimulatorPageService {
    constructor(private http: HttpClient) { }
    public startSimulator(startSimulatorDto: StartSimulatorDto): Observable<any> {
        return this.http.post(Consts.SIMULATOR_URL + Consts.SIMULATOR_START, startSimulatorDto);
    }
    public stopSimulator(stopSimulatorDto: StopSimulatorDto): Observable<any> {
        return this.http.post(Consts.SIMULATOR_URL + Consts.SIMULATOR_STOP, stopSimulatorDto);
    }
    public getCurrent(): Observable<GetCurrentChannelsDto> {
        return this.http.get<GetCurrentChannelsDto>(Consts.SIMULATOR_URL + Consts.SIMULATOR_GET_CURRENT);
    }
}