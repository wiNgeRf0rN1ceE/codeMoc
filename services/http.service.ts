import {Injectable} from '@angular/core';
import {Http, Headers, Response, ResponseContentType, URLSearchParams, RequestOptions} from '@angular/http';
import {Observable, Observer} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {UserService} from "./user.service";
import {NotificationService} from "./notification.service";

@Injectable()
export class HttpClient {
    private static api_server: string = 'https://api.cargodeal.ru';
    private static api_token: string = 'WWWToken';
    private static jsonrpc: string = '2.0';
    private static action: Object = {
      'usr.list': 'User.list',
      'usr.auth': 'User.signin',
      'usr.logout': 'User.signout',
      'crew': 'Crew.list',
      'usr.create': 'User.create',
      'usr.info': 'User.info',
      'usr.modify': 'User.modify',
      'usr.delete': 'User.delete',
      'usr.unlock': 'User.session_unlock',
      'usr.group_list': 'User.filter_group_list',
      'usr.group_add': 'User.group_add',
      'epnt.list': 'EntryPoint.list',
      'epnt.add': 'EntryPoint.create',
      'epnt.edit': 'EntryPoint.edit',
      'cpnt.list': 'ConclusionPoint.list',
      'cpnt.edit': 'ConclusionPoint.edit',
      'cpnt.add': 'ConclusionPoint.create',
      'vhc.models': 'Vehicle.models',
      'vhc.marks': 'Vehicle.marks',
      'vhc.edit_model': 'Vehicles.edit_model',
      'vhc.add_model': 'Vehicles.add_model',
      'vhc.edit_mark': 'Vehicles.edit_mark',
      'vhc.add_mark': 'Vehicles.add_mark',
      'vhc.remove_mark': 'Vehicles.remove_mark',
      'vhc.remove_model': 'Vehicles.remove_model',
      'vhc.list': 'Vehicle.list',
      'vhc.add': 'Vehicles.add',
      'vhc.modify': 'Vehicles.modify',
      'vhc.remove': 'Vehicles.remove',
      'vhc.grp_lst': 'Vehicle.filter_group_list',
      'vhc.flt_group_list': 'Vehicle.filter_group_list',
      'vhc.group_list': 'Vehicle.group_list',
      'vhc.group_add': 'Vehicle.group_add',
      'usr.subscr': 'User.subscribe',
      'orders.list': 'Orders.list_new',
      'orders.list_progress': 'Orders.list_in_progress',
      'orders.new_order': 'Orders.new_order',
      'orders.forms': 'Orders.forms_list',
      'orders.marks': 'Orders.marks_list',
      'orders.create': 'Orders.create',
      'orders.kinds': 'Orders.kinds_list',
      'orders.modify': 'Orders.modify',
      'orders.remove': 'Order.remove',
      'orders.progress_rm': 'Order.remove_progress',
      'crew.order_confirm': 'Crew.order_confirmation',
      'company.list': 'Company.list',
      'ordr.info': 'Order.info',
      'crew.position': 'Crew.get_position',
      'crew.statuses': 'Crew.filter_status_list',
      'trl.list': 'Trailer.list',
      'trl.add': 'Trailer.add',
      'trl.modify': 'Trailer.modify',
      'trl.remove': 'Trailer.remove',
      'widgets': 'Dashboard.widgets',
      'cpnt.remove': 'ConclusionPoint.remove',
      'epnt.remove': 'EntryPoint.remove',

    };

    constructor(private http: Http, private notificator: NotificationService) {}

    private static createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json');
        if(UserService.session_id) {
            headers.append('Authorization', HttpClient.api_token + ' ' + UserService.session_id);
        }
    }

    private static createRPCRequest(method: string, params: any) {
        return {
            'id': Math.floor(Math.random() * 99) + 1,
            'jsonrpc': HttpClient.jsonrpc,
            'method': HttpClient.action[method],
            'params': params
        }
    }

    getXML(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        headers.append('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        if(UserService.session_id) {
            headers.append('Authorization', HttpClient.api_token + ' ' + UserService.session_id);
        }
        let options = new RequestOptions({responseType: ResponseContentType.Blob, headers});
        return this.http.get(HttpClient.api_server + path, options)
                .map((res:Response) => res.blob());
    }

    // getFile(url: string) {
    //     let headers = new Headers();
    //     HttpClient.createAuthorizationHeader(headers);
    //     return this.http.get(HttpClient.api_server + url)
    //         .map((response: Response) => {
    //             return response;
    //         })
    // }

    // private extractContent(res: Response) {
    //     let blob: Blob = res.blob();
    //     window['saveAs'](blob, 'report.xml');
    // }



    post(action: string, params: any = {}) {
        let headers = new Headers();
        HttpClient.createAuthorizationHeader(headers);
        let data: string = JSON.stringify(HttpClient.createRPCRequest(action, params));

        return this.http.post(HttpClient.api_server, data, {headers: headers})
            .map((response: Response) => {
                if(response.json().error){ throw Observable.throw(response.json().error); }
                return response.json().result
            })
            .catch((handler) => this.handleError(handler));
    }

    private handleError(handler: Response) {
        if(handler.status && 401 == handler.status) {
            this.notificator.notifyError("Доступ без авторизации", "Похоже, что Ваша сессия устарела");
            UserService.lock();
        }
        return Observable.throw(handler);
    }
}
