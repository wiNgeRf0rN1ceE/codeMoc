export enum Type {
    clt, opr, dvr
}

export interface IUsers {
    id: number;
    is_authenticated: boolean;
    session_id?: string;
    username: string;
    fio: string;
    type: Type;

    fam?: string;
    name?: string;
    otch?: string;
    companies: number[];
    group: number;

    to_json(): string;
}

abstract class AbsUser implements IUsers {
    id: number;
    is_authenticated: boolean;
    session_id?: string;
    username: string;
    fio: string;
    type: Type = Type.opr;

    fam?: string;
    name?: string;
    otch?: string;
    companies: number[];
    group: number;

    to_json(): string {
        return JSON.stringify(this);
    }

    public static from_json(str: string): IUsers {
        let user = new User(), json_user = JSON.parse(str);
        for(let propName in json_user) {
            if(json_user.hasOwnProperty(propName)){
                user[propName] = json_user[propName];
            }
        }
        return user;
    }
}

export class User extends AbsUser {
    is_authenticated: boolean = true;
}

export class AnonymousUser extends AbsUser {
    is_authenticated: boolean = false;
    fio: string = "Пользователь";
}
