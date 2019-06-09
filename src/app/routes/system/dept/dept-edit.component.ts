import { Component } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-system-dept',
  templateUrl: './dept-edit.component.html',
})
export class DeptEditComponent{
  record: any = {};
  parentId: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      orderNum: { type: 'number', title: '排序' }
    },
    required: ['name'],
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
  ) {
    this.parentId = this.modal.getInstance().nzComponentParams;
  }

  save(value: any) {
    if (this.record.id) {
      this.http.put(Api.BaseDeptApi, value).subscribe((res: any) => {
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
      value.parentId = this.parentId;
      this.http.post(Api.BaseDeptApi, value).subscribe((res: any) => {
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