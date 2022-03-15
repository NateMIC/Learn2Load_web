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
        this.signalRService.customObservable.subscribe((data) => {
            if(data == "erreur"){
                this.alertErrorLaunchFormation();
            }
            else if(data.destination.includes("_StressTest")) {
                this.alertStressTestFinished(data);
            }
            else if(data.destination.includes("Angular_AppComponent")) {
                this.alertFormationFinished(data);
            }
          }
        );
    }

    public buttonClicked = (event) => {
        this.signalRService.broadcastHoloData(event);
    }

    public alertFormationFinished(data){
        //If formation is successed
        if(data.isValid) {
            var message = data.source + " a terminé la formation en " + Math.floor(data.time) + " secondes avec une moyenne de " + data.success + "% de succes et " + data.error + "% d'erreur.";
            this.messageService.add({key: 'br', severity:'success', summary: 'Validation de la palette', detail: message, sticky: true});
        }
        //If formation is failed
        else {
            var message = data.source + " a terminé la formation en " + Math.floor(data.time) + " secondes avec une moyenne de " + data.success + "% de succes et " + data.error + "% d'erreur.";
            this.messageService.add({key: 'br', severity:'error', summary: 'Validation de la palette', detail: message, sticky: true});
        }
    }

    public alertStressTestFinished(data){
        if(data.isValid) {
            var message = data.source + " a passé le test avec succès !";
            this.messageService.add({key: 'br', severity:'success', summary: 'Test de stress', detail: message, sticky: true});
        }
        else {
            var message = data.source + " a échoué au test.";
            this.messageService.add({key: 'br', severity:'error', summary: 'Test de stress', detail: message, sticky: true});
        }
    }

    public alertErrorLaunchFormation(){
        var message = "La formation n'a pas pu être lancée car le client n'est pas accessible";
        this.messageService.add({key: 'br', severity:'error', summary: 'Erreur', detail: message, sticky: true});
    }

    
}
