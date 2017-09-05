import {Component} from "@angular/core";
import {Router} from '@angular/router';
import {Validators, FormBuilder} from '@angular/forms';

import {UserService} from '../services/user.service';
import {User} from '../models/user';

import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl: "../../templates/views/login.html"
})
export class LoginComponent {
    public form: any;

    constructor(private router: Router, private user_service: UserService, fb: FormBuilder) {
        this.form = fb.group({
            "login":["", Validators.required],
            "password":["", Validators.required]
        });
    }

    onSubmit() {
        const login: string = this.form.value["login"];
        const password: string = this.form.value["password"];

        this.user_service.authenticate(login, password)
            .toPromise()
            .then((response) => {
                if(response.authenticated) {
                    const user = new User();

                    user.id = response.userid;
                    user.is_authenticated = true;
                    user.session_id = response.session_id;
                    user.fio = response.userfio;

                    this.user_service.user = user;

                    this.router.navigate([""]);
                }
            })
    }
}
