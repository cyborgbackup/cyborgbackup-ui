import {Component, HostListener, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {
    NbTreeGridDataSource,
    NbTreeGridDataSourceBuilder,
    NbDialogService, NbMenuService, NbGlobalPhysicalPosition, NbToastrService
} from '@nebular/theme';
import {CatalogsService, RestoreService} from '../../services';
import {ContextMenuDirective} from '../context-menu/context-menu.directive';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CDK_TABLE, CdkTable} from '@angular/cdk/table';

interface FSEntry {
    name: string;
    type: string;
    size?: string;
    mtime?: string;
    owner?: string;
    group?: string;
    healthy?: boolean;
    mode?: string;
    archive_name?: string;
}

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

@Component({
    selector: 'cbg-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
    @ViewChild(ContextMenuDirective, {static: false}) contextMenu: ContextMenuDirective;
    @ViewChild('restoreDialog', {static: true}) restoreDialog: TemplateRef<any>;

    public formRestore: FormGroup;

    customColumn = 'name';
    defaultColumns = [];
    allColumns = [this.customColumn, ...this.defaultColumns];
    dataSource: NbTreeGridDataSource<FSEntry>;
    public items = [
        {title: 'Restore'},
    ];
    public itemDetail: FSEntry = {
        name: '',
        type: '',
        size: '',
        mtime: '',
        owner: '',
        group: '',
        healthy: undefined,
        mode: '',
        archive_name: ''
    };
    public archiveDetail = {
        archive_name: undefined,
        hostname: undefined,
        policy_type: undefined,
        original_size: undefined,
        compressed_size: undefined,
        deduplicated_size: undefined,
        started: undefined,
        elapsed: undefined
    };

    private data: TreeNode<FSEntry>[];
    private destroy$: Subject<void> = new Subject<void>();

    constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
                private catalogsService: CatalogsService,
                private dialogService: NbDialogService,
                private menuService: NbMenuService,
                private formBuilder: FormBuilder,
                private restoreService: RestoreService,
                private toastrService: NbToastrService) {
        this.loadInitialTree();
        this.formRestore = this.formBuilder.group({
            destination: ['', Validators.required],
            dest_folder: [],
            dry_run: [false],
            host: ['']
        });
    }

    @HostListener('document:click')
    close() {
        if (this.contextMenu) {
            this.contextMenu.hide();
        }
    }

    getDataEntry(item, entry = this.data): any {
        for (const v of entry) {
            if (v) {
                if (v.data
                    && v.data.name === item.data.name
                    && v.data.type === item.data.type
                    && v.data.archive_name === item.data.archive_name) {
                    return v;
                } else {
                    if (v.children && v.children.length > 0) {
                        const el = this.getDataEntry(item, v.children);
                        if (el !== undefined) {
                            return el;
                        }
                    }
                }
            }
        }
    }

    _expandNode(name, index = 0, tree = this.data): void {
        const searchedItem = name.split('-')[index];
        for (const v of tree) {
            if (v.data.name === searchedItem) {
                v.expanded = true;
                this._expandNode(name, index + 1, v.children);
            }
        }
    }

    setExpanded(entry: any): void {
        if (entry.data.hasOwnProperty('archive_name')) {
            this._expandNode(entry.data.archive_name);
        }
    }

    getDataExpanded(row: any): void {
        if (row.expanded === false) {
            this.getInfos(row);
            if (row.children === undefined) {
                const entry = this.getDataEntry(row, this.data);
                if (entry && entry.data) {
                    let path = null;
                    if (['dir', 'file', 'symlink'].indexOf(entry.data.type) !== -1) {
                        path = entry.data.name;
                    }
                    this.catalogsService.getPathEntries(entry.data.archive_name, path).subscribe((data) => {
                        for (const v of data) {
                            let type = 'file';
                            if (v.mode[0] === 'd') {
                                type = 'dir';
                            }
                            const newEntry = {
                                data: {
                                    name: v.path,
                                    type,
                                    size: v.size,
                                    mtime: v.mtime,
                                    owner: v.owner,
                                    group: v.group,
                                    mode: v.mode,
                                    healthy: v.healthy,
                                    archive_name: entry.data.archive_name,
                                },
                                children: []
                            };
                            entry.children.push(newEntry);
                        }
                        entry.expanded = true;
                        this.setExpanded(entry);
                        this.dataSource.setData(this.data);
                    }, (err) => {
                        console.log(err);
                    });
                }
            }
        }
    }

    getInfos(row): void {
        if (['dir', 'file', 'date'].indexOf(row.data.type) > -1) {
            if (this.archiveDetail.archive_name !== row.data.archive_name) {
                this.catalogsService.getArchiveInfo(row.data.archive_name).subscribe((res) => {
                    for (const k of Object.keys(this.archiveDetail)) {
                        if (k === 'policy_type') {
                            this.archiveDetail[k] = res.summary_fields.policy.policy_type;
                        } else if (k === 'hostname') {
                            this.archiveDetail[k] = res.summary_fields.client.hostname;
                        } else {
                            this.archiveDetail[k] = res[k];
                        }
                    }
                    this.archiveDetail.archive_name = row.data.archive_name;
                });
            }
            if (row.data.type !== 'date') {
                this.itemDetail = row.data;
            }
        }
    }

    ngOnInit() {
        this.menuService.onItemClick().pipe(
            takeUntil(this.destroy$),
        ).subscribe((itemClick: any) => {
            if (typeof itemClick.tag === 'object' && itemClick.tag.hasOwnProperty('mtime')) {
                this.restore(itemClick);
            }
            if (typeof itemClick.tag === 'object' && itemClick.tag.hasOwnProperty('type') && itemClick.tag.hasOwnProperty('archive_name')) {
                if (itemClick.tag.type === 'date') {
                    this.restore(itemClick);
                }
            }
        });
    }

    open(row, event) {
        if (['file', 'dir', 'date'].indexOf(row.data.type) >= 0) {
            this.contextMenu.tag = row.data;
            this.contextMenu.cbgRebuild(event);
            this.contextMenu.show();
        }
        return false;
    }

    restore(item): void {
        this.dialogService.open(this.restoreDialog, {
            context: item
        }).onClose.subscribe((res) => {
            if (res && this.formRestore.valid) {
                const data = this.formRestore.value;
                data['archive_name'] = item.tag.archive_name;
                data['item'] = '';
                if (item.tag.type !== 'date') {
                    data['item'] = item.tag.name;
                }
                this.restoreService.post(this.formRestore.value).subscribe(() => {
                    this.toastrService.show('', 'Restore launched', {
                        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                        status: 'success'
                    });
                }, (err) => {
                    this.toastrService.show(err, 'Error on Restore', {
                        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                        status: 'danger'
                    });
                });
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadInitialTree(): void {
        this.data = [];
        this.catalogsService.getArchivesNames().subscribe((data: Array<any>) => {
            for (const d of data) {
                const archiveNamesSplit = d.archive_name.split('-');
                const archiveType = archiveNamesSplit[0];
                const archiveHost = archiveNamesSplit[1];
                const archiveDate = archiveNamesSplit[2] + '-' + archiveNamesSplit[3] + '-'
                    + archiveNamesSplit[4] + '-' + archiveNamesSplit[5];
                let found = false;
                let entry = null;
                for (const v of this.data) {
                    if (v.data.name === archiveType && v.data.type === 'policy') {
                        found = true;
                        entry = v;
                    }
                }
                if (!found) {
                    entry = {data: {name: archiveType, type: 'policy'}, children: []};
                    this.data.push(entry);
                }
                found = false;
                for (const v of entry.children) {
                    if (v.data.name === archiveHost && v.data.type === 'client') {
                        found = true;
                        entry = v;
                    }
                }
                if (!found) {
                    const tmpEntry = entry;
                    entry = {data: {name: archiveHost, type: 'client'}, children: []};
                    tmpEntry.children.push(entry);
                }
                found = false;
                for (const v of entry.children) {
                    if (v.data.name === archiveDate && v.data.type === 'date') {
                        found = true;
                        entry = v;
                    }
                }
                if (!found) {
                    const tmpEntry = {
                        data: {name: archiveDate, type: 'date', archive_name: d.archive_name},
                        children: []
                    };
                    entry.children.push(tmpEntry);
                }
            }
            this.dataSource = this.dataSourceBuilder.create(this.data);
        });
    }

}
