import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/device';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent implements OnInit {

  devices: Device[];
  newDevice: Device;

  constructor() { }

  ngOnInit() {
    this.devices = [
      {name: "LENOVO-LEGION-Y"},
      {name: "LAPTOP-VV33544P"},
      {name: "HOLOLENS-0V1C1L"},
      {name: "MSI-HOME"},
      {name: "DESKTOP-B18594V"}
    ];
  }

  addNewDevice(newDeviceName: String) {
    if(newDeviceName != null && newDeviceName != "") {
      this.newDevice.name = newDeviceName;
      this.devices.push(this.newDevice);
    }
  }

}
