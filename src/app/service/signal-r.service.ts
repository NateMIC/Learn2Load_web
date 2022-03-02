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
    .withUrl("https://localhost:5001/chart")
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

  public broadcastChartData = (data) => {
    this.data = data;
    this.hubConnection.invoke('broadcastchartdata', this.data)
    .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
      console.log(this.bradcastedData);
      
    })
  }

  constructor() { }
}
