import {Component, ViewChild, TemplateRef} from '@angular/core';
import {AbstractControl, FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {Http, Headers, Response} from '@angular/http';
import {HttpClient} from '../../services/http.service';
import * as moment from 'moment';
import {saveAs as importedSaveAs} from "file-saver";
import 'moment/locale/ru';

@Component({
    template: `
<div class="container">
    <div class="block-header">
        <h2>Отчеты</h2>
    </div>
    <div class="card">
        <div class="card-header">
            <h2>Отчеты <small>Небольшое описание этого компонента</small></h2>
        </div>
        <div class="card-body card-padding">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="row">
                <div class="col-sm-6">
                    <label>Начальная дата <sup class="text-danger">*</sup></label>
                    <div class="input-group form-group">
                        <span class="input-group-addon"><i class="zmdi zmdi-calendar"></i></span>
                        <div class="dtp-container fg-line">
                            <input class="form-control date-time-picker p-l-5" formControlName="start_date" [ngModel]="currentStart" [returnObject]=" 'string' " [viewFormat]="'YYYY-MM-DD HH:mm'"
                                [mode]="'dropdown'" [locale]=" 'ru' " [theme]=" 'gray' " [(dateTimePicker)]="currentStart" (dateTimePickerChange)="setStartDate($event)"
                                readonly>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <label>Конечная дата <sup class="text-danger">*</sup></label>
                    <div class="input-group form-group">
                        <span class="input-group-addon"><i class="zmdi zmdi-calendar"></i></span>
                        <div class="dtp-container fg-line">
                            <input class="form-control date-time-picker p-l-5" formControlName="end_date" [ngModel]="currentEnd" [returnObject]=" 'string' " [viewFormat]="'YYYY-MM-DD HH:mm'"
                                [mode]="'dropdown'"  [locale]=" 'ru' " [theme]=" 'gray' " [(dateTimePicker)]="currentEnd" (dateTimePickerChange)="setEndDate($event)"
                                readonly>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Скачать отчет</button>
                </div>
            </div>
            </form>
        </div>
     </div>
</div>
    `
})
export class ReportsComponent {
    private form;
    private currentStart;
    private currentEnd;
    private start_date;
    private end_date;
    private clc_time;

    api_server = 'http://api.ecma.it-lab.su';
    api_token = 'WWWToken';

    constructor( private fb: FormBuilder, private http: HttpClient) {
    }

    onSubmit() {
       this.http.getXML('/report/orders/' + this.form.value['start_date'] + '/' + this.form.value['end_date'])
        .subscribe((res)=>{
             importedSaveAs(res, 'otchet.xlsx');
            console.log('response - ' + res);
        });
    }


    setStartDate(moment) {
        this.currentStart = moment;

    }

    setEndDate(moment) {
        this.currentEnd = moment;

    }


    ngOnInit() {
        this.form = this.fb.group({
            "start_date": ["", Validators.required],
            "end_date": ["", Validators.required],
        })
    }

}
