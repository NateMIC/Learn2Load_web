import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { SharedService } from 'src/app/service/shared.service';
import { SignalRService } from 'src/app/service/signal-r.service';
 
@Component({
    templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {

    chartData: any;
    chartOptions: any;
    subscription: Subscription;
    config: AppConfig;
    successLevel: number;
    errorLevel: number;
    minutes : number;
    secondes : number;
    learninglevel: any[];
    selectedLevel: string = "DE";
    isFormationLaunched: boolean = false;
    casques: string[];
    selectedCasque1: string;
    selectedFruitType: string[];
    errorSelectedFruit: string;
    
    constructor(public configService: ConfigService, private _sharedService: SharedService, public signalRService: SignalRService) {
        this.learninglevel = [
            {label: 'Débutant', value: 'DE'},
            {label: 'Intermédiaire', value: 'IN'},
            {label: 'Avancé', value: 'AV'},
            {label: 'Expert', value: 'EX'},
            {label: 'Personnalisé', value: 'PE'}
        ];
        //If a new device must be added, just add the device name of this one
        //TODO Maybe change the access to a device by another way than the name because there could be redundancy
        this.casques = ["LENOVO-LEGION-Y","LAPTOP-VV33544P", "HOLOLENS-0V1C1L", "MSI-HOME", "DESKTOP-B18594V"];
        this.selectedCasque1 = this.casques[0];
    }

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        this.changeValuesBasedOnTheSelectedLevel("DE");

        this.signalRService.customObservable.subscribe((data) => {
            if(data != "erreur" && data.destination.includes("Angular_DashboardComponent")) {
                this.toggleFormationManagmentButtons();
            }
          }
        );
    }

    changeValuesBasedOnTheSelectedLevel(value:string) {
        switch(value) {
            case "DE" : console.log("'Débutant' mode activated");
                this.successLevel = 25;
                this.errorLevel = 35;
                this.selectedFruitType = ["watermelon"];
                this.minutes = 10;
                this.secondes = 0;
            break;
            case "IN" : console.log("'Intermédiaire' mode activated");
                this.successLevel = 40;
                this.errorLevel = 25;
                this.selectedFruitType = ["watermelon", "lemon"];
                this.minutes = 8;
                this.secondes = 0;
            break;
            case "AV" : console.log("'Avancé' mode activated");
                this.successLevel = 45;
                this.errorLevel = 20;
                this.selectedFruitType = ["watermelon", "lemon"];
                this.minutes = 7;
                this.secondes = 30;
            break;
            case "EX" : console.log("'Expert' mode activated");
                this.successLevel = 50;
                this.errorLevel = 25;
                this.selectedFruitType = ["watermelon", "lemon", "peach"];
                this.minutes = 5;
                this.secondes = 0;
            break;
            case "PE" : console.log("'Personnalisé' mode activated");
                console.log("In progress");
            break;
        }      
    }

    changeToPersonnalizedMode() {
        if(this.selectedLevel != "PE") {
            this.selectedLevel = "PE";
            console.log("'Personnalisé' mode activated");
        }
    }

    buttonClicked(action){
        console.log(this.selectedFruitType.length);
        
        if(this.selectedFruitType.length == 0)
            this.errorSelectedFruit = "Vous devez sélectionner au moins 1 type de fruit";
        else {
            this.errorSelectedFruit = "";
            localStorage.setItem("selectedCasque", this.selectedCasque1);
            console.log(localStorage.getItem("selectedCasque"));
            var time = (this.minutes * 60) + this.secondes;
            var jsonToSend = {
                "source" : this.signalRService.sourceId,
                "destination" : localStorage.getItem("selectedCasque"),
                "action" : action,
                "fruitsTypes" : this.selectedFruitType,
                "errorLevel" : this.errorLevel,
                "successLevel" : this.successLevel,
                "time" : time
            }
            var jsonString = JSON.stringify(jsonToSend); 
            
            this._sharedService.emitChange(jsonString);
        }
        console.log(this.errorSelectedFruit);
        
    }

    toggleFormationManagmentButtons(){
        this.isFormationLaunched = !this.isFormationLaunched;
        console.log("formation lancée : " + this.isFormationLaunched);
        
    }

}
