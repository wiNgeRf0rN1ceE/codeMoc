import {Component, OnInit,ViewChild, Input, Output, EventEmitter,  ContentChild} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {MaterialWindowComponent} from "../../party_modules/@material-windows/materialwindow.component";
import {MaterialSelectComponent} from "../../party_modules/@material-select/material-select.component";
import {UserService} from '../../services/user.service';

import {AnonymousUser, IUsers} from '../../models/user';

@Component({
    selector: 'user-edit',
    templateUrl: '../../../templates/views/concrete/forms/user-edit.html'
})
export class UsersEditComponent {
    public form: FormGroup;
    public group;
    public company;

    public currentGroup;
    public currentCompany: Array<Number> ;

    public grpValue;
    public afterNewValue;
    public items;
    afterData;
    groupId;

    @Input() public user: IUsers = new AnonymousUser();
    @Output() form_update : EventEmitter<IUsers> = new EventEmitter<IUsers>();

    constructor(private fb: FormBuilder, private userService: UserService) {  }

    @ViewChild("createGroup")
    create_group: MaterialWindowComponent;

    ngOnInit() {
        this.currentCompany = this.user.companies;
        this.company = this.user.companies;
        const arrayGroup = [];
        arrayGroup.push(this.user.group);
        this.currentGroup = arrayGroup;

        this.form = this.fb.group({
            "id":[this.user.id],
            "fam":[this.user.fam],
            "name":[this.user.name, Validators.required],
            "otch":[this.user.otch],
            "username":[this.user.username, Validators.required],
            "password":[""],
            "type":[this.user.type, Validators.required],
        });
    }

    onGroupCreate() {
        this.userService.getUserGroup().subscribe(response => {
            this.afterData =  response.list;
        });
        this.create_group.close();
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
            group_id = this.group == undefined ? this.user.group : parseInt(this.group);
        }
        const user_id: number = this.form.value["id"];
        const fam: string = this.form.value["fam"];
        const name: string = this.form.value["name"];
        const otch: string = this.form.value["otch"];
        const username: string = this.form.value["username"];
        const password: string = this.form.value["password"];
        const type: string = this.form.value["type"];
        this.userService.updateUser(user_id, username, password, name, fam , otch, type, this.company, group_id).subscribe();
        this.form_update.emit(this.user);
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
            const idx = this.company.indexOf(value.id);
            if (idx != -1){
                this.company.splice(i,1);
            }
        }
    }


}
