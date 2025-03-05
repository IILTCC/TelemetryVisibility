import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetFrameDto } from "../dtos/getFramesDto";
import { GetPacketCountDto } from "../dtos/getPacketCountDto";
import { Consts } from "./consts";
import { GetStatisticsDto } from "../dtos/getStatisticsDto";
import { StatisticsRo } from "../dtos/statisticsRo";
import { GetStatisticsCount } from "../dtos/getStatisticsCount";

@Injectable({
    providedIn: 'root'
})
export class StatisticsPagesService {
    constructor(private http: HttpClient) { }
    public getStatistics(getStatisticsDto: GetStatisticsDto): Observable<StatisticsRo> {
        return this.http.post<StatisticsRo>(Consts.STATISTICS_URL + Consts.STATISTICS_GET_STATISTICS, getStatisticsDto);
    }
    public getStatisticsCount(getStatisticsCount: GetStatisticsCount): Observable<any> {
        return this.http.post<GetStatisticsCount>(Consts.STATISTICS_URL + Consts.STATISTICS_GET_STATISTICS_COUNT, getStatisticsCount);
    }
}