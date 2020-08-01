import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-address-edit',
  templateUrl: './address-edit.component.html',
})
export class AddressEditComponent {
  record: any = {isDefault: false};
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '地址', ui: {
        widget: 'textarea',
        autosize: { minRows: 2, maxRows: 6 }, }, },
      isDefault: { type: 'boolean', title: '是否默认' }
    },
    required: ['name', 'isDefault'],
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
      this.http.put(Api.BaseSupplyAddressUrl, value).subscribe((res: any) => {
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
      const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
      value.firmId = firmInfo.id;
      this.http.post(Api.BaseSupplyAddressUrl, value).subscribe((res: any) => {
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
