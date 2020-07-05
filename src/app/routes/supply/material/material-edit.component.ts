import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema, SFNumberWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-material-edit',
  templateUrl: './material-edit.component.html',
})
export class MaterialEditComponent {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      materialNo: { type: 'string', title: '物料编号', maxLength: 15 },
      name: { type: 'string', title: '物料名称' },
      format: { type: 'string', title: '规格' },
      unit: { type: 'string', title: '单位' },
      price: {  type: 'number', title: '单价', ui: { prefix: '￥' } as SFNumberWidgetSchema }
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
    public settings: SettingsService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseSupplyMaterialApi, value).subscribe((res: any) => {
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
      this.http.post(Api.BaseSupplyMaterialApi, value).subscribe((res: any) => {
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
