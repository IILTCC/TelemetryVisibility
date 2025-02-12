import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetFrameDto } from "../dtos/getFramesDto";
import { RetFramesDto } from "../dtos/retFrameDto";
import { GetPacketCountDto } from "../dtos/getPacketCountDto";

@Injectable({
    providedIn: 'root'
})
export class ArchivePageService {
    constructor(private http: HttpClient) { }
    public getPackets(getFramesDto: GetFrameDto): Observable<any> {
        return this.http.post<any>('http://localhost:5000/api/FrameRequest/frameByIcd', getFramesDto);
    }
    public getPacketCount(getPacketCountDto:GetPacketCountDto):Observable<any>
    {
        return this.http.post<any>("http://localhost:5000/api/FrameRequest/getFrameCount",getPacketCountDto);
    }
}