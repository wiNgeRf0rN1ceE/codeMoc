import {Component, ViewChild, TemplateRef} from "@angular/core";
import {MaterialTableMonitoringVehicle} from "../../party_modules/@material-datatables/extends/monitoring-vehicles.component";
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";

@Component({
    template: `
      <div class="container">
        <div class="block-header">
          <h2>Список автомобилей</h2>
        </div>
        <div class="card">
          <div class="card-header">
            <h2>Список автомобилей <small>Небольшое описание этого компонента</small></h2>
            <ul class="actions">
              <li>
                <a href="javascript:void(0)" (click)="reloadList()">
                  <i class="zmdi zmdi-refresh"></i>
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body">
              <div class="row">
                <div class="col-md-5">
                    <div class="bootgrid-header container-fluid">
                      <div class="search form-group">
                        <div class="input-group">
                            <span class="zmdi icon input-group-addon zmdi-search zmdi-hc-fw"></span>
                            <input type="text" [ngModel]="search" (ngModelChange)="onSearch($event)" class="search-field form-control" placeholder="Поиск">
                        </div>
                      </div>
                    </div>
                 </div>
               </div>
            <material-table-monitoring-vehicles
              [api_action]="api_action"
              [editable]="false"
              [search]="search"
              [sort]="sort"
              (action_table_sorting)="onSort($event)"
              [removable]="false"
              [columns]="columns">
            </material-table-monitoring-vehicles>
            <template #vehicleNumber let-row="row">
              <img alt="" src="{{row.vehicle_number_img}}" width="150px">
            </template>
              <template #trailerNumber let-row="row">
              <img *ngIf="row.trailer_number_img" alt="" src="{{row.trailer_number_img}}" width="150px">
               <p *ngIf="!row.trailer_number_img">Трейлер отсутствует</p> 
              </template>
            <template #vehiclePosition let-row="row">
              <p *ngIf="row.longitude" style="margin-bottom: 5px;">Скорость: {{row.speed}} км/ч</p>
              <p *ngIf="row.longitude" style="margin-bottom: 0px;"><a (click)="displayOnMap(row)" href="javascript:void(0)">
                Показать на карте</a></p>
              <p *ngIf="!row.longitude"><i>Нет данных</i></p>
            </template>
            <template #vehicleCaption let-row="row">
              {{row.mark}} {{row.model}}
            </template>
            <material-window *ngFor="let crew of crew_positions" draggable-window #infoWindow
              (populate_state)="onWindowClose(crew)"
              [opened]="true"
              [title]="map_window">
              <crew-position
                [crew]="crew">
              </crew-position>
            </material-window>
          </div>
        </div>
    </div>
    `
})
export class MonitoringVehiclesList {
    private map_window: string = "Позиция на карте";
    private api_action: string = "crew";
    public sortType = 'asc';
    public sort = {};
    public search = '';
    private columns: Array<any> = [];
    private crew_positions: Array<any> = [];

    @ViewChild("infoWindow")
    info_window: MaterialWindowComponent;

    @ViewChild(MaterialTableMonitoringVehicle)
    vehicle_list: MaterialTableMonitoringVehicle;

    @ViewChild("vehicleNumber")
    vehicle_number: TemplateRef<any>;

    @ViewChild("trailerNumber")
    trailer_number: TemplateRef<any>;

    @ViewChild("vehiclePosition")
    vehicle_position: TemplateRef<any>;

    @ViewChild("vehicleCaption")
    vehicle_caption: TemplateRef<any>;

    ngOnInit() {
        this.columns = [
            {"name": "crew_id", "caption": "Автомобиль", "template": this.vehicle_caption},
            {"name": "username", "caption": "За рулем"},
            {"name": "status_txt", "caption": "Статус"},
            {"name": "crew_id", "caption": "Номер авто", "template": this.vehicle_number},
            {"name": "crew_id", "caption": "Номер трейлера", "template": this.trailer_number},
            {"name": "crew_id", "caption": "Позиция авто", "template": this.vehicle_position},
        ]
    }

    onWindowClose(row: any): void {
        for(let i = 0; i < this.crew_positions.length; i++) {
            if(this.crew_positions[i].crew_id == row.crew_id) {
                this.crew_positions.splice(i, 1);
                break;
            }
        }
    }

    displayOnMap(row: any): void {
        for(let i = 0; i < this.crew_positions.length; i++) {
            if(this.crew_positions[i].crew_id == row.crew_id) {
                this.crew_positions.splice(i, 1);
                break;
            }
        }
        this.crew_positions.push(row);

    }

    onSort(columnName: any) {
        if (this.sortType == "asc"){
            this.sortType = "desc";
        } else {
            this.sortType = "asc";
        }
        this.sort[columnName] = this.sortType;
        this.reloadList();
    }

    onSearch(value) {
        this.search = value;
        setTimeout(()=>this.reloadList(), 500);
    }

    reloadList(): void {
        this.vehicle_list.loadList();
        this.sort = {};
    }

    removeFire(row: any): void {

    }

    editFire(row: any): void {

    }

    createFire(): void {

    }

}
