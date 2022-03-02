import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenusComponent } from './menus.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
        {path:'',component: MenusComponent, children:[
				{path:'', redirectTo: 'personal', pathMatch: 'full'},
        ]}
    ])
  ],
  exports: [RouterModule]
})
export class MenusModule { }
