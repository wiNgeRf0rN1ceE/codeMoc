import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from './http.service';

import {Subject} from 'rxjs/Subject';

import {IUsers, AnonymousUser, User} from '../models/user';

@Injectable()
export class UserService {
    public static storage_index: string = "ecma-web-user";
    public static session_id?: string;

    public static state_lock: boolean = false;
    public static lock_emitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _user: IUsers = new AnonymousUser();
    private _usr_change: Subject<IUsers> = new Subject<IUsers>();

    set user(value: IUsers) {
        this._user = value;
        this._usr_change.next(this.user);

        UserService.session_id = value.session_id;
        this.save_data();
    }

    get user(): IUsers { return this._user; }

    set usr_change(value: Subject<IUsers>) { }
    get usr_change(): Subject<IUsers> { return this._usr_change; }

    constructor(private httpService: HttpClient) {
        const local_user = localStorage.getItem(UserService.storage_index);
        if(local_user) {
            this.user = User.from_json(local_user);
        }
    }

    public static destroy_data() {
        localStorage.removeItem(UserService.storage_index);
    }

    authenticate(username: string, password: string) {
        const params = {'username': username, 'password': password};
        return this.httpService.post('usr.auth', params);
    }

    destroy_session() {
        return this.httpService.post('usr.logout');
    }

    save_data() {
        localStorage.setItem(UserService.storage_index, this.user.to_json());
    }

    static lock(): void {
        this.state_lock = true;
        this.lock_emitter.emit(this.state_lock);
    }

    static unlock(): void {
        this.state_lock = false;
        this.lock_emitter.emit(this.state_lock);
    }

    createUser(username: string, password: string, type: string, fam: string, name: string, otch: string, company_ids: number[], group_id: number) {
        const params = {'username': username, 'password': password, 'usr_data': { 'fam': fam, 'name': name, 'otch': otch, 'type': type, "company_ids": company_ids, "group_id": group_id } }
        return this.httpService.post('usr.create', params);
    }

    updateUser(user_id: number, username: string, password: string, name: string, fam: string, otch: string, type: string, company_ids: number[], group_id: number) {
        const params = { 'user_id': user_id, 'username': username, 'password': password, 'usr_data': { 'name': name, 'fam': fam, 'otch': otch, 'type': type, "company_ids": company_ids, "group_id": group_id } };
        return this.httpService.post('usr.modify', params);
    }

    deleteUser(user_id: number) {
        return this.httpService.post('usr.delete', { 'user_id': user_id });
    }
    
    getCompany() {
        const params = {"limit": 10, "offset": 0};
        return this.httpService.post('company.list', params);
    }

    getUserInfo(user_id: number) {
        const params = { "user_id": user_id };
        return this.httpService.post('usr.info', params);
    }

    createGroup(caption: string) {
        return this.httpService.post('usr.group_add', {"caption": caption } );
    }

    getUserGroup() {
        const params = {"limit": 10, "offset": 0};
        return this.httpService.post('usr.group_list', params);
    }

}
