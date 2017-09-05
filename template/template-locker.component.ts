import {Component, Renderer} from "@angular/core";
import {Validators, FormBuilder} from '@angular/forms';

import {HttpClient} from "../services/http.service";
import {UserService} from "../services/user.service";
import {Location} from "@angular/common";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
    selector: "app-locker",
    template: `
      <div id="lock-wrapper" class="lock-wrapper" *ngIf="state_locked">
        <div class="login-content">
          <div class="lc-block lc-block-alt toggled" id="l-lockscreen">
            <div class="lcb-form">
              <img class="lcb-user" src="/static/img/profile-pics/2_big.jpg" alt="">
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="fg-line">
                    <input type="password" class="form-control text-center" formControlName="password" 
                      placeholder="Пароль">
                  </div>
    
                  <button type="submit" class="btn btn-login btn-success btn-float" [disabled]="!form.valid">
                  <i class="zmdi zmdi-arrow-forward"></i></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `
})
export class TemplateLockerComponent {
    private state_locked: boolean = false;
    public form: any;

    constructor(private renderer: Renderer,private router: Router, private http: HttpClient, fb: FormBuilder, private location: Location){
        this.form = fb.group({
            "password":["", Validators.required]
        });
    }

    ngOnInit() {
        UserService.lock_emitter.subscribe((is_locked) => {
            if(is_locked && this.location.path() == "/login") {
                UserService.unlock();
                return;
            }

            this.state_locked = is_locked;
            this.renderer.setElementClass(document.getElementById("main"), "has-blur", is_locked);
        });
    }

    onSubmit() {
        const password: string = this.form.value["password"];

        this.http.post('usr.unlock', {password: password})
            .subscribe(
                (response) => UserService.unlock(),
                (handler) => {
                    if(40010 == handler.error.code) {
                        alert("Неправильный логин или пароль");
                    }
                    else {
                        this.router.navigate(['/login']);
                        alert("Ошибка обработки запроса, войдите в систему заново");
                    }
                }
            );
    }
}
