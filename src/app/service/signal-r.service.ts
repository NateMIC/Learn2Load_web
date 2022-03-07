import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  public data: string;
  public bradcastedData: string;


  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://learn2loadserver.azurewebsites.net/holo") // Server address on Azure
    .build();

    this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .catch((err) => console.log("Error catch : " + err));
  }

  public addTransferDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      
    })
  }

  //used to send data to the server
  public broadcastHoloData = (data) => {
    this.data = data;
    this.hubConnection.invoke('broadcastholodata', this.data)
    .catch(err => console.error(err));
  }

  //used to receive data from the server
  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastholodata', (data) => {
      this.bradcastedData = data;
      var jsonObject = JSON.parse(data);
      if(jsonObject.source == "hololens"){
        this.callAppComponentFunctionToDisplayToast(jsonObject);
      }
    })
  }

  callAppComponentFunctionToDisplayToast(jsonObject) {
    this.customSubject.next(jsonObject);
  }

  constructor() { }
}
