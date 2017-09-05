import {Component, ViewChild, Output, EventEmitter} from "@angular/core";
import {AbstractControl, FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "../../services/http.service";
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {MaterialSelectComponent} from "../../party_modules/@material-select/material-select.component";
import {NotificationService} from "../../services/notification.service";
import {OrdersService} from '../../services/orders.service';
import * as moment from 'moment';
import 'moment/locale/ru';

@Component({
    templateUrl: '../../../templates/views/concrete/forms/order-create.html',
    selector: "order-create"
})
export class OrderCreateComponent {
    form: any;
    private momentValue;
    private clc_time;
    private lang: string = 'ru';
    private input11Moment: any;
    reset;
    active = true;
    clearValue = false;

    // Variables for select without new element
    kindId;
    markId;
    formId;
    
    // Variables for select with new element
    currentEpnt;
    currentCpnt;
    afterNewEpnt;
    afterNewCpnt;
    newSelectedEpnt;
    newSelectedCpnt;
    epntData;
    cpntData;
    cpntId;
    epntId;
    cpntNewValue
    epntNewValue

    @Output() public form_create: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder, private http: HttpClient, 
        private notifier: NotificationService, private ordersService: OrdersService) {
     }

    @ViewChild("createConclusion")
    create_conclusion: MaterialWindowComponent;

    @ViewChild("createEntry")
    create_entry: MaterialWindowComponent;




    public setEntry(moment: any): any {
        this.momentValue = moment;
        // Do whatever you want to the return object 'moment'
    }
    public setConclusion(moment: any): any {
        this.clc_time = moment;
        // Do whatever you want to the return object 'moment'
    }
    
    onEntryCreate(pointValue) {
        this.newSelectedEpnt = pointValue.address;
        this.http.post("epnt.list", {limit: 999, offset: 0})
            .subscribe(
                (response) =>  this.epntData =  response.list
            );
        this.create_entry.close();
    }

    onConclusionCreate(pointValue) {
        this.newSelectedCpnt = pointValue.address;
         this.http.post("cpnt.list", {limit: 999, offset: 0})
            .subscribe(
                (response) =>  { 
                    this.cpntData =  response.list;
                }
            );
        this.create_conclusion.close();
    }

    digitsRequire(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            if (!/^[\d\.]+$/.test(control.value)) {
                return {digitsRequire: false};
            }
            return null;
        }
    }

    dataRequire(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            if (!/^\d{2}\.\d{2}\.\d{4}\s\d{2}\:\d{2}$/.test(control.value)) {
                return {dataRequire: false};
            }
            return null;
        }
    }

    ngOnInit() {
        this.form = this.fb.group({
            "entry_time": ["", Validators.compose([Validators.required, this.dataRequire()])],
            "conclusion_time": ["", Validators.compose([Validators.required, this.dataRequire()])],
            "entry_point_contact": ["", Validators.required],
            "conclusion_point_contact": ["", Validators.required],
            "order_weight": ["", Validators.compose([Validators.required, this.digitsRequire()])],
            "order_price": ["", Validators.compose([Validators.required, this.digitsRequire()])],
            "comment": [""],
        })
    }

    getValueCpnt(value) {
        if ( value !== null)
            this.cpntNewValue = value;
    }

    getValueEpnt(value) {
        if ( value !== null)
            this.epntNewValue = value;
    }

    onSubmit() {
        let epnt_id;
        if (this.epntData) {
            for (let obj of this.epntData) {
                if (obj.caption == this.epntNewValue) {
                    this.epntId = obj.id;
                }
            }
            epnt_id = this.currentEpnt == undefined ? this.epntId : parseInt(this.currentEpnt);
        } else {
            epnt_id = this.currentEpnt == undefined ? null : parseInt(this.currentEpnt);
        }
        let cpnt_id;
        if (this.cpntData) {
            for (let obj of this.cpntData) {
                if (obj.caption == this.cpntNewValue) {
                    this.cpntId = obj.id;
                }
            }
            cpnt_id = this.currentCpnt == undefined ? this.cpntId : parseInt(this.currentCpnt);
        } else {
            cpnt_id = this.currentCpnt == undefined ? null : parseInt(this.currentCpnt);
        }
        const price: number = parseFloat(this.form.value['order_price']);
        const weight: number = parseFloat(this.form.value['order_weight']);
        const epnt_contact: string = this.form.value['entry_point_contact'];
        const epnt_time: string = this.form.value['entry_time'];
        const cpnt_time: string = this.form.value['conclusion_time'];
        const cpnt_contact: string = this.form.value['conclusion_point_contact'];
        const form: number = parseInt(this.formId);
        const mark: number = parseInt(this.markId);
        const kind: number = parseInt(this.kindId);
        const comment: string = this.form.value['comment'];
        this.ordersService.createOrder(form, mark, price, weight, kind, epnt_id, epnt_contact, epnt_time, cpnt_id, cpnt_contact, cpnt_time, comment )
            .subscribe(
                (response) => { 
                    this.form_create.emit(response);
                    this.onCreate(response);
                },   
                (error) =>  {
                    this.form_create.emit(error);
                    this.onCreateError(error);
                }
            );
        this.newSelectedCpnt = this.newSelectedEpnt = this.afterNewCpnt = this.afterNewEpnt = [];
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        this.reset = [{ id: 0, text: ''}];
        this.active = false;
        this.active = true;
        this.clearValue = true;
    }

    onCreate(response) {
        this.notifier.notifyInfo("Отлично", "Заказ создан");
    }

    onCreateError(response) {
        this.notifier.notifyError("Ошибка", "Не удалось создать заказ");
    }

    selectedEpnt(value) {    
        this.currentEpnt = value.id;
        this.afterNewEpnt = value.text;

    }

    selectedCpnt(value) {
        this.currentCpnt = value.id;
        this.afterNewCpnt = value.text;
    }

    selectedMarks(value) {
        this.markId = value.id;
    }

    selectedKinds(value) {
        this.kindId = value.id
    }

    selectedForms(value) {
        this.formId = value.id;
    }

}