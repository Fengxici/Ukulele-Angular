import { Component, OnInit } from '@angular/core';
import {
  SFSchema,
  SFUISchema,
  SFSelectWidgetSchema,
} from '@delon/form';
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
  schema: SFSchema = { properties: {} };
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
    this.initSchema();
  }

  // 初始化表单，在获取完部门树数据之后再初始化
  initSchema() {
    this.schema = {
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
          ui: {
            widget: 'select',
            mode: 'multiple',
          } as SFSelectWidgetSchema,
        }
      },
      required: ['username', 'phone'],
    };
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
