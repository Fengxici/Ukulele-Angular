import { _HttpClient, SettingsService } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { STPage, STComponent, STColumn, STChange } from '@delon/abc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firm-market-user-modal',
  template: `<nz-card>
              <st #st [data]="page.records" [columns]="columns" (change)="change($event)"
                [pi]="page.current" [ps]="page.size" [total]="page.total" [page]="pagination">
              <ng-template st-row="taglist" let-item let-index="index">
                <nz-tag [nzColor]="'#2db7f5'" *ngFor="let tag of item.userTagList">{{ getTag(tag) }}</nz-tag>
              </ng-template>
            </st>
          </nz-card>`
})
export class FirmMarketUserModalComponent implements OnInit {
  constructor(
    protected http: _HttpClient,
    private router: Router,
    protected settingsService: SettingsService,
    private modal: NzModalRef
  ) {}
  @Input() inputData: any;
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
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '用户名', index: 'username' },
    { title: '手机', index: 'phone' },
    { title: '角色',  render: 'taglist'},
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
      return '采购(经理)';
    else if (value === 'PURCHASE_STAFF')
      return '采购(专员)';
    else if ( value === 'MARKET')
      return '销售(经理)';
    else if ( value === 'MARKET_STAFF')
      return '销售(专员)';
    // else if ( value === 'PLAN')
    //   return '计划';
    else if (value === 'DEPOSITORY_PURCHASE')
      return '仓库(原料)';
    else if (value === 'DEPOSITORY_MARKET')
      return '仓库(成品)';
    // else if (value === 'QUALITY')
    //   return '质检';
    // else if (value === 'FINANCE')
    //   return '财务';
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
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settingsService.user.id));
    if (!firmInfo) {
      this.router.navigate(['/supply/firm']);
      return;
    }
    this.params = {firmId: firmInfo.id};
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseSupplyUserApi + '/market/page/' + current + '/' + size, this.params)
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
