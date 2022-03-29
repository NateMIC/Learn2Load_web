import { Component, OnInit } from '@angular/core';
import { Device } from '../../device';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent implements OnInit {

  devices: Device[];
  newDevice: Device;
  newDeviceName: String;
  constructor() { }

  ngOnInit() {
    this.devices = [
      {id: 0, name: "LENOVO-LEGION-Y"},
      {id: 1, name: "LAPTOP-VV33544P"},
      {id: 2, name: "HOLOLENS-0V1C1L"},
      {id: 3, name: "MSI-HOME"},
      {id: 4, name: "DESKTOP-B18594V"}
    ];
  }

  addNewDevice(newDeviceName) {
    if(newDeviceName != null && newDeviceName != "") {
      this.newDevice = {
        id: 0,
        name: newDeviceName
      };
      this.devices.push(this.newDevice);
      this.assignIDs();
      this.newDeviceName = '';
    }
  }

  removeSelectedDevice(selectedDeviceToRemove: Device) {
    if(selectedDeviceToRemove != null && this.devices.includes(selectedDeviceToRemove)) {
      this.devices.splice(selectedDeviceToRemove.id, 1);
      this.assignIDs();
    }
  }

  assignIDs() {
    for (let index = 0; index < this.devices.length; index++) {
      const element = this.devices[index];
      if(element.id != index) {
        console.log(this.devices[index]);
        element.id = index;
        console.log(this.devices[index]);
      }
    }
  }

}
