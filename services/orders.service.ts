import {Injectable} from '@angular/core';
import {HttpClient} from './http.service';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class OrdersService {

    constructor(private httpService: HttpClient) { }

    createOrderCrew(order_id: number, crew_list: string[], weight_list: number[], token: number ) {
        const params = {"order_id": order_id, "crew_list": crew_list, "weight_list": weight_list, "token": token };
        return this.httpService.post('orders.new_order', params);
    }
    checkCreateOrderCrew(order_id: number, crew_list: string[], weight_list: number[], token: number, confirm: boolean ) {
        const params = {"order_id": order_id, "crew_list": crew_list, "weight_list": weight_list, "token": token, "confirm": confirm };
        return this.httpService.post('orders.new_order', params);
    }

    createOrder( order_form_id: number, order_mark_id: number, price: number, weight: number, kind: number, entry_point_id: number, entry_point_contact: string, entry_point_time: string, conclusion_point_id: number, conclusion_point_contact: string, conclusion_point_time: string, comment: string) {
        const params = 
        { "order_form_id": order_form_id, "order_mark_id": order_mark_id, "price": price, "weight": weight, "order_kind_id": kind,
          "entry_point_id": entry_point_id, "entry_point_contact": entry_point_contact, "entry_point_time": entry_point_time, 
          "conclusion_point_id": conclusion_point_id, "conclusion_point_contact": conclusion_point_contact, "conclusion_point_time": conclusion_point_time, "comment": comment
        };
        return this.httpService.post('orders.create', params);

    }
    
    editOrder( order_id: number, order_form_id: number, order_mark_id: number, price: number, weight: number, kind: number, entry_point_id: number, entry_point_contact: string, entry_point_time: string, conclusion_point_id: number, conclusion_point_contact: string, conclusion_point_time: string, comment: string)  {
        const params = 
        { "order_id": order_id,  "order_data": { "order_form_id": order_form_id, "order_mark_id": order_mark_id, "price": price, "weight": weight, "order_kind_id": kind,
          "entry_point_id": entry_point_id, "entry_point_contact": entry_point_contact, "entry_time": entry_point_time, 
          "conclusion_point_id": conclusion_point_id, "conclusion_point_contact": conclusion_point_contact, "conclusion_time": conclusion_point_time, "comment": comment }
        };
        return this.httpService.post('orders.modify', params);

    }

    removeOrder(id: number) {
        return this.httpService.post('orders.remove', {"order_id": id} );
    }

}