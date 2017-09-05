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
/*
 Директива для работы выпадающего меню шаблона
 */
var DropdownDirective = (function () {
    function DropdownDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    DropdownDirective.prototype.inside = function (event) {
        event.preventDefault();
        this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "open", true);
    };
    DropdownDirective.prototype.outside = function (targetElement) {
        var clickedInside = this.elementRef.nativeElement.contains(targetElement) ||
            this.elementRef.nativeElement.parentNode.contains(targetElement);
        if (!clickedInside) {
            this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "open", false);
        }
    };
    return DropdownDirective;
}());
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DropdownDirective.prototype, "inside", null);
__decorate([
    core_1.HostListener('document:click', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DropdownDirective.prototype, "outside", null);
DropdownDirective = __decorate([
    core_1.Directive({
        selector: "[uib-dropdown-toggle]"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], DropdownDirective);
exports.DropdownDirective = DropdownDirective;
/*
 Директива для скрытия/отображения сайдбара шаблона
 */
var SidebarToggleDirective = (function () {
    function SidebarToggleDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    SidebarToggleDirective.prototype.click = function (event) {
        event.preventDefault();
        var cond = -1 == this.elementRef.nativeElement.className.indexOf("open");
        this.renderer.setElementClass(this.elementRef.nativeElement, "open", cond);
        this.renderer.setElementClass(document.getElementById("sidebar"), "toggled", cond);
    };
    return SidebarToggleDirective;
}());
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SidebarToggleDirective.prototype, "click", null);
SidebarToggleDirective = __decorate([
    core_1.Directive({
        selector: "[uib-sidebar-toggle]"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], SidebarToggleDirective);
exports.SidebarToggleDirective = SidebarToggleDirective;
/*
 Директива для работы выпадающего меню в сайдбаре
 */
var SubmenuDirective = (function () {
    function SubmenuDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    SubmenuDirective.prototype.click = function (event) {
        event.preventDefault();
        var cond = -1 == this.elementRef.nativeElement.parentNode.className.indexOf("active");
        this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "active", cond);
        this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "toggled", cond);
    };
    return SubmenuDirective;
}());
__decorate([
    core_1.HostListener("click", ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubmenuDirective.prototype, "click", null);
SubmenuDirective = __decorate([
    core_1.Directive({
        selector: "[toggle-submenu]"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], SubmenuDirective);
exports.SubmenuDirective = SubmenuDirective;
var DraggableDirective = (function () {
    function DraggableDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    DraggableDirective.prototype.mouseHandling = function (event) {
        // alert('11');
    };
    return DraggableDirective;
}());
__decorate([
    core_1.HostListener("mousedown", ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "mouseHandling", null);
DraggableDirective = __decorate([
    core_1.Directive({
        selector: "[draggable]"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], DraggableDirective);
exports.DraggableDirective = DraggableDirective;
