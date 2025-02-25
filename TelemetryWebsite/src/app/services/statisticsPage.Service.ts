import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetFrameDto } from "../dtos/getFramesDto";
import { GetPacketCountDto } from "../dtos/getPacketCountDto";
import { Consts } from "./consts";
import { GetStatisticsDto } from "../dtos/getStatisticsDto";
import { StatisticsRet } from "../dtos/statisticsRet";

@Injectable({
    providedIn: 'root'
})
export class StatisticsPagesService {
    constructor(private http: HttpClient) { }
    public getStatistics(getStatisticsDto: GetStatisticsDto): Observable<StatisticsRet> {
        return this.http.post<StatisticsRet>(Consts.STATISTICS_URL + Consts.STATISTICS_GET_STATISTICS, getStatisticsDto);
    }
}