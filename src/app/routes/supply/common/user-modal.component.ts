import { _HttpClient, SettingsService } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { STColumnBadge, STPage, STComponent, STColumn, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-firm-user-modal',
  template: `<nz-card>
              <sf mode="search" [schema]="searchSchema" (formSubmit)="query($event)" 
                (formReset)="st.reset($event)" acl [acl-ability]="'query'"></sf>
              <st #st [data]="page.records" [columns]="columns" (change)="change($event)"
                [pi]="page.current" [ps]="page.size" [total]="page.total" [page]="pagination">
              <ng-template st-row="taglist" let-item let-index="index">
                <nz-tag [nzColor]="'#2db7f5'" *ngFor="let tag of item.userTagList">{{ getTag(tag) }}</nz-tag>
              </ng-template>
            </st>
          </nz-card>`
})
export class FirmUserModalComponent implements OnInit {
  constructor(
    protected http: _HttpClient,
    protected settingsService: SettingsService,
    private modal: NzModalRef
  ) {}
  @Input() inputData: any;
  DISABLE_BADGE: STColumnBadge = {
    true: {text: '注销', color: 'default'},
    false: {text: '启用', color: 'success'}
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
      userId: {
        type: 'string',
        title: '编号',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      userTag: {
        type: 'string',
        title: '标签',
        ui: {
          acl: { ability: ['query'] },
        },
      }
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '用户名', index: 'username' },
    { title: '手机', index: 'phone' },
    { title: '角色',  render: 'taglist'},
    { title: '拥有者',  index: 'owner', type: 'yn'},
    { title: '管理员',  index: 'admin', type: 'yn'},
    { title: '状态', index: 'disabled', type: 'badge', badge: this.DISABLE_BADGE },
    {
      title: '操作',
      buttons: [
        {
          text: '选择',
          icon: 'user',
          click: (record: any) => {
            this.selected(record);
          }
        },
      ],
    },
  ];
  ngOnInit() {
    this.query(null);
  }
  getTag(value): string {
    if (value === 'PURCHASE')
      return '采购';
    else if ( value === 'MARKET')
      return '销售';
    else if ( value === 'PLAN')
      return '计划';
    else if (value === 'DEPOSITORY')
      return '仓库';
    else if (value === 'QUALITY')
      return '质检';
    else if (value === 'FINANCE')
      return '财务';
    else
      return '未知';
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
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseSupplyUserApi + '/page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  selected(record): void {
    this.modal.destroy({ user: record, ext: this.inputData });
  }
}