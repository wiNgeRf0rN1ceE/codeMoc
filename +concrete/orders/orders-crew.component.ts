import {Component, ViewChild, TemplateRef, OnInit, Input, Output, EventEmitter,AfterViewChecked } from "@angular/core";
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl} from '@angular/forms';
import {CrewService} from '../../services/crew.service';
import {OrdersService} from '../../services/orders.service';
import {NotificationService} from "../../services/notification.service";
import {HttpClient} from '../../services/http.service';
import {MaterialTableOrderCrew} from "../../party_modules/@material-datatables/extends/order-crew.component";


@Component({
    selector: 'vehicles-list',
    templateUrl: '../../../templates/views/concrete/vehicles-list.html',
    styles: [` .card { box-shadow: none;}`]
})
export class OrdersCrewComponent {
    public form: FormGroup;
    private columns: Array<any> = [];
    private crew_list: Array<any> = [];
    public disabled: boolean = true;
    longitude: any = "";
    latitude: any = "";
    address: any = "";
    public sortType = 'asc';
    public sort = {};
    public search = '';

    @Input() private order: any;
    @Output() private update_order: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild("checkCrew")
    check_crew: TemplateRef<any>;

    @ViewChild("vehicle")
    vehicle: TemplateRef<any>;

    @ViewChild(MaterialTableOrderCrew)
    vehicle_list: MaterialTableOrderCrew;


    constructor(private crew: CrewService, private fb: FormBuilder, private ordersService: OrdersService, private notifier: NotificationService, private http: HttpClient){
    }

    validateWeight(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            let progress_weight = this.order.progress_weight == null ? 0 : this.order.progress_weight;
            if((this.order.weight - progress_weight) < control.value ){
                return {validateWeight: false};
            }
            return null;
        }
    }

    changeMapState(value: any) {
        const [crew_id, add] = value;

        if(add && -1 == this.crew_list.indexOf(crew_id)) {
            this.crew_list.push(crew_id);
        }
        else if(!add && -1 != this.crew_list.indexOf(crew_id)){
            this.crew_list.splice(this.crew_list.indexOf(crew_id), 1);
        }
    }

    ngOnInit() {
        this.form = this.fb.group({
            "search": [],
            "weight": [this.order.weight - this.order.progress_weight || 0,
                 Validators.compose([Validators.required, this.validateWeight()])],
        });

        this.columns = [
            {name: "", caption: "", "template": this.check_crew},
            {name: "username", caption: "ФИО"},
            {name: "crew_id", caption: "Автомобиль", "template": this.vehicle},
            {name: "status_txt", caption: "Статус"},
            {name: 'capacity', caption: "Тоннаж"},
        ];

        this.http.post("epnt.list", {limit: 999, offset: 0})
            .subscribe(response => this.pointData(response.list));
    }


    pointData(data) {
        const arr = data;
        for(let obj in data) {
            for(let prop in arr[obj]) {
                // console.log(prop + ":" + arr[obj][prop]);
                if  (arr[obj]['id'] == this.order.entry_point_id) {
                    // console.log('order enntry id ' + arr[obj][prop]);
                    this.latitude = arr[obj]['latitude'];
                    this.longitude = arr[obj]['longitude'];
                    this.address = arr[obj]['address'];
                }
            }
        }
    }

    submit() {
        if(!this.crew_list.length) {
            alert("Не выбрано ни одного экипажа!");
            return;
        }

        const weight = parseFloat(this.form.value["weight"]).toFixed(2),
                weight_list = new Array(this.crew_list.length).fill(weight);
        
        const random =  Math.floor(100 + Math.random() * (999 + 1 - 100));
        this.ordersService.createOrderCrew(this.order.id, this.crew_list, weight_list, random).subscribe(
                (response) => { 
                    this.update_order.emit(this.order);
                    // this.onTransfer(response);
                },   
                (error) =>  {
                    if (error.error.code == 40018) {
                        if(!confirm("Данный заказ ждет ответа от водителя, все равно отправить?")) {
                                return;
                         }
                            let confirmed = true;
                            this.ordersService.checkCreateOrderCrew(this.order.id, this.crew_list, weight_list, random, confirmed ).subscribe(                (response) => { 
                                this.update_order.emit(this.order) });
                    } else {
                    this.update_order.emit(error);
                    this.onTransferError(error);
                    }
                }
        );
    }

    getValue(element: HTMLInputElement): void {
        if(element.checked && -1 == this.crew_list.indexOf(element.value)) {
            this.crew_list.push(element.value);
        }
        else if(!element.checked && -1 != this.crew_list.indexOf(element.value)){
            this.crew_list.splice(this.crew_list.indexOf(element.value), 1);
        }
    }

    isChecked(value: string) {
        return -1 != this.crew_list.indexOf(value);
    }

    isDisabled(row): boolean {
        return !row.status_allow_orders;
    }

    onTransfer(response) {
        this.notifier.notifyInfo("Заказ успешно отправлен", `Зявки на заказ №  отправлены`);
    }

    onTransferError(response) {
        this.notifier.notifyError("Ошибка", "Не удалось отправить заказ");
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

    reloadList() {
        this.vehicle_list.loadList();
        this.sort = {};
    }

    onSearch(value) {
        this.search = value;
        setTimeout(()=>this.reloadList(), 500);
    }

}