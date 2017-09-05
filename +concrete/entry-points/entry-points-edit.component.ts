import {Component, Input, Output, EventEmitter} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";

import {HttpClient} from "../../services/http.service";
import {MapPoints} from "../../models/map-points";

@Component({
    selector: "entry-point-edit",
    templateUrl: "../../../templates/views/concrete/forms/entry-point.html"
})
export class EntryPointsEditComponent {
    private form: any;
    active = true;

    @Input() private entry_point: MapPoints = new MapPoints();
    @Output() private form_submit: EventEmitter<MapPoints> = new EventEmitter<MapPoints>();

    constructor(private fb: FormBuilder, private http: HttpClient) { }

    ngOnInit() {
        this.form = this.fb.group({
            "address": [this.entry_point.address, Validators.required],
            "latitude": [this.entry_point.latitude, Validators.required],
            "longitude": [this.entry_point.longitude, Validators.required]
        })
    }

    onSubmit() {
        const id: number = this.entry_point.id;
        const address: string = this.form.value["address"];
        const lat: number = parseFloat(this.form.value["latitude"]);
        const lon: number = parseFloat(this.form.value["longitude"]);

        this.http.post("epnt.edit", {point_id: id, address: address, latitude: lat, longitude: lon})
            .subscribe();
        this.form_submit.emit(this.entry_point);
    }
}
