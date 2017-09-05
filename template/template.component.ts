import {Router} from '@angular/router';
import {Component} from "@angular/core";
import {AnonymousUser} from '../models/user';
import 'rxjs/add/operator/toPromise';

import {UserService} from "../services/user.service";
import {NotificationService} from "../services/notification.service";

/*
 Отображение хэдера шаблона
 */
@Component({
    selector: "app-header",
    templateUrl: '../../templates/blocks/header.html'
})
export class HeaderComponent {
    current_skin_color: string = "blue";

    user_subscription: any;
    user: any;

    event_queue: any = [];

    constructor(private user_service: UserService, private router: Router, private notificator: NotificationService){
        this.user = user_service.user;
        this.user_subscription = user_service.usr_change.subscribe(user => this.user = user);

        this.notificator.queue_emitter.subscribe(queue => this.event_queue = queue);
    }

    emptyQueue() {
        this.notificator.emptyQueue();
    }

    cleanNotify(notification: any) {
        this.notificator.cleanNotify(notification);
    }

    lockSession() {
        this.user_service.destroy_session().subscribe(() => UserService.lock());
    }

    logout() {
        this.user_service.destroy_session()
            .toPromise()
            .then((response) => {
                this.user_service.user = new AnonymousUser();
                UserService.destroy_data();
                this.router.navigate(["/login"]);
                UserService.unlock();

            })
            .catch((response) => {
                this.user_service.user = new AnonymousUser();
                UserService.destroy_data();
                this.router.navigate(["/login"]);
                UserService.unlock();
            })
    }
}

/*
 Отображение сайдбара шаблона
 */
@Component({
    selector: "app-sidebar",
    templateUrl: '../../templates/blocks/sidebar.html'
})
export class SidebarComponent {
    user_subscription: any;
    user: any;

    constructor(user_service: UserService){
        this.user = user_service.user;
        this.user_subscription = user_service.usr_change.subscribe((user) => {
            this.user = user;
        });
    }
}
