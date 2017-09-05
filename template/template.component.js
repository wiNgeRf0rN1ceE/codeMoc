"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var user_1 = require("../models/user");
require("rxjs/add/operator/toPromise");
var user_service_1 = require("../services/user.service");
var notification_service_1 = require("../services/notification.service");
/*
 Отображение хэдера шаблона
 */
var HeaderComponent = (function () {
    function HeaderComponent(user_service, router, notificator) {
        var _this = this;
        this.user_service = user_service;
        this.router = router;
        this.notificator = notificator;
        this.current_skin_color = "blue";
        this.event_queue = [];
        this.user = user_service.user;
        this.user_subscription = user_service.usr_change.subscribe(function (user) { return _this.user = user; });
        this.notificator.queue_emitter.subscribe(function (queue) { return _this.event_queue = queue; });
    }
    HeaderComponent.prototype.emptyQueue = function () {
        this.notificator.emptyQueue();
    };
    HeaderComponent.prototype.cleanNotify = function (notification) {
        this.notificator.cleanNotify(notification);
    };
    HeaderComponent.prototype.lockSession = function () {
        this.user_service.destroy_session().subscribe(function () { return user_service_1.UserService.lock(); });
    };
    HeaderComponent.prototype.logout = function () {
        var _this = this;
        this.user_service.destroy_session()
            .toPromise()
            .then(function (response) {
            _this.user_service.user = new user_1.AnonymousUser();
            user_service_1.UserService.destroy_data();
            _this.router.navigate(["/login"]);
            user_service_1.UserService.unlock();
        })
            .catch(function (response) {
            _this.user_service.user = new user_1.AnonymousUser();
            user_service_1.UserService.destroy_data();
            _this.router.navigate(["/login"]);
            user_service_1.UserService.unlock();
        });
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: "app-header",
        templateUrl: '../../templates/blocks/header.html'
    }),
    __metadata("design:paramtypes", [user_service_1.UserService, router_1.Router, notification_service_1.NotificationService])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
/*
 Отображение сайдбара шаблона
 */
var SidebarComponent = (function () {
    function SidebarComponent(user_service) {
        var _this = this;
        this.user = user_service.user;
        this.user_subscription = user_service.usr_change.subscribe(function (user) {
            _this.user = user;
        });
    }
    return SidebarComponent;
}());
SidebarComponent = __decorate([
    core_1.Component({
        selector: "app-sidebar",
        templateUrl: '../../templates/blocks/sidebar.html'
    }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
