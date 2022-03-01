import { Component, OnInit } from '@angular/core';
import { SignalRService } from "./service/signal-r.service";
import { PrimeNGConfig } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig, public signalRService: SignalRService, private http: HttpClient) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        this.signalRService.startConnection();
        this.signalRService.addTransferDataListener();
        this.startHttpRequest();
    }

    private startHttpRequest(){
        this.http.get("https://localhost:5001/api/chart").subscribe(res => {
            console.log(res);
        })
    }
}
