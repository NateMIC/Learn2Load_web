import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  public data: string;
  public bradcastedData: string;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://9969-194-78-242-183.ngrok.io/holo")
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

  public broadcastHoloData = (data) => {
    this.data = data;
    this.hubConnection.invoke('broadcastholodata', this.data)
    .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastholodata', (data) => {
      this.bradcastedData = data;
      console.log(this.bradcastedData);
      
    })
  }

  constructor() { }
}
