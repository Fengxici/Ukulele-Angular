import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ResponseCode } from '@shared/response.code';
import { DictEditComponent } from './dict-edit.component';
import { Api } from '@shared/api';
import { DictIndexEditComponent } from './dict-index-edit.component';
import { AbilityService } from '@shared/service/AbilityService';
import { ActivatedRoute } from '@angular/router';
import { BaseAbilityComponent } from '@shared/base.ability.component';

@Component({
  selector: 'app-system-dict',
  templateUrl: './dict.component.html',
})
export class SystemDictComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected abilityService: AbilityService,
    protected route: ActivatedRoute,
  ) {
    super(abilityService, route);
  }
  params: any = {};
  page: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10,
  };
  pagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  searchSchema: SFSchema = {
    properties: {
      key: {
        type: 'string',
        title: '键',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      name: {
        type: 'string',
        title: '名称',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '键', index: 'key' },
    { title: '名称', index: 'name' },
    {
      title: '操作',
      buttons: [
        {
          text: '新增字典项',
          icon: 'profile',
          type: 'modal',
          click: (record: any) => {
            this.addItem(record.id);
          },
          acl: { ability: ['add'] },
        },
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: DictIndexEditComponent,
          },
          click: () => {
            this.query(null);
          },
          acl: { ability: ['modify'] },
        },
        {
          text: '删除',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
          acl: { ability: ['delete'] },
        },
      ],
    },
  ];
  @ViewChild('stItem', { static: true }) stItem: STComponent;
  itemColumns: STColumn[] = [
    { title: '名称', index: 'label' },
    { title: '值', index: 'value' },
    { title: '排序', index: 'sort' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: DictEditComponent,
          },
          click: () => {
            this.query(null);
          },
          acl: { ability: ['modify'] },
        },
        {
          text: '删除',
          icon: 'delete',
          click: (record: any) => {
            this.deleteItem(record);
          },
          acl: { ability: ['delete'] },
        },
      ],
    },
  ];
  ngOnInit() {
    super.initAbilities();
    this.query(null);
  }
  ngOnDestroy(): void {
    super.clearAbilities();
  }

  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
  }

  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    this.params = {};
    if (event) {
      if (event.key) this.params.key = event.key;
      if (event.name) this.params.name = event.name;
    }

    this.http
      .get(Api.BaseDictApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(DictIndexEditComponent)
      .subscribe(() => this.st.reload());
  }

  addItem(id: any) {
    this.modal
      .createStatic(DictEditComponent, id)
      .subscribe(() => this.st.reload());
  }

  delete(record: any) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: '确定删除吗?',
      nzContent:
        '<b style="color: red;">如果您确定要删除请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .delete(Api.BaseDictApi + 'index/' + record.id)
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.st.reload();
                this.msg.success('删除成功');
              } else {
                this.msg.warning(res.message);
              }
            } else {
              this.msg.error('删除失败，未知错误');
            }
          }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  deleteItem(record: any) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: '确定删除吗?',
      nzContent:
        '<b style="color: red;">如果您确定要删除请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http.delete(Api.BaseDictApi + record.id).subscribe((res: any) => {
          if (res) {
            if (res.code === ResponseCode.SUCCESS) {
              this.st.reload();
              this.msg.success('删除成功');
            } else {
              this.msg.warning(res.message);
            }
          } else {
            this.msg.error('删除失败，未知错误');
          }
        }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
