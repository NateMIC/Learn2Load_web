import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
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

    succesLevel: number = 50;

    errorLevel: number = 15;

    crateNumber: number = 6;

    minutes : number = 3;

    secondes : number = 30;

    learninglevel: any[];

    selectedLevel: string = "DE";

    
    constructor(private productService: ProductService, public configService: ConfigService) {
        this.learninglevel = [
            {label: 'Débutant', value: 'DE'},
            {label: 'Intermédiaire', value: 'IN'},
            {label: 'Expert', value: 'EX'},
            {label: 'Personnalisé', value: 'PE'}
        ];
    }

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
    }

}
