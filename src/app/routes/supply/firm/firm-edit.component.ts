import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-firm-edit',
  templateUrl: './firm-edit.component.html',
})
export class FirmEditComponent {
  record: any = {};
  mode: string;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 50 },
      shortName: { type: 'string', title: '简称', maxLength: 22 },
      unicode: { type: 'string', title: '社会统一信用代码', maxLength: 18 },
      phone: { type: 'string', title: '电话', maxLength: 15 },
      address: { type: 'string', title: '地址', maxLength: 50 },
      bankAccount: { type: 'string', title: '银行账号', maxLength: 22 },
      bankName: { type: 'string', title: '开户行', maxLength: 22 },
      contacts: { type: 'string', title: '联系人', maxLength: 22 },
      description: { type: 'string', title: '描述' },
    },
    required: ['name', 'unicode'],
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
    public settings: SettingsService,
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
            this.msgSrv.warning(res.message);
          }
        } else {
          this.msgSrv.error('修改失败，未知错误');
        }
      });
    } else {
      if (this.mode) {
        this.http.post(Api.BaseSupplyFirmApi + 'owner/create/' + this.settings.user.id, value).subscribe((res: any) => {
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
      } else {
        this.http.post(Api.BaseSupplyFirmApi, value).subscribe((res: any) => {
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
  }

  close() {
    this.modal.destroy();
  }
}
