import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
 
@Component({
    templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {

    chartData: any;

    chartOptions: any;

    subscription: Subscription;

    config: AppConfig;

    succesLevel: number;

    errorLevel: number;

    crateNumber: number;

    minutes : number;

    secondes : number;

    learninglevel: any[];

    selectedLevel: string = "DE";

    
    constructor(public configService: ConfigService) {
        this.learninglevel = [
            {label: 'Débutant', value: 'DE'},
            {label: 'Intermédiaire', value: 'IN'},
            {label: 'Avancé', value: 'AV'},
            {label: 'Expert', value: 'EX'},
            {label: 'Personnalisé', value: 'PE'}
        ];
    }



    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        this.succesLevel = 50;
        this.errorLevel = 15;
        this.crateNumber = 4;
        this.minutes = 15;
        this.secondes = 0;
    }

    changeValuesBasedOnTheSelectedLevel(value:string) {
        switch(value) {
            case "DE" : console.log("'Débutant' mode activated");
                this.succesLevel = 40;
                this.errorLevel = 35;
                this.crateNumber = 4;
                this.minutes = 15;
                this.secondes = 0;
            break;
            case "IN" : console.log("'Intermédiaire' mode activated");
                this.succesLevel = 50;
                this.errorLevel = 25;
                this.crateNumber = 6;
                this.minutes = 10;
                this.secondes = 0;
            break;
            case "AV" : console.log("'Avancé' mode activated");
                this.succesLevel = 60;
                this.errorLevel = 15;
                this.crateNumber = 8;
                this.minutes = 7;
                this.secondes = 30;
            break;
            case "EX" : console.log("'Expert' mode activated");
                this.succesLevel = 70;
                this.errorLevel = 10;
                this.crateNumber = 10;
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

    savePersonnalizedValues() {
        this.succesLevel = this.succesLevel;
        this.errorLevel = this.errorLevel;
        this.crateNumber = this.crateNumber;
        this.minutes = this.minutes;
        this.secondes = this.secondes;

        // console.log("Success : " + this.succesLevel);
        // console.log("Error : " + this.errorLevel);
        // console.log("Nb crates : " + this.crateNumber);
        // console.log("Time : " + this.minutes + ":" + this.secondes);
    }

}
