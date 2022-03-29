import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  public sourceId;
  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.urlServer) //Server address
    .build();

    this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .then(() => this.getConnectionId())
    .catch((err) => console.log("Error catch : " + err));
  }

  public getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid').then(
      (data) => {
          this.sourceId = data;
        }
    ); 
  }

  //used to send data to the server
  public broadcastHoloData = async (data) => {    
    this.hubConnection.invoke('broadcastholodata', data);
  }

  //used to receive data from the server
  public addBroadcastDataListener = () => {
    this.hubConnection.on('broadcastdatatoangular', (data) => {
      console.log("Données recues : " + data);
      var jsonObject = JSON.parse(data);
      if(jsonObject.source == localStorage.getItem("selectedCasque")){
        this.callAppComponentFunctionToDisplayToast(jsonObject);
      }
    })
  }

  callAppComponentFunctionToDisplayToast(jsonObject) {
    this.customSubject.next(jsonObject);
  }

  constructor() { 
  }
}
