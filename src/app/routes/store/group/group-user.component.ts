import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { STPage, STComponent, STColumn, STChange } from '@delon/abc';
import { SCHEMA_THIRDS_COMPONENTS } from '@shared/json-schema/json-schema.module';
@Component({
  selector: 'app-store-group-user',
  templateUrl: './group-user.component.html',
})
export class GroupUserComponent implements OnInit{
  record: any = {};
  account: string;
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
      name: {
        type: 'string',
        title: '用户名',
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '用户名', index: 'account' },
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          }
        },
      ],
    },
  ];

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
    this.params = {groupId: this.record.id};
    if (event) {
      if (event.name) this.params.account = event.name;
    }
    this.http
      .get(Api.BaseStoreGroupApi + '/user/page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            this.page = res.data;
          }
        }
      });
  }

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.record && this.record.id){
      this.query(null);
    }
  }

  join() {
    if (this.account && this.account.length > 0) {
      const value = {
        account: this.account,
        groupId: this.record.id
      };
      this.http.post(Api.BaseStoreGroupApi + 'user/add', value).subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.msgSrv.success('保存成功');
                this.params.name = this.account;
                this.query({name: this.account});
              } else {
                this.msgSrv.warning(res.message);
              }
            } else {
              this.msgSrv.error('保存失败，未知错误');
            }
          });
    } else {
      this.msgSrv.warning('请输入用户名');
    }
  }

  delete(record: any) {
    const value = {
      groupId: this.record.id,
      userId: record.userId
    };
    this.http.delete(Api.BaseStoreGroupApi + 'user/delete', value).subscribe((res: any) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          this.msgSrv.success('删除成功');
          this.query(null);
        } else {
          this.msgSrv.warning(res.message);
        }
      } else {
        this.msgSrv.error('删除失败，未知错误');
      }
    });
  }
  close() {
    this.modal.destroy();
  }
}
