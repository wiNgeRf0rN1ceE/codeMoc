import { Component, OnInit } from '@angular/core';
import { CrewService } from '../../services/crew.service';
import { Observable } from 'rxjs/Rx';
import {HttpClient} from "../../services/http.service";


@Component({
    template: `
        <div class="container-fluid" style="margin-top: -20px;">
          <div class="card">
            <div class="card-body card-padding p-b-10">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>&nbsp;</label>
                    <div class="checkbox">
                      <label>
                        <input type="checkbox"
                           (change)="getActiveOnly($event.target)">
                        <i class="input-helper"></i>
                        Показывать только готовых к работе
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Статусы</label>
                    <material-select
                      (control_change)="setStatus($event)"
                      [api_action]="'crew.statuses'">
                    </material-select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Группа</label>
                    <material-select
                      (control_change)="setGroup($event)"
                      [api_action]="'vhc.grp_lst'">
                    </material-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: -20px;">
          <div id="map" style=" min-height: 650px; height: 100%;
    width: 100%; "></div>
        </div>
    `
})
export class Map implements OnInit {
    subscription: any;
    placemarks: any = {};
    map: ymaps.Map;

    current_status: any = null;
    current_group: any = null;
    ready_only: boolean = false;

    getActiveOnly(element: HTMLInputElement) {
       this.ready_only = element.checked;
    }

    setStatus(value: any) {
        this.current_status = value;
    }

    setGroup(value: any) {
        this.current_group = value;
    }

    prepareQuery() {
        let params_filter = {ready_only: this.ready_only};

        if(parseInt(this.current_status)) {
            params_filter['status_id'] = parseInt(this.current_status);
        }
        if(parseInt(this.current_group)) {
            params_filter['group_id'] = parseInt(this.current_group);
        }

        return {offset: 0, limit: 500, param_filter: params_filter};
    }

    constructor(private crewService: CrewService, private httpService: HttpClient) {
        ymaps.ready().then(() => {
            this.map = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 8,
                controls: ['zoomControl']
            });
            // this.map.behaviors.disable('scrollZoom');
        });
    }

    displayMarks(data): void {
        const placemarks =  data.list;
        let marks = [];

        for(let placemark: ymaps.Placemark, i: number = 0; i < placemarks.length; i++) {
            marks.push(placemarks[i].crew_id);

            if(!(placemarks[i].crew_id in this.placemarks)) {
                let entryInfo;
                let conclusionInfo;
                let str;
                if ( (placemarks[i].entry_point == undefined) && (placemarks[i].conclusion_point == undefined) ) {
                    entryInfo = conclusionInfo = 'Заказ не взят';
                    str = "";
                } else {
                    entryInfo = placemarks[i].entry_point;
                    conclusionInfo = placemarks[i].conclusion_point;
                    str = `Откуда: ${entryInfo} Куда: ${conclusionInfo}`;
                }
                placemark = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], {
                    balloonContent: `
                        <p class="m-b-5">Автомобиль: ${placemarks[i].mark} ${placemarks[i].model}</p>
                        <p class="m-b-5">Скорость: ${placemarks[i].speed}</p>
                        <p class="m-b-5">За рулем: ${placemarks[i].username}</p>
                        <p class="m-b-5">Статус: ${placemarks[i].status_txt}</p>
                        <p class="m-b-5">${str}</p>
                        <p class="m-b-5"><img width="100px" src="${placemarks[i].vehicle_number_img}"></p>
                    `
                },
                {
                    iconLayout: 'default#image',
                    iconImageHref: placemarks[i].map_icon,
                    iconImageSize: [32, 32],
                    iconImageOffset: [-16, -32]
                });
                this.map.geoObjects.add(placemark);
                this.placemarks[placemarks[i].crew_id] = placemark;
            }
            else {
                this.placemarks[placemarks[i].crew_id].geometry
                    .setCoordinates([placemarks[i].latitude, placemarks[i].longitude]);
                this.placemarks[placemarks[i].crew_id].options
                    .set('iconImageHref', placemarks[i].map_icon);
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
            return this.httpService.post('crew', params);
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


