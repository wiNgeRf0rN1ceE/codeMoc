import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";

import { DropdownModule } from '../party_modules/@material-dropdown/dropdown.module';
import { DateTimePickerModule } from '../party_modules/@datetime-picker/lib/picker.module';
import { SelectModule } from '../party_modules/@material-select2/index';

import { Map }   from './monitoring/vehicles-map.component';
import { MonitoringVehiclesList }   from './monitoring/vehicles-list.component';
import { EntryPointsComponent } from './entry-points/entry-points.component';
import { ConclusionPointsComponent } from './conclusion-points/conclusion-points.component';
import { ConclusionPointCreateComponent } from './conclusion-points/conclusion-point-create.component';
import { ConclusionPointEditComponent } from './conclusion-points/conclusion-point-edit.component';
import { EntryPointsCreateComponent } from './entry-points/entry-points-create.component';
import { EntryPointsEditComponent } from './entry-points/entry-points-edit.component';
import { VehiclePositionComponent } from './monitoring/vehicle-position.component';

import { OrdersComponent } from './orders/orders.component';
import { OrdersCrewComponent } from './orders/orders-crew.component';
import { OrdersInProcessComponent } from './orders/orders-in-process.component';
import { OrderCreateComponent } from './orders/order-create.component';
import { OrderInfoComponent } from './orders/order-info.component';
import { OrderEditComponent } from './orders/order-edit.component'; 

import { CrewService } from '../services/crew.service';
import { OrdersService } from '../services/orders.service';
import { routing } from './concrete.routing';

import {MaterialModule} from "../party_modules/@material/material.module";
import {MaterialTablesModule} from "../party_modules/@material-datatables/datatables.module";
import {OrderHistoryComponent} from "./orders/order-history.component";
import {OrdersCrewMapComponent} from "./orders/orders-crew-map.component";

@NgModule({
  imports: [routing, CommonModule, MaterialTablesModule, MaterialModule, 
            FormsModule, ReactiveFormsModule,  DateTimePickerModule,
            DropdownModule, SelectModule],
  providers: [ CrewService, OrdersService ],
  declarations: [
      Map, MonitoringVehiclesList, EntryPointsComponent, EntryPointsCreateComponent, EntryPointsEditComponent,
      VehiclePositionComponent, OrdersComponent, OrdersCrewComponent,
      ConclusionPointsComponent, ConclusionPointCreateComponent, OrdersInProcessComponent,
      OrderCreateComponent, OrderInfoComponent, OrderHistoryComponent, ConclusionPointEditComponent,
      OrdersCrewMapComponent, OrderEditComponent
  ]
})
export class ConcreteModule { }
