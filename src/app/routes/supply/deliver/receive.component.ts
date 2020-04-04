import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { STComponent, STColumn, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { ReceiveEditComponent } from './receive-edit.component';

@Component({
  selector: 'app-supply-receive',
  templateUrl: './receive.component.html',
})
export class ReceiveComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  params: any = {};
  record: any;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称'
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '发货单号', index: 'deliverNo'},
    {
      title: '操作',
      buttons: [
        {
          text: '物料明细',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: ReceiveEditComponent,
          },
          click: () => {
            this.query(null);
          },
        },
        {
          text: '一键签收',
          icon: 'edit',
          click: (record) => {
          },
        },
        {
          text: '一键验收',
          icon: 'edit',
          click: (record) => {
          },
        }
      ],
    },
  ];

  ngOnInit() {
    this.query(null);
  }

  ngOnDestroy(): void {
    super.clearAbilities();
  }

  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    if (event) {
      if (event.name) this.params.name = event.name;
    }
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.params.firmId = firmInfo.id;
    this.http
    .get(Api.BaseSupplyDeliverUrl + 'page/' + current + '/' + size + '/1', this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.record = res.data.records;
        }
      });
  }

  change(e: STChange) {
    console.log('change', e);
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
  }
}
