import {Component, Input} from "@angular/core";
import {CrewService} from "../../services/crew.service";

@Component({
    selector: "crew-position",
    styles: [
        'div.crew-position{height: 300px;}'
    ],
    template: `
      <div class="crew-wrapper">
        <div class="ya-map crew-position" id="crew-{{crew.crew_id}}"></div>
      </div>
    `
})
export class VehiclePositionComponent {
    @Input() public crew: any;
    private subscription: any;

    private map: ymaps.Map;
    private placemark: ymaps.Placemark;

    constructor(private crew_service: CrewService) { }

    ngOnInit() {
        ymaps.ready().then(() => {
            this.map = new ymaps.Map('crew-' + this.crew.crew_id, {
                center: [55.751574, 37.573856],
                zoom: 15,
                controls: ['zoomControl']
            });

            if(this.crew) {
                this.displayMark(this.crew);
                this.subscription = this.crew_service.getPosition(this.crew.crew_id)
                    .subscribe((response) => this.displayMark(response));
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    displayMark(data: any) {
        if(!this.placemark) {
            this.placemark = new ymaps.Placemark([data.latitude, data.longitude], {
                balloonContent: "Foo"
            }, {
                iconLayout: 'default#image',
                iconImageHref: data.map_icon,
                iconImageSize: [24, 24],
                iconImageOffset: [-12, -24]
            });

            this.map.geoObjects.add(this.placemark);
            this.map.setCenter([data.latitude, data.longitude]);
        }
        else {
            this.map.setCenter([data.latitude, data.longitude]);
            this.placemark.geometry.setCoordinates([data.latitude, data.longitude]);
            this.placemark.options.set('iconImageHref', data.map_icon);
        }
    }
}
