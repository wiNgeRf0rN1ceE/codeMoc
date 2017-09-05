import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
import { HttpClient } from './services/http.service';


@Component({
    selector: "app",
    templateUrl: '../templates/default.html'
})
export class AppComponent {
    user: any;
    user_subscription: any;
    constructor(private user_service: UserService, private http: HttpClient) {

        this.user = user_service.user;
        this.user_subscription = user_service.usr_change.subscribe((user) => { this.user = user; });

        if("serviceWorker" in navigator) {
            let msgChannel = new MessageChannel();

            navigator.serviceWorker.register('/app/service_worker/push.sw.js')
            .then((registration: ServiceWorkerRegistration) => {
                return registration.pushManager.getSubscription()
                    .then(function(subscription) {
                        if (subscription) {
                            return subscription;
                        }
                        return registration.pushManager.subscribe({ userVisibleOnly: true });
                    });
            })
            .then((subscription) => {
                let rawKey = subscription.getKey ? subscription.getKey('p256dh') : new ArrayBuffer(0),
                    key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '',
                    rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : new ArrayBuffer(0),
                    authSecret = rawAuthSecret?btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))):'',
                    endpoint = subscription.endpoint;

                this.http.post('usr.subscr', {key: key, secret: authSecret, endpoint: endpoint})
                    .subscribe();
            })
        }
    }
}
