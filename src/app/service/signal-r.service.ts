import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  public data: string;
  public bradcastedData: string;
  public connectionId : string;
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
          this.connectionId = data;
          console.log(this.connectionId);
          
          var jsonToSend = {
            "source" : this.sourceId,
          }
          var jsonString = JSON.stringify(jsonToSend);
          this.broadcastHoloData(jsonString);
        }
    ); 
  }

  public addTransferDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      
    })
  }

  //used to send data to the server
  public broadcastHoloData = (data) => {
    this.data = data;
    this.hubConnection.invoke('broadcastholodata', this.data, this.connectionId)
    .catch(err => this.callAppComponentFunctionToDisplayToast("erreur"));
  }

  //used to receive data from the server
  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastholodata', (data) => {
      console.log("Données recues : " + data);
      
      this.bradcastedData = data;
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
    this.sourceId = "angular" + uuidv4();
  }
}
