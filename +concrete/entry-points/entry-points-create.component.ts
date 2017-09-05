import {Component, Output, EventEmitter} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "../../services/http.service";

@Component({
    selector: "entry-point-create",
    templateUrl: "../../../templates/views/concrete/forms/entry-point.html"
})
export class EntryPointsCreateComponent {
    private form: any;
    active = true;

    @Output() form_submit: EventEmitter<any> = new EventEmitter<any>();
    @Output() public send_value: EventEmitter<any> =  new EventEmitter<any>();


    constructor(private fb: FormBuilder, private http: HttpClient) { }

    ngOnInit() {
        this.form = this.fb.group({
            "address": ["", Validators.required],
            "latitude": ["", Validators.required],
            "longitude": ["", Validators.required]
        });
    }

    onChange(value) {
        this.send_value.emit(value);
    }

    resetForm() {
        this.form.reset();
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

    onSubmit() {
        const address: string = this.form.value["address"];
        const lat: number = parseFloat(this.form.value["latitude"]);
        const lon: number = parseFloat(this.form.value["longitude"]);

        this.http.post("epnt.add", {address: address, latitude: lat, longitude: lon})
            .subscribe(
                (response) => this.form_submit.emit(response),
                (error) => alert("Не удалось создать объект, проверьте правильность заролнения полей формы")
            );
        this.resetForm();
    }

}
