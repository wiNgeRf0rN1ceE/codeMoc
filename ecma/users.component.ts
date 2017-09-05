import {Component, ViewChild, TemplateRef} from '@angular/core';
import {MaterialWindowComponent} from "../party_modules/@material-windows/materialwindow.component";
import {MaterialTableComponent} from "../party_modules/@material-datatables/components/datatable.component";
import {UserService} from '../services/user.service';
import {Validators, FormBuilder} from '@angular/forms';
import {IUsers} from '../models/user';

@Component({
    template: `
      <div class="container">
        <div class="block-header">
          <h2>Список пользователей</h2>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Список пользователей <small>Небольшое описание этого компонента</small></h2>
            <ul class="actions">
              <li>
                <a href="javascript:void(0)" (click)="actionCreateUser()">
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
            <material-table #usersList
              [api_action]="api_action"
              [sort]="sort"
              [search]="search"
              [columns]="columns"
              (action_table_sorting)="onSort($event)"                          
              (action_element_edit)="actionEditUser($event)"
              (action_element_remove)="actionRemoveUser($event)">
            </material-table>
            <material-window draggable-window *ngFor="let user of users_on_edit"
              [title]="window_title_edit"
              [opened]="true"
              (populate_state)="editWindowClose(user)">
              <user-edit
                [user]="user"
                (form_update)="onUserUpdate($event)"></user-edit>
            </material-window>
            <material-window draggable-window #createWindow
              [title]="window_title_create">
              <create-user
                (forms_submit)="onUserCreate($event)">
              </create-user>
            </material-window>
            <template #userType
              let-row="row">
              <span *ngIf="row.type=='opr'">Оператор</span>
              <span *ngIf="row.type=='drv'">Водитель</span>
              <span *ngIf="row.type=='clt'">Клиент</span>
            </template>
          </div>
        </div>
      </div>
    `
})
export class UsersComponent {
    public form: any;
    private window_title_create = "Создание нового пользователя";
    private window_title_edit = "Редактирование пользователя";

    private api_action: string = "usr.list";
    private columns: Array<any> = [];
    public sortType = 'asc';
    public sort = {};
    public search = '';

    private users_on_edit: Array<any> = [];

    @ViewChild("userType")
    user_type: TemplateRef<any>;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.form = fb.group({
            "fio":["", Validators.required],
            "username":["", Validators.required],
            "password":["", Validators.required],
            "type":["", Validators.required],
        });
    }

    @ViewChild("editWindow")
    edit_window: MaterialWindowComponent;

    @ViewChild("createWindow")
    create_window: MaterialWindowComponent;

    @ViewChild("usersList")
    users_list: MaterialTableComponent;

    ngOnInit() {
        this.columns = [
            {name: "id", caption: "#"},
            {name: "fio", caption: "Имя сотрудника"},
            {name: "username", caption: "Логин"},
            {name: "type", caption: "Тип", template: this.user_type}
        ];
    }

    actionCreateUser() {
        this.create_window.open();
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

    createFire() {
        this.create_window.open();
    }

    actionEditUser(row: any) {
        if(-1 == this.users_on_edit.lastIndexOf(row)) {
            this.users_on_edit.push(row);
        }
    }

    actionRemoveUser(row: any) {
        if(!confirm("Пользователь будет удален безвозвратно, Вы уверены?")) {
            return;
        }

        const id: number = row.id;
        this.userService.deleteUser(id).subscribe(response => this.users_list.loadList());
    }

    editWindowClose(user: any): void {
        const index = this.users_on_edit.lastIndexOf(user);
        this.users_on_edit.splice(index, 1);
    }

    onUserUpdate(usr: IUsers) {
        for(let i = 0; i < this.users_on_edit.length; i++) {
            if (this.users_on_edit[i].id === usr.id) {
                this.users_on_edit.splice(i, 1);
                break;
            }
        }
        this.users_list.loadList();
    }

    onUserCreate(user: IUsers) {
        user["_rowCls"] = "info";
        this.users_list.append(user);
        this.create_window.close();
    }

    reloadList() {
        this.users_list.loadList();
        this.sort = {};
    }
}
