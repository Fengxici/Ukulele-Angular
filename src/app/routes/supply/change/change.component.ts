import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange, STColumnBadge } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { FirmDrawerComponent } from '../common/firm-drawer.component';

@Component({
  selector: 'app-supply-change',
  templateUrl: './change.component.html',
})
export class ChangeComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    public settings: SettingsService,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  _STATUS: STColumnBadge = {
    0: {text: '申请', color: 'default'},
    1: {text: '同意', color: 'success'},
    2: {text: '拒绝', color: 'warning'},
  };
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
      orderNo: {
        type: 'string',
        title: '订单编号'
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '', width: '50', render: 'id'},
    { title: '订单编号', index: 'purchaseNo' },
    { title: '物料名称', index: 'materialName' },
    { title: '物料编号', index: 'materialNo' },
    {title: '变更内容', index: 'changeFieldText'},
    {title: '变更前', index: 'originValue'},
    {title: '变更后', index: 'changeValue'},
    { title: '状态', index: 'status', type: 'badge', badge: this._STATUS },
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
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    if (!firmInfo) {
      return;
    }
    this.params.applyFirm = firmInfo.id;
    if (event) {
      if (event.orderNo) this.params.purchaseNo = event.orderNo;
    }
    this.http
      .get(Api.BaseSupplyOrderFlowApi + '/purchase/change/page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }
}
