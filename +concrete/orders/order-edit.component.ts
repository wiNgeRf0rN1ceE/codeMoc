import {Component, ViewChild,Input, Output, EventEmitter} from "@angular/core";
import {AbstractControl, FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "../../services/http.service";
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {MaterialSelectComponent} from "../../party_modules/@material-select/material-select.component";
import {NotificationService} from "../../services/notification.service";
import {OrdersService} from '../../services/orders.service';
import {Order} from '../../models/order';
import * as moment from 'moment';
import 'moment/locale/ru';

@Component({
    templateUrl: '../../../templates/views/concrete/forms/order-edit.html',
    selector: "order-edit"
})
export class OrderEditComponent {
    form: any;
    private entryTime;

    private conclusionTime;
    private lang: string = 'ru';
    private input11Moment: any;


    clearValue = false;
    // Variables for select without new element
    kindId;
    markId;
    formId;
    arrCurrentKind;
    arrCurrentMark;
    arrCurrentForm;
    
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

    arrCurrentEpnt;
    arrCurrentCpnt;


    @Input() public order: Order = new Order();
    @Output() public form_edit: EventEmitter<Order> = new EventEmitter<Order>();

    constructor(
        private fb: FormBuilder, private http: HttpClient, 
        private notifier: NotificationService, private ordersService: OrdersService
        ) {}

    @ViewChild("createConclusion")
    create_conclusion: MaterialWindowComponent;

    @ViewChild("createEntry")
    create_entry: MaterialWindowComponent;

    public setEntry(moment: any): any {
        this.entryTime = moment;
        // Do whatever you want to the return object 'moment'
    }

    public setConclusion(moment: any): any {
        this.conclusionTime = moment;
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

    getValueCpnt(value) {
        if ( value !== null)
            this.cpntNewValue = value;
    }

    getValueEpnt(value) {
        if ( value !== null)
            this.epntNewValue = value;
    }


    ngOnInit() {
        this.entryTime = this.order.entry_time_short;
        this.conclusionTime = this.order.conclusion_time_short;
        const arrayCpnt = [];
        arrayCpnt.push(this.order.conclusion_point_id);
        this.arrCurrentCpnt = arrayCpnt;
        const arrayEpnt = [];
        arrayEpnt.push(this.order.entry_point_id);
        this.arrCurrentEpnt = arrayEpnt
        const arrayKind = [];
        arrayKind.push(this.order.kind_id);
        this.arrCurrentKind = arrayKind;
        const arrayMark = [];
        arrayMark.push(this.order.mark_id);
        this.arrCurrentMark = arrayMark
        const arrayForm = [];
        arrayForm.push(this.order.form_id);
        this.arrCurrentForm = arrayForm

        this.form = this.fb.group({
            "entry_time": ["", Validators.compose([Validators.required, this.dataRequire()])],
            "conclusion_time": ["", Validators.compose([Validators.required, this.dataRequire()])],
            "entry_point_contact": [this.order.entry_contact, Validators.required],
            "conclusion_point_contact": [this.order.conclusion_contact, Validators.required],
            "order_weight": [this.order.weight, Validators.compose([Validators.required, this.digitsRequire()])],
            "order_price": [this.order.price, Validators.compose([Validators.required, this.digitsRequire()])],
            "comment": [this.order.comment],
        })
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
            epnt_id = this.currentEpnt == undefined ? this.order.entry_point_id : parseInt(this.currentEpnt);
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
            cpnt_id = this.currentCpnt == undefined ? this.order.conclusion_point_id : parseInt(this.currentCpnt);
        }
        const price: number = parseFloat(this.form.value['order_price']);
        const weight: number = parseFloat(this.form.value['order_weight']);
        const epnt_contact: string = this.form.value['entry_point_contact'];
        const epnt_time: string = this.form.value['entry_time'];
        const cpnt_time: string = this.form.value['conclusion_time'];
        const cpnt_contact: string = this.form.value['conclusion_point_contact'];
        const form: number = this.formId == undefined ? this.order.form_id : parseInt(this.formId);
        const mark: number = this.markId == undefined ? this.order.mark_id : parseInt(this.markId);
        const kind: number = this.kindId == undefined ? this.order.kind_id : parseInt(this.kindId);
        const comment: string = this.form.value['comment'];
        this.ordersService.editOrder(this.order.id, form, mark, price, weight, kind, epnt_id, epnt_contact, epnt_time, cpnt_id, cpnt_contact, cpnt_time, comment )
            .subscribe(
                (response) => { 
                    this.form_edit.emit(this.order);
                    this.onEdit(response);
                },   
                (error) =>  {
                    this.form_edit.emit(error);
                    this.onEditError(error);
                }
            );
    }

    onEdit(response) {
        this.notifier.notifyInfo("Отлично", "Заказ изменен");
    }

    onEditError(response) {
        this.notifier.notifyError("Ошибка", "Не удалось изменить заказ");
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