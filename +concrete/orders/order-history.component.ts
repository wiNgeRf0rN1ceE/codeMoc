import {Component, Input} from "@angular/core";

@Component({
    selector: "order-history",
    template: `
      <div class="order-history-wrapper">
        <div class="p-timeline" *ngFor="let element of history">
          <div class="pt-line c-gray text-right">
            <span class="d-block">{{element.date}}</span>
            {{element.time}}
          </div>  
          <div class="pt-body">
            <h2 class="ptb-title">{{element.stage_caption}}</h2>
            <div class="order-data-wrapper">
              <p *ngFor="let data_element of element.data">
                <span *ngIf="data_element.type == 'file'">
                  <a [href]="'http://api.cargodeal.ru/uploads/' + data_element.data" target="_blank">
                    <img style="max-width: 100px;" class="img-thumbnail"
                      [src]="'http://api.cargodeal.ru/uploads/' + data_element.data" alt="">
                  </a>
                </span>
                <span *ngIf="data_element.type == 'text'">{{data_element.data}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    `
})
export class OrderHistoryComponent {

    @Input() private history: any;

}