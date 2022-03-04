import { Component, OnInit } from '@angular/core';
import { SignalRService } from "./service/signal-r.service";
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './service/shared.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig, public signalRService: SignalRService, private http: HttpClient, private _sharedService: SharedService, private messageService : MessageService) { 
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
        this.signalRService.customObservable.subscribe((data) => {
            this.alertFormationFinished(data);
          }
        );
    }

    private startHttpRequest(){ // Server address on Azure
        this.http.get("https://learn2loadserver.azurewebsites.net/api/holo").subscribe(res => {
            console.log(res);
        })
    }

    public buttonClicked = (event) => {
        this.signalRService.broadcastHoloData(event);
    }

    public alertFormationFinished(data){
        var message = data.source + " a terminé la formation en " + Math.floor(data.time) + " secondes avec " + data.success + "% de succes et " + data.error + "% d'erreur.";
        this.messageService.add({key: 'br', severity:'info', summary: 'Info', detail: message});
    }

    
}
