import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import * as signalR from '@microsoft/signalr';
import { ReceiveStatisticsDto } from '../dtos/webSockets/receiveStatisticsDto';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Consts } from './consts';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private hubConnection!: HubConnection;
    public connect(): void {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(Consts.SIGNALR_URL)
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }
    public startListen(): void {
        this.hubConnection
            .start()
            .then(() => {
            })
            .catch((error) => {
            });
    }
    public updateStatistics(): Observable<ReceiveStatisticsDto> {
        return new Observable<ReceiveStatisticsDto>((observer) => {
            this.hubConnection.on(Consts.SIGNALR_STATISTICS_NAME, (statisticsUpdate: ReceiveStatisticsDto) => {
                observer.next(statisticsUpdate);
            });
        });
    }

    public disconnect(): void {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection.stop()
                .then(() => { })
                .catch((error) => { });
        }
    }
}

