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
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_service_1 = require("../services/http.service");
var user_service_1 = require("../services/user.service");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var TemplateLockerComponent = (function () {
    function TemplateLockerComponent(renderer, router, http, fb, location) {
        this.renderer = renderer;
        this.router = router;
        this.http = http;
        this.location = location;
        this.state_locked = false;
        this.form = fb.group({
            "password": ["", forms_1.Validators.required]
        });
    }
    TemplateLockerComponent.prototype.ngOnInit = function () {
        var _this = this;
        user_service_1.UserService.lock_emitter.subscribe(function (is_locked) {
            if (is_locked && _this.location.path() == "/login") {
                user_service_1.UserService.unlock();
                return;
            }
            _this.state_locked = is_locked;
            _this.renderer.setElementClass(document.getElementById("main"), "has-blur", is_locked);
        });
    };
    TemplateLockerComponent.prototype.onSubmit = function () {
        var _this = this;
        var password = this.form.value["password"];
        this.http.post('usr.unlock', { password: password })
            .subscribe(function (response) { return user_service_1.UserService.unlock(); }, function (handler) {
            if (40010 == handler.error.code) {
                alert("Неправильный логин или пароль");
            }
            else {
                _this.router.navigate(['/login']);
                alert("Ошибка обработки запроса, войдите в систему заново");
            }
        });
    };
    return TemplateLockerComponent;
}());
TemplateLockerComponent = __decorate([
    core_1.Component({
        selector: "app-locker",
        template: "\n      <div id=\"lock-wrapper\" class=\"lock-wrapper\" *ngIf=\"state_locked\">\n        <div class=\"login-content\">\n          <div class=\"lc-block lc-block-alt toggled\" id=\"l-lockscreen\">\n            <div class=\"lcb-form\">\n              <img class=\"lcb-user\" src=\"/static/img/profile-pics/2_big.jpg\" alt=\"\">\n              <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n                  <div class=\"fg-line\">\n                    <input type=\"password\" class=\"form-control text-center\" formControlName=\"password\" \n                      placeholder=\"\u041F\u0430\u0440\u043E\u043B\u044C\">\n                  </div>\n    \n                  <button type=\"submit\" class=\"btn btn-login btn-success btn-float\" [disabled]=\"!form.valid\">\n                  <i class=\"zmdi zmdi-arrow-forward\"></i></button>\n              </form>\n            </div>\n          </div>\n        </div>\n      </div>\n    "
    }),
    __metadata("design:paramtypes", [core_1.Renderer, router_1.Router, http_service_1.HttpClient, forms_1.FormBuilder, common_1.Location])
], TemplateLockerComponent);
exports.TemplateLockerComponent = TemplateLockerComponent;
