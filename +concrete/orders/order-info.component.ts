import {Component, Input} from "@angular/core";
import {HttpClient} from "../../services/http.service";
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";

@Component({
    selector: "order-information",
    template: `
        <div *ngIf="!data" class="text-center">
            <div class="preloader pls-blue">
                <svg class="pl-circular" viewBox="25 25 50 50">
                    <circle class="plc-path" cx="50" cy="50" r="20"></circle>
                </svg>
            </div>
        </div>
        <div *ngIf="data">
            <tabs>
                <tab [tabTitle]="'Основная информация'">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Номер заказа</label>
                                <input class="form-control" [value]="data.id" readonly="readonly">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group fg-line">
                                <label>Вес заказа</label>
                                <input class="form-control" [value]="data.weight" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group fg-line">
                                <label>Форма заказа</label>
                                <input class="form-control" [value]="data.form" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group fg-line">
                                <label>Марка заказа</label>
                                <input class="form-control" [value]="data.mark" readonly="readonly">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Точка загрузки</label>
                                <input class="form-control" [value]="data.entry_point" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Точка разгрузки</label>
                                <input class="form-control" [value]="data.conclusion_point" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Время загрузки</label>
                                <input class="form-control" [value]="data.entry_time" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Время разгрузки</label>
                                <input class="form-control" [value]="data.conclusion_time" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Контактное лицо</label>
                                <input class="form-control" [value]="data.entry_point_contact" readonly="readonly">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group fg-line">
                                <label>Контактное лицо</label>
                                <input class="form-control" [value]="data.conclusion_point_contact" readonly="readonly">
                            </div>
                        </div>
                    </div>
                </tab>
                <tab [tabTitle]="'Прогресс'">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <tr>
                                <th>Вес</th>
                                <th>Водитель</th>
                                <th>Автомобиль</th>
                                <th>Статус</th>
                                <th></th>
                            </tr>
                            <tr *ngFor="let progress of data.stages">
                                <td>{{progress.weight}}</td>
                                <td>{{progress.driver}}</td>
                                <td>{{progress.vehicle}}</td>
                                <td>{{progress.stage.caption}}</td>
                                <td>
                                    <a href="javascript:void(0)" *ngIf="progress.stage_history.length"
                                      (click)="progressHistory.open()">
                                      <i class="zmdi zmdi-receipt"></i> История изменения этапов</a>
                                    <a href="javascript:void(0)" *ngIf="progress.stage_history.length < 2"
                                      (click)="progressRemove(progress.id)">
                                        <i class="zmdi zmdi-delete"></i> Удалить
                                    </a>
                                </td>
                                <material-window [cssClass]="'inner-window'" #progressHistory
                                   [title]="'История изменения этапов'">
                                   <order-history [history]="progress.stage_history"></order-history>
                                </material-window>
                            </tr>
                        </table>
                    </div>
                </tab>
            </tabs>
        </div>
    `
})
export class OrderInfoComponent {
    private data: any = null;

    @Input() private order_id: number;

    constructor(private http: HttpClient) { }

    reload() {
        this.http.post('ordr.info', {order_id : this.order_id})
            .subscribe((response) => this.data = response);
    }

    progressRemove(id: number) {
        if(!confirm("Данные будут удалены безвозвратно, продолжить?")) {
            return;
        }

        this.data = null;

        this.http.post('orders.progress_rm', {progress_id : id})
            .subscribe((response) => {
                this.reload();
            });
    }

    ngOnInit() {
        this.reload();
    }
}