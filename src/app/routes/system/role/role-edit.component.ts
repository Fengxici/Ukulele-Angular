import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFSelectWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';

@Component({
  selector: 'app-system-role-edit',
  templateUrl: './role-edit.component.html',
})
export class RoleEditComponent {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      roleName: {
        type: 'string',
        title: '角色名称',
      },
      roleCode: { type: 'string', title: '角色代码', maxLength: 15 },
      roleLevel: { type: 'string', title: '角色级别', enum: [
        { label: '超级管理员', value: 'SUPER' },
        { label: '管理员', value: 'ADMIN' },
        { label: '用户', value: 'USER' },
      ],
      ui: {
        widget: 'select',
        mode: 'default',
      } as SFSelectWidgetSchema, },
      roleDesc: {
        type: 'string',
        title: '角色描述',
      },
    },
    required: ['roleName', 'roleCode', 'roleLevel', 'roleDesc'],
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

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseRoleApi, value).subscribe((res: any) => {
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
      this.http.post(Api.BaseRoleApi, value).subscribe((res: any) => {
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
