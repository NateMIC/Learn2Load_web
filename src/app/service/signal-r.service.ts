import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { SharedService } from './shared.service';

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
    .withAutomaticReconnect()
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
          var jsonToSend = {
            "source" : this.sourceId,
            "destination" :localStorage.getItem("selectedCasque"),
            "action" : "isFormationLaunched"
        }
        console.log(jsonToSend);
        
        var jsonString = JSON.stringify(jsonToSend); 
        
        this._sharedService.emitChange(jsonString);
        }
    ); 
  }

  //used to send data to the server
  public broadcastHoloData = async (data) => {  
    console.log("Données envoyées : " + data);
    this.hubConnection.invoke('broadcastholodata', data);
  }

  //used to receive data from the server
  public addBroadcastDataListener = () => {
    this.hubConnection.on('broadcastdatatoangular', (data) => {
      console.log("Données recues : " + data);
      var jsonObject = JSON.parse(data);
      this.callAppComponentFunctionToDisplayToast(jsonObject);
    })
  }

  callAppComponentFunctionToDisplayToast(jsonObject) {
    this.customSubject.next(jsonObject);
  }

  constructor(private _sharedService: SharedService) { 
  }
}
