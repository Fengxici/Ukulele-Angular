import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange, STColumnTag, STColumnBadge } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { EmployeeApplyHandleComponent } from './apply-access.component';
import { FirmDrawerComponent } from '../common/firm-drawer.component';

@Component({
  selector: 'app-supply-join',
  templateUrl: './apply.component.html',
})
export class EmployeeApplyComponent extends BaseAbilityComponent
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
  HANDLED_BADGE: STColumnBadge = {
    false: {text: '未处理', color: 'default'},
    true: {text: '已处理', color: 'success'}
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
      username: {
        type: 'string',
        title: '用户名',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      phone: {
        type: 'string',
        title: '电话号码',
        ui: {
          acl: { ability: ['query'] },
        },
      }
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '用户名', index: 'username' },
    { title: '手机', index: 'phone' },
    { title: '状态', index: 'disabled', type: 'badge', badge: this.HANDLED_BADGE },
    {
      title: '操作',
      buttons: [
        {
          text: '处理',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: EmployeeApplyHandleComponent,
          },
          click: () => {
            this.query(null);
          },
          acl: { ability: ['edit'] },
        }
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
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo'));
    this.params = {firmId: firmInfo.id};
    this.http
      .get(Api.BaseSupplyUserApplyApi + '/page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
          else this.page = {
            records: [],
            current: 1,
            total: 0,
            size: 10,
          };
        }
      });
  }
}
