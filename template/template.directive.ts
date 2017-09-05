import {Directive, Renderer, ElementRef, HostListener, EventEmitter} from "@angular/core";

/*
 Директива для работы выпадающего меню шаблона
 */
@Directive({
    selector: "[uib-dropdown-toggle]"
})
export class DropdownDirective {
    constructor(private elementRef: ElementRef, private renderer: Renderer) { }

    @HostListener('click', ['$event']) inside(event) {
        event.preventDefault();
        this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "open", true);
    }

    @HostListener('document:click', ['$event.target']) outside(targetElement) {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement) ||
            this.elementRef.nativeElement.parentNode.contains(targetElement);

        if(!clickedInside) {
            this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "open", false);
        }
    }
}

/*
 Директива для скрытия/отображения сайдбара шаблона
 */
@Directive({
    selector: "[uib-sidebar-toggle]"
})
export class SidebarToggleDirective {
    constructor(private elementRef: ElementRef, private renderer: Renderer) { }

    @HostListener('click', ['$event']) click(event) {
        event.preventDefault();
        const cond = -1 == this.elementRef.nativeElement.className.indexOf("open");
        this.renderer.setElementClass(this.elementRef.nativeElement, "open", cond);
        this.renderer.setElementClass(document.getElementById("sidebar"), "toggled", cond);
    }
}

/*
 Директива для работы выпадающего меню в сайдбаре
 */
@Directive({
    selector: "[toggle-submenu]"
})
export class SubmenuDirective {
    constructor(private elementRef: ElementRef, private renderer: Renderer) { }

    @HostListener("click", ['$event']) click(event) {
        event.preventDefault();
        const cond = -1 == this.elementRef.nativeElement.parentNode.className.indexOf("active");
        this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "active", cond);
        this.renderer.setElementClass(this.elementRef.nativeElement.parentNode, "toggled", cond);
    }
}

@Directive({
    selector: "[draggable]"
})
export class DraggableDirective {

    constructor(private elementRef: ElementRef, private renderer: Renderer) { }

    @HostListener("mousedown", ['$event'])
    mouseHandling(event) {
        // alert('11');
    }
}
