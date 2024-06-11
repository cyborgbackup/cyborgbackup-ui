import {Component, OnInit} from '@angular/core';
import {PoliciesService} from '../../../services';
import {NbDialogRef} from '@nebular/theme';

@Component({
    selector: 'cbg-dialog-form-policy-vmmodule',
    templateUrl: './dialog-form-policy-vmmodule.component.html',
    styleUrls: ['./dialog-form-policy-vmmodule.component.css']
})
export class DialogFormPolicyVMModuleComponent implements OnInit {
    client: any;
    module: string;
    vms: any;
    vars: any;
    loading: boolean;
    state: any;
    checked: object;
    error: string;

    constructor(private policiesService: PoliciesService,
                protected dialogRef: NbDialogRef<any>) {
        this.loading = true;
        this.error = null;
        this.state = {
            qemu: true,
            lxc: true
        };
        this.checked = {};
    }

    close(save = false) {
        const filtered = Object.keys(this.checked).filter((key) => this.checked[key]).map(x => +x);
        this.dialogRef.close(save ? filtered : undefined);
    }

    groupBy(list, keyGetter): any {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    toggle(item): void {
        this.state[item] = !this.state[item];
    }

    select(vm): void {
        this.checked[vm.vmid] = !this.checked[vm.vmid];
    }

    checkAll(type, event): void {
        this.vms[type].forEach((vm) => {
            this.checked[vm.vmid] = event.target.checked;
        });
    }

    ngOnInit(): void {
        this.error = null;
        this.policiesService.moduleItems(this.module, this.client.id).subscribe((res) => {
            if (res.status === 200) {
                res.body.forEach((vm) => {
                    this.checked[vm.vmid] = this.vars !== undefined && this.vars.includes(vm.vmid);
                });
                const filtered = this.groupBy(res.body, (vm) => vm.type);
                this.vms = {
                    qemu: [],
                    lxc: []
                };
                ['qemu', 'lxc'].forEach((type) => {
                    this.vms[type] = filtered.get(type);
                });
            } else {
                this.error = 'Unable to get Virtual Machine list';
            }
            this.loading = false;
        });
    }

}
