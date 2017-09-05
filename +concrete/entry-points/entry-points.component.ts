import { Component, ViewChild, TemplateRef } from "@angular/core";

import { MaterialWindowComponent } from "../../party_modules/@material-windows/materialwindow.component";
import { MaterialTableComponent } from "../../party_modules/@material-datatables/components/datatable.component";

import { EntryPointsCreateComponent } from './entry-points-create.component';
import {HttpClient} from "../../services/http.service";
import { MapPoints } from "../../models/map-points";


@Component({
    template: `
      <div class="container">
        <div class="block-header">
          <h2>Точки погрузки</h2>
        </div>
        <div class="card">
          <div class="card-header">
            <h2>Список точек погрузки <small>Небольшое описание этого компонента</small></h2>
            <ul class="actions">
              <li>
                <a href="javascript:void(0)" (click)="createFire()">
                  <i class="zmdi zmdi-plus"></i>
                </a>
              </li>
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
            <material-table #pointsList
              [api_action]="api_action"
              [columns]="columns"
              [sort]="sort"
              [search]="search"
              (action_table_sorting)="onSort($event)"
              (action_element_edit)="actionEditPoint($event)"
              (action_element_remove)="actionRemovePoint($event)">
            </material-table>
            <material-window draggable-window #createWindow
              [title]="title_window_new">
              <entry-point-create
                (form_submit)="onPointCreate($event)">
              </entry-point-create>
            </material-window>
            <material-window draggable-window *ngFor="let point of edit_list"
              [opened]="true"
              (populate_state)="editWindowClose(point)">
              <entry-point-edit
                [entry_point]="point"
                (form_submit)="onPointEdit($event)">
               </entry-point-edit>
            </material-window>
            <template #entryPosition let-row="row">
              <img src="https://static-maps.yandex.ru/1.x/?ll={{row.longitude}},{{row.latitude}}&size=250,100&z=14&l=map&pt={{row.longitude}},{{row.latitude}},comma" 
                 alt="">
            </template>
          </div>
          
        </div>
      </div>
    `
})
export class EntryPointsComponent {
    private api_action: string = "epnt.list";
    private columns: any = [];
    private edit_list = [];

    public sortType = 'asc';
    public sort = {};
    public search = '';

    constructor(private http: HttpClient) { }

    private title_window_new = "Новая точка погрузки";

    @ViewChild("entryPosition")
    entry_position: TemplateRef<any>;

    @ViewChild("pointsList")
    points_list: MaterialTableComponent;

    @ViewChild("createWindow")
    create_window: MaterialWindowComponent;

    @ViewChild(EntryPointsCreateComponent)
    create_entry_point: EntryPointsCreateComponent;

    ngOnInit() {
        this.columns = [
            {"name": "id", "caption": "#"},
            {"name": "address", "caption": "Адрес точки погрузки"},
            {"name": "longitude", "caption": "На карте", "template": this.entry_position},
        ]
    }

    onPointCreate(row: any):void {
        row["_rowCls"] = "info";
        this.points_list.append(row);
        this.create_window.close();
    }

    onPointEdit(point: MapPoints): void {
        for(let i = 0; i < this.edit_list.length; i++) {
            if (this.edit_list[i].id === point.id){
                this.edit_list.splice(i, 1);
                break;
            }
        }
        this.points_list.loadList();
    }

    editWindowClose(row: any): void {
        const index = this.edit_list.lastIndexOf(row);
        this.edit_list.splice(index, 1);
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
        this.points_list.loadList();
        this.sort = {};
    }

    createFire(): void {
        this.create_window.open();
    }

    actionEditPoint(row: any): void {
        if(-1 == this.edit_list.lastIndexOf(row)) {
            this.edit_list.push(row);
        }
    }

    actionRemovePoint(row: any): void {
        if(!confirm("Точка погрузки будет удалена безвозвратно, Вы уверены?")) {
            return;
        }
        this.http.post("epnt.remove", {point_id: row.id})
            .subscribe(response => this.points_list.loadList());
    }
}
