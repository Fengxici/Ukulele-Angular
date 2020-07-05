import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { FirmEditComponent } from './firm-edit.component';
import { STPage, STComponent, STColumn, STChange } from '@delon/abc';

@Component({
  selector: 'app-supply-firm',
  templateUrl: './firm.component.html',
})
export class FirmComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    public settings: SettingsService,
    private msgSrv: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  firmModalVisible = false;
  list: any = [];
  firmInfo: any = {};
  firmPage: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10,
  };
  firmPagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  firmParams: any = {};
  @ViewChild('firmst', { static: true }) firmst: STComponent;
  firmColumns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '简称', index: 'shortName' },
    { title: '社会统一信用代码', index: 'unicode' },
    {
      title: '操作',
      buttons: [
        {
          text: '加入',
          icon: 'check',
          click: (record: any) => {
            this.handleFirmModalClose(record);
          }
        },
      ],
    },
  ];
  firmSearchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '供应商名称'
      }
    },
  };
  schema: SFSchema = {
    properties: {
      shortName: { type: 'string', title: '简称', maxLength: 15 , ui: { widget: 'text' }},
      unicode: { type: 'string', title: '社会统一信用代码', maxLength: 15 , ui: { widget: 'text' }},
      phone: { type: 'string', title: '电话', maxLength: 15 , ui: { widget: 'text' }},
      address: { type: 'string', title: '地址', maxLength: 15, ui: { widget: 'text' } },
      bankAccount: { type: 'string', title: '银行账号', maxLength: 15, ui: { widget: 'text' } },
      bankName: { type: 'string', title: '开户行', maxLength: 15 , ui: { widget: 'text' }},
      contacts: { type: 'string', title: '联系人', maxLength: 15 , ui: { widget: 'text' }},
      description: { type: 'string', title: '描述' , ui: { widget: 'text' }},
    },
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };
  queryMy() {
    this.http
      .get(Api.BaseSupplyFirmApi + 'user/firm/list', {userId: this.settings.user.id})
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.list = res.data;
        }
      });
  }

  ngOnInit() {
    this.firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    if (!this.firmInfo)
      this.firmInfo = {};
    super.initAbilities();
    this.queryMy();
  }

  ngOnDestroy(): void {
    super.clearAbilities();
  }

  change(item: any) {
    this.firmInfo = item;
    localStorage.setItem('firmInfo' + this.settings.user.id, JSON.stringify(item));
  }

  edit(item: any) {
    this.modal
    .createStatic(FirmEditComponent, {record: item, mode: 'owner'})
    .subscribe(() => this.queryMy());
  }

  transfer(item: any) {

  }

  add() {
    this.modal
      .createStatic(FirmEditComponent, {mode: 'owner'})
      .subscribe(() => this.queryMy());
  }

  join() {
    this.firmModalVisible  = true;
    this.queryFirm(null);
  }
  handleFirmModalClose(value: any): void {
    this.http
    .post(Api.BaseSupplyFirmApi + 'user/apply' , null, {userId: this.settings.user.id, firmId: this.firmInfo.id})
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        this.firmModalVisible  = false;
        this.msgSrv.success('申请加入成功，等待管理员批准');
        this.queryMy();
      } else {
        this.msgSrv.error('加入失败');
      }
    });
  }

  firmPageChange(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.firmParams.size = e.ps;
      this.firmParams.current = e.pi;
      this.queryFirm(null);
    }
  }
  queryFirm(event: any) {
    const current: number = this.firmParams.current || 1;
    const size: number = this.firmParams.size || 10;
    if (event) {
      // 搜索时取所有公司列表
      if (event.name) this.firmParams.name = event.name;
    }
    this.http
    .get(Api.BaseSupplyFirmApi + 'page/' + current + '/' + size, this.firmParams)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.firmPage = res.data;
      }
    });
  }
}
