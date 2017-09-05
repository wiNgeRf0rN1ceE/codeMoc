import {Component,Input, Output, EventEmitter, OnInit, AfterViewChecked} from "@angular/core";
import {CrewService} from "../../services/crew.service";
import {HttpClient} from "../../services/http.service";
import {Observable} from 'rxjs/Rx';
@Component({
    selector: "orders-crew-maps",
    template: `
        <div class="row">
          <div class="col-md-4 p-t-10">
            Выбрано объектов: <b>{{crews.length}}</b>
          </div>
          <div class="col-md-4">
            <div class="checkbox">
              <label>
                <input type="checkbox" [(ngModel)]="ready_only" (change)="changeState($event.target)">
                <i class="input-helper"></i>
                Только готовые к работе
              </label>
            </div>
          </div>
          <div class="col-md-4">
            <material-select
              (control_change)="setGroup($event)"
              [api_action]="'vhc.grp_lst'">
            </material-select>
          </div>
        </div>
        <hr>
        <div class="yandex-map-wrapper" (load)="onLoad()">
          <div id="yandex-map"></div>
        </div>
    `,
    styles: ['#yandex-map{height: 400px;}']
})
export class OrdersCrewMapComponent implements OnInit {

    @Input() longitude;
    @Input() latitude;
    @Input() address;
    @Output("on_change")
    private state_emitter: EventEmitter<any> = new EventEmitter<any>();

    private map: ymaps.Map;
    private subscription: any;
    private crews: Array<string> = [];
    entryPlacemark: ymaps.Placemark;

    private ready_only: boolean = false;
    private group: string = "";

    private placemarks: any = {};

    constructor(private crew_service: CrewService, private http_service: HttpClient) {
        ymaps.ready().then(() => {
            this.map = new ymaps.Map('yandex-map', {
                center: [this.longitude, this.latitude],
                zoom: 8,
                controls: ['zoomControl']
            });
            // this.map.behaviors.disable('scrollZoom');
            let address = this.address;
            this.entryPlacemark = new ymaps.Placemark([this.longitude, this.latitude],  {
                    balloonContent: `
                        <p class="m-b-5">Точка погрузки</p>
                        <p class="m-b-5">Адрес: ${address}</p>
                    `
                });
            this.map.geoObjects.add(this.entryPlacemark);
        })
    }

    changeState(element: HTMLInputElement) {
        this.ready_only = element.checked;
    }

    setGroup(value: any) {
        this.group = value;
    }

    prepareQuery() {
        return {param_filter: {ready_only: this.ready_only, group_id: this.group}};
    }

    displayMarks(data: any) {
        const placemarks = data.list;
        let marks = [];

        for(let placemark: ymaps.Placemark, i: number = 0; i < placemarks.length; i++) {
            marks.push(placemarks[i].crew_id);

            let crew_id: string = placemarks[i].crew_id,
                placemark_icn: string = placemarks[i].map_icon;

            if(!(placemarks[i].crew_id in this.placemarks)) {
                placemark = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], { },
                {
                    iconLayout: 'default#image',
                    iconImageHref: placemarks[i].map_icon,
                    iconImageSize: [32, 32],
                    iconImageOffset: [-16, -32]
                });
                this.map.geoObjects.add(placemark);
                this.placemarks[placemarks[i].crew_id] = placemark;

                placemark.events.add('click', (e) => {
                    e.stopPropagation();

                    if(-1 == this.crews.indexOf(crew_id)) {
                        this.crews.push(crew_id);
                        this.state_emitter.emit([crew_id, true]);

                        placemark.options.set('iconImageHref', 'http://api.ecma.it-lab.su/vehicles/icon_check.png');
                    }
                    else {
                        const index = this.crews.indexOf(crew_id);
                        this.crews.splice(index, 1);
                        this.state_emitter.emit([crew_id, false]);

                        placemark.options.set('iconImageHref', placemark_icn);
                    }
                });
            }
            else {
                this.placemarks[placemarks[i].crew_id].geometry
                    .setCoordinates([placemarks[i].latitude, placemarks[i].longitude]);

                if(-1 == this.crews.indexOf(crew_id)) {
                    this.placemarks[placemarks[i].crew_id].options
                        .set('iconImageHref', placemarks[i].map_icon);
                }
            }
        }

        for(let mark_index: any, i: number = 0; i < Object.keys(this.placemarks).length; i++) {
            mark_index = Object.keys(this.placemarks)[i];
            if(-1 == marks.indexOf(mark_index)) {
                this.map.geoObjects.remove(this.placemarks[mark_index]);
                delete this.placemarks[mark_index];
            }
        }
    }


    ngOnInit() {
        this.subscription = Observable.interval(3000).flatMap(() => {
            let params = this.prepareQuery();
            return this.http_service.post('crew', params);
        })
        .subscribe(data => {
            if(data) {
                this.displayMarks(data);
            }
        });
    }
    

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
