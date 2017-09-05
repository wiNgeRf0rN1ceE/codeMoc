import {Component, ViewChild, TemplateRef} from '@angular/core';
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {MaterialTableComponent} from "../../party_modules/@material-datatables/components/datatable.component";

@Component({
    templateUrl: '../../../templates/views/concrete/orders-in-process.html'
})
export class OrdersInProcessComponent { 
    private api_action: string = "orders.list_progress";
    public sortType = 'asc';
    public sort = {};
    public search = '';

    private columns: Array<any> = [];
    private displayed_orders: Array<number> = [];

    @ViewChild(MaterialTableComponent)
    orders_list: MaterialTableComponent;

    constructor() {}

    @ViewChild("aboutBtn")
    aboutBtn: TemplateRef<any>;

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

    ngOnInit() {
        this.columns = [
            {name: "id", caption: "#"},
            {name: "entry_address", caption: "Откуда"},
            {name: "conclusion_address", caption: "Куда"},
            {name: "author", caption: "Автор"},
            {caption: "", template: this.aboutBtn},
        ];
    }

    displayOrder(id: number): void {
        this.displayed_orders.push(id);
    }

}