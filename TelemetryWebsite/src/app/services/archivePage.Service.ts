import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetFrameDto } from "../dtos/getFramesDto";
import { GetPacketCountDto } from "../dtos/getPacketCountDto";
import { Consts } from "./consts";
import { archiveFramesRo } from "../dtos/archiveFramesRo";
import { GetDateRangeDto } from "../dtos/getDateRangeDto";
import { GetFullFramesDto } from "../dtos/getFullFramesDto";

@Injectable({
    providedIn: 'root'
})
export class ArchivePageService {
    constructor(private http: HttpClient) { }
    public getPackets(getFramesDto: GetFrameDto): Observable<archiveFramesRo> {
        return this.http.post<archiveFramesRo>(Consts.ARCHIVE_URL + Consts.ARCHIVE_GET_FRAMES, getFramesDto);
    }
    public getPacketCount(getPacketCountDto: GetPacketCountDto): Observable<any> {
        return this.http.post<any>(Consts.ARCHIVE_URL + Consts.ARCHIVE_GET_FRAME_COUNT, getPacketCountDto);
    }
    public getFramesDateRange(icdType: number): Observable<GetDateRangeDto> {
        const params = new HttpParams()
            .set('collectionType', icdType);

        return this.http.get<GetDateRangeDto>(Consts.ARCHIVE_URL + Consts.ARCHIVE_DATE_RANGE, { params });
    }
    public getFullFrames(getFullStatisticsDto: GetFullFramesDto): Observable<archiveFramesRo> {
        return this.http.post<archiveFramesRo>(Consts.ARCHIVE_URL + Consts.ARCHIVE_GET_FULL_FRAME, getFullStatisticsDto);
    }
}