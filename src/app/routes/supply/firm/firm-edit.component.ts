import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-firm-edit',
  templateUrl: './firm-edit.component.html',
})
export class FirmEditComponent {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 15 },
      description: { type: 'string', title: '描述' },
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
  ) {}

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseSupplyFirmApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('修改成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.msg);
          }
        } else {
          this.msgSrv.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseSupplyFirmApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.msg);
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