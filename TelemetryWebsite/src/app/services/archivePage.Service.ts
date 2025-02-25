import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetFrameDto } from "../dtos/getFramesDto";
import { GetPacketCountDto } from "../dtos/getPacketCountDto";
import { Consts } from "./consts";

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
}