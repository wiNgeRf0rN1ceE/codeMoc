import {Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {MaterialSelectComponent} from "../../party_modules/@material-select/material-select.component";
import {UserService} from '../../services/user.service';

@Component({
    selector: 'create-user',
    templateUrl: '../../../templates/views/concrete/forms/user-create.html'
})
export class CreateUserComponent {
    public form: any;

    public group;
    public company = [];

    public afterNewValue;

    public resetModel;
    active = true;
    grpValue;
    elementSelected;
    clearValue = false;
    afterData;
    groupId;

    @Output() forms_submit: EventEmitter<any> = new EventEmitter<any>();
    

    constructor(private fb: FormBuilder, private userService: UserService) {;
        this.form = fb.group({
            "fam":[""],
            "name":["", Validators.required],
            "otch":[""],
            "username":["", Validators.required],
            "password":["", Validators.required],
            "type":["", Validators.required],
        });
    }

    @ViewChild("createGroup")
    create_group: MaterialWindowComponent;


    onGroupCreate(vhcData) {
        this.elementSelected = vhcData;
        this.userService.getUserGroup().subscribe(response => {
            this.afterData =  response.list;
        });
        console.log('this vhcdata' + vhcData);
        console.log('this elementselected' + this.elementSelected);
        this.create_group.close();
    }

    resetForm() {
        this.form.reset();
        this.active = false;
        this.active = true;
        this.resetModel = [{ id: 0, text: ''}];
    }

    getValue(value) {
        this.grpValue = value;
    }

    onSubmit() {
        let group_id;
        if (this.afterData) {
            for (let obj of this.afterData) {
                if (obj.caption == this.grpValue) {
                    this.groupId = obj.id;
                }
            }
            group_id = this.group == undefined ? this.groupId : parseInt(this.group);
        } else {
            group_id = this.group == undefined ? null : parseInt(this.group);
        }
        const fam: string = this.form.value["fam"];
        const name: string = this.form.value["name"];
        const otch: string = this.form.value["otch"];
        const username: string = this.form.value["username"];
        const password: string = this.form.value["password"];
        const type: string = this.form.value["type"];
        this.userService.createUser(username, password, type,  fam,  name, otch, this.company, group_id)
            .subscribe(
                (response) => this.forms_submit.emit(response),
                (error) => this.onError(error),
            );
        this.elementSelected = this.afterNewValue = [];
        this.clearValue = true;
        this.resetForm();
    }

    onError(exception: any) {
        if (exception.error.code == 500) 
            alert("Извините, пользователь с таким именем уже существует"); 
    }


    public selected(value:any):void {
        this.group = value.id;
        this.afterNewValue = value.text;

    }

    public selectedCompany(value:any) {
        this.company.push(value.id);
    }

    public removedCompany(value: any) {
        for (let i = 0; i < this.company.length; i++) {
            if (-1 == this.company.indexOf(value)){
                this.company.splice(i,1);
            }
        }
    }

}
