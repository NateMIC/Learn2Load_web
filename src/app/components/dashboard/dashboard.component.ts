import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { SharedService } from '../../service/shared.service';
import { SignalRService } from '../../service/signal-r.service';
 
@Component({
    templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {

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

    launchBtn: HTMLButtonElement;
    stopBtn: HTMLButtonElement;
    restartBtn: HTMLButtonElement;

    //Contain the command in this order -> watermelon, lemon, peach
    command: number[] = [0,0,0];
    fruitType: string[] = ["watermelon", "lemon", "peach"];
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
        this.casques = ["LENOVO-LEGION-Y","LAPTOP-VV33544P", "HOLOLENS-0V1C1L", "MSI-HOME", "DESKTOP-B18594V"];
        this.selectedCasque1 = this.casques[0];
        localStorage.setItem("selectedCasque", this.selectedCasque1);
    }

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        this.changeValuesBasedOnTheSelectedLevel("DE");

        this.signalRService.customObservable.subscribe((data) => {           
            if(data != "erreur" && data.component != null && data.component == "Angular_DashboardComponent") {
                this.isFormationLaunched = data.isLaunched;
                this.toggleFormationManagmentButtons();
            }
            else if(data.isLaunched && data.component != "Angular_AppComponent_StressTest"){                
                this.isFormationLaunched = data.isLaunched;
                this.launchBtn.disabled = this.isFormationLaunched;
                this.stopBtn.disabled = !this.isFormationLaunched;
                this.restartBtn.disabled = !this.isFormationLaunched;
                this.successLevel = data.successLevel;
                this.errorLevel = data.errorLevel;
                this.command[0] = data.nbWatermelon;
                this.command[1] = data.nbLemon;
                this.command[2] = data.nbPeach;
                this.selectedFruitType = [];
                if(data.watermelon)
                    this.selectedFruitType.push("watermelon");
                if(data.lemon)
                    this.selectedFruitType.push("lemon");
                if(data.peach)
                    this.selectedFruitType.push("peach");
                this.secondes = data.time%60
                this.minutes = Math.floor(data.time/60)
            }
          }
        );
        this.launchBtn = document.getElementById("launchButton") as HTMLButtonElement;
        this.stopBtn = document.getElementById("stopButton") as HTMLButtonElement;
        this.restartBtn = document.getElementById("restartButton") as HTMLButtonElement;
        this.stopBtn.disabled = true;
        this.restartBtn.disabled = true;
    }

    changeValuesBasedOnTheSelectedLevel(value:string) {
        switch(value) {
            case "DE" : console.log("'Débutant' mode activated");
                this.successLevel = 25;
                this.errorLevel = 35;
                this.selectedFruitType = ["watermelon"];
                this.minutes = 10;
                this.secondes = 0;
                this.command[0] = 2;
                this.command[1] = 0;
                this.command[2] = 0;
            break;
            case "IN" : console.log("'Intermédiaire' mode activated");
                this.successLevel = 40;
                this.errorLevel = 25;
                this.selectedFruitType = ["watermelon", "lemon"];
                this.minutes = 8;
                this.secondes = 0;
                this.command[0] = 2;
                this.command[1] = 2;
                this.command[2] = 0;
            break;
            case "AV" : console.log("'Avancé' mode activated");
                this.successLevel = 45;
                this.errorLevel = 20;
                this.selectedFruitType = ["watermelon", "lemon", "peach"];
                this.minutes = 7;
                this.secondes = 30;
                this.command[0] = 2;
                this.command[1] = 3;
                this.command[2] = 2;
            break;
            case "EX" : console.log("'Expert' mode activated");
                this.successLevel = 50;
                this.errorLevel = 25;
                this.selectedFruitType = ["watermelon", "lemon", "peach"];
                this.minutes = 5;
                this.secondes = 0;
                //The learner must make the order in several pallets
                this.command[0] = 4;
                this.command[1] = 5;
                this.command[2] = 4;
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


    manageCommand(category: string) {
        if(this.selectedLevel != "PE") {
            this.selectedLevel = "PE";
            console.log("'Personnalisé' mode activated");
        }
        if(!this.selectedFruitType.includes(category))
        {
            this.selectedFruitType.push(category);
        }
        console.log(this.selectedFruitType);
        
    }

    buttonClicked(action){        
        if(this.selectedFruitType.length == 0)
            this.errorSelectedFruit = "Vous devez sélectionner au moins 1 type de fruit";
        else if(this.command[0] == 0 && this.command[1] == 0 && this.command[2] == 0)
            this.errorSelectedFruit = "Vous devez ajouter au moins une caisse de fruits à la commande";
        else {
            var watermelon = this.selectedFruitType.includes("watermelon");
            var lemon = this.selectedFruitType.includes("lemon");
            var peach = this.selectedFruitType.includes("peach");
            if (!watermelon) this.command[0] = 0;
            if (!lemon) this.command[1] = 0;
            if (!peach) this.command[2] = 0;

            
            this.errorSelectedFruit = "";
            localStorage.setItem("selectedCasque", this.selectedCasque1);
            var time = (this.minutes * 60) + this.secondes;
            var jsonToSend = {
                "source" : this.signalRService.sourceId,
                "destination" : localStorage.getItem("selectedCasque"),
                "action" : action,
                "watermelon": watermelon,
                "peach": peach,
                "lemon": lemon,
                "nbWatermelon": this.command[0],
                "nbLemon": this.command[1],
                "nbPeach": this.command[2],
                "errorLevel" : this.errorLevel,
                "successLevel" : this.successLevel,
                "time" : time
            }
            var jsonString = JSON.stringify(jsonToSend); 
            
            this._sharedService.emitChange(jsonString);
        }
        
    }

    toggleFormationManagmentButtons(){
        this.launchBtn.disabled = this.isFormationLaunched;
        this.stopBtn.disabled = !this.isFormationLaunched;
        this.restartBtn.disabled = !this.isFormationLaunched;
        console.log("formation lancée : " + this.isFormationLaunched);
        
    }

    checkIfFormationLaunched(event){
        this.launchBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.restartBtn.disabled = true;
        this.changeValuesBasedOnTheSelectedLevel("DE");
        localStorage.setItem("selectedCasque", this.selectedCasque1);        
        var jsonToSend = {
            "source" : this.signalRService.sourceId,
            "destination" : event.value,
            "action" : "isFormationLaunched"
        }
        console.log(jsonToSend);
        
        var jsonString = JSON.stringify(jsonToSend); 
        
        this._sharedService.emitChange(jsonString);
    }

}
