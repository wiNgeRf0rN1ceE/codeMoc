import {Component, ViewChild, TemplateRef} from '@angular/core';
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {MaterialTableComponent} from "../../party_modules/@material-datatables/components/datatable.component";
import {NotificationService} from "../../services/notification.service";
import {OrdersService} from "../../services/orders.service";
import {Order} from '../../models/order';

@Component({
    templateUrl: '../../../templates/views/concrete/orders.html',
    styles: [`
              .btn, .btn-default { text-transform: none;}`]
})
export class OrdersComponent { 
    private api_action: string = "orders.list";   
    private columns: Array<any> = [];
    private title_window = "Список активных экипажей";

    public sortType = 'asc';
    public sort = {};
    public search = '';

    @ViewChild(MaterialTableComponent)
    orders_list: MaterialTableComponent;

    @ViewChild("btn")
    btn_order: TemplateRef<any>;

    @ViewChild("addOrder")
    add_order: MaterialWindowComponent;

    private orders_on_open: Array<any> = [];
    private order_edit: Array<any> = [];
    private displayed_orders: Array<number> = [];


    constructor(private notify_center: NotificationService, private ordersService: OrdersService) {}

    ngOnInit() {
        this.columns = [
            {name: "id", caption: "#"},
            {name: "entry_address", caption: "Откуда"},
            {name: "conclusion_address", caption: "Куда"},
            {name: "weight", caption: "Вес"},
            {name: "progress_weight", caption: "Распределено"},
            {name: "", caption: "", "template": this.btn_order}
        ];
    }

    createFire() {
        this.add_order.open();
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

    reloadList() {
        this.orders_list.loadList();
        this.sort = {};
    }


    actionEditOrder(row: any) {
        if(-1 == this.order_edit.lastIndexOf(row)) {
            this.order_edit.push(row);
        }
    }

    openFire(order: any): void {
        if(-1 == this.orders_on_open.lastIndexOf(order)) {
            this.orders_on_open.push(order);
        }
    }

    onOrderUpdate(order: any) {
        for(let i = 0; i < this.orders_on_open.length; i++) {
            if (this.orders_on_open[i].id === order.id){
                this.orders_on_open.splice(i, 1);
                break;
            }
        }

        this.orders_list.loadList();
        this.notify_center.notifyInfo("Заказ успешно отправлен", `Зявки на заказ № ${order.id} отправлены`);
    }

    onOrderEdit(order: Order) {
        for(let i = 0; i < this.order_edit.length; i++) {
            if (this.order_edit[i].id === order.id){
                this.order_edit.splice(i, 1);
                break;
            }
        }
        this.orders_list.loadList();
    }

    onOrderCreate(row: any) {
        this.add_order.close();
        this.orders_list.loadList();
    }

    openWindowCloseOrder(order: any): void {
        const index = this.orders_on_open.lastIndexOf(order);
        this.orders_on_open.splice(index, 1);
    }

    editWindowClose(order: any): void {
        const index = this.order_edit.lastIndexOf(order);
        this.order_edit.splice(index, 1);
    }

    removeFire(row: any) {
        if(!confirm("Заказ будет удален безвозвратно, Вы уверены?")) {
            return;
        }
        this.ordersService.removeOrder(row.id).subscribe(response => this.orders_list.loadList());
    }

    displayOrder(id: number): void {
        this.displayed_orders.push(id);
    }

}