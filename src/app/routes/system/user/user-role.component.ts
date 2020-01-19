import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SFSchema,
} from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { STPage, STColumn, STComponent, STChange } from '@delon/abc';

@Component({
  selector: 'app-system-user-role',
  templateUrl: './user-role.component.html',
})
export class UserRoleComponent implements OnInit {
  record: any = {};
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
      roleName: {
        type: 'string',
        title: '角色名称',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      roleCode: {
        type: 'string',
        title: '角色代码',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '角色名称', index: 'roleName' },
    { title: '角色代码', index: 'roleCode' },
    { title: '描述', index: 'roleDesc' },
    {
      title: '操作'
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
    this.params = {};
    if (event) {
      if (event.roleName) this.params.roleName = event.roleName;
      if (event.roleCode) this.params.roleCode = event.roleCode;
    }
    this.http
      .get(Api.BaseRoleApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    this.query(null);
  }

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseUserApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('修改成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.message);
          }
        } else {
          this.msgSrv.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseUserApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.message);
          }
        } else {
          this.msgSrv.error('保存失败，未知错误');
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
