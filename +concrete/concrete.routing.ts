import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Map } from './monitoring/vehicles-map.component';
import { MonitoringVehiclesList }   from './monitoring/vehicles-list.component';
import { EntryPointsComponent } from './entry-points/entry-points.component';
import { ConclusionPointsComponent } from './conclusion-points/conclusion-points.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersInProcessComponent} from './orders/orders-in-process.component';

const routes: Routes = [
  { path: 'monitoring/vehicles/map', component: Map },
  { path: 'monitoring/vehicles/list', component: MonitoringVehiclesList },
  { path: 'orders/entry_points', component: EntryPointsComponent },
  { path: 'orders/conclusion_points', component: ConclusionPointsComponent },
  { path: 'orders/list', component: OrdersComponent },
  { path: 'orders/process', component: OrdersInProcessComponent}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
