import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema, SFTreeSelectWidgetSchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';

@Component({
  selector: 'app-system-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {
  record: any = {};
  departmentList: any = [];
  schema: SFSchema = {
    properties: {
      username: {
        type: 'string',
        title: '用户名',
      },
      phone: {
        type: 'string',
        title: '电话',
      },
      label: {
        type: 'string',
        title: '角色标签',
        enum: [
          { label: '管理员', value: 'admin' },
          { label: '用户', value: 'user' },
        ],
      },
      department: {
        type: 'string',
        title: '部门',
        enum: this.departmentList,
      },
    },
    required: ['username', 'phone'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    this.queryDepartment();
  }

  queryDepartment() {
    this.http.get(Api.BaseDeptApi + 'tree').subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.departmentList = res.data;
      }
    });
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
