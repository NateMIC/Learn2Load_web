import { Component, OnInit } from '@angular/core';
import { SignalRService } from "./service/signal-r.service";
import { PrimeNGConfig } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './service/shared.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig, public signalRService: SignalRService, private http: HttpClient, private _sharedService: SharedService) { 
        _sharedService.changeEmitted$.subscribe(data => {
            this.buttonClicked(data);
        });
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        this.signalRService.startConnection();
        this.signalRService.addTransferDataListener();
        this.signalRService.addBroadcastChartDataListener();
        this.startHttpRequest();
    }

    private startHttpRequest(){
        this.http.get("https://9969-194-78-242-183.ngrok.io/api/holo").subscribe(res => {
            console.log(res);
        })
    }

    public buttonClicked = (event) => {
        this.signalRService.broadcastHoloData(event);
    }
}
